// =========================================================
// LEGAL TERMS OF SERVICE, ASSUMPTION OF RISK & RELEASE
// =========================================================

const LEGAL_TERMS_HTML = `
  <div class="bg-amber-50 border border-amber-300 rounded-2xl p-3.5 text-amber-950 font-semibold text-xs">
    <strong>Effective Date:</strong> November 23, 2026 &bull; <strong>Last Updated:</strong> November 23, 2026<br/>
    PLEASE READ THIS AGREEMENT CAREFULLY. IT CONTAINS A MANDATORY ARBITRATION CLAUSE, A CLASS ACTION WAIVER, AND A LEGALLY BINDING RELEASE OF LIABILITY AND ASSUMPTION OF RISK FOR OUTDOOR RECREATIONAL ACTIVITIES.
  </div>

  <p>
    By downloading, accessing, or using <strong>ParkQuest</strong> (the "App") and its related websites, services, and quest content (collectively, the "Services"), operated by <strong>ParkQuest Outdoor Technologies LLC</strong> ("Company," "we," "us," or "our"), you ("User," "you," or "your") agree to be bound by these Terms of Service ("Terms"). If you do not agree to all of these Terms, do not access or use the Services.
  </p>

  <h4 class="font-serif font-bold text-forest text-base pt-1">1. NO AFFILIATION WITH THE NATIONAL PARK SERVICE</h4>
  <p>
    <strong>ParkQuest</strong> is an independent commercial application. <strong>We are not affiliated with, endorsed by, sponsored by, or officially connected with the National Park Service (NPS), the U.S. Department of the Interior, the U.S. Forest Service, or any federal, state, or local government agency.</strong> All park names, geographic locations, and landmarks are used strictly for descriptive and informational purposes. Official park rules, ranger directives, and posted signage always supersede any information or quest objective within the App.
  </p>

  <h4 class="font-serif font-bold text-forest text-base pt-1">2. ELIGIBILITY AND MINORS</h4>
  <p>
    You must be at least <strong>18 years of age</strong> (or the age of legal majority in your jurisdiction) to create an account and accept these Terms.
  </p>
  <ul class="list-disc pl-5 space-y-1">
    <li><strong>Minors:</strong> Individuals under 18 may only participate in quests under the direct, continuous physical supervision of a parent or legal guardian who has accepted these Terms on the minor’s behalf.</li>
    <li><strong>Children Under 13:</strong> Pursuant to the Children’s Online Privacy Protection Act (COPPA), the App does not knowingly collect personal information or geolocation data from children under 13. Parents/guardians must operate the device for family participation.</li>
  </ul>

  <h4 class="font-serif font-bold text-forest text-base pt-1">3. EXPRESS ASSUMPTION OF RISK (OUTDOOR &amp; RECREATIONAL HAZARDS)</h4>
  <p>
    You acknowledge and agree that visiting National Parks, wilderness areas, and public lands involves <strong>inherent, extreme, and unpredictable risks</strong> that cannot be eliminated regardless of the care taken to avoid injuries. These risks include, but are not limited to:
  </p>
  <ol class="list-decimal pl-5 space-y-1">
    <li><strong>Terrain &amp; Environmental Hazards:</strong> Uneven, steep, slippery, or unstable trails; cliffs, drop-offs, crevices, rockfalls, avalanches, and geothermal features (hot springs, geysers, thin crusts);</li>
    <li><strong>Water &amp; Weather Hazards:</strong> Rapidly changing weather, lightning, flash floods, extreme heat or cold, hypothermia, dehydration, and swift currents;</li>
    <li><strong>Wildlife &amp; Flora:</strong> Encounters with or attacks by wild animals (including bears, bison, elk, venomous snakes, and insects) and exposure to poisonous plants;</li>
    <li><strong>Navigation &amp; Technology Limitations:</strong> Loss of cellular reception, inaccurate or delayed GPS/GNSS signals, battery depletion, and map or waypoint inaccuracies;</li>
    <li><strong>Remote Locations:</strong> Limited or delayed access to medical care, emergency services, or Search and Rescue (SAR) operations;</li>
    <li><strong>Distraction:</strong> Risks arising from viewing a mobile screen while walking, hiking, or operating a vehicle.</li>
  </ol>
  <p class="font-bold text-slateInk">
    YOU VOLUNTARILY CHOOSE TO PARTICIPATE IN THE SERVICES WITH FULL KNOWLEDGE OF THESE DANGERS AND EXPRESSLY ASSUME ALL RISKS OF BODILY INJURY, ILLNESS, PERMANENT DISABILITY, DEATH, OR PROPERTY DAMAGE ARISING FROM YOUR USE OF THE APP.
  </p>

  <h4 class="font-serif font-bold text-forest text-base pt-1">4. RELEASE OF LIABILITY AND COVENANT NOT TO SUE</h4>
  <p>
    To the fullest extent permitted by applicable law, you (on behalf of yourself, your heirs, executors, administrators, assigns, and any minor children in your care) hereby <strong>irrevocably release, waive, discharge, and covenant not to sue</strong> <strong>ParkQuest Outdoor Technologies LLC</strong>, its officers, directors, employees, contractors, licensors, and affiliates (collectively, the "Released Parties") from any and all liability, claims, demands, actions, or causes of action whatsoever arising out of or related to any loss, damage, injury, or death that may be sustained by you or your property while using the Services—<strong>whether caused by the ordinary negligence of the Released Parties or otherwise</strong>.
  </p>

  <h4 class="font-serif font-bold text-forest text-base pt-1">5. MANDATORY SAFETY &amp; PARK COMPLIANCE RULES</h4>
  <ul class="list-disc pl-5 space-y-1">
    <li><strong>Situational Awareness:</strong> Never look at your device screen while walking on uneven terrain, near drop-offs, near roadways, or while operating a motor vehicle or bicycle. Stop completely in a safe location before interacting with the App.</li>
    <li><strong>Obey All Closures &amp; Signage:</strong> Never enter closed trails, restricted wildlife zones, fragile thermal areas, or private property to reach a quest waypoint. If a quest pin appears to be in an unsafe, closed, or inaccessible area, <strong>do not attempt to reach it</strong> and report the pin to us immediately.</li>
    <li><strong>Leave No Trace &amp; Federal Law:</strong> You must comply with all federal regulations under <strong>36 CFR</strong> (Title 36 of the Code of Federal Regulations), including staying on designated trails/boardwalks, maintaining safe distances from wildlife (100+ yards from bears/wolves; 25+ yards from all other wildlife), and never placing, burying, or leaving physical items in any park.</li>
    <li><strong>Permits &amp; Fees:</strong> You are solely responsible for obtaining required park entrance passes, timed-entry reservations, and backcountry permits.</li>
  </ul>

  <h4 class="font-serif font-bold text-forest text-base pt-1">6. DISCLAIMER OF WARRANTIES ("AS IS")</h4>
  <p>
    THE SERVICES, INCLUDING ALL MAPS, GPS COORDINATES, TRAIL DESCRIPTIONS, AND QUEST DATA, ARE PROVIDED ON AN <strong>"AS IS" AND "AS AVAILABLE"</strong> BASIS WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. COMPANY DOES NOT WARRANT THAT GPS COORDINATES WILL BE ACCURATE, THAT TRAILS WILL BE OPEN OR SAFE, OR THAT THE APP WILL FUNCTION WITHOUT INTERRUPTION OR CELLULAR CONNECTIVITY.
  </p>

  <h4 class="font-serif font-bold text-forest text-base pt-1">7. LIMITATION OF LIABILITY</h4>
  <p>
    TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL THE RELEASED PARTIES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES. IN ALL EVENTS, THE AGGREGATE LIABILITY OF THE RELEASED PARTIES FOR ANY CLAIM ARISING OUT OF THESE TERMS OR THE SERVICES SHALL NOT EXCEED THE GREATER OF <strong>(A) THE TOTAL AMOUNT PAID BY YOU TO COMPANY IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM, OR (B) ONE HUNDRED U.S. DOLLARS ($100.00)</strong>.
  </p>

  <h4 class="font-serif font-bold text-forest text-base pt-1">8. INDEMNIFICATION</h4>
  <p>
    You agree to defend, indemnify, and hold harmless the Released Parties from and against any and all claims, damages, losses, liabilities, fines, penalties, and expenses (including reasonable attorneys’ fees) arising out of or relating to: (a) your use or misuse of the Services; (b) your violation of these Terms or any federal, state, or local law (including National Park regulations); (c) your trespass upon private property; or (d) any User-Generated Content (such as photos) you submit through the App.
  </p>

  <h4 class="font-serif font-bold text-forest text-base pt-1">9. USER-GENERATED CONTENT &amp; PHOTO SUBMISSIONS</h4>
  <ul class="list-disc pl-5 space-y-1">
    <li>You retain ownership of your content, but grant Company a worldwide, non-exclusive, royalty-free, transferable license to host, display, and use such content to operate and improve the Services.</li>
    <li>You represent that your photos do not infringe third-party rights, violate park rules (e.g., illegal drone use or wildlife harassment), or depict identifiable individuals or license plates without consent.</li>
  </ul>

  <h4 class="font-serif font-bold text-forest text-base pt-1">10. DISPUTE RESOLUTION, BINDING ARBITRATION &amp; CLASS ACTION WAIVER</h4>
  <ul class="list-disc pl-5 space-y-1">
    <li><strong>Informal Resolution:</strong> Before filing a claim, you agree to contact us at <strong>legal@parkquestapp.example.com</strong> and attempt to resolve the dispute informally for at least 30 days.</li>
    <li><strong>Binding Arbitration:</strong> Any dispute not resolved informally shall be resolved exclusively through final and binding individual arbitration administered by the American Arbitration Association (AAA) under its Consumer Arbitration Rules, rather than in court.</li>
    <li><strong>Class Action Waiver:</strong> <strong>YOU AND COMPANY AGREE THAT EACH MAY BRING CLAIMS AGAINST THE OTHER ONLY IN YOUR OR ITS INDIVIDUAL CAPACITY, AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS, COLLECTIVE, OR REPRESENTATIVE PROCEEDING.</strong></li>
  </ul>

  <h4 class="font-serif font-bold text-forest text-base pt-1">11. GOVERNING LAW AND SEVERABILITY</h4>
  <p>
    These Terms shall be governed by and construed in accordance with the laws of the State of <strong>Indiana</strong>, without regard to its conflict-of-law principles. If any provision of these Terms is held invalid or unenforceable by a court of competent jurisdiction, the remaining provisions shall remain in full force and effect.
  </p>
`;

function initLegalTermsContent() {
  const container = document.getElementById('legal-terms-scroll-area');
  if (container) {
    container.innerHTML = LEGAL_TERMS_HTML;
  }
}