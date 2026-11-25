// =========================================================
// PARKQUEST FIREBASE CLOUD SERVICE (Auth + Offline Firestore)
// =========================================================
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import {
  getAuth,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile
} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  limit,
  getDocs,
  onSnapshot,
  arrayUnion,
  arrayRemove,
  increment,
  serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';

const cfg = window.PARKQUEST_FIREBASE_CONFIG || {};
const isConfigured = Boolean(cfg.apiKey && !cfg.apiKey.startsWith('YOUR_'));

let app = null;
let auth = null;
let db = null;
let currentUser = null;
let currentUserProfile = null;
let leaderboardUnsubscribes = [];
let globalLeaderboardUnsubscribe = null;
let incomingRequestsUnsubscribe = null;
let outgoingRequestsUnsubscribe = null;
let profileUnsubscribe = null;
let latestIncomingRequests = [];
let latestOutgoingRequests = [];

function generateFriendCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function initFirebase() {
  if (!isConfigured) {
    console.info('[ParkQuestCloud] Firebase config placeholder detected — running in local/offline demo mode.');
    return false;
  }
  try {
    app = initializeApp(cfg);
    auth = getAuth(app);
    setPersistence(auth, browserLocalPersistence).catch(console.warn);

    // Offline-first IndexedDB persistence for remote National Parks with zero cell signal
    db = initializeFirestore(app, {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager()
      })
    });

    onAuthStateChanged(auth, async (user) => {
      currentUser = user;
      stopCloudListeners();
      if (user) {
        await ensureAndMigrateUserProfile(user);
        startProfileListener(user.uid);
        subscribeFriendRequests(user.uid);
      } else {
        currentUserProfile = null;
      }
      if (typeof window.onCloudAuthStateChanged === 'function') {
        window.onCloudAuthStateChanged(user, currentUserProfile);
      }
    });
    return true;
  } catch (err) {
    console.error('[ParkQuestCloud] Initialization failed:', err);
    return false;
  }
}

async function ensureAndMigrateUserProfile(user) {
  if (!db || !user) return null;
  const userRef = doc(db, 'users', user.uid);
  const snap = await getDoc(userRef);

  // Pull any pre-existing local quest progress to merge on first sign-in
  const localProgress = typeof window.getLocalProgressForCloudMigration === 'function'
    ? window.getLocalProgressForCloudMigration()
    : { totalPoints: 0, completedQuests: [], parksVisited: [], displayName: '' };

  if (!snap.exists()) {
    const friendCode = generateFriendCode();
    const newProfile = {
      uid: user.uid,
      displayName: user.displayName || localProgress.displayName || (user.email ? user.email.split('@')[0] : 'Park Explorer'),
      friendCode,
      friends: [],
      totalPoints: localProgress.totalPoints || 0,
      completedQuests: localProgress.completedQuests || [],
      parksVisited: localProgress.parksVisited || [],
      lastUpdated: serverTimestamp()
    };
    await setDoc(userRef, newProfile);
    currentUserProfile = newProfile;
    if (localProgress.completedQuests.length > 0 && typeof window.showToast === 'function') {
      window.showToast(`Migrated ${localProgress.completedQuests.length} local quests (${localProgress.totalPoints} XP) to your cloud profile!`, 'success');
    }
    return newProfile;
  } else {
    const existing = snap.data();
    // Merge any unsynced local quests completed before signing in
    const existingQuests = new Set(existing.completedQuests || []);
    const newLocalQuests = (localProgress.completedQuests || []).filter(qId => !existingQuests.has(qId));

    if (newLocalQuests.length > 0 && typeof window.calculatePointsForQuests === 'function') {
      const bonusPoints = window.calculatePointsForQuests(newLocalQuests);
      const updates = {
        completedQuests: arrayUnion(...newLocalQuests),
        totalPoints: increment(bonusPoints),
        lastUpdated: serverTimestamp()
      };
      if ((localProgress.parksVisited || []).length > 0) {
        updates.parksVisited = arrayUnion(...localProgress.parksVisited);
      }
      await updateDoc(userRef, updates);
      if (typeof window.showToast === 'function') {
        window.showToast(`Merged ${newLocalQuests.length} local quests (+${bonusPoints} XP) into your cloud profile!`, 'success');
      }
    }
    currentUserProfile = existing;
    return existing;
  }
}

function startProfileListener(uid) {
  if (!db || !uid) return;
  const userRef = doc(db, 'users', uid);
  profileUnsubscribe = onSnapshot(userRef, { includeMetadataChanges: true }, (snap) => {
    if (!snap.exists()) return;
    currentUserProfile = snap.data();
    const fromCache = snap.metadata.fromCache;
    const hasPendingWrites = snap.metadata.hasPendingWrites;

    if (typeof window.onCloudProfileUpdated === 'function') {
      window.onCloudProfileUpdated(currentUserProfile, { fromCache, hasPendingWrites });
    }
    subscribeFriendLeaderboard(currentUserProfile);
  });
}

function subscribeFriendLeaderboard(profile) {
  leaderboardUnsubscribes.forEach(unsub => unsub());
  leaderboardUnsubscribes = [];
  if (!db || !profile) return;

  const uids = Array.from(new Set([profile.uid, ...(profile.friends || [])]));
  // Firestore 'in' queries support up to 30 items per batch
  const chunks = [];
  for (let i = 0; i < uids.length; i += 30) {
    chunks.push(uids.slice(i, i + 30));
  }

  const chunkResults = new Map();
  const emitMerged = () => {
    const byUid = new Map();
    chunkResults.forEach(arr => {
      arr.forEach(u => { if (u && u.uid) byUid.set(u.uid, u); });
    });
    const merged = Array.from(byUid.values());
    merged.sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0));
    if (typeof window.onCloudLeaderboardUpdated === 'function') {
      window.onCloudLeaderboardUpdated(merged);
    }
  };

  chunks.forEach((chunk, idx) => {
    const q = query(collection(db, 'users'), where('uid', 'in', chunk), limit(30));
    const unsub = onSnapshot(q, (snapshot) => {
      const list = [];
      snapshot.forEach(d => list.push(d.data()));
      chunkResults.set(`in_${idx}`, list);
      emitMerged();
    }, (err) => {
      console.warn('[ParkQuestCloud] Leaderboard listener warning:', err);
    });
    leaderboardUnsubscribes.push(unsub);
  });
}

function emitFriendRequests() {
  if (typeof window.onCloudFriendRequestsUpdated === 'function') {
    window.onCloudFriendRequestsUpdated({
      incoming: latestIncomingRequests.filter(r => r.status === 'pending'),
      outgoing: latestOutgoingRequests.filter(r => r.status === 'pending')
    });
  }
}

function subscribeFriendRequests(uid) {
  if (incomingRequestsUnsubscribe) { incomingRequestsUnsubscribe(); incomingRequestsUnsubscribe = null; }
  if (outgoingRequestsUnsubscribe) { outgoingRequestsUnsubscribe(); outgoingRequestsUnsubscribe = null; }
  latestIncomingRequests = [];
  latestOutgoingRequests = [];
  if (!db || !uid) return;

  const inQ = query(collection(db, 'friendRequests'), where('toUid', '==', uid), limit(30));
  incomingRequestsUnsubscribe = onSnapshot(inQ, (snap) => {
    const list = [];
    snap.forEach(d => {
      const data = { id: d.id, ...d.data() };
      if (data.status === 'removed') {
        // Other user unfriended you — remove them from your friends array & clean up doc
        updateDoc(doc(db, 'users', uid), { friends: arrayRemove(data.fromUid), lastUpdated: serverTimestamp() }).catch(() => {});
        deleteDoc(doc(db, 'friendRequests', d.id)).catch(() => {});
      } else {
        list.push(data);
      }
    });
    latestIncomingRequests = list;
    emitFriendRequests();
  }, err => console.warn('[ParkQuestCloud] Incoming requests listener:', err));

  const outQ = query(collection(db, 'friendRequests'), where('fromUid', '==', uid), limit(30));
  outgoingRequestsUnsubscribe = onSnapshot(outQ, (snap) => {
    const list = [];
    snap.forEach(d => {
      const data = { id: d.id, ...d.data() };
      if (data.status === 'accepted') {
        // Recipient accepted! Add them to our friends array if not yet present
        const currentFriends = currentUserProfile?.friends || [];
        if (!currentFriends.includes(data.toUid)) {
          updateDoc(doc(db, 'users', uid), { friends: arrayUnion(data.toUid), lastUpdated: serverTimestamp() }).catch(() => {});
        }
      } else if (data.status === 'removed') {
        updateDoc(doc(db, 'users', uid), { friends: arrayRemove(data.toUid), lastUpdated: serverTimestamp() }).catch(() => {});
        deleteDoc(doc(db, 'friendRequests', d.id)).catch(() => {});
      } else {
        list.push(data);
      }
    });
    latestOutgoingRequests = list;
    emitFriendRequests();
  }, err => console.warn('[ParkQuestCloud] Outgoing requests listener:', err));
}

function subscribeGlobalLeaderboard() {
  if (globalLeaderboardUnsubscribe) {
    globalLeaderboardUnsubscribe();
    globalLeaderboardUnsubscribe = null;
  }
  if (!db) return;
  const q = query(collection(db, 'users'), limit(30));
  globalLeaderboardUnsubscribe = onSnapshot(q, (snapshot) => {
    const list = [];
    snapshot.forEach(d => list.push(d.data()));
    list.sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0));
    if (typeof window.onCloudGlobalLeaderboardUpdated === 'function') {
      window.onCloudGlobalLeaderboardUpdated(list);
    }
  }, (err) => {
    console.warn('[ParkQuestCloud] Global leaderboard listener warning:', err);
  });
}

function stopCloudListeners() {
  if (profileUnsubscribe) {
    profileUnsubscribe();
    profileUnsubscribe = null;
  }
  if (globalLeaderboardUnsubscribe) {
    globalLeaderboardUnsubscribe();
    globalLeaderboardUnsubscribe = null;
  }
  if (incomingRequestsUnsubscribe) {
    incomingRequestsUnsubscribe();
    incomingRequestsUnsubscribe = null;
  }
  if (outgoingRequestsUnsubscribe) {
    outgoingRequestsUnsubscribe();
    outgoingRequestsUnsubscribe = null;
  }
  latestIncomingRequests = [];
  latestOutgoingRequests = [];
  leaderboardUnsubscribes.forEach(u => u());
  leaderboardUnsubscribes = [];
}

// --- Public Cloud API exposed to app.js ---
window.ParkQuestCloud = {
  isConfigured: () => isConfigured,
  getCurrentUser: () => currentUser,
  getProfile: () => currentUserProfile,

  async signInEmail(email, password) {
    if (!auth) throw new Error('Firebase is not configured yet. Add your config in firebase-config.js.');
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return cred.user;
  },

  async signUpEmail(email, password, displayName) {
    if (!auth) throw new Error('Firebase is not configured yet. Add your config in firebase-config.js.');
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await updateProfile(cred.user, { displayName });
    }
    return cred.user;
  },

  async signInGoogle() {
    if (!auth) throw new Error('Firebase is not configured yet. Add your config in firebase-config.js.');
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const cred = await signInWithPopup(auth, provider);
    return cred.user;
  },

  async signOutUser() {
    if (!auth) return;
    stopCloudListeners();
    currentUser = null;
    currentUserProfile = null;
    await signOut(auth);
  },

  // Offline-first atomic quest completion
  async recordQuestCompletion(questId, parkId, points) {
    if (!db || !currentUser) return { synced: false, offlineDemo: true };
    const userRef = doc(db, 'users', currentUser.uid);
    // Do not await network confirmation if offline — Firestore queues in IndexedDB immediately
    updateDoc(userRef, {
      totalPoints: increment(points),
      completedQuests: arrayUnion(questId),
      parksVisited: arrayUnion(parkId),
      lastUpdated: serverTimestamp()
    }).catch(err => console.warn('[ParkQuestCloud] Queued/error updating quest:', err));
    return { synced: true };
  },

  // Atomic undo
  async recordQuestUndo(questId, points) {
    if (!db || !currentUser) return { synced: false, offlineDemo: true };
    const userRef = doc(db, 'users', currentUser.uid);
    updateDoc(userRef, {
      totalPoints: increment(-Math.abs(points)),
      completedQuests: arrayRemove(questId),
      lastUpdated: serverTimestamp()
    }).catch(err => console.warn('[ParkQuestCloud] Queued/error undoing quest:', err));
    return { synced: true };
  },

  // Send a two-way friend request by 6-char friendCode
  async sendFriendRequestByCode(codeRaw) {
    if (!db || !currentUser || !currentUserProfile) throw new Error('Sign in with Firebase first to send friend requests.');
    const code = (codeRaw || '').trim().toUpperCase();
    if (code.length !== 6) throw new Error('Friend code must be a 6-character alphanumeric code.');

    const q = query(collection(db, 'users'), where('friendCode', '==', code), limit(1));
    const snap = await getDocs(q);
    if (snap.empty) throw new Error(`No Ranger found with Friend Code "${code}".`);

    const targetDoc = snap.docs[0].data();
    return this.sendFriendRequestToUser(targetDoc);
  },

  async sendFriendRequestToUser(targetDoc) {
    if (!db || !currentUser || !currentUserProfile) throw new Error('Sign in with Firebase first.');
    if (!targetDoc || targetDoc.uid === currentUser.uid) throw new Error('You cannot send a friend request to yourself.');
    if ((currentUserProfile.friends || []).includes(targetDoc.uid)) {
      throw new Error(`${targetDoc.displayName || 'This Ranger'} is already your friend.`);
    }

    const reqId = `${currentUser.uid}_${targetDoc.uid}`;
    await setDoc(doc(db, 'friendRequests', reqId), {
      id: reqId,
      fromUid: currentUser.uid,
      fromName: currentUserProfile.displayName || currentUser.displayName || 'Explorer',
      fromCode: currentUserProfile.friendCode || '------',
      toUid: targetDoc.uid,
      toName: targetDoc.displayName || 'Explorer',
      toCode: targetDoc.friendCode || '------',
      status: 'pending',
      createdAt: serverTimestamp()
    });
    return targetDoc;
  },

  async acceptFriendRequest(requestId, fromUid) {
    if (!db || !currentUser) return;
    await updateDoc(doc(db, 'friendRequests', requestId), { status: 'accepted' });
    await updateDoc(doc(db, 'users', currentUser.uid), {
      friends: arrayUnion(fromUid),
      lastUpdated: serverTimestamp()
    });
  },

  async declineFriendRequest(requestId) {
    if (!db || !currentUser) return;
    await deleteDoc(doc(db, 'friendRequests', requestId));
  },

  async removeFriendByUid(friendUid) {
    if (!db || !currentUser) return;
    if (currentUserProfile && Array.isArray(currentUserProfile.friends)) {
      currentUserProfile.friends = currentUserProfile.friends.filter(id => id !== friendUid);
    }
    await updateDoc(doc(db, 'users', currentUser.uid), {
      friends: arrayRemove(friendUid),
      lastUpdated: serverTimestamp()
    });
    // Notify the other side by marking any request doc between us as 'removed'
    for (const id of [`${currentUser.uid}_${friendUid}`, `${friendUid}_${currentUser.uid}`]) {
      const ref = doc(db, 'friendRequests', id);
      const snap = await getDoc(ref).catch(() => null);
      if (snap && snap.exists()) {
        await updateDoc(ref, { status: 'removed' }).catch(() => {});
      }
    }
  }
};

initFirebase();
