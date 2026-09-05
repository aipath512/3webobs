/* ===================================================================
   AUDIT-AI — REAL ENGINE — 3webobs.com
   Motor real: fetch site + fisiere de semnal, evaluare pe dovezi reale.
   ZERO PROFILES hardcodat. ZERO regex pe numele domeniului.
   Semnale nemasurabile fara API extern platit = NA (nu FAIL, nu inventat).
   =================================================================== */

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, A2A-Version, A2A-Extensions',
  'Access-Control-Expose-Headers': 'A2A-Version',
};

function json(obj, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS, ...extraHeaders },
  });
}

/* ---------- catalogul celor 167 de semnale (id, nume, categorie, greutate) ---------- */
/* versiune de motor si de registru — apar in fiecare raport, ca doua rapoarte
   sa poata fi comparate fara sa ghicesti ce deploy le-a produs. */
const ENGINE_VERSION = '3.1.0';
const RULESET_VERSION = '2026-08-30';

const SIG = {"AEO":[{"id":"aeo1","n":"FAQ Structured Data","c":"ON-PAGE","w":9,"wl":["HUMAN_WEB","AI_WEB"],"m":"ESTABLISHED_PRACTICE","pt":true},{"id":"aeo2","n":"HowTo Structured Data Where Applicable","c":"ON-PAGE","w":7,"wl":["HUMAN_WEB","AI_WEB"],"m":"ESTABLISHED_PRACTICE","pt":true},{"id":"aeo3","n":"Question-and-Answer Content Blocks","c":"ON-PAGE","w":9,"wl":["HUMAN_WEB","AI_WEB"],"m":"ESTABLISHED_PRACTICE","pt":true},{"id":"aeo4","n":"Extractable Direct Answer Blocks","c":"ON-PAGE","w":10,"wl":["AI_WEB"],"m":"3WEBS_METHOD","pt":true},{"id":"aeo5","n":"Speakable Structured Data Where Applicable","c":"ON-PAGE","w":5,"wl":["AI_WEB"],"m":"PROVIDER_SPECIFIC","pt":true},{"id":"aeo6","n":"Article Structured Data Where Applicable","c":"ON-PAGE","w":7,"wl":["HUMAN_WEB","AI_WEB"],"m":"ESTABLISHED_PRACTICE","pt":true},{"id":"aeo7","n":"Breadcrumb Structured Data","c":"ON-PAGE","w":7,"wl":["HUMAN_WEB","AI_WEB"],"m":"ESTABLISHED_PRACTICE","pt":true},{"id":"aeo8","n":"Table of Contents and Section Anchors","c":"ON-PAGE","w":6,"wl":["HUMAN_WEB","AI_WEB"],"m":"ESTABLISHED_PRACTICE","pt":true},{"id":"aeo9","n":"External Entity Disambiguation","c":"OFF-PAGE","w":8,"wl":["AI_WEB"],"m":"ESTABLISHED_PRACTICE","pt":true},{"id":"aeo10","n":"Search Knowledge Entity Presence","c":"OFF-PAGE","w":9,"wl":["AI_WEB"],"m":"PROVIDER_SPECIFIC","pt":true},{"id":"aeo11","n":"Direct Answer Formatting","c":"ON-PAGE","w":9,"wl":["HUMAN_WEB","AI_WEB"],"m":"ESTABLISHED_PRACTICE","pt":true},{"id":"aeo12","n":"Intent-Oriented URL Structure","c":"ON-SITE","w":6,"wl":["HUMAN_WEB","AI_WEB"],"m":"ESTABLISHED_PRACTICE","pt":true},{"id":"aeo13","n":"People-Also-Ask Topic Coverage","c":"OFF-PAGE","w":7,"wl":["AI_WEB"],"m":"PROVIDER_SPECIFIC","pt":true},{"id":"aeo14","n":"Featured Answer Extractability","c":"ON-PAGE","w":9,"wl":["AI_WEB"],"m":"ESTABLISHED_PRACTICE","pt":true},{"id":"aeo15","n":"Definition Blocks","c":"ON-PAGE","w":7,"wl":["HUMAN_WEB","AI_WEB"],"m":"ESTABLISHED_PRACTICE","pt":true},{"id":"aeo16","n":"Step-by-Step Content Structure","c":"ON-PAGE","w":7,"wl":["HUMAN_WEB","AI_WEB"],"m":"ESTABLISHED_PRACTICE","pt":true},{"id":"aeo17","n":"Concise Lead Answer","c":"ON-PAGE","w":7,"wl":["AI_WEB"],"m":"3WEBS_METHOD","pt":true},{"id":"aeo18","n":"Natural-Language Query Coverage","c":"ON-PAGE","w":7,"wl":["AI_WEB"],"m":"3WEBS_METHOD","pt":true},{"id":"aeo19","n":"Answer-First Content Structure","c":"ON-PAGE","w":9,"wl":["AI_WEB"],"m":"3WEBS_METHOD","pt":true},{"id":"aeo20","n":"Semantically Descriptive Headings","c":"ON-PAGE","w":8,"wl":["HUMAN_WEB","AI_WEB"],"m":"ESTABLISHED_PRACTICE","pt":true},{"id":"aeo21","n":"Conversational Query Coverage","c":"ON-PAGE","w":8,"wl":["AI_WEB"],"m":"3WEBS_METHOD","pt":true},{"id":"aeo22","n":"Structured Data Relationship Coherence","c":"ON-PAGE","w":7,"wl":["AI_WEB"],"m":"ESTABLISHED_PRACTICE","pt":true},{"id":"aeo23","n":"Rich Result Eligibility","c":"ON-PAGE","w":8,"wl":["HUMAN_WEB","AI_WEB"],"m":"PROVIDER_SPECIFIC","pt":true},{"id":"aeo24","n":"Google AI Overview and AI Mode Source Readiness","c":"ON-PAGE","w":9,"wl":["AI_WEB"],"m":"PROVIDER_SPECIFIC","pt":true},{"id":"aeo25","n":"Context Continuity Across Sections","c":"ON-PAGE","w":7,"wl":["AI_WEB"],"m":"3WEBS_METHOD","pt":true},{"id":"aeo26","n":"Primary Entity Salience","c":"ON-PAGE","w":8,"wl":["AI_WEB"],"m":"3WEBS_METHOD","pt":true},{"id":"aeo27","n":"Semantic HTML Structure","c":"ON-SITE","w":8,"wl":["HUMAN_WEB","AI_WEB"],"m":"STANDARD","pt":true},{"id":"aeo28","n":"ClaimReview Structured Data Where Applicable","c":"ON-PAGE","w":5,"wl":["AI_WEB"],"m":"ESTABLISHED_PRACTICE","pt":true},{"id":"aeo29","n":"Event Structured Data Where Applicable","c":"ON-PAGE","w":5,"wl":["HUMAN_WEB","AI_WEB"],"m":"ESTABLISHED_PRACTICE","pt":true},{"id":"aeo30","n":"Product Structured Data Where Applicable","c":"ON-PAGE","w":7,"wl":["HUMAN_WEB","AI_WEB"],"m":"ESTABLISHED_PRACTICE","pt":true},{"id":"aeo31","n":"LocalBusiness Structured Data Where Applicable","c":"ON-PAGE","w":6,"wl":["HUMAN_WEB","AI_WEB"],"m":"ESTABLISHED_PRACTICE","pt":true},{"id":"aeo32","n":"Review and Rating Structured Data Validity","c":"ON-PAGE","w":6,"wl":["HUMAN_WEB","AI_WEB"],"m":"ESTABLISHED_PRACTICE","pt":true},{"id":"aeo33","n":"Video Structured Data Where Applicable","c":"ON-PAGE","w":5,"wl":["HUMAN_WEB","AI_WEB"],"m":"ESTABLISHED_PRACTICE","pt":true},{"id":"aeo34","n":"Person and Author Structured Data","c":"ON-PAGE","w":7,"wl":["AI_WEB"],"m":"ESTABLISHED_PRACTICE","pt":true}],"GEO":[{"id":"geo1","n":"llms.txt Presence and Quality","c":"ON-SITE","w":8,"wl":["AI_WEB"],"m":"EMERGING","pt":true},{"id":"geo2","n":"AI Policy Declaration File","c":"ON-SITE","w":6,"wl":["AI_WEB","MACHINE_WEB"],"m":"3WEBS_METHOD","pt":true},{"id":"geo3","n":"robots.txt AI Crawler Directives","c":"ON-SITE","w":9,"wl":["AI_WEB"],"m":"STANDARD","pt":true},{"id":"geo4","n":"Entity Graph Structured Data","c":"ON-SITE","w":10,"wl":["AI_WEB"],"m":"ESTABLISHED_PRACTICE","pt":true},{"id":"geo5","n":"Organization Structured Data Completeness","c":"ON-PAGE","w":9,"wl":["AI_WEB"],"m":"ESTABLISHED_PRACTICE","pt":true},{"id":"geo6","n":"External Identity References","c":"OFF-PAGE","w":8,"wl":["AI_WEB"],"m":"ESTABLISHED_PRACTICE","pt":true},{"id":"geo7","n":"Independent Knowledge-Graph Entity Presence","c":"OFF-PAGE","w":9,"wl":["AI_WEB"],"m":"ESTABLISHED_PRACTICE","pt":true},{"id":"geo8","n":"ai.json Identity Declaration","c":"ON-SITE","w":6,"wl":["AI_WEB","MACHINE_WEB"],"m":"3WEBS_METHOD","pt":true},{"id":"geo9","n":"Intent Declaration","c":"ON-SITE","w":6,"wl":["MACHINE_WEB"],"m":"3WEBS_METHOD","pt":true},{"id":"geo10","n":"Machine-Readable Governance Declaration","c":"ON-SITE","w":6,"wl":["AI_WEB","MACHINE_WEB"],"m":"3WEBS_METHOD","pt":true},{"id":"geo11","n":"Machine-Readable Entity Registry","c":"ON-SITE","w":7,"wl":["AI_WEB","MACHINE_WEB"],"m":"3WEBS_METHOD","pt":true},{"id":"geo12","n":"Independent Organization Profile Presence","c":"OFF-PAGE","w":6,"wl":["AI_WEB"],"m":"ESTABLISHED_PRACTICE","pt":true},{"id":"geo13","n":"LinkedIn Entity Presence and Consistency","c":"OFF-PAGE","w":6,"wl":["AI_WEB"],"m":"ESTABLISHED_PRACTICE","pt":true},{"id":"geo14","n":"Independent Editorial Mentions","c":"OFF-PAGE","w":8,"wl":["AI_WEB"],"m":"ESTABLISHED_PRACTICE","pt":true},{"id":"geo15","n":"Author Experience and Expertise Evidence","c":"OFF-PAGE","w":8,"wl":["AI_WEB"],"m":"ESTABLISHED_PRACTICE","pt":true},{"id":"geo16","n":"Brand Entity Consistency","c":"ON-PAGE","w":9,"wl":["AI_WEB"],"m":"3WEBS_METHOD","pt":true},{"id":"geo17","n":"Canonical URL Consistency","c":"ON-SITE","w":8,"wl":["HUMAN_WEB","AI_WEB"],"m":"STANDARD","pt":true},{"id":"geo18","n":"Hreflang Language and Region Targeting","c":"ON-SITE","w":6,"wl":["HUMAN_WEB","AI_WEB"],"m":"STANDARD","pt":true},{"id":"geo19","n":"Local Identity Citation Consistency","c":"OFF-PAGE","w":6,"wl":["AI_WEB"],"m":"ESTABLISHED_PRACTICE","pt":true},{"id":"geo20","n":"Google Business Profile Where Applicable","c":"OFF-PAGE","w":7,"wl":["HUMAN_WEB","AI_WEB"],"m":"PROVIDER_SPECIFIC","pt":true},{"id":"geo21","n":"Named Entity Clarity","c":"ON-PAGE","w":8,"wl":["AI_WEB"],"m":"3WEBS_METHOD","pt":true},{"id":"geo22","n":"Geographic Context Explicitness","c":"ON-PAGE","w":6,"wl":["AI_WEB"],"m":"3WEBS_METHOD","pt":true},{"id":"geo23","n":"Open Graph Metadata Completeness","c":"ON-PAGE","w":6,"wl":["HUMAN_WEB","AI_WEB"],"m":"ESTABLISHED_PRACTICE","pt":true},{"id":"geo24","n":"Social Card Metadata Completeness","c":"ON-PAGE","w":5,"wl":["HUMAN_WEB","AI_WEB"],"m":"ESTABLISHED_PRACTICE","pt":true},{"id":"geo25","n":"Integrity Manifest Presence and Validity","c":"ON-SITE","w":7,"wl":["MACHINE_WEB"],"m":"3WEBS_METHOD","pt":true},{"id":"geo26","n":"Machine-Readable Change History","c":"ON-SITE","w":6,"wl":["MACHINE_WEB"],"m":"3WEBS_METHOD","pt":true},{"id":"geo27","n":"Dataset Structured Data Where Applicable","c":"ON-PAGE","w":6,"wl":["AI_WEB"],"m":"ESTABLISHED_PRACTICE","pt":true},{"id":"geo28","n":"External Entity Link Quality","c":"OFF-PAGE","w":8,"wl":["AI_WEB"],"m":"ESTABLISHED_PRACTICE","pt":true}],"AIO":[{"id":"aio1","n":"Topical Coverage Depth","c":"ON-PAGE","w":10,"wl":["AI_WEB"],"m":"3WEBS_METHOD","pt":true},{"id":"aio2","n":"Semantic Topic Cluster Coverage","c":"ON-PAGE","w":9,"wl":["AI_WEB"],"m":"3WEBS_METHOD","pt":true},{"id":"aio3","n":"Content Freshness Evidence","c":"ON-PAGE","w":8,"wl":["HUMAN_WEB","AI_WEB"],"m":"ESTABLISHED_PRACTICE","pt":true},{"id":"aio4","n":"External Experience Expertise Authority Trust Evidence","c":"OFF-PAGE","w":9,"wl":["AI_WEB"],"m":"ESTABLISHED_PRACTICE","pt":true},{"id":"aio5","n":"Expertise Evidence in Content","c":"ON-PAGE","w":9,"wl":["AI_WEB"],"m":"3WEBS_METHOD","pt":true},{"id":"aio6","n":"Information Density","c":"ON-PAGE","w":8,"wl":["AI_WEB"],"m":"3WEBS_METHOD","pt":true},{"id":"aio7","n":"Source Citation Quality","c":"ON-PAGE","w":9,"wl":["AI_WEB"],"m":"3WEBS_METHOD","pt":true},{"id":"aio8","n":"Explicit AI Crawler Access Policy","c":"ON-SITE","w":9,"wl":["AI_WEB"],"m":"STANDARD","pt":true},{"id":"aio9","n":"Public Content AI Fetchability","c":"ON-SITE","w":9,"wl":["AI_WEB"],"m":"3WEBS_METHOD","pt":true},{"id":"aio10","n":"Perplexity Citation Observation","c":"OFF-PAGE","w":7,"wl":["AI_WEB"],"m":"PROVIDER_SPECIFIC","pt":true},{"id":"aio11","n":"ChatGPT Search Citation Observation","c":"OFF-PAGE","w":8,"wl":["AI_WEB"],"m":"PROVIDER_SPECIFIC","pt":true},{"id":"aio12","n":"Google AI Grounding Observation","c":"OFF-PAGE","w":8,"wl":["AI_WEB"],"m":"PROVIDER_SPECIFIC","pt":true},{"id":"aio13","n":"Claude Web Citation Observation","c":"OFF-PAGE","w":7,"wl":["AI_WEB"],"m":"PROVIDER_SPECIFIC","pt":true},{"id":"aio14","n":"AI Retrieval Discoverability Evidence","c":"OFF-PAGE","w":7,"wl":["AI_WEB"],"m":"EXPERIMENTAL","pt":true},{"id":"aio15","n":"Unique First-Party Data","c":"ON-PAGE","w":10,"wl":["AI_WEB"],"m":"3WEBS_METHOD","pt":true},{"id":"aio16","n":"Original Definition Evidence","c":"ON-PAGE","w":8,"wl":["AI_WEB"],"m":"3WEBS_METHOD","pt":true},{"id":"aio17","n":"Original Analysis and Thought Leadership Evidence","c":"ON-PAGE","w":8,"wl":["AI_WEB"],"m":"3WEBS_METHOD","pt":true},{"id":"aio18","n":"Topic Completeness","c":"ON-PAGE","w":7,"wl":["AI_WEB"],"m":"3WEBS_METHOD","pt":true},{"id":"aio19","n":"Internal Semantic Link Graph","c":"ON-SITE","w":8,"wl":["HUMAN_WEB","AI_WEB"],"m":"3WEBS_METHOD","pt":true},{"id":"aio20","n":"Concept Cluster Coverage","c":"ON-PAGE","w":8,"wl":["AI_WEB"],"m":"3WEBS_METHOD","pt":true},{"id":"aio21","n":"Comparative and Contrastive Analysis","c":"ON-PAGE","w":7,"wl":["AI_WEB"],"m":"3WEBS_METHOD","pt":true},{"id":"aio22","n":"Retrieval-Friendly Content Structure","c":"ON-PAGE","w":9,"wl":["AI_WEB"],"m":"3WEBS_METHOD","pt":true},{"id":"aio23","n":"Section-Level Summarizability","c":"ON-PAGE","w":8,"wl":["AI_WEB"],"m":"3WEBS_METHOD","pt":true},{"id":"aio24","n":"Table and List Extractability","c":"ON-PAGE","w":7,"wl":["AI_WEB"],"m":"3WEBS_METHOD","pt":true},{"id":"aio25","n":"Content Version and Date Traceability","c":"ON-SITE","w":7,"wl":["AI_WEB","MACHINE_WEB"],"m":"3WEBS_METHOD","pt":true},{"id":"aio26","n":"Machine-Extractable Summary","c":"ON-PAGE","w":8,"wl":["AI_WEB"],"m":"3WEBS_METHOD","pt":true},{"id":"aio27","n":"Descriptive Heading Efficiency","c":"ON-PAGE","w":7,"wl":["AI_WEB"],"m":"3WEBS_METHOD","pt":true},{"id":"aio28","n":"User Intent Explicitness","c":"ON-PAGE","w":8,"wl":["AI_WEB"],"m":"3WEBS_METHOD","pt":true},{"id":"aio29","n":"Cross-Page Factual Consistency","c":"ON-PAGE","w":9,"wl":["AI_WEB"],"m":"3WEBS_METHOD","pt":true},{"id":"aio30","n":"Machine-Readable AI Metadata","c":"ON-SITE","w":8,"wl":["AI_WEB","MACHINE_WEB"],"m":"3WEBS_METHOD","pt":true},{"id":"aio31","n":"Machine Access Policy Declaration","c":"ON-SITE","w":7,"wl":["MACHINE_WEB"],"m":"3WEBS_METHOD","pt":true}],"SEO":[{"id":"seo1","n":"Title Element Quality","c":"ON-PAGE","w":10,"wl":["HUMAN_WEB"],"m":"ESTABLISHED_PRACTICE","pt":true},{"id":"seo2","n":"Meta Description Quality","c":"ON-PAGE","w":7,"wl":["HUMAN_WEB"],"m":"ESTABLISHED_PRACTICE","pt":true},{"id":"seo3","n":"Heading Hierarchy","c":"ON-PAGE","w":9,"wl":["HUMAN_WEB","AI_WEB"],"m":"ESTABLISHED_PRACTICE","pt":true},{"id":"seo4","n":"Primary Topic Relevance","c":"ON-PAGE","w":8,"wl":["HUMAN_WEB","AI_WEB"],"m":"ESTABLISHED_PRACTICE","pt":true},{"id":"seo5","n":"Semantic Term Coverage","c":"ON-PAGE","w":7,"wl":["HUMAN_WEB","AI_WEB"],"m":"3WEBS_METHOD","pt":true},{"id":"seo6","n":"URL Structure","c":"ON-SITE","w":7,"wl":["HUMAN_WEB"],"m":"ESTABLISHED_PRACTICE","pt":true},{"id":"seo7","n":"Image Alternative Text Coverage","c":"ON-PAGE","w":7,"wl":["HUMAN_WEB"],"m":"STANDARD","pt":true},{"id":"seo8","n":"Internal Link Architecture","c":"ON-SITE","w":9,"wl":["HUMAN_WEB","AI_WEB"],"m":"ESTABLISHED_PRACTICE","pt":true},{"id":"seo9","n":"XML Sitemap Validity and Coverage","c":"ON-SITE","w":9,"wl":["HUMAN_WEB","AI_WEB"],"m":"STANDARD","pt":true},{"id":"seo10","n":"Core Web Vitals Overall Evidence","c":"ON-SITE","w":10,"wl":["HUMAN_WEB"],"m":"PROVIDER_SPECIFIC","pt":true},{"id":"seo11","n":"Mobile Usability","c":"ON-SITE","w":10,"wl":["HUMAN_WEB"],"m":"ESTABLISHED_PRACTICE","pt":true},{"id":"seo12","n":"HTTPS Availability","c":"ON-SITE","w":10,"wl":["HUMAN_WEB","AI_WEB","MACHINE_WEB"],"m":"STANDARD","pt":true},{"id":"seo13","n":"Backlink Authority Evidence","c":"OFF-PAGE","w":9,"wl":["HUMAN_WEB","AI_WEB"],"m":"ESTABLISHED_PRACTICE","pt":true},{"id":"seo14","n":"Backlink Source Diversity","c":"OFF-PAGE","w":8,"wl":["HUMAN_WEB","AI_WEB"],"m":"ESTABLISHED_PRACTICE","pt":true},{"id":"seo15","n":"Referring Domain Evidence","c":"OFF-PAGE","w":8,"wl":["HUMAN_WEB","AI_WEB"],"m":"ESTABLISHED_PRACTICE","pt":true},{"id":"seo16","n":"Anchor Text Diversity","c":"OFF-PAGE","w":7,"wl":["HUMAN_WEB"],"m":"ESTABLISHED_PRACTICE","pt":true},{"id":"seo17","n":"Independent Brand Mention Evidence","c":"OFF-PAGE","w":8,"wl":["HUMAN_WEB","AI_WEB"],"m":"ESTABLISHED_PRACTICE","pt":true},{"id":"seo18","n":"Duplicate Content Risk","c":"ON-PAGE","w":8,"wl":["HUMAN_WEB","AI_WEB"],"m":"ESTABLISHED_PRACTICE","pt":true},{"id":"seo19","n":"Canonical Link Elements","c":"ON-SITE","w":9,"wl":["HUMAN_WEB","AI_WEB"],"m":"STANDARD","pt":true},{"id":"seo20","n":"Structured Data Validity","c":"ON-PAGE","w":9,"wl":["HUMAN_WEB","AI_WEB"],"m":"ESTABLISHED_PRACTICE","pt":true},{"id":"seo21","n":"Crawl Path Efficiency","c":"ON-SITE","w":7,"wl":["HUMAN_WEB","AI_WEB"],"m":"ESTABLISHED_PRACTICE","pt":true},{"id":"seo22","n":"Broken Internal Links","c":"ON-SITE","w":8,"wl":["HUMAN_WEB","AI_WEB"],"m":"ESTABLISHED_PRACTICE","pt":true},{"id":"seo23","n":"Redirect Chain Quality","c":"ON-SITE","w":7,"wl":["HUMAN_WEB","AI_WEB"],"m":"ESTABLISHED_PRACTICE","pt":true},{"id":"seo24","n":"Content Sufficiency for Page Intent","c":"ON-PAGE","w":7,"wl":["HUMAN_WEB","AI_WEB"],"m":"3WEBS_METHOD","pt":true},{"id":"seo25","n":"Outbound Source Quality","c":"ON-PAGE","w":7,"wl":["HUMAN_WEB","AI_WEB"],"m":"ESTABLISHED_PRACTICE","pt":true},{"id":"seo26","n":"Public Social Presence","c":"OFF-PAGE","w":5,"wl":["HUMAN_WEB","AI_WEB"],"m":"ESTABLISHED_PRACTICE","pt":true},{"id":"seo27","n":"Public Engagement Metrics Availability","c":"OFF-PAGE","w":3,"wl":["HUMAN_WEB"],"m":"3WEBS_METHOD","pt":false},{"id":"seo28","n":"Private Behavioral Analytics Availability","c":"OFF-PAGE","w":2,"wl":["HUMAN_WEB"],"m":"3WEBS_METHOD","pt":false},{"id":"seo29","n":"Organic Search CTR Evidence","c":"OFF-PAGE","w":3,"wl":["HUMAN_WEB"],"m":"PROVIDER_SPECIFIC","pt":false},{"id":"seo30","n":"Search Console Access Evidence","c":"OFF-PAGE","w":2,"wl":["HUMAN_WEB"],"m":"PROVIDER_SPECIFIC","pt":false},{"id":"seo31","n":"Private Search Index Coverage Evidence","c":"OFF-PAGE","w":3,"wl":["HUMAN_WEB"],"m":"PROVIDER_SPECIFIC","pt":false},{"id":"seo32","n":"Largest Contentful Paint","c":"ON-SITE","w":9,"wl":["HUMAN_WEB"],"m":"PROVIDER_SPECIFIC","pt":true},{"id":"seo33","n":"Cumulative Layout Shift","c":"ON-SITE","w":8,"wl":["HUMAN_WEB"],"m":"PROVIDER_SPECIFIC","pt":true},{"id":"seo34","n":"Interaction to Next Paint","c":"ON-SITE","w":8,"wl":["HUMAN_WEB"],"m":"PROVIDER_SPECIFIC","pt":true},{"id":"seo35","n":"HTTP to HTTPS Redirect","c":"ON-SITE","w":7,"wl":["HUMAN_WEB","AI_WEB","MACHINE_WEB"],"m":"STANDARD","pt":true},{"id":"seo36","n":"Hreflang Implementation Validity","c":"ON-SITE","w":6,"wl":["HUMAN_WEB","AI_WEB"],"m":"STANDARD","pt":true},{"id":"seo37","n":"Pagination Crawlability","c":"ON-SITE","w":5,"wl":["HUMAN_WEB","AI_WEB"],"m":"ESTABLISHED_PRACTICE","pt":true},{"id":"seo38","n":"Structured Data Warning and Error Severity","c":"ON-PAGE","w":8,"wl":["HUMAN_WEB","AI_WEB"],"m":"ESTABLISHED_PRACTICE","pt":true},{"id":"seo39","n":"Suspicious Backlink Risk","c":"OFF-PAGE","w":6,"wl":["HUMAN_WEB"],"m":"EXPERIMENTAL","pt":true},{"id":"seo40","n":"Domain History and Independent Authority Evidence","c":"OFF-PAGE","w":7,"wl":["HUMAN_WEB","AI_WEB"],"m":"ESTABLISHED_PRACTICE","pt":true},{"id":"seo41","n":"Content Modification Recency","c":"ON-PAGE","w":7,"wl":["HUMAN_WEB","AI_WEB"],"m":"ESTABLISHED_PRACTICE","pt":true},{"id":"seo42","n":"Document Structural Flow","c":"ON-PAGE","w":7,"wl":["HUMAN_WEB","AI_WEB"],"m":"3WEBS_METHOD","pt":true}],"AI_SIGNALS":[{"id":"ai1","n":"OpenAI Crawler Access Declaration","c":"ON-SITE","w":9,"wl":["AI_WEB"],"m":"PROVIDER_SPECIFIC","pt":true},{"id":"ai2","n":"Anthropic Crawler Access Declaration","c":"ON-SITE","w":9,"wl":["AI_WEB"],"m":"PROVIDER_SPECIFIC","pt":true},{"id":"ai3","n":"Google-Extended Policy Declaration","c":"ON-SITE","w":7,"wl":["AI_WEB"],"m":"PROVIDER_SPECIFIC","pt":true},{"id":"ai4","n":"Perplexity Crawler Access Declaration","c":"ON-SITE","w":8,"wl":["AI_WEB"],"m":"PROVIDER_SPECIFIC","pt":true},{"id":"ai5","n":"Other AI Crawler Access Coverage","c":"ON-SITE","w":6,"wl":["AI_WEB"],"m":"PROVIDER_SPECIFIC","pt":true},{"id":"ai6","n":"SHA-256 Integrity Manifest","c":"ON-SITE","w":8,"wl":["MACHINE_WEB"],"m":"3WEBS_METHOD","pt":true},{"id":"ai7","n":"Independent Timestamp or Signature Evidence","c":"OFF-SITE","w":8,"wl":["MACHINE_WEB"],"m":"ESTABLISHED_PRACTICE","pt":true},{"id":"ai8","n":"Machine-Readable Session and State Declaration","c":"ON-SITE","w":6,"wl":["MACHINE_WEB"],"m":"3WEBS_METHOD","pt":true},{"id":"ai9","n":"Canonical Alias and Entity Resolution Declaration","c":"ON-SITE","w":7,"wl":["AI_WEB","MACHINE_WEB"],"m":"3WEBS_METHOD","pt":true},{"id":"ai10","n":"Machine-Readable Usage Policy","c":"ON-SITE","w":7,"wl":["MACHINE_WEB"],"m":"3WEBS_METHOD","pt":true},{"id":"ai11","n":"Machine-Readable Action Contract","c":"ON-SITE","w":8,"wl":["MACHINE_WEB"],"m":"3WEBS_METHOD","pt":true},{"id":"ai12","n":"Grounding and Evidence Controls","c":"ON-SITE","w":8,"wl":["AI_WEB","MACHINE_WEB"],"m":"3WEBS_METHOD","pt":true},{"id":"ai13","n":"Entity Graph Completeness","c":"ON-SITE","w":8,"wl":["AI_WEB","MACHINE_WEB"],"m":"3WEBS_METHOD","pt":true},{"id":"ai14","n":"Machine-Readable Confidentiality Boundary","c":"ON-SITE","w":7,"wl":["MACHINE_WEB"],"m":"3WEBS_METHOD","pt":true},{"id":"ai15","n":"AI Training and Reuse Permission Declaration","c":"ON-SITE","w":7,"wl":["AI_WEB"],"m":"3WEBS_METHOD","pt":true},{"id":"ai16","n":"EU AI Act Transparency Declaration","c":"ON-SITE","w":7,"wl":["AI_WEB","MACHINE_WEB"],"m":"3WEBS_METHOD","pt":true},{"id":"ai17","n":"AI Governance Declaration","c":"ON-SITE","w":8,"wl":["AI_WEB","MACHINE_WEB"],"m":"3WEBS_METHOD","pt":true},{"id":"ai18","n":"Machine Access Allow-Lane Declaration","c":"ON-SITE","w":7,"wl":["MACHINE_WEB"],"m":"3WEBS_METHOD","pt":true},{"id":"ai32","n":"Claim-to-Evidence Traceability","c":"ON-SITE","w":10,"wl":["AI_WEB","MACHINE_WEB"],"m":"3WEBS_METHOD","pt":true}],"A2A":[{"id":"ai19","n":"Agent Card Discoverable","c":"ON-SITE","w":9,"wl":["MACHINE_WEB"],"m":"EMERGING","pt":true},{"id":"ai20","n":"Agent Card Structurally Valid","c":"ON-SITE","w":9,"wl":["MACHINE_WEB"],"m":"EMERGING","pt":true},{"id":"ai21","n":"Capabilities Explicitly Declared","c":"ON-SITE","w":8,"wl":["MACHINE_WEB"],"m":"EMERGING","pt":true},{"id":"ai22","n":"Capability Contract Valid","c":"ON-SITE","w":9,"wl":["MACHINE_WEB"],"m":"3WEBS_METHOD","pt":true},{"id":"ai23","n":"Declared Endpoint Reachable","c":"ON-SITE","w":10,"wl":["MACHINE_WEB"],"m":"3WEBS_METHOD","pt":true},{"id":"ai24","n":"Machine Protocol Response Valid","c":"ON-SITE","w":10,"wl":["MACHINE_WEB"],"m":"3WEBS_METHOD","pt":true},{"id":"ai25","n":"Capability Invocable Under Declared Contract","c":"ON-SITE","w":10,"wl":["MACHINE_WEB"],"m":"3WEBS_METHOD","pt":true},{"id":"ai26","n":"Capability Execution Verified","c":"OFF-SITE","w":10,"wl":["MACHINE_WEB"],"m":"3WEBS_METHOD","pt":true},{"id":"ai27","n":"Task Status Contract","c":"ON-SITE","w":8,"wl":["MACHINE_WEB"],"m":"EMERGING","pt":true},{"id":"ai28","n":"Human Approval Boundary Declaration","c":"ON-SITE","w":9,"wl":["MACHINE_WEB"],"m":"3WEBS_METHOD","pt":true},{"id":"ai29","n":"Artifact Exchange and Provenance Contract","c":"ON-SITE","w":8,"wl":["MACHINE_WEB"],"m":"3WEBS_METHOD","pt":true},{"id":"ai30","n":"Cancellation and Resume Contract","c":"ON-SITE","w":7,"wl":["MACHINE_WEB"],"m":"EMERGING","pt":true},{"id":"ai31","n":"Agent Activity Audit Trail","c":"ON-SITE","w":9,"wl":["MACHINE_WEB"],"m":"3WEBS_METHOD","pt":true}]};

/* ---------- normalizare URL + admisie SSRF ----------
   normalizeUrl e folosit peste tot ca punct de intrare pentru orice URL
   controlat de utilizator/agent (audit target, callback obs.permanent).
   Blocheaza: scheme non-http(s), credentials in URL, IP-uri literale
   private/loopback/link-local/rezervate (inclusiv 169.254.169.254 —
   IP-ul de metadata cloud folosit in majoritatea exploit-urilor SSRF). */
function ipv4Parts(host) {
  const m = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(host);
  if (!m) return null;
  const parts = m.slice(1).map(Number);
  if (parts.some(p => p > 255)) return null;
  return parts;
}
function isPrivateIPv4(host) {
  const p = ipv4Parts(host);
  if (!p) return false;
  const [a, b] = p;
  if (a === 0) return true;                              // 0.0.0.0/8
  if (a === 10) return true;                              // 10.0.0.0/8
  if (a === 100 && b >= 64 && b <= 127) return true;      // 100.64.0.0/10 CGNAT
  if (a === 127) return true;                              // loopback
  if (a === 169 && b === 254) return true;                 // link-local / cloud metadata
  if (a === 172 && b >= 16 && b <= 31) return true;         // 172.16.0.0/12
  if (a === 192 && b === 0 && p[2] === 0) return true;      // 192.0.0.0/24
  if (a === 192 && b === 0 && p[2] === 2) return true;      // TEST-NET-1
  if (a === 192 && b === 168) return true;                  // 192.168.0.0/16
  if (a === 198 && (b === 18 || b === 19)) return true;      // 198.18.0.0/15
  if (a === 198 && b === 51 && p[2] === 100) return true;    // TEST-NET-2
  if (a === 203 && b === 0 && p[2] === 113) return true;     // TEST-NET-3
  if (a >= 224) return true;                                 // multicast + reserved (224-255)
  return false;
}
function isPrivateIPv6(host) {
  const h = host.toLowerCase().replace(/^\[|\]$/g, '');
  if (h === '::1' || h === '::') return true;
  if (/^fe[89ab][0-9a-f]:/.test(h)) return true;   // fe80::/10 link-local
  if (/^f[cd][0-9a-f]{2}:/.test(h)) return true;    // fc00::/7 unique local
  const v4mapped = /^::ffff:(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})$/.exec(h);
  if (v4mapped) return isPrivateIPv4(v4mapped[1]);
  return false;
}
function looksLikeIpLiteral(host) {
  return !!ipv4Parts(host) || host.includes(':');
}

function normalizeUrl(raw) {
  if (!raw) return null;
  let u = String(raw).trim();
  /* Daca sirul are DEJA o schema (orice schema), nu-i mai punem https:// in
     fata — altfel "ftp://example.com" devenea "https://ftp://example.com",
     un URL absurd cu hostname "ftp" care trecea toate verificarile.
     Schemele non-http(s) sunt respinse mai jos, explicit. */
  if (/^[a-z][a-z0-9+.-]*:/i.test(u)) {
    if (!/^https?:\/\//i.test(u)) return null;      // ftp:, file:, javascript:, data: etc.
  } else {
    u = 'https://' + u;
  }
  let parsed;
  try { parsed = new URL(u); } catch { return null; }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null;
  if (parsed.username || parsed.password) return null;   // credentials in URL — never admitted
  const host = parsed.hostname;
  if (host === 'localhost' || host.endsWith('.localhost') || host.endsWith('.local')
      || host.endsWith('.internal')) return null;
  if (looksLikeIpLiteral(host)) {
    if (isPrivateIPv4(host) || isPrivateIPv6(host)) return null;
  }
  return parsed;
}

/* rezolutie DNS prin DoH (Cloudflare 1.1.1.1) pentru a bloca domenii care
   rezolva spre IP-uri private — nu elimina 100% riscul de DNS rebinding
   (fetch() face propria rezolutie separat, dupa acest check), dar blocheaza
   marea majoritate a atacurilor SSRF realiste unde domeniul e static. */
/* Cache DNS pe durata unui audit. Fara el, fiecare safeFetch facea 2 interogari
   DoH (A + AAAA), iar un audit complet ajungea la ~88 subrequests din care 58
   DNS — peste limita de 50 a planului Cloudflare Free, deci auditul ar fi
   esuat in productie. Aproape toate cererile merg spre acelasi host, deci un
   cache per-invocatie reduce cele 58 la 1-3. */
const dnsCache = new Map();

async function resolveHostIsPrivate(hostname) {
  if (looksLikeIpLiteral(hostname)) return isPrivateIPv4(hostname) || isPrivateIPv6(hostname);
  if (dnsCache.has(hostname)) return dnsCache.get(hostname);
  const result = await resolveHostIsPrivateUncached(hostname);
  dnsCache.set(hostname, result);
  return result;
}

async function resolveHostIsPrivateUncached(hostname) {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 3000);
    const [a, aaaa] = await Promise.all(
      ['A', 'AAAA'].map(type =>
        fetch(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(hostname)}&type=${type}`,
          { headers: { accept: 'application/dns-json' }, signal: ctrl.signal })
          .then(r => r.ok ? r.json() : null).catch(() => null))
    );
    clearTimeout(t);
    const answers = [...((a && a.Answer) || []), ...((aaaa && aaaa.Answer) || [])];
    for (const ans of answers) {
      const ip = ans && ans.data;
      if (!ip) continue;
      if (ip.includes(':') ? isPrivateIPv6(ip) : isPrivateIPv4(ip)) return true;
    }
    return false; // fara raspuns DNS = nu blocam orbeste; fetch-ul propriu va esua oricum daca domeniul nu exista
  } catch { return false; }
}

/* extrage un URL dintr-un text in limbaj natural, ex. "audit https://x.com pls"
   sau "please check example.com" — normalizeUrl singur trateaza tot textul ca
   URL si esueaza pe orice fraza care nu e ea insasi un URL curat. */
function extractUrlFromText(raw) {
  const s = String(raw || '').trim();
  if (!s) return '';
  const withScheme = s.match(/https?:\/\/[^\s"'<>]+/i);
  if (withScheme) return withScheme[0].replace(/[.,;:!?)]+$/, '');
  const bareDomain = s.match(/\b(?:[a-z0-9-]+\.)+[a-z]{2,}(?:\/[^\s"'<>]*)?\b/i);
  if (bareDomain) return bareDomain[0].replace(/[.,;:!?)]+$/, '');
  return s;
}

/* callback-ul obs.permanent e un al doilea vector server-side fetch (scheduler-ul
   face POST catre el) — trece prin aceeasi admisie ca orice URL target.
   Un email (fara scheme http) trece neschimbat — nu declanseaza niciun fetch. */
async function validateNotify(notify) {
  const s = String(notify || '').trim();
  if (!s) return { ok: false, reason: 'notify is required' };
  if (!/^https?:\/\//i.test(s)) {
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)) return { ok: true, value: s };
    return { ok: false, reason: 'notify must be an email address or an https:// callback URL' };
  }
  const u = normalizeUrl(s);
  if (!u) return { ok: false, reason: 'callback URL is invalid or points to a blocked address' };
  if (u.protocol !== 'https:') return { ok: false, reason: 'callback URL must be HTTPS' };
  if (await resolveHostIsPrivate(u.hostname)) return { ok: false, reason: 'callback URL resolves to a private address' };
  return { ok: true, value: u.href };
}

/* ---------- fetch cu timeout, redirect manual revalidat, limita de bytes ----------
   Nu foloseste redirect:'follow' — un redirect public->privat ar ocoli
   complet verificarea facuta pe URL-ul initial. Fiecare hop e revalidat
   prin normalizeUrl + resolveHostIsPrivate inainte de a fi urmat. */
const MAX_RESPONSE_BYTES = 3 * 1024 * 1024; // 3MB — suficient pentru HTML/JSON, opreste raspunsuri abuzive

/* ---------- limitator de concurenta ----------
   Cloudflare permite maximum 6 conexiuni simultane de iesire per invocatie,
   IDENTIC pe planul Free si pe cel Paid — nu e o limita de subrequesturi si
   nu se rezolva prin upgrade. Codul facea Promise.all pe 23 de fisiere JSON
   si pe toate linkurile interne deodata; cererile peste 6 se puneau la coada,
   iar cand coada depasea timeout-ul de 8s rezultatul devenea status 0.
   Pool-ul de 4 lasa loc si pentru DNS/PageSpeed care ruleaza in paralel. */
const MAX_CONCURRENT_FETCH = 4;

/* ---------- limiter, si de ce arata asa ----------
   Un Worker nu are un isolate per cerere: acelasi isolate serveste cereri
   diferite, simultan. Deci un limiter la nivel de modul e PARTAJAT intre
   cereri care nu au nicio legatura una cu alta. Doua consecinte, ambele
   observate in productie:

   1. Interferenta. Patru /explain paralele isi iau reciproc sloturile si se
      asteapta unele pe altele, desi sunt cereri independente.
   2. Blocaj permanent. Daca o continuare e abandonata — invocatia s-a
      terminat, clientul a inchis conexiunea, isolate-ul a fost reciclat —
      `finally` din safeFetch nu mai ruleaza niciodata pentru ea. Slotul
      ramane ocupat pe veci. Dupa patru astfel de abandonuri, inFlight e 4,
      coada creste nelimitat, si ORICE cerere ulterioara asteapta la infinit
      pana expira si intoarce 500.

   Reparatia corecta ar fi un context per cerere, dus prin toate apelurile.
   Ar insemna sa modific fiecare apel de safeFetch din 2700 de linii, cu risc
   mare de regresie. In loc de asta, limiter-ul devine auto-vindecator:
   fiecare slot are un termen de expirare, iar asteptarea in coada are si ea
   unul. Cand ceva nu mai raspunde, sistemul isi revine singur in loc sa se
   blocheze definitiv.

   Principiul: mai bine o cerere in plus decat o coada blocata. Limiter-ul
   exista ca sa protejeze pool-ul de conexiuni, nu ca sa garanteze un numar
   exact — deci cand se strica, cedeaza in directia disponibilitatii. */

const SLOT_MAX_HOLD_MS = 12000;   // timeout-ul unui fetch e 8s; peste 12s detinatorul nu mai exista
const QUEUE_MAX_WAIT_MS = 10000;  // dupa atat, trecem fara slot, nu asteptam la infinit
const QUEUE_MAX_LEN = 64;         // peste atat, nu mai punem la coada deloc

let slotHolders = [];             // timestampuri; lungimea = sloturi ocupate
let fetchQueue = [];

function reclaimExpiredSlots() {
  const cutoff = Date.now() - SLOT_MAX_HOLD_MS;
  const before = slotHolders.length;
  slotHolders = slotHolders.filter(t => t > cutoff);
  const reclaimed = before - slotHolders.length;
  if (reclaimed > 0) {
    console.warn(`limiter: reclaimed ${reclaimed} slot(s) held past ${SLOT_MAX_HOLD_MS}ms`);
    for (let i = 0; i < reclaimed; i++) {
      const next = fetchQueue.shift();
      if (next) { slotHolders.push(Date.now()); next(); }
    }
  }
}

function acquireSlot() {
  reclaimExpiredSlots();
  if (slotHolders.length < MAX_CONCURRENT_FETCH) {
    const token = Date.now();
    slotHolders.push(token);
    return Promise.resolve(token);
  }
  if (fetchQueue.length >= QUEUE_MAX_LEN) {
    /* Coada e deja prea lunga. Nu o mai lungim: trecem fara slot. Un fetch
       peste limita e mai putin daunator decat o cerere care asteapta minute. */
    console.warn('limiter: queue full, proceeding without a slot');
    return Promise.resolve(null);
  }
  return new Promise(resolve => {
    let settled = false;
    let timer = null;
    /* clearTimeout nu e o optimizare, e obligatoriu. Un Worker nu poate
       incheia invocarea cat timp are un timer activ, asa ca un cronometru
       lasat pornit dupa ce promisiunea s-a rezolvat tine raspunsul in loc
       exact atatea milisecunde cat era programat. Fara linia asta, orice
       audit in care macar un fetch a asteptat la coada raspundea in 10
       secunde in loc de sub o secunda. */
    const done = (token) => {
      if (settled) return;
      settled = true;
      if (timer !== null) { clearTimeout(timer); timer = null; }
      resolve(token);
    };
    const waiter = () => done(Date.now());
    fetchQueue.push(waiter);
    timer = setTimeout(() => {
      if (settled) return;
      console.warn(`limiter: waited ${QUEUE_MAX_WAIT_MS}ms for a slot, proceeding without one`);
      fetchQueue = fetchQueue.filter(fn => fn !== waiter);
      done(null);
    }, QUEUE_MAX_WAIT_MS);
  });
}

function releaseSlot(token) {
  if (token === null || token === undefined) return;   // am trecut fara slot
  const i = slotHolders.indexOf(token);
  if (i === -1) return;                                 // deja reclamat de reclaimExpiredSlots
  slotHolders.splice(i, 1);
  const next = fetchQueue.shift();
  if (next) { slotHolders.push(Date.now()); next(); }
}

/* Elibereaza conexiunea cand raspunsul nu e citit. Fara asta, orice raspuns
   abandonat (redirect, eroare, HEAD respins) tine conexiunea ocupata pana la
   sfarsitul invocatiei, iar cele 6 sloturi se epuizeaza. Cauza reala a
   celor 4 URL-uri raportate ca HTTP 0 in sitemap. */
function discardBody(r) {
  try { if (r && r.body && !r.bodyUsed) r.body.cancel(); } catch {}
}

async function safeFetch(url, opts = {}, hops = 0) {
  const token = await acquireSlot();
  try { return await safeFetchInner(url, opts, hops); }
  finally { releaseSlot(token); }
}

async function safeFetchInner(url, opts = {}, hops = 0) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 8000);
  try {
    const target = typeof url === 'string' ? normalizeUrl(url) : url;
    if (!target) return { ok: false, status: 0, text: '', error: 'blocked: invalid or private URL' };
    if (await resolveHostIsPrivate(target.hostname)) {
      return { ok: false, status: 0, text: '', error: 'blocked: target resolves to a private address' };
    }
    const r = await fetch(target.href, { ...opts, signal: ctrl.signal, redirect: 'manual' });
    if ([301, 302, 303, 307, 308].includes(r.status)) {
      /* raspunsul de redirect are corp; daca nu e consumat, conexiunea ramane
         ocupata. Cele 11 redirecturi 308 din sitemap epuizau singure sloturile. */
      discardBody(r);
      const loc = r.headers.get('location');
      if (!loc || hops >= 4) return { ok: false, status: r.status, text: '', errorKind: 'redirect', error: 'blocked: redirect limit or missing Location' };
      let nextUrl;
      try { nextUrl = new URL(loc, target.href).href; } catch { return { ok: false, status: r.status, text: '', errorKind: 'redirect', error: 'blocked: invalid redirect target' }; }
      clearTimeout(t);
      /* recursie pe Inner, nu pe safeFetch: altfel un hop ar cere un al doilea
         slot tinandu-l pe primul, iar un lant de redirecturi ar bloca pool-ul. */
      return safeFetchInner(nextUrl, opts, hops + 1);
    }
    const reader = r.body ? r.body.getReader() : null;
    let text = '';
    if (reader) {
      const decoder = new TextDecoder();
      let total = 0;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        total += value.byteLength;
        if (total > MAX_RESPONSE_BYTES) { try { await reader.cancel(); } catch {} 
          return { ok: r.ok, status: r.status, text: text + decoder.decode(), headers: r.headers,
                   redirected: hops > 0, finalUrl: target.href, truncated: true }; }
        text += decoder.decode(value, { stream: true });
      }
      text += decoder.decode();
    } else {
      text = await r.text();
    }
    return { ok: r.ok, status: r.status, text, headers: r.headers,
             redirected: hops > 0, finalUrl: target.href };
  } catch (e) {
    /* status 0 nu mai e o eticheta unica: raportam cauza, ca un timeout sa nu
       mai fie confundat cu un URL care chiar nu exista. */
    const msg = String(e);
    const kind = /abort/i.test(msg) ? 'timeout'
      : /subrequest/i.test(msg) ? 'subrequest_limit'
      : /connection|network|socket/i.test(msg) ? 'connection' : 'exception';
    return { ok: false, status: 0, text: '', errorKind: kind, error: msg };
  } finally {
    clearTimeout(t);
  }
}

/* ---------- extrage toate blocurile JSON-LD si aplatizeaza @type ---------- */
function extractJsonLd(html) {
  const blocks = [];
  let invalidBlocks = 0;
  const re = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html))) {
    try {
      const parsed = JSON.parse(m[1].trim());
      blocks.push(parsed);
    } catch { invalidBlocks++; }
  }
  const types = new Set();
  const nodes = [];
  function walk(node) {
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node)) { node.forEach(walk); return; }
    if (node['@graph']) walk(node['@graph']);
    if (node['@type']) {
      const t = Array.isArray(node['@type']) ? node['@type'] : [node['@type']];
      t.forEach(x => types.add(String(x)));
      nodes.push(node);
    }
    for (const k of Object.keys(node)) {
      /* '@graph' e deja parcurs mai sus; fara aceasta excludere fiecare nod
         dintr-un @graph era numarat de doua ori — de aici si avertismentul
         fals "@id duplicat intre noduri" si un numar de noduri umflat. */
      if (k !== '@type' && k !== '@graph' && typeof node[k] === 'object') walk(node[k]);
    }
  }
  blocks.forEach(walk);
  return { blocks, types, nodes , invalidBlocks};
}

function getNode(nodes, type) {
  return nodes.find(n => {
    const t = Array.isArray(n['@type']) ? n['@type'] : [n['@type']];
    return t.includes(type);
  });
}

function metaTag(html, attr, name) {
  const re = new RegExp(`<meta[^>]+${attr}=["']${name}["'][^>]+content=["']([^"']*)["']`, 'i');
  const re2 = new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+${attr}=["']${name}["']`, 'i');
  const m = html.match(re) || html.match(re2);
  return m ? m[1] : null;
}

function tagsOf(html, tag) {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'gi');
  const out = [];
  let m;
  while ((m = re.exec(html))) out.push(m[1].replace(/<[^>]+>/g, '').trim());
  return out;
}

/* ---------- culege toate dovezile despre site ---------- */
/* ---------- safe, explicit A2A invocation test ----------
   Only ever invokes a capability the TARGET ITSELF marked safe_to_invoke:true
   AND side_effects:"none" in its own capabilities.json. Never guesses a skill,
   never invokes anything mutating. If no such capability is declared, the
   result stays not_applicable — never a fabricated pass or fail. */
/* trimite fiecare URL introdus (auditat) catre registrul comun AIVENTURE,
   per site. Fire-and-forget prin ctx.waitUntil — nu intarzie raspunsul catre
   utilizator si nu strica raportul daca registrul e jos. Endpoint fix,
   de incredere — nu trece prin safeFetch (acela e pentru URL-uri
   controlate de utilizator/agent, nu pentru telemetria noastra interna). */
async function logToRegistry(ctx, targetUrl, type) {
  /* Varianta anterioara era fire-and-forget cu `.catch(() => {})`, deci orice
     esec disparea fara urma — registrul ramanea gol si nu se putea afla de ce.
     Acum asteptam rezultatul si il raportam in raport, ca esecul sa fie vizibil.
     Costa un singur subrequest, deja inclus in buget. */
  try {
    const r = await fetch('https://gdpr.aiventure.ro/registry/log', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ site: '3webobs', url: targetUrl, type: type || 'audit' }),
    });
    if (!r.ok) return { logged: false, reason: 'HTTP ' + r.status };
    let body = null;
    try { body = await r.json(); } catch {}
    return { logged: !!(body && body.ok), reason: body && body.ok ? null : 'raspuns neasteptat' };
  } catch (e) {
    return { logged: false, reason: String((e && e.message) || e) };
  }
}

async function attemptSafeInvocation(origin, caps, opts) {
  const list = caps && Array.isArray(caps.capabilities) ? caps.capabilities : [];
  /* ATENTIE — invocare activa, nu observare pasiva.
     `safe_to_invoke: true` este o declaratie a site-ului AUDITAT despre el insusi.
     Un scanner care face POST doar pe baza ei executa cod pe o tinta care si-a
     acordat singura permisiunea: orice site poate declara asta si poate produce
     efecte secundare reale. De aceea invocarea e acum OPT-IN explicit, cerut de
     cel care ruleaza auditul ({ invokeDeclaredCapability: true }), nu implicita.
     Fara opt-in, semnalele de invocare raman `na` — necunoscut, nu esec. */
  if (!opts || opts.invokeDeclaredCapability !== true) {
    return { attempted: false, skipped: 'not_opted_in',
      reason: 'invocarea capabilitatii declarate necesita consimtamantul celui care ruleaza auditul; declaratia safe_to_invoke a site-ului auditat nu e suficienta' };
  }
  const safeCap = list.find(c => c && c.safe_to_invoke === true && c.side_effects === 'none' && c.a2a_invocation);
  if (!safeCap) return { attempted: false, reason: 'niciun capability declarat safe_to_invoke:true cu side_effects:"none"' };
  const inv = safeCap.a2a_invocation;
  const endpoint = origin + (inv.endpoint || '/a2a');
  const skillId = inv.skill || safeCap.id;
  const body = {
    jsonrpc: '2.0', id: 'safe-test-' + Date.now(),
    method: inv.method === 'message/send' || !inv.method ? 'message/send' : inv.method,
    params: { message: { kind: 'message', role: 'user', messageId: crypto.randomUUID(),
      parts: [{ kind: 'data', data: { skill: skillId } }] } }
  };
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 8000);
  try {
    const r = await fetch(endpoint, {
      method: 'POST', signal: ctrl.signal,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body)
    });
    const status = r.status;
    let rpc = null;
    try { rpc = await r.json(); } catch {}
    const validRpc = !!(rpc && rpc.jsonrpc === '2.0' && rpc.result && !rpc.error);
    const resultData = validRpc && rpc.result.parts && rpc.result.parts[0] && rpc.result.parts[0].data;
    const executed = !!(validRpc && resultData && resultData.skill === skillId);
    return { attempted: true, ok: status === 200, validRpc, executed, capabilityId: safeCap.id, skillId, status };
  } catch (e) {
    return { attempted: true, ok: false, validRpc: false, executed: false, capabilityId: safeCap.id, skillId, error: String((e && e.message) || e) };
  } finally { clearTimeout(t); }
}

/* ---------- parsare REALA robots.txt ----------
   Varianta veche testa doar daca sirul "GPTBot" apare undeva in fisier. Asta
   inseamna ca un robots.txt care spune EXPLICIT:
       User-agent: GPTBot
       Disallow: /
   era raportat drept "GPTBot permis" — exact pe dos fata de realitate. Un
   client ar fi fost informat gresit ca e vizibil pentru AI cand de fapt e blocat.

   Acum parsam pe grupuri de User-agent, respectand semantica RFC 9309:
   un URI e permis daca nicio regula Disallow nu i se potriveste; grupul
   specific unui bot are prioritate fata de grupul "*". */
function parseRobots(text) {
  const out = { gptbot: false, claudebot: false, googleExtended: false,
                perplexitybot: false, ccbot: false, anyDisallowAll: false,
                explicitlyBlocked: [] };
  if (!text) return out;

  // construim grupurile: user-agent(uri) -> reguli
  const groups = [];
  let current = null;
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.replace(/#.*$/, '').trim();
    if (!line) continue;
    const m = /^([A-Za-z-]+)\s*:\s*(.*)$/.exec(line);
    if (!m) continue;
    const field = m[1].toLowerCase();
    const value = m[2].trim();
    if (field === 'user-agent') {
      if (!current || current.rules.length) { current = { agents: [], rules: [] }; groups.push(current); }
      current.agents.push(value.toLowerCase());
    } else if (current && (field === 'allow' || field === 'disallow')) {
      current.rules.push({ type: field, path: value });
    }
  }

  /* Un agent are voie la "/" daca, in grupul care i se aplica, nu exista
     Disallow care sa prinda "/" — sau exista un Allow mai specific. */
  function allowedFor(agentName) {
    const a = agentName.toLowerCase();
    const specific = groups.find(g => g.agents.includes(a));
    const wildcard = groups.find(g => g.agents.includes('*'));
    const group = specific || wildcard;
    if (!group) return { declared: !!specific, allowed: true };   // fara reguli = permis (RFC 9309)
    let bestDisallow = null, bestAllow = null;
    for (const r of group.rules) {
      if (r.path === '') continue;                    // "Disallow:" gol = permite tot
      const matches = '/'.startsWith(r.path) || r.path === '/';
      if (!matches) continue;
      if (r.type === 'disallow' && (!bestDisallow || r.path.length > bestDisallow.length)) bestDisallow = r.path;
      if (r.type === 'allow' && (!bestAllow || r.path.length > bestAllow.length)) bestAllow = r.path;
    }
    if (!bestDisallow) return { declared: !!specific, allowed: true };
    if (bestAllow && bestAllow.length >= bestDisallow.length) return { declared: !!specific, allowed: true };
    return { declared: !!specific, allowed: false };
  }

  const BOTS = { gptbot: 'GPTBot', claudebot: 'ClaudeBot', googleExtended: 'Google-Extended',
                 perplexitybot: 'PerplexityBot', ccbot: 'CCBot' };
  for (const [key, name] of Object.entries(BOTS)) {
    const r = allowedFor(name);
    /* "true" inseamna acum: botul chiar are acces, nu doar ca numele lui apare
       undeva in fisier. Un bot mentionat dar blocat devine false + e listat. */
    out[key] = r.allowed;
    if (!r.allowed) out.explicitlyBlocked.push(name);
  }

  const star = allowedFor('*');
  out.anyDisallowAll = !star.allowed;
  return out;
}

async function gatherEvidence(target, opts) {
  const origin = target.origin;
  const [main, robots, sitemap, llms, aitxt] = await Promise.all([
    safeFetch(target.href),
    safeFetch(origin + '/robots.txt'),
    safeFetch(origin + '/sitemap.xml'),
    safeFetch(origin + '/llms.txt'),
    safeFetch(origin + '/ai.txt'),
  ]);

  const jsonFiles = {};
  const jsonBodies = {};
  const jsonNames = ['ai.json', 'entities.json', 'governance.json', 'intents.json',
    'authority.json', 'policy.json', 'ai-proof.json', '.well-known/agent-card.json',
    'llms-full.txt', 'proof.json', 'adn.json', 'network.json', 'capabilities.json',
    'session.json', 'aliases.json', 'actions.json', 'allow-lane-matrix.json',
    'changelog.json', 'humans.txt', 'site.webmanifest', '.well-known/security.txt',
    'agent-card.json', 'signals.json'];
  await Promise.all(jsonNames.map(async n => {
    const r = await safeFetch(origin + '/' + n);
    jsonFiles[n] = r.ok;
    if (r.ok) { try { jsonBodies[n] = JSON.parse(r.text); } catch { jsonBodies[n] = null; } }
  }));

  const safeInvocation = await attemptSafeInvocation(origin, jsonBodies['capabilities.json'], opts);

  const html = main.text || '';
  const ld = extractJsonLd(html);
  const imgs = [...html.matchAll(/<img\b[^>]*>/gi)].map(m => m[0]);
  const imgsWithAlt = imgs.filter(t => /alt=["'][^"']+["']/i.test(t)).length;
  const links = [...html.matchAll(/<a\b[^>]+href=["']([^"']+)["']/gi)].map(m => m[1]);
  const internalLinks = links.filter(h => h.startsWith('/') || h.includes(target.host)).length;
  const externalLinks = links.filter(h => /^https?:\/\//i.test(h) && !h.includes(target.host)).length;

  /* ---- verificare REALA a linkurilor interne ----
     Inainte se numarau doar linkurile, fara sa fie fetch-uite: un link rupt
     primea PASS. Acum se testeaza efectiv un esantion, cu HEAD (ieftin),
     cu fallback pe GET daca serverul nu suporta HEAD. Esantion limitat ca
     sa nu explodeze bugetul de subrequests al unui singur audit. */
  const LINK_SAMPLE_MAX = 12;
  const internalHrefs = [...new Set(links
    .filter(h => h && !/^(#|mailto:|tel:|javascript:|data:)/i.test(h))
    .map(h => { try { return new URL(h, target.href).href; } catch { return null; } })
    .filter(u => u && u.startsWith(origin))
  )].slice(0, LINK_SAMPLE_MAX);

  const linkChecks = await Promise.all(internalHrefs.map(async u => {
    try {
      let r = await safeFetch(u, { method: 'HEAD' });
      if (!r.ok && (r.status === 405 || r.status === 501 || r.status === 0)) {
        r = await safeFetch(u, { method: 'GET' });
      }
      return { url: u, status: r.status, ok: r.status >= 200 && r.status < 400, errorKind: r.errorKind || null };
    } catch { return { url: u, status: 0, ok: false, errorKind: 'exception' }; }
  }));
  /* acelasi principiu ca la sitemap: o eroare de transport a scannerului nu e
     un link stricat al site-ului auditat. */
  const brokenLinks = linkChecks.filter(c => !c.ok && !c.errorKind);
  const inconclusiveLinks = linkChecks.filter(c => !c.ok && c.errorKind);

  /* ---- parsare REALA a sitemap-ului ----
     Inainte se verifica doar ca sitemap.xml raspunde 200. Acum se parseaza,
     se numara URL-urile, se verifica lastmod si se testeaza un esantion. */
  let sitemapInfo = { present: false, parsed: false, urlCount: 0, withLastmod: 0, sampleBroken: [], isIndex: false };
  let proofCheck = { present: false, entries: 0, verified: 0, mismatches: [], checked: 0 };
  if (sitemap.ok && sitemap.text) {
    const t = sitemap.text;
    sitemapInfo.present = true;
    sitemapInfo.isIndex = /<sitemapindex/i.test(t);
    const locs = [...t.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/gi)].map(m => m[1]);
    sitemapInfo.parsed = /<\?xml/i.test(t) && (/<urlset/i.test(t) || sitemapInfo.isIndex);
    sitemapInfo.urlCount = locs.length;
    sitemapInfo.withLastmod = [...t.matchAll(/<lastmod>/gi)].length;
    const sample = locs.filter(u => u.startsWith(origin)).slice(0, 5);
    const smChecks = await Promise.all(sample.map(async u => {
      try {
        let r = await safeFetch(u, { method: 'HEAD' });
        if (!r.ok && (r.status === 405 || r.status === 501 || r.status === 0)) r = await safeFetch(u, { method: 'GET' });
        return { url: u, status: r.status, ok: r.status >= 200 && r.status < 400, errorKind: r.errorKind || null };
      } catch (e) { return { url: u, status: 0, ok: false, errorKind: 'exception' }; }
    }));
    sitemapInfo.sampleChecked = smChecks.length;
    /* Un URL care nu a putut fi verificat din cauza scannerului (timeout, conexiune,
       exceptie) NU e un URL stricat al site-ului auditat. Il raportam separat, ca
       verificare neconcludenta, ca sa nu mai producem fals-negative pe sitemap. */
    sitemapInfo.sampleBroken = smChecks.filter(c => !c.ok && !c.errorKind);
    sitemapInfo.sampleInconclusive = smChecks.filter(c => !c.ok && c.errorKind);
  }
  const wordCount = html.replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .split(/\s+/).filter(Boolean).length;

  /* ---- verificare CRIPTOGRAFICA reala a manifestului de integritate ----
     Inainte: proof.json exista => PASS 90, fara sa se calculeze vreun hash.
     Auditul extern a gasit un mismatch real pe index.html exact din cauza asta.
     Acum: descarcam un esantion de fisiere declarate, calculam SHA-256 si
     comparam cu valoarea din manifest. */
  const proofBody = jsonBodies['proof.json'] || jsonBodies['ai-proof.json'];
  if (proofBody) {
    proofCheck.present = true;
    // manifestul poate fi { files: [...] } sau { files: { path: {...} } } sau o lista simpla
    let fileEntries = [];
    const f = proofBody.files || proofBody.manifest || proofBody.hashes;
    if (Array.isArray(f)) {
      fileEntries = f.map(e => ({ path: e.path || e.file || e.name, hash: e.sha256 || e.hash || e.digest, bytes: e.bytes || e.size }));
    } else if (f && typeof f === 'object') {
      fileEntries = Object.entries(f).map(([k, v]) => ({
        path: k, hash: (typeof v === 'string' ? v : (v.sha256 || v.hash || v.digest)), bytes: v && v.bytes }));
    }
    fileEntries = fileEntries.filter(e => e.path && e.hash && /^[a-f0-9]{64}$/i.test(e.hash));
    proofCheck.entries = fileEntries.length;

    const PROOF_SAMPLE_MAX = 4;
    const sample = fileEntries.slice(0, PROOF_SAMPLE_MAX);
    for (const entry of sample) {
      try {
        const fileUrl = new URL(entry.path.startsWith('/') ? entry.path : '/' + entry.path, origin).href;
        const r = await safeFetch(fileUrl);
        if (!r.ok) { proofCheck.mismatches.push({ path: entry.path, reason: `HTTP ${r.status}` }); proofCheck.checked++; continue; }
        const buf = new TextEncoder().encode(r.text);
        const digest = await crypto.subtle.digest('SHA-256', buf);
        const actual = Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
        proofCheck.checked++;
        if (actual.toLowerCase() === entry.hash.toLowerCase()) proofCheck.verified++;
        else proofCheck.mismatches.push({ path: entry.path, expected: entry.hash.slice(0, 12), actual: actual.slice(0, 12) });
      } catch (e) {
        proofCheck.checked++;
        proofCheck.mismatches.push({ path: entry.path, reason: 'eroare la verificare' });
      }
    }
  }

  return {
    target, mainOk: main.ok, status: main.status, html,
    proofCheck,
    plainText: (() => {
      return html.replace(/<script[\s\S]*?<\/script>/gi, ' ')
                 .replace(/<style[\s\S]*?<\/style>/gi, ' ')
                 .replace(/<[^>]+>/g, ' ')
                 .replace(/\s+/g, ' ').trim();
    })(),
    h3: tagsOf(html, 'h3'),
    externalHosts: (() => {
      const hosts = new Set();
      for (const h of links) {
        if (/^https?:\/\//i.test(h)) {
          try { const u = new URL(h); if (u.host !== target.host) hosts.add(u.host); } catch {}
        }
      }
      return [...hosts];
    })(),
    robots: robots.ok ? robots.text : null,
    sitemap: sitemap.ok, sitemapText: sitemap.ok ? sitemap.text : '',
    sitemapInfo, linkChecks, brokenLinks, inconclusiveLinks,
    llms: llms.ok ? llms.text : null,
    aitxt: aitxt.ok ? aitxt.text : null,
    jsonFiles, jsonBodies, safeInvocation,
    ldTypes: ld.types, ldNodes: ld.nodes, ldBlocks: ld.blocks, ldInvalidBlocks: ld.invalidBlocks,
    langAttr: (html.match(/<html[^>]+lang=["']([^"']+)["']/i) || [])[1] || null,
    canonical: (html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i) || [])[1] || null,
    viewport: !!html.match(/<meta[^>]+name=["']viewport["']/i),
    ogTitle: metaTag(html, 'property', 'og:title'),
    ogDesc: metaTag(html, 'property', 'og:description'),
    ogImage: metaTag(html, 'property', 'og:image'),
    twCard: metaTag(html, 'name', 'twitter:card'),
    metaDesc: metaTag(html, 'name', 'description'),
    title: (tagsOf(html, 'title')[0] || ''),
    h1: tagsOf(html, 'h1'),
    h2: tagsOf(html, 'h2'),
    hreflang: [...html.matchAll(/<link[^>]+hreflang=["']([^"']+)["']/gi)].length,
    semanticTags: ['header', 'nav', 'main', 'article', 'section', 'footer']
      .filter(t => new RegExp(`<${t}[\\s>]`, 'i').test(html)).length,
    breadcrumbNav: /aria-label=["']breadcrumb["']/i.test(html) || ld.types.has('BreadcrumbList'),
    faqBlocks: (html.match(/<dt[\s>]/gi) || []).length + (html.match(/\?\s*<\/(h[2-6]|dt|strong|b)>/gi) || []).length,
    imgTotal: imgs.length, imgWithAlt: imgsWithAlt,
    internalLinks, externalLinks, wordCount,
    https: target.protocol === 'https:',
    robotsBots: parseRobots(robots.ok ? robots.text : ''),
    sitemapInRobots: /Sitemap:/i.test(robots.text || ''),

    /* dovezi suplimentare, toate din date deja aduse — zero cereri in plus */
    headingFlow: (() => {
      const lv = [...html.matchAll(/<h([1-6])[\s>]/gi)].map(m => Number(m[1]));
      const skips = lv.filter((v, i) => i > 0 && v > lv[i - 1] + 1).length;
      return { levels: lv.length, h1count: lv.filter(x => x === 1).length, skips };
    })(),
    tocAnchors: [...html.matchAll(/<a\b[^>]+href=["']#[\w-]+["']/gi)].length,
    tables: (html.match(/<table[\s>]/gi) || []).length,
    lists: (html.match(/<(ul|ol)[\s>]/gi) || []).length,
    paginationTags: /<link[^>]+rel=["'](next|prev)["']/i.test(html),
    slug: target.pathname,
    ldSameAs: (() => {
      const org = getNode(ld.nodes, 'Organization') || getNode(ld.nodes, 'Corporation');
      return (org && Array.isArray(org.sameAs)) ? org.sameAs : [];
    })(),
    ldDateModified: (() => {
      const n = ld.nodes.find(x => x.dateModified);
      return n ? n.dateModified : null;
    })(),
    mentionsAiAct: /2024\/1689|AI Act|Artificial Intelligence Act/i.test(html),
    mentionsGovernance: /governance|accountab|oversight/i.test(html),
    metaAiSignals: /<meta[^>]+name=["']ai-signals["']/i.test(html),
    metaA2A: /<meta[^>]+name=["']a2a-agent-card["']/i.test(html),
    trainingConsent: /Training:\s*allowed|training["']?\s*:\s*["']allowed/i.test((aitxt.text || '') + (main.text || '')),
    /* aplicabilitate: exista pe pagina continutul pe care fiecare schema l-ar descrie?
       Fara continut, schema nu e un esec — pur si simplu nu se aplica. */
    applicable: (() => {
      const txt = html.replace(/<script[\s\S]*?<\/script>/gi, '')
                      .replace(/<style[\s\S]*?<\/style>/gi, '');
      const plain = txt.replace(/<[^>]+>/g, ' ');
      return {
        Product: /add to cart|buy now|in stock|out of stock|SKU|shopping cart/i.test(plain),
        Event: /<time[\s>]/i.test(txt) &&
               /venue|register now|doors open|agenda|conference|webinar|workshop on/i.test(plain),
        VideoObject: /<video[\s>]|youtube\.com\/embed|player\.vimeo\.com|<iframe[^>]+(youtube|vimeo)/i.test(txt),
        AggregateRating: /itemprop=["']review|class=["'][^"']*\breview\b|\u2605{3,}|\b\d+\s+(customer\s+)?reviews?\b|rated\s+\d(\.\d)?\s*(out of|\/)\s*5/i.test(txt),
        ClaimReview: /fact[- ]check|we rated this|claim:|verdict:|debunk/i.test(plain),
        LocalBusiness: /opening hours|walk[- ]?in|visit (us|our) (shop|store|office)|book a table|directions to/i.test(plain),
        Article: (() => {
          const words = plain.split(/\s+/).filter(Boolean).length;
          const hasArticleTag = /<article[\s>]/i.test(txt);
          const byline = /\bby\s+[A-Z][a-z]+\s+[A-Z][a-z]+|<time[^>]+datetime=|rel=["']author["']/i.test(txt);
          return words > 900 && hasArticleTag && byline;
        })(),
        /* Speakable e o functie in disponibilitate limitata, restransa la
           publisheri de stiri in cateva piete. Ceruta universal, producea FAIL
           pe pagini carora nu li se aplica — un fals pozitiv care costa clientul
           munca inutila. Se aplica exact unde se aplica si Article. */
        SpeakableSpecification: (() => {
          const words = plain.split(/\s+/).filter(Boolean).length;
          const hasArticleTag = /<article[\s>]/i.test(txt);
          const byline = /\bby\s+[A-Z][a-z]+\s+[A-Z][a-z]+|<time[^>]+datetime=|rel=["']author["']/i.test(txt);
          return words > 900 && hasArticleTag && byline;
        })(),
        Person: /<address[\s>]/i.test(txt) || /founder|author|written by/i.test(plain),
        HowTo: /step\s*\d|first,|then,|finally,/i.test(plain),
        /* BreadcrumbList se aplica doar unde exista o ierarhie reala de navigare.
           O homepage nu are parinte, deci nu are ce sa declare intr-un breadcrumb —
           a o penaliza pentru asta era un fals pozitiv semnalat de auditul extern. */
        BreadcrumbList: (() => {
          let depth = 0;
          try { depth = new URL(target.href).pathname.split('/').filter(Boolean).length; } catch {}
          if (depth === 0) return false;                       // homepage: nu se aplica
          return /<nav[^>]*>|aria-label=["'][^"']*breadcrumb/i.test(txt) || depth >= 1;
        })()
      };
    })(),
    redirects: main.redirected || false,
    finalUrl: main.finalUrl || target.href,
  };
}


/* ---------- PageSpeed Insights — sursa gratuita, fara cheie obligatorie ----------
   Cheia PAGESPEED_API_KEY e optionala: fara ea, cota e mai mica dar API-ul raspunde.
   Daca apelul esueaza, semnalele raman NA — niciodata FAIL inventat. */
async function fetchPageSpeed(url, env) {
  const key = env && env.PAGESPEED_API_KEY ? '&key=' + env.PAGESPEED_API_KEY : '';
  const api = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed'
            + '?url=' + encodeURIComponent(url)
            + '&strategy=mobile&category=performance' + key;
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 25000);
  try {
    const r = await fetch(api, { signal: ctrl.signal });
    if (!r.ok) return null;
    const j = await r.json();
    const audits = j.lighthouseResult && j.lighthouseResult.audits;
    if (!audits) return null;
    const num = (k) => audits[k] && typeof audits[k].numericValue === 'number'
      ? audits[k].numericValue : null;
    return {
      lcp: num('largest-contentful-paint'),
      cls: num('cumulative-layout-shift'),
      inp: num('interaction-to-next-paint') ?? num('total-blocking-time'),
      inpIsProxy: num('interaction-to-next-paint') === null,
      perf: j.lighthouseResult.categories && j.lighthouseResult.categories.performance
            ? Math.round(j.lighthouseResult.categories.performance.score * 100) : null,
      viewportOk: audits['viewport'] ? audits['viewport'].score === 1 : null,
      source: 'PageSpeed Insights (Lighthouse, mobile)'
    };
  } catch { return null; }
  finally { clearTimeout(t); }
}

/* praguri Core Web Vitals, dupa documentatia Google */
function cwvVerdict(kind, v, proxy) {
  if (v === null || v === undefined) return { status: 'na', method: 'PageSpeed nu a returnat valoarea' };
  if (kind === 'lcp') {
    const s = v <= 2500 ? 'pass' : v <= 4000 ? 'partial' : 'fail';
    return { status: s, score: s === 'pass' ? 95 : s === 'partial' ? 55 : 20,
             method: `LCP ${Math.round(v)} ms (bun <=2500, slab >4000) — PageSpeed` };
  }
  if (kind === 'cls') {
    const s = v <= 0.1 ? 'pass' : v <= 0.25 ? 'partial' : 'fail';
    return { status: s, score: s === 'pass' ? 95 : s === 'partial' ? 55 : 20,
             method: `CLS ${v.toFixed(3)} (bun <=0.1, slab >0.25) — PageSpeed` };
  }
  if (kind === 'inp') {
    const lim = proxy ? [200, 600] : [200, 500];
    const s = v <= lim[0] ? 'pass' : v <= lim[1] ? 'partial' : 'fail';
    return { status: s, score: s === 'pass' ? 95 : s === 'partial' ? 55 : 20,
             method: `${proxy ? 'TBT (proxy pentru INP)' : 'INP'} ${Math.round(v)} ms — PageSpeed` };
  }
  return { status: 'na', method: 'metrica necunoscuta' };
}

/* ---------- reguli de evaluare pe dovezi reale — cheie: keyword din numele semnalului ---------- */
const SCHEMA_KEYWORDS = [
  [/FAQ Schema/i, 'FAQPage'],
  [/HowTo Schema/i, 'HowTo'],
  [/Article Schema/i, 'Article'],
  [/Breadcrumb Schema/i, 'BreadcrumbList'],
  [/Product Schema/i, 'Product'],
  [/Review \/ Rating Schema/i, 'AggregateRating'],
  [/Video Schema/i, 'VideoObject'],
  [/Event Schema/i, 'Event'],
  [/Local Business Schema/i, 'LocalBusiness'],
  [/Person \/ Author Schema/i, 'Person'],
  [/ClaimReview Schema/i, 'ClaimReview'],
  [/Speakable Schema/i, 'SpeakableSpecification'],
  [/Organization Schema/i, 'Organization'],
];

function evalSignal(sig, ev, psi) {
  if (externalOnly(sig.n)) return { status: 'na', method: 'observatie externa — niciun test public disponibil dintr-un scan de pagina' };
  let n = sig.n;
  /* v3.1 names normalized to existing evidence rules where semantics are equivalent */
  const aliases = [
    [/FAQ Structured Data/i, 'FAQ Schema Markup'],
    [/HowTo Structured Data/i, 'HowTo Schema Markup'],
    [/Article Structured Data/i, 'Article Schema Presence'],
    [/Breadcrumb Structured Data/i, 'Breadcrumb Schema'],
    [/Speakable Structured Data/i, 'Speakable Schema (Voice)'],
    [/Product Structured Data/i, 'Product Schema Completeness'],
    [/Review and Rating Structured Data/i, 'Review / Rating Schema'],
    [/Video Structured Data/i, 'Video Schema Markup'],
    [/Event Structured Data/i, 'Event Schema Accuracy'],
    [/LocalBusiness Structured Data/i, 'Local Business Schema'],
    [/Person and Author Structured Data/i, 'Person / Author Schema'],
    [/ClaimReview Structured Data/i, 'ClaimReview Schema'],
    [/Organization Structured Data Completeness/i, 'Organization Schema Completeness'],
    [/Question-and-Answer Content Blocks/i, 'Q&A Format Content Blocks'],
    [/Extractable Direct Answer Blocks/i, 'Structured Answer Snippets'],
    [/Table of Contents and Section Anchors/i, 'Table of Contents Anchors'],
    [/Direct Answer Formatting/i, 'Direct Answer Formatting'],
    [/Intent-Oriented URL Structure/i, 'Question-Intent URL Structure'],
    [/People-Also-Ask Topic Coverage/i, 'PAA Coverage'],
    [/Featured Answer Extractability/i, 'Featured Snippet Optimization'],
    [/Definition Blocks/i, 'Definition Blocks'],
    [/Step-by-Step Content Structure/i, 'Step-by-Step Schema'],
    [/Concise Lead Answer/i, 'Concise Lead Paragraphs <60w'],
    [/Answer-First Content Structure/i, 'Answer-First Content Structure'],
    [/Semantically Descriptive Headings/i, 'NLP-Friendly Headings'],
    [/Semantic HTML Structure/i, 'Semantic HTML5 Structure'],
    [/llms\.txt Presence and Quality/i, 'llms.txt Presence & Quality'],
    [/AI Policy Declaration File/i, 'ai.txt / AI Directives File'],
    [/robots\.txt AI Crawler Directives/i, 'robots.txt AI Crawler Rules'],
    [/Entity Graph Structured Data/i, 'Entity Graph JSON-LD'],
    [/External Identity References/i, 'sameAs References External'],
    [/ai\.json Identity Declaration/i, 'ai.json Signal File'],
    [/Intent Declaration/i, 'intents.json Declaration'],
    [/Machine-Readable Governance Declaration/i, 'governance.json Presence'],
    [/Machine-Readable Entity Registry/i, 'entities.json Registry'],
    [/Canonical URL Consistency/i, 'Canonical URL Signals'],
    [/Hreflang Language and Region Targeting/i, 'Hreflang Geo-Targeting'],
    [/Open Graph Metadata Completeness/i, 'OpenGraph Completeness'],
    [/Social Card Metadata Completeness/i, 'Twitter Card Meta'],
    [/Integrity Manifest Presence and Validity/i, 'proof.json IP Anchoring'],
    [/Machine-Readable Change History/i, 'changelog.json Versioning'],
    [/Dataset Structured Data/i, 'Dataset Schema Corpus'],
    [/Explicit AI Crawler Access Policy/i, 'AI Crawl Permission Explicit'],
    [/Public Content AI Fetchability/i, 'Content Indexability by LLMs'],
    [/Internal Semantic Link Graph/i, 'Internal Link Semantic Map'],
    [/Retrieval-Friendly Content Structure/i, 'RAG-Ready Content Format'],
    [/Table and List Extractability/i, 'Table / List Extractability'],
    [/Content Version and Date Traceability/i, 'Chronological Versioning'],
    [/Machine-Readable AI Metadata/i, 'LLM-Readable Metadata'],
    [/Machine Access Policy Declaration/i, 'allow-lane-matrix.json'],
    [/Title Element Quality/i, 'Title Tag Optimization'],
    [/Heading Hierarchy/i, 'H1–H6 Hierarchy'],
    [/Image Alternative Text Coverage/i, 'Image Alt Tags'],
    [/XML Sitemap Validity and Coverage/i, 'XML Sitemap Quality'],
    [/HTTPS Availability/i, 'HTTPS / SSL'],
    [/Canonical Link Elements/i, 'Canonical Tags'],
    [/Content Sufficiency for Page Intent/i, 'Content Word Count'],
    [/Largest Contentful Paint/i, 'Core Web Vitals LCP'],
    [/Cumulative Layout Shift/i, 'Core Web Vitals CLS'],
    [/Interaction to Next Paint/i, 'Core Web Vitals INP'],
    [/HTTP to HTTPS Redirect/i, 'HTTPS Redirect Chain'],
    [/Hreflang Implementation Validity/i, 'Hreflang Implementation'],
    [/Pagination Crawlability/i, 'Pagination Tags'],
    [/Content Modification Recency/i, 'Content Freshness Recency'],
    [/Document Structural Flow/i, 'Structured Header Flow'],
    [/OpenAI Crawler Access Declaration/i, 'GPTBot Allow Directive'],
    [/Anthropic Crawler Access Declaration/i, 'ClaudeBot Allow Directive'],
    [/Google-Extended Policy Declaration/i, 'Google-Extended Allow'],
    [/Perplexity Crawler Access Declaration/i, 'PerplexityBot Allow'],
    [/Other AI Crawler Access Coverage/i, 'Meta-AI Allow CCBot'],
    [/SHA-256 Integrity Manifest/i, 'proof.json SHA-256 Anchoring'],
    [/Machine-Readable Session and State Declaration/i, 'session.json State Declaration'],
    [/Canonical Alias and Entity Resolution Declaration/i, 'aliases.json Brand Variants'],
    [/Machine-Readable Usage Policy/i, 'policy.json AI Policy'],
    [/Machine-Readable Action Contract/i, 'actions.json AI Use Cases'],
    [/Entity Graph Completeness/i, 'Entity-Graph Completeness'],
    [/Machine-Readable Confidentiality Boundary/i, 'Confidentiality Boundary Tags'],
    [/AI Training and Reuse Permission Declaration/i, 'Training Data Consent Signal'],
    [/EU AI Act Transparency Declaration/i, 'EU AI Act Compliance Tag'],
    [/AI Governance Declaration/i, 'AI Governance Statement'],
    [/Machine Access Allow-Lane Declaration/i, 'allow-lane-matrix.json']
  ];
  for (const [re, legacy] of aliases) if (re.test(n)) { n = legacy; break; }
  psi = psi || (ev && ev.psi) || null;

  for (const [re, type] of SCHEMA_KEYWORDS) {
    if (re.test(n)) {
      if (ev.ldTypes.has(type))
        return { status: 'pass', score: 90, method: `JSON-LD @type="${type}" gasit` };
      /* fara continutul corespunzator, schema nu se aplica — nu e un esec */
      const ap = ev.applicable || {};
      if (Object.prototype.hasOwnProperty.call(ap, type) && ap[type] === false)
        return { status: 'na',
          method: `pagina nu contine continut de tip ${type} — schema nu se aplica` };
      return { status: 'fail', score: 20, method: `JSON-LD @type="${type}" lipseste` };
    }
  }

  if (/llms\.txt/i.test(n)) {
    if (!ev.llms) return { status: 'fail', score: 0, method: 'llms.txt lipseste' };
    const t = ev.llms.trim();
    const looksXml = /^<\?xml/i.test(t) || /^<urlset/i.test(t) || /^<\s*<?\s*sitemap/i.test(t);
    const looksMd = /^#\s+\S/m.test(t) && !looksXml;
    if (looksXml) return { status: 'fail', score: 0, method: 'llms.txt raspunde 200 dar continutul e XML (probabil sitemap.xml duplicat din greseala), nu format llms.txt' };
    return looksMd
      ? { status: 'pass', score: 85, method: 'llms.txt raspunde 200 cu format markdown valid (titlu # + structura), ' + t.length + ' caractere' }
      : { status: 'partial', score: 40, method: 'llms.txt raspunde 200 dar nu are structura markdown asteptata (titlu # H1 lipseste)' };
  }

  if (/ai\.txt/i.test(n)) return ev.aitxt
    ? { status: 'pass', score: 80, method: 'ai.txt raspunde 200' }
    : { status: 'fail', score: 0, method: 'ai.txt lipseste' };

  if (/robots\.txt AI Crawler/i.test(n)) {
    const b = ev.robotsBots;
    const allowed = [b.gptbot, b.claudebot, b.googleExtended, b.perplexitybot, b.ccbot].filter(Boolean).length;
    if (b.anyDisallowAll) return { status: 'fail', score: 5, method: 'Disallow: / global gasit in robots.txt' };
    return { status: allowed >= 3 ? 'pass' : allowed > 0 ? 'partial' : 'fail',
      score: Math.round((allowed / 5) * 100), method: `${allowed}/5 crawlere AI explicit permise` };
  }

  /* v3.1 Machine Web / A2A evidence */
  const JB = ev.jsonBodies || {};
  const card = JB['.well-known/agent-card.json'] || JB['agent-card.json'];
  const caps = JB['capabilities.json'];
  const acts = JB['actions.json'];
  if (/Agent Card Discoverable/i.test(sig.n)) return ev.jsonFiles['.well-known/agent-card.json']
    ? { status:'pass', score:95, method:'/.well-known/agent-card.json raspunde 200' }
    : { status:'fail', score:0, method:'agent card nedescoperit' };
  if (/Agent Card Structurally Valid/i.test(sig.n)) {
    if (!card) return ev.jsonFiles['.well-known/agent-card.json']
      ? {status:'fail',score:10,method:'agent card prezent dar nu se parseaza ca JSON'}
      : {status:'fail',score:0,method:'agent card lipseste'};

    /* Validare reala pe versiunea declarata, nu doar prezenta campurilor.
       v1.0 cere supportedInterfaces[] (cu url + protocolBinding + protocolVersion)
       si NU mai accepta url / preferredTransport / additionalInterfaces la top level.
       v0.3 cere invers: url la top level. Un card care declara 1.0 dar are forma
       0.3 nu e conform si nu primeste pass. */
    const REQUIRED_V1 = ['name','description','version','capabilities',
                         'supportedInterfaces','defaultInputModes','defaultOutputModes','skills'];
    const V03_ONLY = ['url','preferredTransport','additionalInterfaces','supportsAuthenticatedExtendedCard'];

    const declaredV1 = Array.isArray(card.supportedInterfaces);
    const declares03 = typeof card.protocolVersion === 'string' && /^0\.3/.test(card.protocolVersion);

    if (declaredV1) {
      const missing = REQUIRED_V1.filter(k => card[k] === undefined);
      const leftovers = V03_ONLY.filter(k => card[k] !== undefined);
      const ifaces = card.supportedInterfaces;
      const badIface = ifaces.findIndex(i => !i || !i.url || !i.protocolBinding || !i.protocolVersion);
      if (missing.length) return {status:'fail',score:25,
        method:`declara v1 (supportedInterfaces) dar lipsesc campuri obligatorii: ${missing.join(', ')}`};
      if (!ifaces.length) return {status:'fail',score:25,method:'supportedInterfaces este gol'};
      if (badIface !== -1) return {status:'fail',score:30,
        method:`supportedInterfaces[${badIface}] incomplet — fiecare intrare cere url, protocolBinding si protocolVersion`};
      if (leftovers.length) return {status:'partial',score:65,
        method:`v1 valid, dar mai contine campuri v0.3 eliminate din spec: ${leftovers.join(', ')}`};
      return {status:'pass',score:95,
        method:`agent card conform A2A v1.0 — ${ifaces.length} interfata/e declarate, ${card.skills.length} skills`};
    }

    if (declares03) {
      const ok03 = !!(card.url && Array.isArray(card.skills) && card.skills.length && card.capabilities);
      return ok03 ? {status:'pass',score:80,
                     method:`agent card conform v0.3 (${card.skills.length} skills); migrarea la v1.0 e recomandata`}
                  : {status:'fail',score:25,method:'declara v0.3 dar ii lipsesc campurile obligatorii (url, skills, capabilities)'};
    }

    return {status:'fail',score:20,
      method:`versiune de protocol neconforma: declara "${card.protocolVersion || 'nedeclarat'}" dar nu are nici supportedInterfaces (v1.0), nici forma completa v0.3`};
  }
  if (/Capabilities Explicitly Declared/i.test(sig.n)) {
    const c = caps && Array.isArray(caps.capabilities) ? caps.capabilities.length : 0;
    return c ? {status:'pass',score:90,method:`${c} capabilities declarate`} : {status:'fail',score:0,method:'capabilities.json fara capabilities valide'};
  }
  if (/Capability Contract Valid/i.test(sig.n)) {
    const arr = caps && Array.isArray(caps.capabilities) ? caps.capabilities : [];
    const valid = arr.filter(x => x && x.id && x.input && x.output && x.endpoint).length;
    return arr.length && valid===arr.length ? {status:'pass',score:95,method:`${valid}/${arr.length} capability contracts complete`}
      : valid ? {status:'partial',score:Math.round(valid/arr.length*100),method:`${valid}/${arr.length} capability contracts complete`}
      : {status:'fail',score:0,method:'niciun capability contract complet'};
  }
  if (/Declared Endpoint Reachable/i.test(sig.n)) {
    /* endpoint-ul declarat difera intre versiuni de protocol:
       v1.0 -> supportedInterfaces[].url ; v0.3 -> card.url la top level.
       Acceptam ambele, altfel un card v1 corect ar pica pe nedrept. */
    let declaredUrl = null;
    if (card && Array.isArray(card.supportedInterfaces)) {
      const iface = card.supportedInterfaces.find(i => i && /^https:\/\//i.test(i.url || ''));
      if (iface) declaredUrl = iface.url;
    }
    if (!declaredUrl && card && /^https:\/\//i.test(card.url || '')) declaredUrl = card.url;
    if (!declaredUrl) return {status:'fail',score:0,method:'niciun endpoint HTTPS declarat in agent card (nici supportedInterfaces[].url, nici url)'};
    const si = ev.safeInvocation;
    return si && si.attempted && si.ok
      ? {status:'pass',score:95,method:`endpoint declarat ${declaredUrl} confirmat reachable printr-o invocare reala, non-destructiva (HTTP ${si.status})`}
      : {status:'partial',score:60,method:`endpoint declarat ${declaredUrl}; ${si && si.skipped === 'not_opted_in'
          ? 'invocarea nu a fost ceruta de cel care ruleaza auditul (invokeDeclaredCapability), deci reachability nu a fost testata activ'
          : 'reachability operationala nu a putut fi confirmata printr-un safe-test'}`};
  }
  if (/Machine Protocol Response Valid/i.test(sig.n)) {
    const si = ev.safeInvocation;
    if (!si || !si.attempted) return {status:'na',method: si && si.skipped === 'not_opted_in'
      ? 'invocarea capabilitatii declarate nu a fost ceruta de cel care ruleaza auditul (invokeDeclaredCapability: true); contractul exista, dar nu a fost executat'
      : 'niciun capability declarat safe_to_invoke:true cu side_effects:"none" — invocare reala imposibila fara risc de efecte secundare'};
    return si.validRpc
      ? {status:'pass',score:90,method:`raspuns JSON-RPC 2.0 valid la invocarea reala a skill-ului "${si.skillId}" (HTTP ${si.status})`}
      : {status:'fail',score:10,method:`invocare esuata sau raspuns JSON-RPC invalid (HTTP ${si.status||'n/a'}${si.error?': '+si.error:''})`};
  }
  if (/Capability Invocable Under Declared Contract/i.test(sig.n)) {
    const si = ev.safeInvocation;
    if (!si || !si.attempted) return {status:'na',method: si && si.skipped === 'not_opted_in'
      ? 'invocarea capabilitatii declarate nu a fost ceruta de cel care ruleaza auditul (invokeDeclaredCapability: true); contractul exista, dar nu a fost executat'
      : 'niciun capability declarat safe_to_invoke:true cu side_effects:"none" — invocare reala imposibila fara risc de efecte secundare'};
    return si.ok && si.validRpc
      ? {status:'pass',score:95,method:`skill "${si.skillId}" invocat cu succes exact prin contractul declarat in capabilities.json (HTTP ${si.status})`}
      : {status:'fail',score:10,method:`invocarea skill-ului declarat drept safe_to_invoke a esuat`};
  }
  if (/Capability Execution Verified/i.test(sig.n)) {
    const si = ev.safeInvocation;
    if (!si || !si.attempted) return {status:'na',method: si && si.skipped === 'not_opted_in'
      ? 'executia nu a fost verificata: invocarea nu a fost ceruta de cel care ruleaza auditul (invokeDeclaredCapability: true)'
      : 'niciun capability declarat safe_to_invoke:true cu side_effects:"none" — verificare executie imposibila fara risc de efecte secundare'};
    return si.executed
      ? {status:'pass',score:90,method:`raspunsul returnat de skill "${si.skillId}" corespunde exact skill-ului invocat — executie reala verificata, nu doar declarata`}
      : {status:'fail',score:10,method:`raspunsul primit nu confirma executia skill-ului invocat`};
  }
  if (/Task Status Contract/i.test(sig.n)) {
    const txt=JSON.stringify(card||{})+JSON.stringify(caps||{})+JSON.stringify(acts||{});
    return /status|working|completed|failed|cancel/i.test(txt)
      ? {status:'pass',score:85,method:'contract de stare/task detectat in resursele machine-readable'}
      : {status:'fail',score:10,method:'niciun contract de stare/task detectat'};
  }
  if (/Human Approval Boundary Declaration/i.test(sig.n)) {
    const txt=JSON.stringify(JB['policy.json']||{})+JSON.stringify(JB['governance.json']||{})+JSON.stringify(acts||{});
    return /human|approval|confirm/i.test(txt) ? {status:'pass',score:90,method:'limita de aprobare umana declarata'} : {status:'fail',score:10,method:'limita de aprobare umana nedeclarata'};
  }
  if (/Artifact Exchange and Provenance Contract/i.test(sig.n)) {
    const txt=JSON.stringify(card||{})+JSON.stringify(caps||{})+JSON.stringify(acts||{});
    return /artifact|provenance/i.test(txt) ? {status:'pass',score:85,method:'artefact/provenance declarat'} : {status:'fail',score:10,method:'contract artefact/provenance nedetectat'};
  }
  if (/Cancellation and Resume Contract/i.test(sig.n)) {
    const txt=JSON.stringify(card||{})+JSON.stringify(caps||{})+JSON.stringify(acts||{});
    const c=/cancel/i.test(txt), r=/resume/i.test(txt);
    return c&&r ? {status:'pass',score:90,method:'cancel si resume declarate'} : (c||r) ? {status:'partial',score:50,method:`${c?'cancel':''}${c&&r?' + ':''}${r?'resume':''} declarat`} : {status:'fail',score:10,method:'cancel/resume nedeclarate'};
  }
  if (/Agent Activity Audit Trail/i.test(sig.n)) {
    const txt=JSON.stringify(card||{})+JSON.stringify(JB['governance.json']||{})+JSON.stringify(acts||{});
    return /history|audit|trace|provenance/i.test(txt) ? {status:'pass',score:85,method:'audit/history/provenance declarat'} : {status:'fail',score:10,method:'audit trail nedeclarat'};
  }
  if (/Claim-to-Evidence Traceability/i.test(sig.n)) {
    const proof = ev.jsonFiles['proof.json'] || ev.jsonFiles['ai-proof.json'];
    const evidenceWords = /evidence|proof|sha-256|sha256/i.test(JSON.stringify(JB['ai.json']||{})+JSON.stringify(JB['governance.json']||{})+JSON.stringify(JB['policy.json']||{}));
    return proof && evidenceWords ? {status:'pass',score:90,method:'manifest de integritate + declaratii evidence/proof detectate'}
      : proof || evidenceWords ? {status:'partial',score:50,method:'trasabilitate partiala intre claims si evidence'} : {status:'fail',score:0,method:'nicio trasabilitate claim-to-evidence detectata'};
  }

  if (/proof\.json SHA-256|Cryptographic IP Proof|proof\.json IP Anchoring|SHA-256 Integrity Manifest|Integrity Manifest Presence/i.test(n) || /SHA-256 Integrity Manifest|Integrity Manifest Presence and Validity/i.test(sig.n)) {
    const pc = ev.proofCheck || {};
    if (!pc.present) return { status: 'fail', score: 0, method: 'niciun manifest de integritate publicat' };
    if (!pc.entries) return { status: 'fail', score: 25,
      method: 'proof.json exista dar nu contine intrari cu hash SHA-256 valid (64 hex)' };
    if (!pc.checked) return { status: 'partial', score: 55,
      method: `${pc.entries} intrari declarate, dar niciuna nu a putut fi verificata` };

    /* geo25 (Integrity Manifest Presence and Validity) evalueaza EXISTENTA si
       structura manifestului; ai6 (SHA-256 Integrity Manifest) evalueaza daca
       hash-urile corespund octetilor serviti live. Inainte ambele rulau aceeasi
       ramura, deci un singur defect real producea doua FAIL-uri in doua
       dimensiuni. Acum doar semnalul de hash penalizeaza nepotrivirile. */
    if (/Integrity Manifest Presence and Validity/i.test(sig.n)) return { status: 'pass', score: 92,
      method: `${pc.entries} intrari cu hash SHA-256 valid, manifest publicat si parsabil` };

    if (pc.mismatches.length === 0) return { status: 'pass', score: 95,
      method: `${pc.entries} fisiere in manifest; ${pc.verified}/${pc.checked} verificate criptografic, hash-urile corespund exact` };

    const m = pc.mismatches[0];
    const detail = m.reason ? `${m.path}: ${m.reason}`
      : `${m.path}: manifest ${m.expected}… vs live ${m.actual}…`;
    return { status: 'fail', score: 20,
      method: `manifestul NU corespunde site-ului live — ${pc.mismatches.length} din ${pc.checked} verificate difera (${detail})` };
  }

  if (/\.json/i.test(n)) {
    const fname = (n.match(/([\w.-]+\.json)/i) || [])[1];
    if (fname && fname in ev.jsonFiles) return ev.jsonFiles[fname]
      ? { status: 'pass', score: 85, method: `/${fname} raspunde 200` }
      : { status: 'fail', score: 0, method: `/${fname} lipseste` };
  }

  if (/agent[- ]?card|A2A/i.test(n)) return ev.jsonFiles['.well-known/agent-card.json']
    ? { status: 'pass', score: 85, method: '.well-known/agent-card.json prezent' }
    : { status: 'fail', score: 0, method: '.well-known/agent-card.json lipseste' };

  if (/sitemap/i.test(n)) {
    const si = ev.sitemapInfo || {};
    if (!si.present) return { status: 'fail', score: 10, method: 'sitemap.xml lipseste sau eroare' };
    if (!si.parsed) return { status: 'fail', score: 20,
      method: 'sitemap.xml raspunde 200 dar nu se parseaza ca XML valid (<urlset> sau <sitemapindex> lipseste)' };
    if (si.urlCount === 0) return { status: 'fail', score: 25, method: 'sitemap XML valid dar nu contine niciun <loc>' };

    const broken = (si.sampleBroken || []).length;
    const checked = si.sampleChecked || 0;
    const lastmodPct = si.urlCount ? si.withLastmod / si.urlCount : 0;

    if (broken > 0) return { status: 'fail', score: 35,
      method: `${si.urlCount} URL-uri in sitemap, dar ${broken} din ${checked} testate nu raspund (ex. ${si.sampleBroken[0].url} -> HTTP ${si.sampleBroken[0].status})` };

    if (lastmodPct < 0.5) return { status: 'partial', score: 65,
      method: `${si.urlCount} URL-uri, ${checked}/${checked} testate raspund; doar ${si.withLastmod} au <lastmod> (recomandat pe toate)` };

    return { status: 'pass', score: 90,
      method: `${si.urlCount} URL-uri, esantion de ${checked} verificat si accesibil, ${si.withLastmod} cu <lastmod>` };
  }

  if (/canonical/i.test(n)) return ev.canonical
    ? { status: 'pass', score: 85, method: `<link rel="canonical"> = ${ev.canonical}` }
    : { status: 'fail', score: 20, method: 'lipseste tag canonical' };

  if (/hreflang/i.test(n)) return ev.hreflang > 0
    ? { status: 'pass', score: 75, method: `${ev.hreflang} tag-uri hreflang gasite` }
    : { status: 'na', method: 'niciun hreflang — posibil site mono-limba, nu e neaparat un fail' };

  if (/Open\s?Graph/i.test(n)) {
    const c = [ev.ogTitle, ev.ogDesc, ev.ogImage].filter(Boolean).length;
    return { status: c === 3 ? 'pass' : c > 0 ? 'partial' : 'fail',
      score: Math.round((c / 3) * 100), method: `${c}/3 taguri OG (title/description/image)` };
  }

  if (/Twitter Card/i.test(n)) return ev.twCard
    ? { status: 'pass', score: 80, method: `twitter:card = ${ev.twCard}` }
    : { status: 'fail', score: 15, method: 'lipseste meta twitter:card' };

  if (/Alt (Text|Tag)/i.test(n) || /Image Alt/i.test(n)) {
    if (ev.imgTotal === 0) return { status: 'na', method: 'pagina nu are imagini' };
    const pct = ev.imgWithAlt / ev.imgTotal;
    return { status: pct > 0.8 ? 'pass' : pct > 0.3 ? 'partial' : 'fail',
      score: Math.round(pct * 100), method: `${ev.imgWithAlt}/${ev.imgTotal} imagini cu alt text` };
  }

  if (/Semantic HTML5/i.test(n)) return { status: ev.semanticTags >= 4 ? 'pass' : ev.semanticTags >= 2 ? 'partial' : 'fail',
    score: Math.round((ev.semanticTags / 6) * 100), method: `${ev.semanticTags}/6 tag-uri semantice (header/nav/main/article/section/footer)` };

  if (/Viewport|Mobile/i.test(n)) return ev.viewport
    ? { status: 'pass', score: 90, method: 'meta viewport prezent' }
    : { status: 'fail', score: 0, method: 'lipseste meta viewport — nu e mobile-ready' };

  if (/HTTPS|SSL/i.test(n)) return ev.https
    ? { status: 'pass', score: 100, method: 'site servit pe HTTPS' }
    : { status: 'fail', score: 0, method: 'site NU e pe HTTPS' };

  if (/Word Count|Content (Length|Depth)/i.test(n)) return { status: ev.wordCount >= 600 ? 'pass' : ev.wordCount >= 250 ? 'partial' : 'fail',
    score: Math.min(100, Math.round((ev.wordCount / 600) * 100)), method: `${ev.wordCount} cuvinte pe pagina principala` };

  /* Broken Internal Links — verifica efectiv destinatiile, nu doar numarul.
     Inainte: 27 linkuri numarate = PASS 100, chiar daca erau rupte. */
  if (/Broken Internal Links/i.test(n)) {
    const checks = ev.linkChecks || [];
    const broken = ev.brokenLinks || [];
    if (!checks.length) return { status: 'na', method: 'niciun link intern absolut de testat pe aceasta pagina' };
    if (broken.length === 0) return { status: 'pass', score: 95,
      method: `${checks.length} linkuri interne testate efectiv, toate raspund` };
    const pct = broken.length / checks.length;
    const ex = broken.slice(0, 3).map(b => `${b.url} -> HTTP ${b.status || 'fara raspuns'}`).join('; ');
    return { status: pct > 0.25 ? 'fail' : 'partial',
      score: Math.max(0, Math.round((1 - pct) * 100)),
      method: `${broken.length} din ${checks.length} linkuri interne testate sunt rupte: ${ex}` };
  }

  if (/Internal Link/i.test(n)) return { status: ev.internalLinks >= 10 ? 'pass' : ev.internalLinks >= 3 ? 'partial' : 'fail',
    score: Math.min(100, ev.internalLinks * 8), method: `${ev.internalLinks} linkuri interne detectate` };

  if (/External Link/i.test(n)) return { status: ev.externalLinks >= 3 ? 'pass' : ev.externalLinks >= 1 ? 'partial' : 'fail',
    score: Math.min(100, ev.externalLinks * 20), method: `${ev.externalLinks} linkuri externe detectate` };

  if (/Breadcrumb/i.test(n) && !/Schema/i.test(n)) return ev.breadcrumbNav
    ? { status: 'pass', score: 80, method: 'nav breadcrumb detectat in HTML' }
    : { status: 'fail', score: 20, method: 'nicio structura breadcrumb detectata' };

  if (/FAQ Coverage|Q&A Format|PAA Coverage/i.test(n)) return { status: ev.faqBlocks >= 3 ? 'pass' : ev.faqBlocks >= 1 ? 'partial' : 'fail',
    score: Math.min(100, ev.faqBlocks * 15), method: `${ev.faqBlocks} blocuri tip Q&A detectate` };

  if (/H1|Heading|NLP-Friendly Headings/i.test(n)) return { status: ev.h1.length === 1 ? 'pass' : ev.h1.length === 0 ? 'fail' : 'partial',
    score: ev.h1.length === 1 ? 90 : ev.h1.length === 0 ? 0 : 50, method: `${ev.h1.length} tag-uri H1 pe pagina (ideal: 1)` };

  if (/Title Tag|Meta Description/i.test(n)) {
    const okT = ev.title && ev.title.length >= 15 && ev.title.length <= 65;
    const okD = ev.metaDesc && ev.metaDesc.length >= 50 && ev.metaDesc.length <= 165;
    return { status: okT && okD ? 'pass' : (okT || okD) ? 'partial' : 'fail',
      score: (okT ? 50 : 0) + (okD ? 50 : 0), method: `title=${ev.title.length}c, meta description=${ev.metaDesc ? ev.metaDesc.length : 0}c` };
  }

  if (/Language Declaration|Lang Attribute/i.test(n)) return ev.langAttr
    ? { status: 'pass', score: 90, method: `<html lang="${ev.langAttr}">` }
    : { status: 'fail', score: 10, method: 'lipseste atributul lang pe <html>' };

  if (/sameAs/i.test(n)) {
    const org = getNode(ev.ldNodes, 'Organization') || getNode(ev.ldNodes, 'Person');
    const cnt = org && Array.isArray(org.sameAs) ? org.sameAs.length : 0;
    return { status: cnt >= 3 ? 'pass' : cnt > 0 ? 'partial' : 'fail',
      score: Math.min(100, cnt * 25), method: `${cnt} referinte sameAs in Organization schema` };
  }


  /* ═══════ REGULI ADAUGATE — masurate din date deja aduse, zero cereri suplimentare ═══════ */

  const F = ev.jsonFiles || {};
  const fileRule = (fname, label) => F[fname]
    ? { status: 'pass', score: 88, method: `/${fname} raspunde 200` }
    : { status: 'fail', score: 0, method: `/${fname} lipseste` };

  /* --- permisiuni per-crawler, citite individual din robots.txt --- */
  const botMap = [
    [/ClaudeBot Allow/i, 'claudebot', 'ClaudeBot'],
    [/GPTBot Allow/i, 'gptbot', 'GPTBot'],
    [/Google-Extended Allow/i, 'googleExtended', 'Google-Extended'],
    [/PerplexityBot Allow/i, 'perplexitybot', 'PerplexityBot'],
    [/Meta-AI Allow CCBot|CCBot/i, 'ccbot', 'CCBot'],
  ];
  for (const [re, key, label] of botMap) {
    if (re.test(n)) {
      if (ev.robotsBots.anyDisallowAll)
        return { status: 'fail', score: 0, method: 'Disallow: / global in robots.txt' };
      return ev.robotsBots[key]
        ? { status: 'pass', score: 95, method: `${label} mentionat explicit in robots.txt` }
        : { status: 'fail', score: 25, method: `${label} nu e mentionat explicit in robots.txt` };
    }
  }

  /* --- fisiere de semnal, verificate prin fetch real --- */
  const fileMap = [
    [/ai\.json Signal File/i, 'ai.json'],
    [/intents\.json/i, 'intents.json'],
    [/governance\.json/i, 'governance.json'],
    [/entities\.json/i, 'entities.json'],
    [/policy\.json AI Policy/i, 'policy.json'],
    [/session\.json/i, 'session.json'],
    [/aliases\.json/i, 'aliases.json'],
    [/actions\.json/i, 'actions.json'],
    [/allow-lane-matrix/i, 'allow-lane-matrix.json'],
    [/changelog\.json/i, 'changelog.json'],
    [/ai-proof\.json/i, 'ai-proof.json'],
  ];
  for (const [re, fname] of fileMap) if (re.test(n)) return fileRule(fname);

  /* --- proof.json: accepta oricare dintre cele doua denumiri --- */

  /* --- permisiune de crawl AI, agregat --- */
  if (/AI Crawl Permission Explicit|Content Indexability by LLMs/i.test(n)) {
    const b = ev.robotsBots;
    const c = [b.gptbot, b.claudebot, b.googleExtended, b.perplexitybot, b.ccbot].filter(Boolean).length;
    if (b.anyDisallowAll) return { status: 'fail', score: 0, method: 'Disallow: / global' };
    return { status: c >= 3 ? 'pass' : c > 0 ? 'partial' : 'fail',
      score: Math.round((c / 5) * 100), method: `${c}/5 crawlere AI permise explicit` };
  }

  /* --- consimtamant de training --- */
  if (/Training Data Consent/i.test(n)) return ev.trainingConsent
    ? { status: 'pass', score: 90, method: 'consimtamant de training declarat explicit' }
    : { status: 'fail', score: 20, method: 'niciun consimtamant de training declarat' };

  /* --- EU AI Act / guvernanta --- */
  if (/EU AI Act Compliance Tag/i.test(n)) return ev.mentionsAiAct
    ? { status: 'pass', score: 88, method: 'Regulamentul (UE) 2024/1689 referit explicit in pagina' }
    : { status: 'fail', score: 15, method: 'niciun marcaj EU AI Act gasit' };

  if (/AI Governance Statement/i.test(n)) {
    const ok = F['governance.json'] || ev.mentionsGovernance;
    return ok ? { status: 'pass', score: 85, method: F['governance.json'] ? '/governance.json publicat' : 'declaratie de guvernanta prezenta in pagina' }
              : { status: 'fail', score: 10, method: 'nicio declaratie de guvernanta' };
  }

  /* --- metadate citibile de LLM --- */
  if (/LLM-Readable Metadata/i.test(n)) {
    const c = [ev.metaAiSignals, ev.metaA2A, !!ev.llms, ev.ldTypes.size > 0].filter(Boolean).length;
    return { status: c >= 3 ? 'pass' : c > 0 ? 'partial' : 'fail',
      score: Math.round((c / 4) * 100), method: `${c}/4 straturi de metadate pentru LLM (meta ai-signals, meta a2a, llms.txt, JSON-LD)` };
  }

  /* --- graf de entitati --- */
  if (/Entity Graph JSON-LD|Entity-Graph Completeness/i.test(n)) {
    const t = ev.ldTypes.size;
    return { status: t >= 8 ? 'pass' : t >= 3 ? 'partial' : 'fail',
      score: Math.min(100, t * 8), method: `${t} tipuri schema.org distincte in graful JSON-LD` };
  }

  /* --- profiluri externe declarate prin sameAs (nu verificate la sursa) --- */
  if (/Crunchbase Profile/i.test(n)) {
    const ok = ev.ldSameAs.some(u => /crunchbase\.com/i.test(u));
    return ok ? { status: 'pass', score: 80, method: 'profil Crunchbase declarat in sameAs (nu verificat la sursa)' }
              : { status: 'fail', score: 10, method: 'niciun profil Crunchbase in sameAs' };
  }
  if (/LinkedIn Entity Verification/i.test(n)) {
    const c = ev.ldSameAs.filter(u => /linkedin\.com/i.test(u)).length;
    return { status: c >= 2 ? 'pass' : c === 1 ? 'partial' : 'fail',
      score: Math.min(100, c * 45), method: `${c} referinte LinkedIn in sameAs (nu verificate la sursa)` };
  }
  if (/External Entity Links Quality|Named Entity Density/i.test(n)) {
    const c = ev.ldSameAs.length;
    return { status: c >= 6 ? 'pass' : c >= 2 ? 'partial' : 'fail',
      score: Math.min(100, c * 14), method: `${c} referinte sameAs catre entitati externe` };
  }

  /* --- consistenta brandului intre titlu, og:site_name si schema --- */
  if (/Brand Entity Consistency/i.test(n)) {
    const org = getNode(ev.ldNodes, 'Organization') || getNode(ev.ldNodes, 'Corporation');
    const brand = getNode(ev.ldNodes, 'Brand');
    const names = [ev.title, ev.ogTitle, org && org.name, brand && brand.name].filter(Boolean);
    const norm = s => String(s).toLowerCase().replace(/[^a-z0-9]/g, '');
    const anchor = brand ? norm(brand.name) : (org ? norm(org.name) : '');
    const hits = names.filter(x => anchor && norm(x).includes(anchor.slice(0, 5))).length;
    return { status: hits >= 3 ? 'pass' : hits >= 2 ? 'partial' : 'fail',
      score: Math.round((hits / names.length) * 100),
      method: `${hits}/${names.length} locuri unde numele brandului e consecvent` };
  }

  /* --- structura de continut, din HTML --- */
  if (/Table of Contents Anchors/i.test(n)) return { status: ev.tocAnchors >= 4 ? 'pass' : ev.tocAnchors > 0 ? 'partial' : 'fail',
    score: Math.min(100, ev.tocAnchors * 15), method: `${ev.tocAnchors} ancore interne (#) gasite` };

  if (/Structured Header Flow|Schema Nesting Depth/i.test(n)) {
    const f = ev.headingFlow;
    if (/Schema Nesting/i.test(n)) {
      const t = ev.ldTypes.size;
      return { status: t >= 10 ? 'pass' : t >= 4 ? 'partial' : 'fail',
        score: Math.min(100, t * 7), method: `${t} tipuri imbricate in graful JSON-LD` };
    }
    const ok = f.h1count === 1 && f.skips === 0;
    return { status: ok ? 'pass' : f.skips <= 2 ? 'partial' : 'fail',
      score: ok ? 95 : Math.max(10, 80 - f.skips * 20),
      method: `${f.levels} titluri, ${f.h1count} H1, ${f.skips} salturi de nivel` };
  }

  if (/Table \/ List Extractability/i.test(n)) {
    const c = ev.tables + ev.lists;
    return { status: c >= 5 ? 'pass' : c > 0 ? 'partial' : 'fail',
      score: Math.min(100, c * 12), method: `${ev.tables} tabele si ${ev.lists} liste extractibile` };
  }

  if (/RAG-Ready Content Format|Dense Paragraph Summaries/i.test(n)) {
    const f = ev.headingFlow;
    const ok = f.levels >= 6 && f.skips === 0 && ev.wordCount >= 500;
    return { status: ok ? 'pass' : f.levels >= 3 ? 'partial' : 'fail',
      score: ok ? 88 : 45,
      method: `${f.levels} sectiuni cu titlu, ${ev.wordCount} cuvinte, ${f.skips} salturi de ierarhie` };
  }

  if (/URL Slug Structure|Question-Intent URL Structure/i.test(n)) {
    const s = ev.slug;
    if (s === '/' ) return { status: 'na', method: 'pagina radacina — slug-ul nu se aplica' };
    const ok = /^\/[a-z0-9-\/.]+$/.test(s) && !/_|%20|[A-Z]/.test(s);
    return { status: ok ? 'pass' : 'partial', score: ok ? 90 : 50,
      method: `slug "${s}" ${ok ? 'curat (lowercase, cratime)' : 'contine caractere neideale'}` };
  }

  if (/Pagination Tags/i.test(n)) return ev.paginationTags
    ? { status: 'pass', score: 85, method: 'rel="next"/"prev" prezent' }
    : { status: 'na', method: 'nicio paginare pe aceasta pagina — nu se aplica' };

  if (/Hreflang Implementation/i.test(n)) return ev.hreflang > 0
    ? { status: 'pass', score: 85, method: `${ev.hreflang} taguri hreflang` }
    : { status: 'na', method: 'site mono-limba — hreflang nu se aplica' };

  if (/Content Freshness|Chronological Versioning/i.test(n)) {
    if (!ev.ldDateModified) return { status: 'fail', score: 20, method: 'nicio data de modificare declarata in JSON-LD' };
    const days = Math.round((Date.now() - Date.parse(ev.ldDateModified)) / 86400000);
    return { status: days <= 90 ? 'pass' : days <= 365 ? 'partial' : 'fail',
      score: days <= 90 ? 90 : days <= 365 ? 55 : 20,
      method: `dateModified = ${ev.ldDateModified} (${days} zile)` };
  }

  if (/Redirect Chain|HTTPS Redirect Chain/i.test(n)) return ev.redirects
    ? { status: 'partial', score: 60, method: `cerere redirectionata catre ${ev.finalUrl}` }
    : { status: 'pass', score: 95, method: 'niciun redirect — raspuns direct' };

  if (/AI-Ready Score Declaration/i.test(n)) {
    const ok = F['ai.json'] || F['adn.json'];
    return ok ? { status: 'pass', score: 80, method: 'declaratie de pregatire AI publicata (ai.json / adn.json)' }
              : { status: 'fail', score: 10, method: 'nicio declaratie de pregatire AI' };
  }

  if (/Confidentiality Boundary Tags/i.test(n)) {
    const ok = F['policy.json'] || F['.well-known/security.txt'];
    return ok ? { status: 'pass', score: 80, method: 'limite de utilizare declarate (policy.json / security.txt)' }
              : { status: 'fail', score: 15, method: 'nicio limita de confidentialitate declarata' };
  }

  if (/Structured Answer Snippets|Direct Answer Formatting|Answer-First Content Structure|Featured Snippet/i.test(n)) {
    const ok = ev.ldTypes.has('FAQPage') && ev.faqBlocks >= 3;
    return { status: ok ? 'pass' : ev.ldTypes.has('FAQPage') ? 'partial' : 'fail',
      score: ok ? 88 : ev.ldTypes.has('FAQPage') ? 55 : 20,
      method: ev.ldTypes.has('FAQPage')
        ? `FAQPage in JSON-LD, ${ev.faqBlocks} blocuri Q&A vizibile`
        : 'niciun bloc de raspuns structurat' };
  }

  if (/Definition Blocks|Concise Lead Paragraphs/i.test(n)) {
    const ok = ev.ldTypes.has('DefinedTerm') || ev.ldTypes.has('DefinedTermSet');
    return ok ? { status: 'pass', score: 85, method: 'DefinedTerm / DefinedTermSet prezent in JSON-LD' }
              : { status: 'fail', score: 20, method: 'niciun bloc de definitie structurat' };
  }

  if (/Step-by-Step Schema/i.test(n)) return ev.ldTypes.has('HowTo')
    ? { status: 'pass', score: 88, method: 'HowTo prezent in JSON-LD' }
    : { status: 'fail', score: 20, method: 'niciun HowTo structurat' };

  if (/Dataset Schema Corpus/i.test(n)) return ev.ldTypes.has('Dataset')
    ? { status: 'pass', score: 85, method: 'Dataset prezent in JSON-LD' }
    : { status: 'fail', score: 20, method: 'niciun Dataset declarat' };



  /* --- Core Web Vitals, din PageSpeed (gratuit) --- */
  if (/Core Web Vitals LCP/i.test(n)) return psi ? cwvVerdict('lcp', psi.lcp)
    : { status: 'na', method: 'PageSpeed indisponibil in acest deploy' };
  if (/Core Web Vitals CLS/i.test(n)) return psi ? cwvVerdict('cls', psi.cls)
    : { status: 'na', method: 'PageSpeed indisponibil in acest deploy' };
  if (/Core Web Vitals INP/i.test(n)) return psi ? cwvVerdict('inp', psi.inp, psi.inpIsProxy)
    : { status: 'na', method: 'PageSpeed indisponibil in acest deploy' };
  if (/Core Web Vitals Composite/i.test(n)) {
    if (!psi || psi.perf === null) return { status: 'na', method: 'PageSpeed indisponibil in acest deploy' };
    const s = psi.perf >= 90 ? 'pass' : psi.perf >= 50 ? 'partial' : 'fail';
    return { status: s, score: psi.perf, method: `scor Lighthouse performance ${psi.perf}/100 (mobile) — PageSpeed` };
  }
  if (/Mobile Responsiveness/i.test(n)) {
    if (psi && psi.viewportOk !== null) return psi.viewportOk
      ? { status: 'pass', score: 95, method: 'viewport validat de Lighthouse (mobile)' }
      : { status: 'fail', score: 15, method: 'Lighthouse semnaleaza viewport neconfigurat pentru mobil' };
    return ev.viewport
      ? { status: 'partial', score: 70, method: 'meta viewport prezent (neconfirmat de Lighthouse)' }
      : { status: 'fail', score: 0, method: 'lipseste meta viewport' };
  }

  /* ══════════════════════════════════════════════════════════════════
     SEMNALE DE CONTINUT — analizate din pagina deja descarcata.
     Erau marcate gresit "necesita API platit"; nu necesita nimic extern.
     ══════════════════════════════════════════════════════════════════ */

  const PT = ev.plainText || '';
  const words = PT ? PT.split(/\s+/).filter(Boolean) : [];
  const WC = words.length;
  const sentences = PT.split(/[.!?]+\s/).filter(s => s.trim().length > 15);
  const allHeads = [...(ev.h1 || []), ...(ev.h2 || []), ...(ev.h3 || [])];

  if (/URL Structure/i.test(n)) {
    let p = '';
    try { p = new URL(ev.finalUrl || ev.target.href).pathname; } catch {}
    const segs = p.split('/').filter(Boolean);
    if (!segs.length) return { status: 'na', method: 'pagina radacina — structura de slug nu se aplica' };
    const bad = segs.filter(s => s.length > 40 || /[A-Z]/.test(s) || /_/.test(s) || /%[0-9a-f]{2}/i.test(s) || /^\d+$/.test(s));
    const deep = segs.length > 4;
    if (!bad.length && !deep) return { status: 'pass', score: 90,
      method: `URL curat: ${segs.length} segmente, lowercase, cu cratime, fara ID-uri numerice` };
    const issues = [];
    if (bad.length) issues.push(`${bad.length} segmente problematice (${bad[0]})`);
    if (deep) issues.push(`adancime ${segs.length} (recomandat max 4)`);
    return { status: bad.length > 1 || deep ? 'fail' : 'partial',
      score: bad.length > 1 || deep ? 35 : 65, method: 'URL: ' + issues.join('; ') };
  }

  if (/Information Density/i.test(n)) {
    if (!WC) return { status: 'fail', score: 0, method: 'nicio pagina de text extras' };
    const uniq = new Set(words.map(w => w.toLowerCase().replace(/[^a-z0-9]/gi, ''))).size;
    const ratio = uniq / WC;
    const numbers = (PT.match(/\b\d[\d.,]*\b/g) || []).length;
    return { status: ratio > 0.35 && WC > 300 ? 'pass' : ratio > 0.22 ? 'partial' : 'fail',
      score: Math.min(100, Math.round(ratio * 220)),
      method: `${WC} cuvinte, ${uniq} unice (raport ${(ratio * 100).toFixed(0)}%), ${numbers} valori numerice concrete` };
  }

  if (/Section-Level Summarizability|Machine-Extractable Summary/i.test(n)) {
    if (!allHeads.length) return { status: 'fail', score: 10, method: 'nicio sectiune cu heading — continutul nu poate fi rezumat pe bucati' };
    const lead = PT.slice(0, 400);
    const hasLead = /\b(is|are|provides|measures|means|does|offers|este|sunt|ofera)\b/i.test(lead) && lead.length > 120;
    const ratio = WC / allHeads.length;
    const ok = ratio >= 40 && ratio <= 400 && hasLead;
    return { status: ok ? 'pass' : (allHeads.length >= 3 ? 'partial' : 'fail'),
      score: ok ? 88 : allHeads.length >= 3 ? 60 : 25,
      method: `${allHeads.length} sectiuni, ~${Math.round(ratio)} cuvinte/sectiune${hasLead ? ', cu paragraf-rezumat la inceput' : ', fara rezumat clar la inceput'}` };
  }

  if (/User Intent Explicitness/i.test(n)) {
    const q = (PT.match(/\?/g) || []).length;
    const actionWords = (PT.match(/\b(how to|what is|why|when|guide|step|learn|start|get|run|check|cum|ce este|de ce|ghid|pas)\b/gi) || []).length;
    const total = q + actionWords;
    return { status: total >= 8 ? 'pass' : total >= 3 ? 'partial' : 'fail',
      score: Math.min(100, total * 9),
      method: `${q} intrebari + ${actionWords} formulari orientate pe intentie detectate in text` };
  }

  if (/Primary Topic Relevance/i.test(n)) {
    const title = (ev.title || '').toLowerCase();
    const h1 = (ev.h1 && ev.h1[0] ? ev.h1[0] : '').replace(/<[^>]+>/g, ' ').toLowerCase();
    const terms = [...new Set((title + ' ' + h1).split(/\W+/).filter(w => w.length > 4))];
    if (!terms.length || !WC) return { status: 'fail', score: 10, method: 'titlu sau H1 lipsa — subiectul principal nu poate fi determinat' };
    const low = PT.toLowerCase();
    const found = terms.filter(t => low.includes(t));
    const pct = found.length / terms.length;
    return { status: pct > 0.6 ? 'pass' : pct > 0.3 ? 'partial' : 'fail',
      score: Math.round(pct * 100),
      method: `${found.length}/${terms.length} termeni din titlu/H1 apar si in corpul paginii (${Math.round(pct * 100)}% coerenta)` };
  }

  if (/Semantic Term Coverage|Concept Cluster Coverage|Semantic Topic Cluster/i.test(n)) {
    if (WC < 100) return { status: 'fail', score: 10, method: `doar ${WC} cuvinte — acoperire semantica insuficienta` };
    const freq = {};
    for (const w of words) {
      const k = w.toLowerCase().replace(/[^a-z0-9]/gi, '');
      if (k.length > 5) freq[k] = (freq[k] || 0) + 1;
    }
    const recurring = Object.entries(freq).filter(([, c]) => c >= 3);
    return { status: recurring.length >= 12 ? 'pass' : recurring.length >= 5 ? 'partial' : 'fail',
      score: Math.min(100, recurring.length * 7),
      method: `${recurring.length} termeni de specialitate recurenti (>=3 aparitii), ex: ${recurring.slice(0, 4).map(r => r[0]).join(', ')}` };
  }

  if (/Topical Coverage Depth|Topic Completeness/i.test(n)) {
    const score = Math.min(100, Math.round((WC / 1200) * 60 + allHeads.length * 4));
    return { status: WC > 900 && allHeads.length >= 5 ? 'pass' : WC > 350 ? 'partial' : 'fail',
      score, method: `${WC} cuvinte in ${allHeads.length} sectiuni cu heading` };
  }

  if (/Source Citation Quality|Outbound Source Quality/i.test(n)) {
    const hosts = ev.externalHosts || [];
    if (!hosts.length) return { status: 'fail', score: 15, method: 'nicio sursa externa citata' };
    const authoritative = hosts.filter(h => /\.(gov|edu|europa\.eu|int)$|\.gov\.|wikipedia\.org|w3\.org|ietf\.org|iso\.org|schema\.org|nist\.gov/i.test(h));
    return { status: authoritative.length >= 2 ? 'pass' : hosts.length >= 3 ? 'partial' : 'fail',
      score: Math.min(100, authoritative.length * 30 + hosts.length * 5),
      method: `${hosts.length} domenii externe citate, din care ${authoritative.length} autoritative (${authoritative.slice(0, 3).join(', ') || 'niciunul'})` };
  }

  if (/Expertise Evidence in Content/i.test(n)) {
    const signals = [
      /\b(FCCA|CPA|CCF|PhD|MSc|certified|chartered|licensed|expert|specialist)\b/i.test(PT),
      /\b(years? of experience|since \d{4}|founded in \d{4})\b/i.test(PT),
      /\b(Regulation \(EU\)|RFC \d+|ISO \d+|standard)\b/i.test(PT),
      (ev.ldTypes && (ev.ldTypes.has('Person') || ev.ldTypes.has('Organization'))),
      /\b(methodology|framework|our (approach|method))\b/i.test(PT),
    ].filter(Boolean).length;
    return { status: signals >= 3 ? 'pass' : signals >= 1 ? 'partial' : 'fail',
      score: Math.round((signals / 5) * 100),
      method: `${signals}/5 tipuri de dovada de expertiza (credentiale, vechime, standarde citate, schema Person/Org, metodologie proprie)` };
  }

  if (/Unique First-Party Data|Original Definition Evidence|Original Analysis/i.test(n)) {
    const hasNumbers = (PT.match(/\b\d[\d.,]*\s*(%|signals?|points?|semnale|puncte)\b/gi) || []).length;
    const hasDefinitions = (ev.ldTypes && ev.ldTypes.has('DefinedTerm')) || /\bmeans\b|\bis defined as\b|\binseamna\b/i.test(PT);
    const hasOwnMethod = /\b(our|proprietary|we (developed|built|measure)|metodologia noastra)\b/i.test(PT);
    const c = [hasNumbers >= 3, hasDefinitions, hasOwnMethod].filter(Boolean).length;
    return { status: c >= 2 ? 'pass' : c === 1 ? 'partial' : 'fail',
      score: Math.round((c / 3) * 95),
      method: `${hasNumbers} valori proprii citate, definitii proprii: ${hasDefinitions ? 'da' : 'nu'}, metodologie declarata: ${hasOwnMethod ? 'da' : 'nu'}` };
  }

  if (/Comparative and Contrastive Analysis/i.test(n)) {
    const comp = (PT.match(/\b(versus|vs\.?|compared to|unlike|whereas|in contrast|difference between|fata de|spre deosebire)\b/gi) || []).length;
    const tables = ev.tables || 0;
    return { status: comp >= 3 || tables >= 1 ? 'pass' : comp >= 1 ? 'partial' : 'fail',
      score: Math.min(100, comp * 20 + tables * 30),
      method: `${comp} formulari comparative, ${tables} tabele de comparatie` };
  }

  if (/Natural-Language Query Coverage|Conversational Query Coverage/i.test(n)) {
    const qHeads = allHeads.filter(h => /\?|^(how|what|why|when|where|can|does|is|do|cum|ce|de ce|cand)\b/i.test(h.replace(/<[^>]+>/g, '').trim())).length;
    const faq = ev.faqBlocks || 0;
    const total = qHeads + faq;
    return { status: total >= 5 ? 'pass' : total >= 2 ? 'partial' : 'fail',
      score: Math.min(100, total * 12),
      method: `${qHeads} headinguri formulate ca intrebare + ${faq} blocuri Q&A` };
  }

  /* Cross-Page Factual Consistency cere compararea a doua sau mai multe pagini.
     Auditul citeste o singura pagina, deci acest semnal NU e testabil aici.
     Inainte imprumuta metrica lexicala de la Context Continuity si raporta un
     verdict care nu corespundea numelui semnalului. Ramane 'na' pana exista
     un mod multi-pagina real. */
  if (/Cross-Page Factual Consistency/i.test(n)) {
    return { status: 'na', score: null,
      method: 'necesita compararea mai multor pagini; auditul curent evalueaza o singura pagina' };
  }

  if (/Context Continuity Across Sections/i.test(n)) {
    if (allHeads.length < 2) return { status: 'fail', score: 15, method: 'prea putine sectiuni pentru a evalua continuitatea' };
    const headWords = allHeads.map(h => h.replace(/<[^>]+>/g, '').toLowerCase().split(/\W+/).filter(w => w.length > 4));
    let shared = 0;
    for (let i = 1; i < headWords.length; i++) {
      if (headWords[i].some(w => headWords[i - 1].includes(w) || (ev.title || '').toLowerCase().includes(w))) shared++;
    }
    const pct = shared / (headWords.length - 1);
    return { status: pct > 0.4 ? 'pass' : pct > 0.15 ? 'partial' : 'fail',
      score: Math.round(pct * 130),
      method: `${shared}/${headWords.length - 1} tranzitii intre sectiuni impart vocabular cu sectiunea precedenta sau cu titlul` };
  }

  if (/Primary Entity Salience|Named Entity Clarity/i.test(n)) {
    const org = ev.ldNodes ? getNode(ev.ldNodes, 'Organization') : null;
    const brandName = (org && org.name) || (ev.title || '').split(/[|—–-]/)[0].trim();
    if (!brandName) return { status: 'fail', score: 10, method: 'nicio entitate principala identificabila' };
    const count = (PT.match(new RegExp(brandName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')) || []).length;
    const inTitle = (ev.title || '').toLowerCase().includes(brandName.toLowerCase());
    const inH1 = (ev.h1 || []).some(h => h.toLowerCase().includes(brandName.toLowerCase()));
    return { status: count >= 3 && (inTitle || inH1) ? 'pass' : count >= 1 ? 'partial' : 'fail',
      score: Math.min(100, count * 15 + (inTitle ? 25 : 0) + (inH1 ? 20 : 0)),
      method: `entitatea "${brandName}" apare de ${count} ori in text, in titlu: ${inTitle ? 'da' : 'nu'}, in H1: ${inH1 ? 'da' : 'nu'}` };
  }

  if (/Geographic Context Explicitness/i.test(n)) {
    const org = ev.ldNodes ? getNode(ev.ldNodes, 'Organization') : null;
    const hasAddr = !!(org && org.address);
    const hasCountry = /\b(Romania|România|European Union|EU|Bucharest|București|worldwide)\b/i.test(PT);
    const hasArea = !!(org && org.areaServed);
    const c = [hasAddr, hasCountry, hasArea].filter(Boolean).length;
    return { status: c >= 2 ? 'pass' : c === 1 ? 'partial' : 'fail',
      score: Math.round((c / 3) * 95),
      method: `adresa in schema: ${hasAddr ? 'da' : 'nu'}, tara/regiune in text: ${hasCountry ? 'da' : 'nu'}, areaServed declarat: ${hasArea ? 'da' : 'nu'}` };
  }

  if (/Structured Data Relationship Coherence/i.test(n)) {
    const nodes = ev.ldNodes || [];
    if (!nodes.length) return { status: 'fail', score: 0, method: 'niciun nod JSON-LD' };
    const withId = nodes.filter(x => x && x['@id']).length;
    const refs = JSON.stringify(nodes).match(/"@id"\s*:\s*"[^"]+"/g) || [];
    const linked = refs.length - withId;
    return { status: withId >= 3 && linked > 0 ? 'pass' : withId >= 1 ? 'partial' : 'fail',
      score: Math.min(100, withId * 12 + Math.max(0, linked) * 4),
      method: `${nodes.length} noduri JSON-LD, ${withId} cu @id propriu, ${Math.max(0, linked)} referinte intre ele (graf conectat)` };
  }

  if (/Duplicate Content Risk/i.test(n)) {
    if (!sentences.length) return { status: 'na', method: 'text insuficient pentru analiza de duplicare' };
    const norm = sentences.map(s => s.trim().toLowerCase().replace(/\s+/g, ' '));
    const uniq = new Set(norm);
    const dupPct = 1 - uniq.size / norm.length;
    const hasCanonical = !!ev.canonical;
    return { status: dupPct < 0.1 && hasCanonical ? 'pass' : dupPct < 0.25 ? 'partial' : 'fail',
      score: Math.round((1 - dupPct) * (hasCanonical ? 100 : 70)),
      method: `${norm.length} propozitii, ${Math.round(dupPct * 100)}% repetate intern; canonical ${hasCanonical ? 'prezent' : 'lipsa'}` };
  }

  if (/Crawl Path Efficiency/i.test(n)) {
    const checks = ev.linkChecks || [];
    const inSitemap = ev.sitemapInfo ? ev.sitemapInfo.urlCount : 0;
    const hasRobotsSitemap = ev.sitemapInRobots;
    const c = [checks.length >= 5, inSitemap > 0, hasRobotsSitemap].filter(Boolean).length;
    return { status: c === 3 ? 'pass' : c >= 1 ? 'partial' : 'fail',
      score: Math.round((c / 3) * 95),
      method: `${checks.length} linkuri interne accesibile, ${inSitemap} URL-uri in sitemap, sitemap declarat in robots.txt: ${hasRobotsSitemap ? 'da' : 'nu'}` };
  }

  if (/Grounding and Evidence Controls/i.test(n)) {
    const pc = ev.proofCheck || {};
    const hasProof = pc.present && pc.entries > 0;
    const verified = pc.verified > 0 && pc.mismatches.length === 0;
    const declaresMethod = /\b(deterministic|evidence|rules applied|no score is generated)\b/i.test(PT);
    const c = [hasProof, verified, declaresMethod].filter(Boolean).length;
    return { status: c === 3 ? 'pass' : c >= 1 ? 'partial' : 'fail',
      score: Math.round((c / 3) * 95),
      method: `manifest de integritate: ${hasProof ? 'da' : 'nu'}, hash-uri verificate: ${verified ? 'da' : 'nu'}, metoda declarata public: ${declaresMethod ? 'da' : 'nu'}` };
  }

  /* ══════════════════════════════════════════════════════════════════
     SEMNALE VERIFICABILE LOCAL — declaratii, structura, consistenta.
     Unde se poate verifica DOAR declaratia (nu si continutul sursei
     externe), dovada spune asta explicit — nu pretinde verificare completa.
     ══════════════════════════════════════════════════════════════════ */

  const SA = ev.ldSameAs || [];
  const hostOf = (u) => { try { return new URL(u).host.replace(/^www\./, ''); } catch { return ''; } };

  if (/Structured Data Validity/i.test(n) && !/Warning|Severity/i.test(n)) {
    const nodes = ev.ldNodes || [];
    if (!nodes.length) return { status: 'fail', score: 0, method: 'niciun bloc JSON-LD de validat' };
    const REQ = {
      Organization: ['name'], LocalBusiness: ['name', 'address'], Person: ['name'],
      Product: ['name'], Article: ['headline'], FAQPage: ['mainEntity'],
      HowTo: ['name', 'step'], Event: ['name', 'startDate'], BreadcrumbList: ['itemListElement'],
      WebSite: ['name'], SoftwareApplication: ['name'], Service: ['name'],
    };
    const errors = [];
    for (const node of nodes) {
      if (!node || typeof node !== 'object') { errors.push('nod care nu e obiect'); continue; }
      const t = Array.isArray(node['@type']) ? node['@type'][0] : node['@type'];
      if (!t) { errors.push('nod fara @type'); continue; }
      const req = REQ[t];
      if (req) for (const k of req) if (node[k] === undefined) errors.push(`${t} fara "${k}"`);
    }
    if (!errors.length) return { status: 'pass', score: 92,
      method: `${nodes.length} noduri JSON-LD, toate cu @type si proprietatile obligatorii pentru tipul lor` };
    return { status: errors.length > 3 ? 'fail' : 'partial',
      score: Math.max(10, 90 - errors.length * 15),
      method: `${errors.length} probleme in JSON-LD: ${errors.slice(0, 3).join('; ')}` };
  }

  if (/Structured Data Warning and Error Severity/i.test(n)) {
    const nodes = ev.ldNodes || [];
    if (!nodes.length) return { status: 'fail', score: 0, method: 'niciun JSON-LD' };
    const raw = JSON.stringify(nodes);
    const warnings = [];
    if (!/"@context"/.test(ev.html)) warnings.push('@context lipsa in cel putin un bloc');
    if (/"@id"\s*:\s*""/.test(raw)) warnings.push('@id gol');
    if (/:\s*"(TODO|TBD|xxx|lorem)"/i.test(raw)) warnings.push('valori placeholder ramase');
    if (/"url"\s*:\s*"(?!https?:)/.test(raw)) warnings.push('url relativ (recomandat absolut)');
    const dup = nodes.filter(x => x && x['@id']).map(x => x['@id']);
    if (new Set(dup).size !== dup.length) warnings.push('@id duplicat intre noduri');
    if (!warnings.length) return { status: 'pass', score: 90, method: 'niciun avertisment structural detectat in JSON-LD' };
    return { status: warnings.length > 2 ? 'partial' : 'pass',
      score: Math.max(40, 90 - warnings.length * 12),
      method: `${warnings.length} avertismente (nu erori blocante): ${warnings.join('; ')}` };
  }

  if (/Rich Result Eligibility/i.test(n)) {
    const T = ev.ldTypes || new Set();
    const RICH = ['FAQPage', 'HowTo', 'Product', 'Article', 'NewsArticle', 'BreadcrumbList',
                  'Event', 'Recipe', 'Review', 'VideoObject', 'Course', 'JobPosting', 'Organization'];
    const eligible = RICH.filter(t => T.has(t));
    if (!eligible.length) return { status: 'fail', score: 10,
      method: 'niciun tip de schema eligibil pentru rezultate imbogatite (FAQPage, HowTo, Product, Article, Event...)' };
    return { status: eligible.length >= 2 ? 'pass' : 'partial',
      score: Math.min(95, eligible.length * 35),
      method: `${eligible.length} tipuri eligibile pentru rich results declarate: ${eligible.join(', ')} (eligibilitatea finala o decide Google)` };
  }

  if (/Google AI Overview and AI Mode Source Readiness/i.test(n)) {
    const c = [
      (ev.faqBlocks || 0) >= 3,
      (ev.ldTypes && (ev.ldTypes.has('FAQPage') || ev.ldTypes.has('HowTo'))),
      !!ev.llms,
      (ev.h2 || []).length >= 4,
      !!(ev.robotsBots && ev.robotsBots.googleExtended),
    ].filter(Boolean).length;
    return { status: c >= 4 ? 'pass' : c >= 2 ? 'partial' : 'fail',
      score: Math.round((c / 5) * 95),
      method: `${c}/5 conditii de extractibilitate (Q&A vizibil, schema FAQ/HowTo, llms.txt, structura de headinguri, Google-Extended permis) — aparitia efectiva in AI Overviews nu e observabila public` };
  }

  if (/External Entity Disambiguation/i.test(n)) {
    if (!SA.length) return { status: 'fail', score: 0,
      method: 'niciun link sameAs — entitatea nu e legata de niciun hub extern de identitate' };
    const HUBS = ['wikidata.org', 'wikipedia.org', 'crunchbase.com', 'linkedin.com',
                  'github.com', 'orcid.org', 'ror.org', 'opencorporates.com'];
    const matched = [...new Set(SA.map(hostOf).filter(h => HUBS.some(x => h.endsWith(x))))];
    return { status: matched.length >= 2 ? 'pass' : matched.length === 1 ? 'partial' : 'fail',
      score: Math.min(95, matched.length * 40),
      method: `${matched.length} huburi de identitate declarate in sameAs (${matched.join(', ') || 'niciunul'}) — declaratia e verificabila local, potrivirea profilului nu` };
  }

  if (/External Entity Link Quality/i.test(n)) {
    if (!SA.length) return { status: 'fail', score: 0, method: 'niciun sameAs declarat' };
    const https = SA.filter(u => /^https:\/\//i.test(u)).length;
    const uniqueHosts = new Set(SA.map(hostOf).filter(Boolean));
    const wellFormed = SA.filter(u => { try { new URL(u); return true; } catch { return false; } }).length;
    const ok = https === SA.length && wellFormed === SA.length && uniqueHosts.size >= 3;
    return { status: ok ? 'pass' : uniqueHosts.size >= 2 ? 'partial' : 'fail',
      score: Math.min(95, uniqueHosts.size * 22 + (https === SA.length ? 20 : 0)),
      method: `${SA.length} linkuri sameAs catre ${uniqueHosts.size} domenii distincte, ${https} pe HTTPS, ${wellFormed} bine formate` };
  }

  if (/LinkedIn Entity Presence and Consistency/i.test(n)) {
    const li = SA.filter(u => /linkedin\.com/i.test(u));
    if (!li.length) return { status: 'fail', score: 0, method: 'niciun profil LinkedIn declarat in sameAs' };
    const company = li.filter(u => /linkedin\.com\/(company|school)\//i.test(u));
    return { status: company.length ? 'pass' : 'partial',
      score: company.length ? 88 : 55,
      method: company.length
        ? `profil de companie LinkedIn declarat (${li.length} link-uri LinkedIn) — declaratia e verificabila local, continutul profilului nu`
        : `${li.length} link LinkedIn declarat, dar niciunul de tip /company/ (pare profil personal)` };
  }

  if (/Public Social Presence/i.test(n)) {
    const SOCIAL = ['linkedin.com', 'x.com', 'twitter.com', 'facebook.com', 'youtube.com',
                    'instagram.com', 'github.com', 'medium.com', 'tiktok.com', 'mastodon'];
    const found = [...new Set(SA.map(hostOf).filter(h => SOCIAL.some(s => h.includes(s))))];
    return { status: found.length >= 3 ? 'pass' : found.length >= 1 ? 'partial' : 'fail',
      score: Math.min(95, found.length * 28),
      method: `${found.length} profiluri sociale declarate public in sameAs: ${found.join(', ') || 'niciunul'}` };
  }

  if (/Independent Organization Profile Presence/i.test(n)) {
    const DIRS = ['crunchbase.com', 'opencorporates.com', 'bloomberg.com', 'dnb.com',
                  'clutch.co', 'g2.com', 'trustpilot.com', 'listafirme.ro', 'termene.ro'];
    const found = [...new Set(SA.map(hostOf).filter(h => DIRS.some(d => h.includes(d))))];
    if (!found.length) return { status: 'fail', score: 5,
      method: 'niciun profil declarat in directoare independente de firme (Crunchbase, OpenCorporates, Trustpilot...)' };
    return { status: found.length >= 2 ? 'pass' : 'partial', score: Math.min(90, found.length * 45),
      method: `${found.length} profiluri in directoare independente declarate: ${found.join(', ')} — existenta profilului nu e verificata din acest scan` };
  }

  if (/Author Experience and Expertise Evidence/i.test(n)) {
    const person = ev.ldNodes ? getNode(ev.ldNodes, 'Person') : null;
    const c = [
      !!person,
      !!(person && (person.jobTitle || person.hasCredential || person.honorificSuffix)),
      !!(person && person.sameAs),
      /\b(FCCA|CPA|CCF|PhD|MBA|CFA|certified|chartered)\b/i.test(PT),
      /\b(author|written by|by [A-Z][a-z]+ [A-Z]|autor)\b/.test(PT),
    ].filter(Boolean).length;
    return { status: c >= 3 ? 'pass' : c >= 1 ? 'partial' : 'fail',
      score: Math.round((c / 5) * 95),
      method: `${c}/5 dovezi de autor (schema Person, titlu/credentiale, sameAs personal, acronime de certificare in text, atribuire explicita)` };
  }

  if (/External Experience Expertise Authority Trust Evidence/i.test(n)) {
    const c = [
      SA.length >= 3,
      !!(ev.ldNodes && getNode(ev.ldNodes, 'Person')),
      /\/(about|despre|contact|legal|terms)/i.test(ev.html),
      !!(ev.ldNodes && getNode(ev.ldNodes, 'Organization') && getNode(ev.ldNodes, 'Organization').address),
      /\b(CUI|VAT|registration (number|no)|Reg\. Com)\b/i.test(PT),
    ].filter(Boolean).length;
    return { status: c >= 4 ? 'pass' : c >= 2 ? 'partial' : 'fail',
      score: Math.round((c / 5) * 92),
      method: `${c}/5 semnale E-E-A-T verificabile pe pagina (profiluri externe declarate, autor identificat, pagini about/contact/legal, adresa in schema, identificatori legali) — reputatia externa nu e observabila public` };
  }

  if (/Local Identity Citation Consistency/i.test(n)) {
    const org = ev.ldNodes ? getNode(ev.ldNodes, 'Organization') : null;
    const addr = org && org.address;
    if (!addr) return { status: 'fail', score: 10, method: 'nicio adresa in schema Organization — consistenta NAP nu poate fi evaluata' };
    const name = org.name || '';
    const locality = typeof addr === 'object' ? (addr.addressLocality || '') : '';
    const tel = (org.telephone) || ((PT.match(/\+?\d[\d\s().-]{8,}\d/) || [])[0] || '');
    const nameInText = name && PT.toLowerCase().includes(name.toLowerCase().slice(0, 12));
    const locInText = locality && PT.toLowerCase().includes(locality.toLowerCase());
    const c = [nameInText, locInText, !!tel].filter(Boolean).length;
    return { status: c === 3 ? 'pass' : c >= 1 ? 'partial' : 'fail',
      score: Math.round((c / 3) * 92),
      method: `NAP intern consistent: nume in text ${nameInText ? 'da' : 'nu'}, localitate in text ${locInText ? 'da' : 'nu'}, telefon ${tel ? 'da' : 'nu'} — consistenta cu directoare externe nu e verificabila local` };
  }

  if (/Independent Timestamp or Signature Evidence/i.test(n)) {
    const pb = (ev.jsonBodies && (ev.jsonBodies['proof.json'] || ev.jsonBodies['ai-proof.json'])) || null;
    if (!pb) return { status: 'fail', score: 0, method: 'niciun manifest publicat' };
    const ea = pb.external_anchoring || {};
    const anchors = ['timestamp_authority', 'opens_timestamp', 'digital_signature'].filter(k => ea[k] === true);
    if (anchors.length) return { status: 'pass', score: 92,
      method: `ancorare externa declarata si activa: ${anchors.join(', ')}` };
    const honest = typeof ea.statement === 'string' && /integrity|only|nu/i.test(ea.statement);
    return { status: honest ? 'partial' : 'fail', score: honest ? 55 : 15,
      method: honest
        ? 'fara ancorare externa (TSA/OpenTimestamps/semnatura), dar manifestul declara onest aceasta limita — integritate, nu dovada de moment'
        : 'fara ancorare externa si fara declararea acestei limite' };
  }

  if (/Anchor Text Diversity/i.test(n)) {
    const anchors = [...(ev.html.matchAll(/<a\b[^>]*>([\s\S]*?)<\/a>/gi))]
      .map(m => m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase())
      .filter(t => t.length > 1);
    if (anchors.length < 5) return { status: 'na', method: 'prea putine linkuri pentru a evalua diversitatea textului de ancora' };
    const uniq = new Set(anchors);
    const generic = anchors.filter(t => /^(click here|here|read more|more|link|aici|mai mult)$/.test(t)).length;
    const ratio = uniq.size / anchors.length;
    return { status: ratio > 0.6 && generic === 0 ? 'pass' : ratio > 0.35 ? 'partial' : 'fail',
      score: Math.round(ratio * 100) - generic * 5,
      method: `${anchors.length} ancore interne, ${uniq.size} distincte (${Math.round(ratio * 100)}% diversitate), ${generic} generice de tip "click here" — ancorele backlinkurilor externe nu sunt observabile` };
  }

  /* semnale care cer date externe platite (backlinks, PageSpeed, Wikidata verificat,
     Crunchbase, LinkedIn, presa, NAP local, Google Business, Core Web Vitals) —
     onest marcate NA, niciodata FAIL sau scor inventat */
  return { status: 'na', method: 'necesita sursa externa (API platit) neconectata in acest deploy' };
}


/* ══ GARD NA — semnale care nu pot fi testate dintr-un scan de pagina ══
   Nu exista interfata publica prin care sa afli daca un model citeaza
   un brand, si nici date de backlink fara API platit. Un semnal
   netestabil devine NA, niciodata FAIL 0. NA e exclus din scor. */
const EXTERNAL_ONLY = [
  /Citation Observation/i, /Grounding Observation/i, /Retrieval Discoverability/i,
  /Knowledge-Graph Entity Presence/i, /Search Knowledge Entity Presence/i,
  /Independent Editorial Mentions/i, /Independent Brand Mention/i,
  /Backlink Authority/i, /Backlink Source Diversity/i, /Referring Domain Evidence/i,
  /Suspicious Backlink Risk/i,
  /Domain History and Independent Authority/i,
  /Google Business Profile/i,
  /People-Also-Ask Topic Coverage/i,
  /Public Engagement Metrics/i, /Private Behavioral Analytics/i,
  /Organic Search CTR/i, /Search Console Access/i, /Private Search Index Coverage/i,
];
/* Scoase din gard, pentru ca au acum reguli reale de evaluare locala —
   evalueaza ce e declarat si consistent pe pagina, si spun explicit in dovada
   ce anume NU poate fi confirmat din exterior:
     Author Experience and Expertise Evidence  -> schema Person + credentiale in text
     External Experience Expertise (E-E-A-T)   -> profiluri declarate, about/contact/legal, identificatori legali
     Anchor Text Diversity                     -> diversitatea ancorelor interne
     Local Identity Citation Consistency       -> consistenta NAP interna (schema vs text)
     Independent Organization Profile Presence -> profiluri declarate in directoare
     Public Social Presence                    -> profiluri sociale declarate in sameAs */
function externalOnly(n) { return EXTERNAL_ONLY.some(rx => rx.test(n)); }

/* ---------- invariant status <-> scor ----------
   Unele reguli calculau statusul dintr-o conditie si scorul dintr-o formula
   independenta. La `Primary Entity Salience`, un brand mentionat de 7+ ori in
   text dar absent din titlu si din H1 producea status `partial` cu scor 100 —
   simultan incomplet si perfect. Un auditor extern a semnalat contradictia.

   Aici statusul se DERIVA din scor, o singura data, pentru toate semnalele.
   `na` primeste scor null, niciodata 0: un semnal netestabil nu e un esec, iar
   scorul 0 l-ar penaliza pe client pentru limita noastra de observatie.
   Cand regula pretinde alt status decat spune banda de scor, castiga scorul si
   dezacordul se scrie in `method`, ca bugul sa ramana vizibil, nu netezit. */
const SCORE_BANDS = { pass: 85, partial: 25 };

function statusFromScore(score) {
  if (score >= SCORE_BANDS.pass) return 'pass';
  if (score >= SCORE_BANDS.partial) return 'partial';
  return 'fail';
}

function normalizeVerdict(r) {
  if (!r) return { status: 'na', score: null, method: 'regula nu a returnat niciun verdict' };
  if (r.status === 'na') return { status: 'na', score: null, method: r.method };
  const raw = Number(r.score);
  const score = Number.isFinite(raw) ? Math.max(0, Math.min(100, Math.round(raw))) : 0;
  const derived = statusFromScore(score);
  if (r.status && r.status !== derived) {
    return { status: derived, score,
      method: `${r.method} [status corectat: regula a raportat "${r.status}" cu scor ${score}; banda de scor da "${derived}"]` };
  }
  return { status: derived, score, method: r.method };
}


/* ---------- validare structurala schema.org pe site-ul AUDITAT ----------
   Nu e o a saptea dimensiune si nu intra in cele 167. E un verdict separat,
   despre singurul strat pe care un motor de cautare si un sistem AI il citesc
   la fel. Un graf poate fi JSON valid si totusi gresit semantic: o proprietate
   pusa pe un tip care nu o defineste, o referinta catre alt fel de obiect.
   Pagina se randeaza, JSON-ul parseaza, sensul e rupt, si nimic nu avertizeaza.

   Vocabularul e un subset. Un tip din afara lui nu e raportat ca gresit, ci
   ca neverificat — absenta din lista noastra nu inseamna absenta din
   schema.org. Aceeasi disciplina ca la `na`: nu inventam un verdict. */

const SCHEMA_THING = ['name','url','description','image','identifier','sameAs','alternateName','additionalType','disambiguatingDescription','mainEntityOfPage','potentialAction','subjectOf'];
const SCHEMA_CW = [...SCHEMA_THING,'about','author','creator','publisher','inLanguage','dateModified','datePublished','license','keywords','copyrightHolder','copyrightYear','isAccessibleForFree','encodingFormat','headline','isPartOf','hasPart','citation','version','abstract','text','audience','provider','isBasedOn','material','workExample'];
const SCHEMA_WP = [...SCHEMA_CW,'breadcrumb','primaryImageOfPage','significantLink','relatedLink','speakable','lastReviewed','mainEntity','specialty'];
const SCHEMA_ORG = [...SCHEMA_THING,'address','email','telephone','legalName','logo','brand','founder','foundingDate','foundingLocation','areaServed','contactPoint','employee','knowsAbout','knowsLanguage','taxID','vatID','duns','naics','location','parentOrganization','subOrganization','member','memberOf','numberOfEmployees','slogan','owns','makesOffer','hasOfferCatalog','seeks','award'];
const SCHEMA_IL = [...SCHEMA_THING,'itemListElement','itemListOrder','numberOfItems'];

const SCHEMA_VOCAB = {
  Thing: SCHEMA_THING, CreativeWork: SCHEMA_CW,
  WebPage: SCHEMA_WP, CollectionPage: SCHEMA_WP, ContactPage: SCHEMA_WP,
  AboutPage: SCHEMA_WP, ProfilePage: SCHEMA_WP, FAQPage: SCHEMA_WP,
  WebSite: [...SCHEMA_CW,'issn'],
  Article: [...SCHEMA_CW,'articleBody','articleSection','wordCount','speakable'],
  NewsArticle: [...SCHEMA_CW,'articleBody','articleSection','wordCount','speakable','dateline'],
  BlogPosting: [...SCHEMA_CW,'articleBody','articleSection','wordCount'],
  TechArticle: [...SCHEMA_CW,'proficiencyLevel','dependencies','articleBody','articleSection'],
  APIReference: [...SCHEMA_CW,'proficiencyLevel','assemblyVersion','programmingModel','targetPlatform'],
  SoftwareSourceCode: [...SCHEMA_CW,'codeRepository','codeSampleType','programmingLanguage','runtimePlatform','targetProduct'],
  SoftwareApplication: [...SCHEMA_CW,'applicationCategory','applicationSubCategory','operatingSystem','browserRequirements','featureList','softwareVersion','offers','downloadUrl','screenshot','aggregateRating'],
  WebApplication: [...SCHEMA_CW,'applicationCategory','applicationSubCategory','operatingSystem','browserRequirements','featureList','softwareVersion','offers'],
  Dataset: [...SCHEMA_CW,'distribution','variableMeasured','measurementTechnique','includedInDataCatalog'],
  DataCatalog: [...SCHEMA_CW,'dataset','measurementTechnique'],
  DigitalDocument: [...SCHEMA_CW,'hasDigitalDocumentPermission'],
  DefinedTermSet: [...SCHEMA_CW,'hasDefinedTerm'],
  DefinedTerm: [...SCHEMA_THING,'termCode','inDefinedTermSet'],
  HowTo: [...SCHEMA_CW,'step','supply','tool','totalTime','estimatedCost','prepTime','performTime','yield'],
  ItemList: SCHEMA_IL, BreadcrumbList: SCHEMA_IL, OfferCatalog: SCHEMA_IL,
  ListItem: [...SCHEMA_THING,'item','position','nextItem','previousItem'],
  Organization: SCHEMA_ORG, Corporation: [...SCHEMA_ORG,'tickerSymbol'], OnlineBusiness: SCHEMA_ORG,
  LocalBusiness: [...SCHEMA_ORG,'openingHoursSpecification','currenciesAccepted','paymentAccepted','priceRange','branchOf','geo'],
  Brand: [...SCHEMA_THING,'logo','slogan','aggregateRating','review'],
  Person: [...SCHEMA_THING,'affiliation','email','jobTitle','worksFor','knowsAbout','knowsLanguage','nationality','hasOccupation','address','telephone','birthDate','alumniOf','award','memberOf'],
  Occupation: [...SCHEMA_THING,'occupationLocation','skills','responsibilities','qualifications','estimatedSalary','occupationalCategory'],
  Service: [...SCHEMA_THING,'areaServed','audience','availableChannel','brand','provider','serviceType','termsOfService','hasOfferCatalog','offers','category','serviceOutput','hoursAvailable'],
  WebAPI: [...SCHEMA_THING,'documentation','provider','termsOfService','areaServed','availableChannel','serviceType','assemblyVersion','programmingModel'],
  Offer: [...SCHEMA_THING,'price','priceCurrency','availability','itemOffered','priceSpecification','eligibleQuantity','validFrom','validThrough','seller','category','acceptedPaymentMethod','areaServed'],
  Product: [...SCHEMA_THING,'brand','offers','sku','gtin13','aggregateRating','review','category','model','manufacturer','material','color','weight'],
  Question: [...SCHEMA_CW,'acceptedAnswer','suggestedAnswer','answerCount','upvoteCount'],
  Answer: [...SCHEMA_CW,'upvoteCount'],
  Review: [...SCHEMA_CW,'reviewRating','itemReviewed','reviewBody'],
  AggregateRating: [...SCHEMA_THING,'ratingValue','reviewCount','ratingCount','bestRating','worstRating','itemReviewed'],
  PostalAddress: [...SCHEMA_THING,'streetAddress','addressLocality','addressRegion','postalCode','addressCountry','postOfficeBoxNumber'],
  Event: [...SCHEMA_THING,'startDate','endDate','location','organizer','performer','eventStatus','eventAttendanceMode','offers'],
};

const SCHEMA_RANGE = {
  hasPart:         { expect: ['CreativeWork'], note: 'hasPart expects a CreativeWork' },
  isPartOf:        { expect: ['CreativeWork'], note: 'isPartOf expects a CreativeWork' },
  hasDefinedTerm:  { expect: ['DefinedTerm'], note: 'hasDefinedTerm expects a DefinedTerm' },
  publisher:       { expect: ['Organization','Person'], note: 'publisher expects an Organization or Person' },
  author:          { expect: ['Organization','Person'], note: 'author expects an Organization or Person' },
  creator:         { expect: ['Organization','Person'], note: 'creator expects an Organization or Person' },
  provider:        { expect: ['Organization','Person'], note: 'provider expects an Organization or Person' },
  founder:         { expect: ['Person','Organization'], note: 'founder expects a Person' },
  brand:           { expect: ['Brand','Organization'], note: 'brand expects a Brand or Organization' },
  hasOfferCatalog: { expect: ['OfferCatalog'], note: 'hasOfferCatalog expects an OfferCatalog' },
};

const SCHEMA_PARENTS = {
  Corporation:'Organization', OnlineBusiness:'Organization', LocalBusiness:'Organization',
  WebPage:'CreativeWork', CollectionPage:'WebPage', ContactPage:'WebPage', AboutPage:'WebPage',
  ProfilePage:'WebPage', FAQPage:'WebPage', WebSite:'CreativeWork', Article:'CreativeWork',
  NewsArticle:'Article', BlogPosting:'Article', TechArticle:'Article', APIReference:'TechArticle',
  SoftwareSourceCode:'CreativeWork', SoftwareApplication:'CreativeWork', WebApplication:'SoftwareApplication',
  Dataset:'CreativeWork', DataCatalog:'CreativeWork', DigitalDocument:'CreativeWork',
  DefinedTermSet:'CreativeWork', HowTo:'CreativeWork', BreadcrumbList:'ItemList', OfferCatalog:'ItemList',
  WebAPI:'Service', Question:'CreativeWork', Answer:'CreativeWork', Review:'CreativeWork',
};

function schemaIsA(type, ancestor) {
  let t = type; const seen = new Set();
  while (t && !seen.has(t)) { if (t === ancestor) return true; seen.add(t); t = SCHEMA_PARENTS[t]; }
  return ancestor === 'Thing';
}

function validateSchemaGraph(nodes, invalidBlocks) {
  const out = { objects: 0, valid: 0, warning: 0, error: 0, unverified: 0,
                invalidBlocks: invalidBlocks || 0, issues: [], types: [] };
  if (invalidBlocks) {
    out.issues.push({ level: 'error', type: '(block)', property: '@context',
      message: `${invalidBlocks} JSON-LD block(s) do not parse as JSON` });
    out.error += invalidBlocks;
  }
  if (!nodes || !nodes.length) { out.status = out.invalidBlocks ? 'error' : 'none'; return out; }

  const byId = {};
  for (const n of nodes) if (n['@id']) byId[n['@id']] = n;
  const typeSet = new Set();

  for (const o of nodes) {
    out.objects++;
    const types = Array.isArray(o['@type']) ? o['@type'] : [o['@type']];
    types.forEach(t => typeSet.add(String(t)));
    const allowed = new Set(); let known = false;
    for (const t of types) { const v = SCHEMA_VOCAB[t]; if (v) { known = true; v.forEach(p => allowed.add(p)); } }

    let objErr = 0, objWarn = 0;
    for (const key of Object.keys(o)) {
      if (key.startsWith('@')) continue;
      if (known && !allowed.has(key)) {
        objWarn++;
        if (out.issues.length < 40) out.issues.push({ level: 'warning', type: types.join(' + '),
          property: key, message: `"${key}" is not defined on ${types.join(' + ')}` });
      }
      const rule = SCHEMA_RANGE[key];
      if (rule) {
        const targets = Array.isArray(o[key]) ? o[key] : [o[key]];
        for (const t of targets) {
          if (!t || typeof t !== 'object') continue;
          let tt = Array.isArray(t['@type']) ? t['@type'] : (t['@type'] ? [t['@type']] : []);
          if (!tt.length && t['@id']) { const r = byId[t['@id']]; if (r) tt = Array.isArray(r['@type']) ? r['@type'] : [r['@type']]; }
          if (!tt.length) continue;
          if (!tt.some(x => rule.expect.some(e => schemaIsA(String(x), e)))) {
            objErr++;
            if (out.issues.length < 40) out.issues.push({ level: 'error', type: types.join(' + '),
              property: key, message: `${rule.note}; target is ${tt.join(' + ')}` });
          }
        }
      }
    }
    if (objErr) out.error++;
    else if (objWarn) out.warning++;
    else if (known) out.valid++;
    else out.unverified++;
  }

  out.types = [...typeSet].sort();
  const scored = out.valid + out.warning + out.error;
  out.score = scored ? Math.round(((out.valid + out.warning * 0.5) / scored) * 100) : null;
  out.status = out.error ? 'error' : out.warning ? 'warning' : out.valid ? 'valid' : 'none';
  return out;
}


/* ═══════════ CELE 100 DE ELEMENTE SCHEMA.ORG ═══════════

   Structured data e singurul strat pe care un motor de cautare si un sistem
   AI il citesc la fel. De aceea o singura lista serveste ambele web-uri, si
   de aceea cardul se numeste Mixed Signals.

   Registrul e o selectie, nu specificatia schema.org — care are mii de
   termeni. Astea sunt cele care schimba daca o entitate poate fi rezolvata,
   o oferta citita, o pagina inteleasa.

   Verdictele:
     green   prezent, si complet unde completitudinea e definita
     yellow  prezent dar incomplet, sau recomandat si absent
     red     obligatoriu pentru orice site si lipseste
     grey    neaplicabil — conditia care l-ar face relevant nu e indeplinita

   `conditional` absent NU e esec. E aceeasi disciplina ca `na` la cele 167:
   nu penalizam un site pentru ca nu vinde produse. */

const SCHEMA100 = [{"n":1,"label":"Organization","kind":"type","group":"Core entities","requirement":"required","reads":["human","ai"],"completeness":["name","url","logo","sameAs"]},{"n":2,"label":"LocalBusiness","kind":"type","group":"Core entities","requirement":"conditional","reads":["human","ai"],"completeness":["address","telephone","openingHoursSpecification"],"condition":"the business has a physical location"},{"n":3,"label":"Person","kind":"type","group":"Core entities","requirement":"recommended","reads":["human","ai"],"completeness":["name","jobTitle"]},{"n":4,"label":"Product","kind":"type","group":"Core entities","requirement":"conditional","reads":["human","ai"],"completeness":["name","offers"],"condition":"the page sells a product"},{"n":5,"label":"Article","kind":"type","group":"Core entities","requirement":"conditional","reads":["human","ai"],"completeness":["headline","author","datePublished"],"condition":"the page is editorial"},{"n":6,"label":"BlogPosting","kind":"type","group":"Core entities","requirement":"conditional","reads":["human","ai"],"completeness":["headline","author","datePublished"],"condition":"the page is a blog post"},{"n":7,"label":"WebSite","kind":"type","group":"Core entities","requirement":"required","reads":["human","ai"],"completeness":["name","url"]},{"n":8,"label":"WebPage","kind":"type","group":"Core entities","requirement":"required","reads":["human","ai"],"completeness":["name","url","isPartOf"]},{"n":9,"label":"BreadcrumbList","kind":"type","group":"Core entities","requirement":"recommended","reads":["human","ai"],"completeness":["itemListElement"]},{"n":10,"label":"Event","kind":"type","group":"Core entities","requirement":"conditional","reads":["human","ai"],"completeness":["startDate","location"],"condition":"the page announces an event"},{"n":11,"label":"Offer","kind":"type","group":"Commerce","requirement":"conditional","reads":["human","ai"],"completeness":["price","priceCurrency","availability"],"condition":"something is sold"},{"n":12,"label":"AggregateRating","kind":"type","group":"Commerce","requirement":"optional","reads":["human","ai"]},{"n":13,"label":"Review","kind":"type","group":"Commerce","requirement":"optional","reads":["human","ai"]},{"n":14,"label":"price","kind":"property","group":"Commerce","requirement":"conditional","reads":["human","ai"],"condition":"an Offer exists","on":["Offer"]},{"n":15,"label":"priceCurrency","kind":"property","group":"Commerce","requirement":"conditional","reads":["human","ai"],"condition":"an Offer exists","on":["Offer"]},{"n":16,"label":"availability","kind":"property","group":"Commerce","requirement":"conditional","reads":["human","ai"],"condition":"an Offer exists","on":["Offer"]},{"n":17,"label":"sku","kind":"property","group":"Commerce","requirement":"optional","reads":["human","ai"],"on":["Product","Offer"]},{"n":18,"label":"brand","kind":"property","group":"Commerce","requirement":"recommended","reads":["human","ai"],"on":["Product","Organization"]},{"n":19,"label":"gtin13","kind":"property","group":"Commerce","requirement":"optional","reads":["human","ai"],"on":["Product"]},{"n":20,"label":"itemCondition","kind":"property","group":"Commerce","requirement":"optional","reads":["human","ai"],"on":["Product","Offer"]},{"n":21,"label":"@context","kind":"property","group":"Identity & graph","requirement":"required","reads":["human","ai"]},{"n":22,"label":"@type","kind":"property","group":"Identity & graph","requirement":"required","reads":["human","ai"]},{"n":23,"label":"@id","kind":"property","group":"Identity & graph","requirement":"required","reads":["ai"]},{"n":24,"label":"name","kind":"property","group":"Identity & graph","requirement":"required","reads":["human","ai"]},{"n":25,"label":"url","kind":"property","group":"Identity & graph","requirement":"required","reads":["human","ai"]},{"n":26,"label":"sameAs","kind":"property","group":"Identity & graph","requirement":"required","reads":["ai"]},{"n":27,"label":"logo","kind":"property","group":"Identity & graph","requirement":"recommended","reads":["human","ai"],"on":["Organization"]},{"n":28,"label":"description","kind":"property","group":"Identity & graph","requirement":"required","reads":["human","ai"]},{"n":29,"label":"image","kind":"property","group":"Identity & graph","requirement":"recommended","reads":["human","ai"]},{"n":30,"label":"mainEntityOfPage","kind":"property","group":"Identity & graph","requirement":"recommended","reads":["ai"]},{"n":31,"label":"PostalAddress","kind":"type","group":"Location & contact","requirement":"recommended","reads":["human","ai"],"completeness":["streetAddress","addressLocality","addressCountry"]},{"n":32,"label":"streetAddress","kind":"property","group":"Location & contact","requirement":"conditional","reads":["human","ai"],"condition":"an address is declared","on":["PostalAddress"]},{"n":33,"label":"addressLocality","kind":"property","group":"Location & contact","requirement":"conditional","reads":["human","ai"],"condition":"an address is declared","on":["PostalAddress"]},{"n":34,"label":"addressCountry","kind":"property","group":"Location & contact","requirement":"conditional","reads":["human","ai"],"condition":"an address is declared","on":["PostalAddress"]},{"n":35,"label":"postalCode","kind":"property","group":"Location & contact","requirement":"optional","reads":["human","ai"],"on":["PostalAddress"]},{"n":36,"label":"geo","kind":"property","group":"Location & contact","requirement":"optional","reads":["human","ai"],"on":["LocalBusiness","Place"]},{"n":37,"label":"telephone","kind":"property","group":"Location & contact","requirement":"recommended","reads":["human","ai"]},{"n":38,"label":"email","kind":"property","group":"Location & contact","requirement":"recommended","reads":["human","ai"]},{"n":39,"label":"openingHoursSpecification","kind":"property","group":"Location & contact","requirement":"conditional","reads":["human","ai"],"condition":"the business has opening hours","on":["LocalBusiness"]},{"n":40,"label":"contactPoint","kind":"property","group":"Location & contact","requirement":"recommended","reads":["human","ai"],"on":["Organization"]},{"n":41,"label":"FAQPage","kind":"type","group":"Rich content","requirement":"recommended","reads":["human","ai"],"completeness":["mainEntity"]},{"n":42,"label":"Question","kind":"type","group":"Rich content","requirement":"conditional","reads":["human","ai"],"condition":"a FAQPage exists"},{"n":43,"label":"Answer","kind":"type","group":"Rich content","requirement":"conditional","reads":["human","ai"],"condition":"a FAQPage exists"},{"n":44,"label":"HowTo","kind":"type","group":"Rich content","requirement":"conditional","reads":["human","ai"],"completeness":["step"],"condition":"the page describes a procedure"},{"n":45,"label":"VideoObject","kind":"type","group":"Rich content","requirement":"conditional","reads":["human","ai"],"condition":"the page carries video"},{"n":46,"label":"SoftwareApplication","kind":"type","group":"Rich content","requirement":"conditional","reads":["human","ai"],"completeness":["applicationCategory"],"condition":"the page describes software"},{"n":47,"label":"JobPosting","kind":"type","group":"Rich content","requirement":"conditional","reads":["human","ai"],"condition":"the page is a job advert"},{"n":48,"label":"Course","kind":"type","group":"Rich content","requirement":"conditional","reads":["human","ai"],"condition":"the page offers a course"},{"n":49,"label":"author","kind":"property","group":"Rich content","requirement":"conditional","reads":["human","ai"],"condition":"the page is editorial"},{"n":50,"label":"publisher","kind":"property","group":"Rich content","requirement":"recommended","reads":["human","ai"]},{"n":51,"label":"ProfessionalService","kind":"type","group":"Services & corporate","requirement":"conditional","reads":["human","ai"],"condition":"the business is a professional service"},{"n":52,"label":"Corporation","kind":"type","group":"Services & corporate","requirement":"recommended","reads":["human","ai"]},{"n":53,"label":"Service","kind":"type","group":"Services & corporate","requirement":"recommended","reads":["human","ai"],"completeness":["name","provider"]},{"n":54,"label":"TechArticle","kind":"type","group":"Services & corporate","requirement":"conditional","reads":["human","ai"],"condition":"the page is technical documentation"},{"n":55,"label":"Dataset","kind":"type","group":"Services & corporate","requirement":"conditional","reads":["ai"],"completeness":["distribution"],"condition":"the page publishes data"},{"n":56,"label":"Recipe","kind":"type","group":"Guides & navigation","requirement":"optional","reads":["human","ai"]},{"n":57,"label":"Step","kind":"type","group":"Guides & navigation","requirement":"conditional","reads":["human","ai"],"condition":"a HowTo exists"},{"n":58,"label":"ListItem","kind":"type","group":"Guides & navigation","requirement":"conditional","reads":["human","ai"],"condition":"a list or breadcrumb exists"},{"n":59,"label":"ItemList","kind":"type","group":"Guides & navigation","requirement":"recommended","reads":["human","ai"]},{"n":60,"label":"SpeakableSpecification","kind":"type","group":"Guides & navigation","requirement":"optional","reads":["ai"]},{"n":61,"label":"legalName","kind":"property","group":"Legal & identifiers","requirement":"required","reads":["human","ai"],"on":["Organization"]},{"n":62,"label":"vatID","kind":"property","group":"Legal & identifiers","requirement":"recommended","reads":["human","ai"],"on":["Organization"]},{"n":63,"label":"taxID","kind":"property","group":"Legal & identifiers","requirement":"optional","reads":["human","ai"],"on":["Organization"]},{"n":64,"label":"duns","kind":"property","group":"Legal & identifiers","requirement":"optional","reads":["human","ai"],"on":["Organization"]},{"n":65,"label":"naics","kind":"property","group":"Legal & identifiers","requirement":"optional","reads":["human","ai"],"on":["Organization"]},{"n":66,"label":"founder","kind":"property","group":"Semantic validation","requirement":"recommended","reads":["human","ai"],"on":["Organization"]},{"n":67,"label":"foundingDate","kind":"property","group":"Semantic validation","requirement":"recommended","reads":["human","ai"],"on":["Organization"]},{"n":68,"label":"knowsAbout","kind":"property","group":"Semantic validation","requirement":"recommended","reads":["ai"],"on":["Organization","Person"]},{"n":69,"label":"alumniOf","kind":"property","group":"Semantic validation","requirement":"optional","reads":["human","ai"],"on":["Person"]},{"n":70,"label":"parentOrganization","kind":"property","group":"Semantic validation","requirement":"optional","reads":["human","ai"],"on":["Organization"]},{"n":71,"label":"AudioObject","kind":"type","group":"Media","requirement":"optional","reads":["human","ai"]},{"n":72,"label":"ImageObject","kind":"type","group":"Media","requirement":"recommended","reads":["human","ai"]},{"n":73,"label":"thumbnailUrl","kind":"property","group":"Media","requirement":"optional","reads":["human","ai"]},{"n":74,"label":"aggregateRating","kind":"property","group":"Media","requirement":"optional","reads":["human","ai"],"on":["Service","Product","Organization"]},{"n":75,"label":"hasOfferCatalog","kind":"property","group":"Media","requirement":"recommended","reads":["human","ai"],"on":["Organization","Service"]},{"n":76,"label":"MerchantReturnPolicy","kind":"type","group":"Commerce policies","requirement":"conditional","reads":["human","ai"],"condition":"goods are sold"},{"n":77,"label":"OfferShippingDetails","kind":"type","group":"Commerce policies","requirement":"conditional","reads":["human","ai"],"condition":"physical goods are shipped"},{"n":78,"label":"shippingRate","kind":"property","group":"Commerce policies","requirement":"optional","reads":["human","ai"]},{"n":79,"label":"deliveryTime","kind":"property","group":"Commerce policies","requirement":"optional","reads":["human","ai"]},{"n":80,"label":"returnPolicyCategory","kind":"property","group":"Commerce policies","requirement":"optional","reads":["human","ai"]},{"n":81,"label":"priceValidUntil","kind":"property","group":"Commerce policies","requirement":"optional","reads":["human","ai"],"on":["Offer"]},{"n":82,"label":"itemOffered","kind":"property","group":"Commerce policies","requirement":"conditional","reads":["human","ai"],"condition":"an Offer exists","on":["Offer"]},{"n":83,"label":"copyrightHolder","kind":"property","group":"Attribution & licensing","requirement":"recommended","reads":["ai"]},{"n":84,"label":"copyrightYear","kind":"property","group":"Attribution & licensing","requirement":"optional","reads":["ai"]},{"n":85,"label":"license","kind":"property","group":"Attribution & licensing","requirement":"recommended","reads":["ai"]},{"n":86,"label":"creditText","kind":"property","group":"Attribution & licensing","requirement":"optional","reads":["ai"]},{"n":87,"label":"acquireLicensePage","kind":"property","group":"Attribution & licensing","requirement":"optional","reads":["ai"]},{"n":88,"label":"reviewedBy","kind":"property","group":"Trust & E-E-A-T","requirement":"recommended","reads":["human","ai"]},{"n":89,"label":"citation","kind":"property","group":"Trust & E-E-A-T","requirement":"recommended","reads":["ai"]},{"n":90,"label":"correction","kind":"property","group":"Trust & E-E-A-T","requirement":"optional","reads":["ai"]},{"n":91,"label":"fundedBy","kind":"property","group":"Trust & E-E-A-T","requirement":"optional","reads":["human","ai"]},{"n":92,"label":"publishingPrinciples","kind":"property","group":"Trust & E-E-A-T","requirement":"recommended","reads":["ai"]},{"n":93,"label":"ownershipFundingInfo","kind":"property","group":"B2B & institutional","requirement":"optional","reads":["human","ai"],"on":["Organization"]},{"n":94,"label":"memberOf","kind":"property","group":"B2B & institutional","requirement":"optional","reads":["human","ai"],"on":["Organization","Person"]},{"n":95,"label":"areaServed","kind":"property","group":"B2B & institutional","requirement":"recommended","reads":["human","ai"],"on":["Organization","Service"]},{"n":96,"label":"seeks","kind":"property","group":"B2B & institutional","requirement":"optional","reads":["human","ai"],"on":["Organization"]},{"n":97,"label":"DataDownload","kind":"type","group":"Applications & APIs","requirement":"optional","reads":["ai"]},{"n":98,"label":"operatingSystem","kind":"property","group":"Applications & APIs","requirement":"conditional","reads":["human","ai"],"condition":"software is described","on":["SoftwareApplication"]},{"n":99,"label":"applicationCategory","kind":"property","group":"Applications & APIs","requirement":"conditional","reads":["human","ai"],"condition":"software is described","on":["SoftwareApplication"]},{"n":100,"label":"entryPoint","kind":"property","group":"Applications & APIs","requirement":"recommended","reads":["ai"]}];

/* Conditiile, evaluate din graful real. Fiecare intoarce true daca elementul
   devine relevant pentru site-ul asta. */
function schema100Conditions(nodes) {
  nodes = nodes || [];
  const types = new Set();
  const props = new Set();
  for (const o of nodes) {
    const t = Array.isArray(o['@type']) ? o['@type'] : (o['@type'] ? [o['@type']] : []);
    t.forEach(x => types.add(String(x)));
    Object.keys(o).forEach(k => props.add(k));
  }
  const has = (...t) => t.some(x => schema100TypeSatisfied(x, types));
  return {
    types, props,
    /* Nu testam prin LocalBusiness — ar fi circular: elementul cerut ar fi
       propria lui conditie.
       Si nu testam prin adresa: orice firma din UE isi publica sediul social,
       pentru ca legea o cere. Un sediu nu e un magazin. Semnul unui loc unde
       vin clienti e programul de functionare sau coordonatele — lucruri pe
       care un serviciu pur online nu are motiv sa le declare.
       Cand nu putem sti din exterior, marcam gri, nu rosu. Un fals rosu
       trimite clientul sa repare ceva ce nu e stricat. */
    'the business has a physical location':
      nodes.some(o => o.openingHoursSpecification) || props.has('geo') || props.has('openingHours'),
    'the page sells a product': has('Product'),
    'the page is editorial': has('Article','NewsArticle','BlogPosting','TechArticle'),
    'the page is a blog post': has('BlogPosting'),
    'the page announces an event': has('Event'),
    'something is sold': has('Offer','Product','Service','OfferCatalog'),
    'an Offer exists': has('Offer'),
    'an address is declared': has('PostalAddress') || props.has('address'),
    'the business has opening hours': nodes.some(o => o.openingHoursSpecification) || props.has('openingHours'),
    'a FAQPage exists': has('FAQPage'),
    'the page describes a procedure': has('HowTo'),
    'the page carries video': has('VideoObject'),
    'the page describes software': has('SoftwareApplication','WebApplication'),
    'the page is a job advert': has('JobPosting'),
    'the page offers a course': has('Course'),
    'the business is a professional service': has('ProfessionalService'),
    'the page is technical documentation': has('TechArticle','APIReference'),
    'the page publishes data': has('Dataset','DataCatalog'),
    'a HowTo exists': has('HowTo'),
    'a list or breadcrumb exists': has('ItemList','BreadcrumbList','OfferCatalog'),
    'goods are sold': has('Product'),
    'physical goods are shipped': has('Product'),
    'software is described': has('SoftwareApplication','WebApplication')
  };
}

/* Un subtip satisface tipul parinte: daca pagina declara TechArticle, ea
   ARE markup de articol. Fara regula asta, checkerul cerea Article pe o
   pagina care il avea deja, sub alt nume — exact genul de fals pozitiv care
   trimite clientul sa repare ceva ce nu e stricat. */
const SCHEMA100_SUBTYPES = {
  Article: ['NewsArticle','BlogPosting','TechArticle','APIReference','Report','ScholarlyArticle'],
  Organization: ['Corporation','OnlineBusiness','LocalBusiness','ProfessionalService','NGO','EducationalOrganization'],
  WebPage: ['CollectionPage','ContactPage','AboutPage','ProfilePage','FAQPage','ItemPage','SearchResultsPage'],
  CreativeWork: ['WebPage','Article','Dataset','SoftwareApplication','DigitalDocument','HowTo','WebSite'],
  ItemList: ['BreadcrumbList','OfferCatalog'],
  LocalBusiness: ['Store','Restaurant','ProfessionalService'],
  SoftwareApplication: ['WebApplication','MobileApplication'],
  Step: ['HowToStep','HowToSection'],
  Person: [],
  ImageObject: [],
};

function schema100TypeSatisfied(label, declaredTypes) {
  if (declaredTypes.has(label)) return true;
  const subs = SCHEMA100_SUBTYPES[label];
  return subs ? subs.some(x => declaredTypes.has(x)) : false;
}

function checkSchema100(nodes, rawBlocks) {
  nodes = nodes || [];
  const ctx = schema100Conditions(nodes);
  const results = [];

  /* Pentru un tip: prezent daca vreun nod il declara. Pentru o proprietate:
     prezenta daca vreun nod o poarta — restransa la tipurile din `on`, daca
     e declarat, ca sa nu numaram un `name` de pe alt obiect drept dovada ca
     Organization are nume. */
  for (const e of SCHEMA100) {
    let present = false, incomplete = null, carriers = [];

    /* @context traieste pe blocul JSON-LD, nu pe noduri. Cautat printre
       noduri, ar fi mereu raportat lipsa — pe orice site din lume. */
    if (e.label === '@context') {
      const ok = (rawBlocks || []).some(b => b && b['@context']);
      results.push({ ...e, mark: ok ? 'green' : 'red',
        reason: ok ? 'declared on the JSON-LD block'
                   : 'no JSON-LD block declares @context, so nothing here is linked data' });
      continue;
    }
    if (e.label === '@type') {
      const ok = nodes.length > 0;
      results.push({ ...e, mark: ok ? 'green' : 'red',
        reason: ok ? `${nodes.length} typed objects` : 'no typed object found' });
      continue;
    }
    if (e.label === '@id') {
      const withId = nodes.filter(o => o['@id']);
      results.push({ ...e, mark: withId.length ? 'green' : 'yellow',
        reason: withId.length ? `${withId.length} of ${nodes.length} objects carry an @id`
                              : 'no object carries an @id, so nothing can reference anything else' });
      continue;
    }

    if (e.kind === 'type') {
      const accepted = new Set([e.label, ...(SCHEMA100_SUBTYPES[e.label] || [])]);
      carriers = nodes.filter(o => {
        const t = Array.isArray(o['@type']) ? o['@type'] : [o['@type']];
        return t.map(String).some(x => accepted.has(x));
      });
      present = carriers.length > 0;
      if (present && e.completeness) {
        const missing = e.completeness.filter(p => !carriers.some(o => o[p] !== undefined && o[p] !== null && o[p] !== ''));
        if (missing.length) incomplete = 'missing ' + missing.join(', ');
      }
    } else {
      const scope = e.on
        ? nodes.filter(o => {
            const t = Array.isArray(o['@type']) ? o['@type'] : [o['@type']];
            return t.map(String).some(x => e.on.includes(x));
          })
        : nodes;
      carriers = scope.filter(o => o[e.label] !== undefined && o[e.label] !== null && o[e.label] !== '');
      present = carriers.length > 0;
      if (!present && e.on && scope.length === 0) {
        /* Tipul care ar purta proprietatea nu exista deloc pe site. Nu e
           absenta proprietatii, e absenta contextului ei. */
        results.push({ ...e, mark: 'grey', reason: `no ${e.on.join(' or ')} declared on this site` });
        continue;
      }
    }

    if (e.requirement === 'conditional') {
      const met = e.condition ? ctx[e.condition] : true;
      if (!met) { results.push({ ...e, mark: 'grey', reason: `not applicable — ${e.condition}` }); continue; }
    }

    let mark, reason;
    if (present && incomplete)      { mark = 'yellow'; reason = 'present but ' + incomplete; }
    else if (present)                { mark = 'green';  reason = 'present' + (carriers.length > 1 ? ` on ${carriers.length} objects` : ''); }
    else if (e.requirement === 'required')    { mark = 'red';    reason = 'required on every site and missing'; }
    else if (e.requirement === 'conditional') { mark = 'red';    reason = 'its condition is met on this site, but it is missing'; }
    else if (e.requirement === 'recommended') { mark = 'yellow'; reason = 'recommended and missing'; }
    else                                       { mark = 'grey';   reason = 'optional, not present'; }

    results.push({ ...e, mark, reason });
  }

  const tally = { green: 0, yellow: 0, red: 0, grey: 0 };
  results.forEach(r => tally[r.mark]++);
  const graded = tally.green + tally.yellow + tally.red;
  return {
    total: results.length,
    ...tally,
    graded,
    score: graded ? Math.round(((tally.green + tally.yellow * 0.5) / graded) * 100) : null,
    status: tally.red ? 'error' : tally.yellow ? 'warning' : tally.green ? 'valid' : 'none',
    elements: results
  };
}

function evaluate(ev, psi) {
  const scores = {};
  const signals = {};
  let totalTested = 0, totalNa = 0;

  /* Scorul foloseste PONDERILE semnalelor (sig.w), nu media simpla.
     Inainte, `HTTPS Availability` (w=10) cantarea exact cat
     `Private Behavioral Analytics` (w=2) — ceea ce face scorul sa nu reflecte
     importanta reala a defectelor. Ponderile erau stocate si folosite doar la
     sortarea planului de actiuni, niciodata la calcul.
     Semnalele NA sunt excluse complet, deci nu penalizeaza si nu dilueaza. */
  const dimWeights = {};
  const dimensions = {};
  for (const dim of Object.keys(SIG)) {
    signals[dim] = [];
    let weightedSum = 0, weightTotal = 0, count = 0;
    for (const sig of SIG[dim]) {
      const r = normalizeVerdict(evalSignal(sig, ev, psi));
      signals[dim].push({ id: sig.id, n: sig.n, c: sig.c, w: sig.w, status: r.status, score: r.score ?? null, method: r.method });
      if (r.status !== 'na') {
        const w = typeof sig.w === 'number' && sig.w > 0 ? sig.w : 1;
        weightedSum += r.score * w;
        weightTotal += w;
        count++; totalTested++;
      } else { totalNa++; }
    }
    scores[dim] = weightTotal ? Math.round(weightedSum / weightTotal) : null;
    dimWeights[dim] = weightTotal;   // cat "cantareste" dimensiunea, pentru scorul global

    /* Coverage si confidence pe dimensiune. Coverage exista deja pe categorii,
       dar nu pe dimensiuni — asa incat "Off-Page 84/100" se putea citi drept
       autoritate externa verificata, cand de fapt inseamna 84/100 din portiunea
       care s-a putut testa. Scorul pleaca de acum insotit de cat acopera. */
    const dimTotal = SIG[dim].length;
    const dimCoverage = dimTotal ? count / dimTotal : 0;
    dimensions[dim] = {
      score: scores[dim],
      tested: count,
      na: dimTotal - count,
      total: dimTotal,
      coverage: Math.round(dimCoverage * 1000) / 10,
      confidence: dimCoverage >= 0.8 ? 'high' : dimCoverage >= 0.5 ? 'medium' : 'low',
      label: scores[dim] === null
        ? `nescorat · 0% acoperire · confidence low`
        : `${scores[dim]}/100 · ${Math.round(dimCoverage * 100)}% acoperire · confidence ${dimCoverage >= 0.8 ? 'high' : dimCoverage >= 0.5 ? 'medium' : 'low'}`
    };
  }

  /* Scoruri pe CATEGORIE (ON-PAGE / ON-SITE / OFF-PAGE / OFF-SITE).
     Datele existau deja in registru (campul `c` al fiecarui semnal) dar nu
     erau agregate nicaieri — deci nu se putea spune clientului "problema ta e
     off-page (reputatie externa), nu on-page (ce repari singur pe site)".
     Aceeasi formula ponderata ca la dimensiuni. */
  const catAgg = {};
  for (const dim of Object.keys(SIG)) {
    for (let i = 0; i < SIG[dim].length; i++) {
      const sig = SIG[dim][i];
      const r = signals[dim][i];
      const cat = sig.c || 'UNCLASSIFIED';
      if (!catAgg[cat]) catAgg[cat] = { weightedSum: 0, weightTotal: 0, tested: 0, na: 0, total: 0,
                                        pass: 0, partial: 0, fail: 0 };
      const a = catAgg[cat];
      a.total++;
      if (r.status === 'na') { a.na++; continue; }
      const w = typeof sig.w === 'number' && sig.w > 0 ? sig.w : 1;
      a.weightedSum += r.score * w;
      a.weightTotal += w;
      a.tested++;
      if (r.status === 'pass') a.pass++;
      else if (r.status === 'partial') a.partial++;
      else if (r.status === 'fail') a.fail++;
    }
  }
  const categories = {};
  for (const [cat, a] of Object.entries(catAgg)) {
    categories[cat] = {
      score: a.weightTotal ? Math.round(a.weightedSum / a.weightTotal) : null,
      tested: a.tested, na: a.na, total: a.total,
      pass: a.pass, partial: a.partial, fail: a.fail,
      coverage: a.total ? Math.round((a.tested / a.total) * 1000) / 10 : 0,
    };
  }

  /* Global: media dimensiunilor ponderata cu greutatea totala testata in
     fiecare — o dimensiune in care s-au putut testa multe semnale grele
     conteaza mai mult decat una cu doua semnale usoare. */
  let gSum = 0, gWeight = 0;
  for (const dim of Object.keys(scores)) {
    if (scores[dim] === null) continue;
    gSum += scores[dim] * dimWeights[dim];
    gWeight += dimWeights[dim];
  }
  const global = gWeight ? Math.round(gSum / gWeight) : 0;

  const globalCoverage = (totalTested + totalNa) ? totalTested / (totalTested + totalNa) : 0;

  /* Verdict separat, in afara celor 167. Nu intra in scorul global si nu e
     o dimensiune: e starea stratului structurat al site-ului auditat. */
  const schema = validateSchemaGraph(ev.ldNodes, ev.ldInvalidBlocks);
  /* Cele 100 de elemente, verificate pe graful site-ului auditat. Separat de
     validarea structurala de mai sus: aia intreaba "e corect ce ai declarat",
     asta intreaba "ai declarat ce conteaza". */
  schema.checklist = checkSchema100(ev.ldNodes, ev.ldBlocks);

  return { scores, dimensions, categories, signals, schema, global, tested: totalTested, na: totalNa,
           totalSignals: totalTested + totalNa,
           confidence: globalCoverage >= 0.8 ? 'high' : globalCoverage >= 0.5 ? 'medium' : 'low',
           scoringMethod: 'weighted-by-signal-weight',
           scoringFormula: 'media dimensiunilor, ponderata cu greutatea semnalelor testate in fiecare; semnalele na sunt excluse, nu punctate cu zero; statusul fiecarui semnal se deriva din scorul lui' };
}

function buildActionPlan(report) {
  const allFails = [];
  for (const dim of Object.keys(report.signals)) {
    report.signals[dim].filter(s => s.status === 'fail').forEach(s => allFails.push({ dim, ...s }));
  }
  allFails.sort((a, b) => b.w - a.w);
  const top = allFails.slice(0, 9);
  const chunk = (arr, n) => arr.slice(n * 3, n * 3 + 3);
  return {
    critical: { title: 'Fix first', items: chunk(top, 0).map(s => s.n), impact: 'The heaviest failures found, by signal weight', delta: 'points within days' },
    important: { title: 'Then', items: chunk(top, 1).map(s => s.n), impact: 'Medium-weight failures', delta: 'points within 30 days' },
    optimize: { title: 'Refine', items: chunk(top, 2).map(s => s.n), impact: 'Fine adjustments', delta: 'points within 90 days' },
  };
}

const CLAIM_MAP = [
  {
    id: 'crawler_access',
    ids: ['ai1', 'ai2', 'ai3', 'ai4', 'ai5', 'geo3', 'aio8'],
    all:  'AI crawler access is declared for every major provider',
    some: 'AI crawler access is declared for some providers but not all',
    none: 'no AI crawler access policy is declared, so AI systems have no explicit permission to read this site',
  },
  {
    id: 'declaration_files',
    ids: ['geo1', 'geo2', 'geo8', 'geo9', 'geo10', 'geo11', 'ai10', 'ai17'],
    all:  'machine-readable declaration files are published and parseable',
    some: 'some machine-readable declaration files are published, others are absent',
    none: 'no machine-readable declaration files are published',
  },
  {
    id: 'entity_anchoring',
    ids: ['geo4', 'geo5', 'geo6', 'geo16', 'ai9', 'ai13'],
    all:  'the entity is anchored in structured data with external references',
    some: 'entity anchoring is present but incomplete',
    none: 'the entity is not anchored in structured data, so AI systems cannot resolve who this organisation is',
  },
  {
    id: 'agent_layer',
    ids: ['ai19', 'ai20', 'ai21', 'ai22', 'ai23', 'ai24'],
    all:  'an agent interface is discoverable, valid and reachable',
    some: 'an agent interface is declared but incomplete or unreachable',
    none: 'no agent interface is exposed, so autonomous agents cannot transact with this business',
  },
  {
    id: 'proof_layer',
    ids: ['ai6', 'ai7', 'ai29', 'ai32', 'geo25'],
    all:  'claims are traceable to cryptographic evidence',
    some: 'a proof layer exists but does not cover all claims',
    none: 'no proof layer is published, so claims cannot be independently verified',
  },
  {
    id: 'answer_structure',
    ids: ['aeo1', 'aeo3', 'aeo4', 'aeo11', 'aeo14', 'aeo19'],
    all:  'content is structured for direct answer extraction',
    some: 'content is partially structured for answer extraction',
    none: 'content is not structured for answer extraction',
  },
];

function flattenSignals(report) {
  const out = new Map();
  for (const dim of Object.keys(report.signals || {})) {
    for (const s of report.signals[dim]) out.set(s.id, s);
  }
  return out;
}

function evaluateClaims(report) {
  const byId = flattenSignals(report);
  const claims = [];
  for (const c of CLAIM_MAP) {
    const covering = c.ids.map(i => byId.get(i)).filter(Boolean);
    const scored = covering.filter(s => s.status !== 'na');
    if (!scored.length) continue;                       // nemasurabil -> tacere
    const pass = scored.filter(s => s.status === 'pass').length;
    const fail = scored.filter(s => s.status === 'fail').length;
    if (fail === scored.length)      claims.push({ id: c.id, tone: 'none', text: c.none, ids: c.ids });
    else if (pass === scored.length) claims.push({ id: c.id, tone: 'all',  text: c.all,  ids: c.ids });
    else                             claims.push({ id: c.id, tone: 'some', text: c.some, ids: c.ids });
  }
  return claims;
}

function joinClauses(items) {
  if (items.length === 1) return items[0];
  if (items.length === 2) return items[0] + ' and ' + items[1];
  return items.slice(0, -1).join('; ') + '; and ' + items[items.length - 1];
}

function gradeOf(score) {
  if (score >= 85) return { letter: 'A', label: 'STRONG' };
  if (score >= 70) return { letter: 'B', label: 'ADEQUATE' };
  if (score >= 55) return { letter: 'C', label: 'PARTIAL' };
  if (score >= 35) return { letter: 'D', label: 'WEAK' };
  return { letter: 'E', label: 'ABSENT' };
}

// Verificare finala: verdictul nu are voie sa nege ceva ce a dat PASS.
function assertConsistent(report, claims) {
  const byId = flattenSignals(report);
  for (const c of claims) {
    if (c.tone !== 'none') continue;
    const passing = c.ids.map(i => byId.get(i)).filter(s => s && s.status === 'pass');
    if (passing.length) {
      throw new Error('VERDICT INCONSISTENT [' + c.id + ']: ' +
        passing.map(s => s.n).join(', ') + ' au status pass');
    }
  }
}

function buildSynthesis(report) {
  const claims = evaluateClaims(report);
  assertConsistent(report, claims);

  const g = gradeOf(report.global);
  const strong  = claims.filter(c => c.tone === 'all');
  const partial = claims.filter(c => c.tone === 'some');
  const absent  = claims.filter(c => c.tone === 'none');

  const out = [];
  out.push(`${report.url} scores ${report.global}/100 (${g.letter} — ${g.label}) across ${report.tested} tested signals.`);

  if (strong.length)  out.push(`In place: ${joinClauses(strong.map(c => c.text))}.`);
  if (absent.length)  out.push(`Missing: ${joinClauses(absent.map(c => c.text))}.`);
  if (partial.length) out.push(`Partial: ${joinClauses(partial.map(c => c.text))}.`);
  if (!absent.length && !partial.length && strong.length) {
    out.push('No structural gaps were found among the signals this scan can test.');
  }

  if (report.na) {
    out.push(`${report.na} signals have no public test and are reported as N/A. They are excluded from the score and are not failures.`);
  }
  out.push('This scan reads delivered HTML, response headers, robots.txt, declared sitemaps and published signal files. It does not measure whether any AI system currently cites this brand.');

  return out.join(' ');
}

// Semnatura pastrata (async, doi parametri) ca sa nu schimbi apelantul.
// env nu mai e folosit — nu mai exista apel extern.
async function fetchSynthesis(report, env) {
  try {
    if (!report || !report.signals) return null;
    return buildSynthesis(report);
  } catch (e) {
    // Inconsistenta = bug real. Mai bine niciun verdict decat unul fals.
    console.error('synthesis blocked:', e.message);
    return null;
  }
}


/* ---------- executie reala pentru obs.permanent, apelata din scheduled() ----------
   Reobserva fiecare abonament ajuns la scadenta, salveaza scorul nou, si
   notifica DOAR daca notify e un URL de callback (email necesita un provider
   de email legat separat — pana atunci abonamentele cu notify=email raman
   inregistrate si rulate, dar notificarea e marcata notify_pending_provider). */
async function runScheduledObservations(env) {
  /* Returneaza un rezumat, ca apelantul (cron-tick) sa poata raporta ce s-a
     intamplat. Fara asta nu ai cum sa stii daca ceasul chiar a lucrat. */
  const summary = { subscriptions: 0, due: 0, observed: 0, notified: 0, unreachable: 0, errors: 0 };
  if (!env.RATE_KV) return { ...summary, skipped: 'no storage configured' };
  const list = await env.RATE_KV.list({ prefix: 'sub:' });
  summary.subscriptions = list.keys.length;
  const now = Date.now();
  const intervalMs = { daily: 86400000, weekly: 7 * 86400000, monthly: 30 * 86400000 };
  for (const k of list.keys) {
    let sub;
    try { sub = JSON.parse(await env.RATE_KV.get(k.name)); } catch { continue; }
    if (!sub || sub.status === 'cancelled') continue;
    const last = sub.lastRunAt ? new Date(sub.lastRunAt).getTime() : 0;
    if ((now - last) < (intervalMs[sub.interval] || intervalMs.weekly)) continue;
    summary.due++;
    const target = normalizeUrl(sub.url);
    if (!target) continue;
    try {
      const ev = await gatherEvidence(target);
      if (!ev.mainOk) { sub.lastRunAt = new Date().toISOString(); sub.status = 'target_unreachable';
        summary.unreachable++;
        await env.RATE_KV.put(k.name, JSON.stringify(sub)); continue; }
      const psi = await fetchPageSpeed(target.href, env).catch(() => null);
      const evalResult = evaluate(ev, psi);
      const newScore = evalResult.global;
      const prevScore = typeof sub.lastScore === 'number' ? sub.lastScore : null;
      const delta = prevScore === null ? null : Math.round((newScore - prevScore) * 10) / 10;
      const changed = prevScore === null || Math.abs(delta) >= (sub.threshold ?? 3);
      sub.lastRunAt = new Date().toISOString();
      sub.lastScore = newScore;
      sub.status = 'active';
      await env.RATE_KV.put(k.name, JSON.stringify(sub));
      summary.observed++;
      if (changed && sub.notify) {
        if (/^https?:\/\//i.test(sub.notify)) {
          try {
            await fetch(sub.notify, { method: 'POST', headers: { 'content-type': 'application/json' },
              body: JSON.stringify({ subscriptionId: sub.id, url: sub.url, previousScore: prevScore,
                newScore, delta, observedAt: sub.lastRunAt }) });
            summary.notified++;
          } catch { summary.errors++; }
        }
        /* notify e email — retinut, dar trimiterea efectiva asteapta un provider de email legat la Worker */
      }
    } catch {}
  }
  return summary;
}

export default {
  async scheduled(event, env, ctx) {
    ctx.waitUntil(runScheduledObservations(env));
  },
  async fetch(request, env, ctx) {
    /* Error boundary. Fara ea, orice exceptie nerezolvata iese ca pagina HTML
       Cloudflare "error 1101", care unui client API sau unui agent nu ii spune
       nimic si nu se poate parsa. Cu ea, primeste JSON, un status corect si un
       requestId care apare si in loguri, deci un incident raportat se poate
       cauta. Serveste si un Retry-After: un 503 fara el invita clientul sa
       reincerce imediat, ceea ce amplifica exact incidentul care l-a produs. */
    const requestId = crypto.randomUUID().slice(0, 8);
    try {
      return await handleRequest(request, env, ctx, requestId);
    } catch (e) {
      console.error(`[${requestId}] unhandled:`, e && (e.stack || e.message || String(e)));
      return new Response(JSON.stringify({
        error: 'engine_error',
        detail: 'The request could not be completed. This is a fault on our side, not in the audited site.',
        requestId,
        retryAfterSeconds: 15
      }), { status: 503, headers: { 'content-type': 'application/json', 'retry-after': '15', ...CORS } });
    }
  }
};


/* ---------- trimiterea raportului prin Resend ----------
   Cheia sta in env.RESEND_API_KEY. Daca lipseste, endpointul NU esueaza:
   salveaza cererea cu delivered:false si spune omului ca nu a plecat nimic.
   Alternativa — un "trimis!" cand nu s-a trimis — e exact genul de afirmatie
   pe care produsul asta o vaneaza la altii.

   Continutul e text simplu plus HTML minimal. Un raport de audit trimis ca
   email cu layout complicat ajunge in spam mai des si arata prost in jumatate
   din clienti; aici conteaza sa ajunga si sa fie citibil. */

const MAIL_FROM = '3webs <contact@5thelement.ai>';

function leadEmailBody(rec, report) {
  const site = rec.url || 'your site';
  const score = rec.score != null ? rec.score : null;
  const link = rec.reportUrl || 'https://3webobs.com/';

  /* Cele mai grele semnale picate — motivul pentru care omul a cerut raportul.
     Fara ele, emailul e un link gol si nu merita deschis. */
  let worst = [];
  if (report && report.signals) {
    for (const dim of Object.keys(report.signals)) {
      for (const sg of report.signals[dim]) {
        if (sg.status === 'fail' || sg.status === 'partial') worst.push({ ...sg, dim });
      }
    }
    worst.sort((a, b) => (b.w || 0) - (a.w || 0));
    worst = worst.slice(0, 5);
  }

  const esc = (x) => String(x == null ? '' : x)
    .replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  const wantsPlan = rec.wants.includes('action_plan');

  const textLines = [
    `AI visibility report — ${site}`,
    score != null ? `Score: ${score}/100 across 167 signals` : '',
    '',
    `Full report: ${link}`,
    '',
    worst.length ? 'Highest-weight signals to fix:' : '',
    ...worst.map(w => `  - ${w.n} (${w.dim}) — ${w.method || ''}`),
    '',
    'Every signal in the report carries its own evidence, and each dimension states how much of it could be observed from outside. Signals that could not be tested are marked not applicable, never counted as failures.',
    '',
    wantsPlan ? 'You asked about the action plan. Reply to this message with your domain and we will come back with scope and a price.' : '',
    '',
    'An audit does not guarantee citation or ranking.',
    'AIVENTURE S.R.L. · Bucharest, Romania · CUI 51415878',
    'https://3webobs.com'
  ].filter(l => l !== '');

  const html = `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:15px;line-height:1.6;color:#111;max-width:560px">
<p style="margin:0 0 4px;font-size:13px;color:#666">AI visibility report</p>
<p style="margin:0 0 18px;font-size:20px;font-weight:600">${esc(site)}</p>
${score != null ? `<p style="margin:0 0 18px;font-size:38px;font-weight:700;line-height:1">${score}<span style="font-size:16px;font-weight:400;color:#666">/100 across 167 signals</span></p>` : ''}
<p style="margin:0 0 22px"><a href="${esc(link)}" style="display:inline-block;padding:11px 22px;background:#111;color:#fff;text-decoration:none;border-radius:100px;font-weight:600;font-size:14px">Open the full report</a></p>
${worst.length ? `<p style="margin:0 0 8px;font-weight:600;font-size:14px">Highest-weight signals to fix</p>
<ul style="margin:0 0 20px;padding-left:18px">${worst.map(w => `<li style="margin-bottom:7px"><strong>${esc(w.n)}</strong> <span style="color:#666">(${esc(w.dim)})</span><br><span style="color:#666;font-size:13px">${esc(w.method || '')}</span></li>`).join('')}</ul>` : ''}
<p style="margin:0 0 18px;color:#444;font-size:13.5px">Every signal carries its own evidence, and each dimension states how much of it could be observed from outside. Signals that could not be tested are marked not applicable &mdash; never counted as failures.</p>
${wantsPlan ? `<p style="margin:0 0 18px;padding:13px 15px;background:#f5f5f7;border-radius:10px;font-size:13.5px">You asked about the <strong>action plan</strong>. Reply to this message with your domain and we will come back with scope and a price.</p>` : ''}
<hr style="border:none;border-top:1px solid #e5e5e5;margin:22px 0 14px">
<p style="margin:0;color:#888;font-size:11.5px">An audit does not guarantee citation or ranking.<br>
AIVENTURE S.R.L. &middot; Bucharest, Romania &middot; CUI 51415878 &middot; <a href="https://3webobs.com" style="color:#888">3webobs.com</a></p>
</div>`;

  return {
    subject: `AI visibility report — ${site}${score != null ? ` (${score}/100)` : ''}`,
    text: textLines.join('\n'),
    html
  };
}

async function sendLeadEmail(env, rec, report) {
  if (!env.RESEND_API_KEY) {
    return { sent: false, reason: 'RESEND_API_KEY is not configured on this Worker' };
  }
  const body = leadEmailBody(rec, report);
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${env.RESEND_API_KEY}`,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        from: MAIL_FROM,
        to: [rec.email],
        reply_to: 'contact@5thelement.ai',
        subject: body.subject,
        text: body.text,
        html: body.html
      })
    });
    const payload = await r.text();      // corpul se citeste mereu
    if (!r.ok) {
      console.error('resend failed', r.status, payload.slice(0, 400));
      return { sent: false, reason: `provider returned ${r.status}` };
    }
    let id = null;
    try { id = JSON.parse(payload).id || null; } catch {}
    return { sent: true, id };
  } catch (e) {
    console.error('resend error', e.message);
    return { sent: false, reason: e.message };
  }
}


/* ═══════════ SESIUNI — ancorare in timp ═══════════

   Un numar de sesiune e o eticheta de patru cifre plus o litera, care spune
   in ce perioada de lucru a fost creat, modificat sau anulat un lucru.
   Fara ea, singurul mod de a compara starea de azi cu cea de acum doua zile
   e sa fi retinut un observationId — adica sa fi stiut dinainte ca vei avea
   nevoie de el.

     0042C   linia principala. C = current. Se incrementeaza la fiecare
             sesiune noua de exploatare. C si spatiu inseamna acelasi lucru:
             "0042 " si "0042C" sunt aceeasi sesiune, dar la scriere se
             normalizeaza mereu la C, ca sa nu existe doua chei pentru
             acelasi lucru.

     0042H   fotografie inghetata, facuta cand ceva trece dintr-un mediu in
             altul. Nu se mai schimba niciodata — asta e tot rostul ei.
             Optionala: cine nu are separare de medii nu o foloseste deloc.

     0042T   singura copie cu drept de scriere, derivata dintr-un H anume.
             Corecturi peste referinta inghetata, fara sa o atinga. Una
             singura deschisa la un moment dat, in tot sistemul.

   Unde traieste numarul. In KV, nu intr-un fisier din repo. Un fisier ar
   fi o a doua sursa care se contrazice cu runtime-ul in ziua in care cineva
   uita sa il regenereze — exact problema pe care pricing.json si
   signals.json o rezolva prin a fi singura sursa. Aici sursa e KV, iar
   /session o publica.

   Relatia cu observationId: sesiunea NU inlocuieste observationId. Il
   grupeaza. O sesiune contine una sau mai multe observatii; observatia
   ramane identificatorul unei rulari, sesiunea spune cand a fost facuta si
   in ce context. */

const SESSION_KEY   = 'session:current';
const SESSION_LOG   = 'session:log';
const SESSION_RE    = /^(\d{4})\s*([CHT ]?)$/i;

function normalizeSession(raw) {
  if (raw === null || raw === undefined) return null;
  const m = String(raw).trim().match(SESSION_RE);
  if (!m) return null;
  const kind = (m[2] || 'C').trim().toUpperCase() || 'C';
  return m[1] + kind;
}

function sessionParts(id) {
  const m = String(id || '').match(/^(\d{4})([CHT])$/);
  return m ? { n: Number(m[1]), kind: m[2], id } : null;
}

/* Sesiunea curenta. Daca nu exista niciuna — prima rulare dupa deploy —
   o cream la 0001C in loc sa esuam: un sistem de ancorare care refuza sa
   porneasca pana il initializeaza cineva manual nu ancoreaza nimic. */
/* Cache pe durata invocarii. Sesiunea curenta se schimba de cateva ori pe
   luna, dar era citita din KV la fiecare stampila — iar un audit stampileaza
   de mai multe ori. O citire KV e ieftina, dar nu gratuita, si nu are rost
   repetata pentru o valoare care nu se poate schimba in timpul unei cereri. */
let sessionCache = null;

async function getSession(env) {
  if (sessionCache) return sessionCache;
  if (!env.RATE_KV) return { id: '0001C', n: 1, kind: 'C', openedAt: null, storage: false };
  let raw = null;
  try { raw = await env.RATE_KV.get(SESSION_KEY); } catch {}
  if (!raw) {
    const nowIso = new Date().toISOString();
    const fresh = { id: '0001C', n: 1, kind: 'C', openedAt: nowIso, day: nowIso.slice(0, 10),
                    note: 'opened automatically on first use' };
    try { await env.RATE_KV.put(SESSION_KEY, JSON.stringify(fresh)); } catch {}
    sessionCache = { ...fresh, storage: true };
    return sessionCache;
  }
  try { sessionCache = { ...JSON.parse(raw), storage: true }; }
  catch { sessionCache = { id: '0001C', n: 1, kind: 'C', openedAt: null, storage: true }; }
  return sessionCache;
}

/* Ce se ataseaza fiecarei inregistrari. Nu doar id-ul: si momentul, pentru
   ca o sesiune tine mai multe zile si "in ce sesiune" nu raspunde la
   "cand exact". */
/* Ancorarea in timp. Trei momente, nu unul, pentru ca raspund la intrebari
   diferite si le-am confundat destul cat sa merite scrise separat:

     sessionOpenedAt  cand a inceput perioada de lucru
     at               cand exact s-a produs lucrul asta
     sessionDay       ziua sesiunii, ca sa poti grupa fara sa parsezi ore

   O sesiune tine mai multe zile. "In ce sesiune" nu raspunde la "cand
   exact", iar "cand exact" nu raspunde la "din ce perioada face parte".
   Amandoua sunt necesare ca sa poti compara doua sesiuni si sa stii ce
   s-a schimbat intre ele si cand anume. */
async function sessionStamp(env) {
  const s = await getSession(env);
  const now = new Date();
  return {
    session: s.id,
    sessionKind: s.kind || 'C',
    sessionOpenedAt: s.openedAt || null,
    sessionDay: (s.openedAt || now.toISOString()).slice(0, 10),
    at: now.toISOString(),
    /* Cate secunde de la deschiderea sesiunii. Raspunde la "cat de tarziu
       in sesiune s-a intamplat", fara scaderi de date la fiecare citire. */
    atOffsetSec: s.openedAt ? Math.round((now - new Date(s.openedAt)) / 1000) : null
  };
}

/* Toate sesiunile cunoscute, in ordine, cu datele lor. Baza comparatiei:
   fara ea nu poti alege doua sesiuni, pentru ca nu stii care exista. */
async function listSessions(env) {
  if (!env.RATE_KV) return { current: null, sessions: [] };
  const current = await getSession(env);
  const out = [{ ...current, isCurrent: true }];
  try {
    const listed = await env.RATE_KV.list({ prefix: 'session:', limit: 500 });
    for (const k of listed.keys) {
      const name = k.name.slice('session:'.length);
      if (name === 'current' || name === 'log' || name === 'openT') continue;
      const raw = await env.RATE_KV.get(k.name);
      if (!raw) continue;
      try { out.push({ ...JSON.parse(raw), isCurrent: false }); } catch {}
    }
  } catch {}
  out.sort((a, b) => (b.n - a.n) || a.kind.localeCompare(b.kind));
  return { current: current.id, sessions: out };
}

async function advanceSession(env, { kind = 'C', from = null, note = null } = {}) {
  if (!env.RATE_KV) return { error: 'session storage is not configured' };
  const cur = await getSession(env);

  if (kind === 'C') {
    const nowIso = new Date().toISOString();
    const next = { id: String(cur.n + 1).padStart(4, '0') + 'C', n: cur.n + 1, kind: 'C',
                   openedAt: nowIso, day: nowIso.slice(0, 10),
                   previous: cur.id, previousClosedAt: nowIso, note };
    await env.RATE_KV.put(SESSION_KEY, JSON.stringify(next));
    /* Invalidarea vine DUPA scriere, nu inainte. Golit la intrare, cache-ul
       s-ar reumple imediat cu valoarea veche, la citirea de context de mai
       sus — si urmatoarea stampila ar purta sesiunea din care tocmai am
       iesit. */
    sessionCache = { ...next, storage: true };
    await appendSessionLog(env, { ...next, event: 'opened' });
    return next;
  }

  if (kind === 'H') {
    /* Inghetare: eticheteaza starea sesiunii curente si o face permanenta.
       Nu schimba sesiunea curenta — munca pe C continua. */
    const nowIso = new Date().toISOString();
    const frozen = { id: String(cur.n).padStart(4, '0') + 'H', n: cur.n, kind: 'H',
                     openedAt: nowIso, day: nowIso.slice(0, 10),
                     frozenAt: nowIso, frozenFrom: cur.id,
                     frozenFromOpenedAt: cur.openedAt || null, note };
    await env.RATE_KV.put('session:' + frozen.id, JSON.stringify(frozen));
    await appendSessionLog(env, { ...frozen, event: 'frozen' });
    return frozen;
  }

  if (kind === 'T') {
    /* Una singura deschisa la un moment dat, in tot sistemul. Daca exista
       deja una, o refuzam explicit in loc sa o inlocuim tacut: doua linii
       de mentenanta simultane sunt exact ce regula asta interzice. */
    let openT = null;
    try { openT = await env.RATE_KV.get('session:openT'); } catch {}
    if (openT) {
      return { error: 'a T session is already open: ' + openT,
               detail: 'Only one may be open at a time. Close it before deriving another.' };
    }
    const src = normalizeSession(from);
    if (!src || !src.endsWith('H')) {
      return { error: 'a T session must be derived from a specific H session',
               detail: 'Pass from=NNNNH. Without a frozen reference there is nothing to derive from.' };
    }
    let exists = null;
    try { exists = await env.RATE_KV.get('session:' + src); } catch {}
    if (!exists) return { error: 'no frozen session ' + src };

    const nowIso = new Date().toISOString();
    let srcFrozenAt = null;
    try { srcFrozenAt = JSON.parse(exists).frozenAt || null; } catch {}
    const t = { id: src.slice(0, 4) + 'T', n: Number(src.slice(0, 4)), kind: 'T',
                derivedFrom: src, derivedFromFrozenAt: srcFrozenAt,
                openedAt: nowIso, day: nowIso.slice(0, 10), note };
    await env.RATE_KV.put('session:' + t.id, JSON.stringify(t));
    await env.RATE_KV.put('session:openT', t.id);
    await appendSessionLog(env, { ...t, event: 'derived' });
    return t;
  }

  return { error: 'kind must be C, H or T' };
}

async function closeT(env) {
  if (!env.RATE_KV) return { error: 'session storage is not configured' };
  let openT = null;
  try { openT = await env.RATE_KV.get('session:openT'); } catch {}
  if (!openT) return { error: 'no T session is open' };
  await env.RATE_KV.delete('session:openT');
  await appendSessionLog(env, { id: openT, kind: 'T', event: 'closed', closedAt: new Date().toISOString() });
  return { closed: openT };
}

async function appendSessionLog(env, entry) {
  try {
    let log = [];
    try { log = JSON.parse(await env.RATE_KV.get(SESSION_LOG) || '[]'); } catch {}
    log.push(entry);
    await env.RATE_KV.put(SESSION_LOG, JSON.stringify(log.slice(-500)));
  } catch {}
}

async function handleRequest(request, env, ctx, requestId) {
  {
    const url = new URL(request.url);
    if (request.method === 'OPTIONS') return new Response(null, { headers: CORS });

    /* rate limit simplu, per-IP, fereastra fixa de 60s — protejeaza rutele
       care declanseaza fetch-uri catre terti sau scriu in KV. Fail-open daca
       RATE_KV lipseste (nu blocheaza functionarea de baza fara storage). */
    const RATE_LIMITED_PATHS = { '/audit': 8, '/a2a': 15, '/lead': 5, '/observe': 5 };
    const limit = RATE_LIMITED_PATHS[url.pathname];
    if (limit && env.RATE_KV) {
      const ip = request.headers.get('cf-connecting-ip') || 'unknown';
      const windowKey = `rl:${url.pathname}:${ip}:${Math.floor(Date.now() / 60000)}`;
      let count = 0;
      try { count = Number(await env.RATE_KV.get(windowKey) || 0); } catch {}
      if (count >= limit) {
        return json({ error: 'rate limit exceeded, try again shortly' }, 429, { 'Retry-After': '60' });
      }
      try { await env.RATE_KV.put(windowKey, String(count + 1), { expirationTtl: 90 }); } catch {}
    }

    /* ---------- /cron-tick ----------
       Cloudflare Pages NU suporta Cron Triggers, deci acest proiect nu se poate
       trezi singur. Solutia: un Worker adevarat (aiventure-gdpr, care ARE cron)
       apeleaza acest endpoint o data pe ora si declanseaza reobservarile scadente.

       Protejat cu un secret comun: fara el, oricine ar putea declansa munca
       programata la nesfarsit. Daca secretul nu e configurat, endpointul e
       inchis complet — nu ramane deschis "din comoditate". */
    if (url.pathname === '/cron-tick' && request.method === 'POST') {
      if (!env.CRON_SECRET) {
        return json({ error: 'cron tick is not configured on this deployment' }, 503);
      }
      const provided = request.headers.get('x-cron-secret') || '';
      // comparatie in timp constant, ca sa nu se poata ghici secretul caracter cu caracter
      const a = new TextEncoder().encode(provided);
      const b = new TextEncoder().encode(env.CRON_SECRET);
      let same = a.length === b.length;
      for (let i = 0; i < Math.max(a.length, b.length); i++) {
        if (a[i] !== b[i]) same = false;
      }
      if (!same) return json({ error: 'unauthorized' }, 401);

      const started = Date.now();
      const result = await runScheduledObservations(env);
      return json({
        ok: true,
        ranAt: new Date(started).toISOString(),
        durationMs: Date.now() - started,
        ...(result || {}),
      });
    }

    if (url.pathname === '/audit' && request.method === 'POST') {
      let body;
      try { body = await request.json(); } catch { return json({ error: 'invalid json' }, 400); }
      const target = normalizeUrl(extractUrlFromText(body.url));
      if (!target) return json({ error: 'invalid url' }, 400);

      /* invokeDeclaredCapability: opt-in explicit al celui care cere auditul,
         pentru a permite un POST catre /a2a-ul site-ului auditat. Implicit false. */
      /* Consimtamant pentru invocare. Regula generala ramane opt-in explicit:
         `safe_to_invoke` e declaratia site-ului AUDITAT despre el insusi, si un
         scanner care face POST doar pe baza ei executa cod pe o tinta care si-a
         dat singura voie.
         Exceptia: cand tinta e chiar acest serviciu, proprietarul auditului si
         proprietarul tintei sunt aceeasi entitate, deci consimtamantul exista
         prin definitie. Fara asta, self-auditul isi raporta propria capabilitate
         drept netestata, desi ea functioneaza. */
      const selfHost = url.hostname.replace(/^www\./, '');
      const isSelfAudit = target.hostname.replace(/^www\./, '') === selfHost;
      const ev = await gatherEvidence(target, {
        invokeDeclaredCapability: body.invokeDeclaredCapability === true || isSelfAudit
      });
      if (!ev.mainOk) return json({ error: 'unreachable', detail: `nu am putut accesa ${target.href}`, status: ev.status }, 200);

      const psi = body.pagespeed === false ? null : await fetchPageSpeed(target.href, env);
      const evalResult = evaluate(ev, psi);
      const report = { url: target.href, ...evalResult };
      report.plan = buildActionPlan(report);
      report.sources = { pagespeed: psi ? psi.source : 'unavailable' };
      report.observationId = 'obs_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
      /* Ancorarea in timp. Un observationId spune CARE rulare; sesiunea spune
         DIN CE perioada face parte, iar cele trei momente spun cand exact.
         Fara sesiune, doua rapoarte se pot compara doar daca ai retinut
         amandoua id-urile — adica daca ai stiut dinainte ca vei avea nevoie. */
      Object.assign(report, await sessionStamp(env));

      /* provenance: fara asta, doua rapoarte nu pot fi comparate corect —
         nu stii ce versiune de reguli le-a produs sau cata acoperire au avut. */
      report.observedAt = new Date().toISOString();
      report.engineVersion = ENGINE_VERSION;
      report.rulesetVersion = RULESET_VERSION;
      report.requestId = request.headers.get('cf-ray') || report.observationId;
      report.coverage = report.totalSignals
        ? Math.round((report.tested / report.totalSignals) * 1000) / 10
        : null;

      /* Observatia anterioara pentru acelasi site. Fara ea, fiecare raport e
         o fotografie izolata si nimeni nu poate arata ce a schimbat o
         injectie. Cautam ultima observatie a aceluiasi URL, dinaintea
         acesteia, si o punem in raport ca referinta — interfata o foloseste
         ca sa afiseze doua carlige per semnal, inainte si dupa.
         Cautarea e plafonata: la un volum mare, o lista completa ar costa
         mai mult decat valoreaza. */
      if (env.RATE_KV) {
        try {
          const listed = await env.RATE_KV.list({ prefix: 'obs:', limit: 400 });
          let best = null, bestAt = null;
          for (const k of listed.keys) {
            if (k.name === 'obs:' + report.observationId) continue;
            const raw = await env.RATE_KV.get(k.name);
            if (!raw) continue;
            let prev; try { prev = JSON.parse(raw); } catch { continue; }
            if (prev.url !== report.url) continue;
            const at = prev.at || prev.observedAt || prev.ts;
            if (!at || at >= report.observedAt) continue;
            if (!bestAt || at > bestAt) { bestAt = at; best = prev; }
          }
          if (best) {
            report.previousObservation = {
              observationId: best.observationId,
              at: bestAt,
              session: best.session || null,
              global: best.global ?? null
            };
            /* Scorurile pe dimensiune ale observatiei anterioare. Cardurile
               le folosesc ca sa arate delta fara sa mai ceara inca un raport. */
            report.previousScores = best.scores || null;
            report.delta = (best.global != null && report.global != null)
              ? Math.round((report.global - best.global) * 10) / 10
              : null;
          }
        } catch {}
      }
      report.evidence = {
        mainStatus: ev.status,
        finalUrl: ev.finalUrl,
        redirected: ev.redirects,
        internalLinksChecked: (ev.linkChecks || []).length,
        sitemapUrls: ev.sitemapInfo ? ev.sitemapInfo.urlCount : 0,
        proofFilesVerified: ev.proofCheck ? ev.proofCheck.verified : 0,
        proofFilesChecked: ev.proofCheck ? ev.proofCheck.checked : 0,
      };
      report.registry = await logToRegistry(ctx, target.href, 'audit');

      if (env.RATE_KV) {
        try {
          const n = Number(await env.RATE_KV.get('audit_count') || 0) + 1;
          await env.RATE_KV.put('audit_count', String(n));
          await env.RATE_KV.put('obs:' + report.observationId, JSON.stringify(report), { expirationTtl: 60 * 60 * 24 * 90 });
        } catch {}
      }
      return json(report);
    }

    if (url.pathname === '/synth' && request.method === 'POST') {
      let body;
      try { body = await request.json(); } catch { return json({ error: 'invalid json' }, 400); }
      const synth = await fetchSynthesis(body.report || {}, env);
      return json({ synthesis: synth, available: !!synth });
    }

    /* /lead — captura de email legata de o observatie concreta.
       Pana acum salva doar email + url, deci nu se stia ce a cerut omul si
       nici la ce raport se referea. Acum retine si observationId, scorul si
       ce a bifat: raportul, planul de actiune, sau amandoua. Un lead fara
       contextul asta e un email pe care nu ai cu ce sa il continui.

       Nu trimitem noi emailul: nu exista furnizor legat, iar butonul din
       pagina foloseste clientul omului. Ce face endpointul e sa retina
       cererea, ca sa existe cand exista si canalul. */
    if (url.pathname === '/lead' && request.method === 'POST') {
      let body;
      try { body = await request.json(); } catch { return json({ error: 'invalid json' }, 400); }

      const email = String(body.email || '').trim().slice(0, 200);
      /* Validare deliberat permisiva: refuzam ce clar nu e o adresa, nu
         incercam sa ghicim ce e valid. Un regex strict respinge adrese reale. */
      if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(email)) {
        return json({ error: 'a valid email address is required' }, 400);
      }

      const wants = Array.isArray(body.wants) ? body.wants : [];
      const wantReport = wants.includes('report') || body.wantReport === true;
      const wantPlan   = wants.includes('action_plan') || body.wantActionPlan === true;
      if (!wantReport && !wantPlan) {
        return json({ error: 'choose at least one: report, action_plan' }, 400);
      }

      const stamp = await sessionStamp(env);
      const record = {
        ...stamp,
        email,
        url: String(body.url || '').slice(0, 500),
        observationId: String(body.observationId || '').slice(0, 60) || null,
        score: Number.isFinite(Number(body.score)) ? Number(body.score) : null,
        wants: [wantReport ? 'report' : null, wantPlan ? 'action_plan' : null].filter(Boolean),
        reportUrl: body.observationId
          ? `https://3webobs.com/signal-detail?obs=${encodeURIComponent(String(body.observationId))}&dim=AEO`
          : null,
        lang: String(body.lang || '').slice(0, 12) || null,
        country: request.headers.get('cf-ipcountry') || null,   // tara, nu IP
        ts: new Date().toISOString(),
        delivered: false,     // devine true cand exista un canal care chiar trimite
        source: '3webobs.com'
      };

      /* Trimitem acum, nu "cand vom avea canal". Daca observatia mai e in KV,
         emailul contine si semnalele picate cu greutate mare — altfel ramane
         linkul, care e oricum lucrul util. */
      let report = null;
      if (record.observationId && env.RATE_KV) {
        try {
          const stored = await env.RATE_KV.get('obs:' + record.observationId);
          if (stored) report = JSON.parse(stored);
        } catch {}
      }
      const delivery = await sendLeadEmail(env, record, report);
      record.delivered = delivery.sent;
      record.deliveryId = delivery.id || null;
      if (!delivery.sent) record.deliveryError = delivery.reason || null;

      if (env.RATE_KV) {
        try {
          const key = `lead:${Date.now()}:${email}`;
          await env.RATE_KV.put(key, JSON.stringify(record), { expirationTtl: 60 * 60 * 24 * 400 });
          /* Index pe email, ca sa se vada daca cineva a cerut de mai multe ori
             fara sa primeasca nimic. */
          const idxKey = `leadidx:${email}`;
          let idx = [];
          try { idx = JSON.parse(await env.RATE_KV.get(idxKey) || '[]'); } catch {}
          idx.push({ ts: record.ts, observationId: record.observationId, wants: record.wants, url: record.url });
          await env.RATE_KV.put(idxKey, JSON.stringify(idx.slice(-25)), { expirationTtl: 60 * 60 * 24 * 400 });

          const cnt = Number(await env.RATE_KV.get('lead_count') || 0) + 1;
          await env.RATE_KV.put('lead_count', String(cnt));
        } catch {}
      }

      return json({
        ok: true,
        saved: record.wants,
        delivered: record.delivered,
        reportUrl: record.reportUrl,
        note: record.delivered
          ? 'Sent. Check your inbox — the report link stays live for 90 days.'
          : 'Saved, but the email could not be sent right now. The report link above still works.'
      });
    }

    /* /leads — citire, pentru panoul de control. Aceeasi parola ca restul. */
    if (url.pathname === '/leads' && request.method === 'GET') {
      const key = url.searchParams.get('key') || request.headers.get('x-cron-secret') || '';
      if (!env.CRON_SECRET) return json({ error: 'no access password configured' }, 503);
      if (key !== env.CRON_SECRET) return json({ error: 'unauthorized' }, 401);
      if (!env.RATE_KV) return json({ error: 'storage not configured' }, 503);
      const out = [];
      try {
        const listed = await env.RATE_KV.list({ prefix: 'lead:', limit: 1000 });
        const keys = listed.keys.map(k => k.name).sort().reverse().slice(0, 200);
        for (const k of keys) {
          const v = await env.RATE_KV.get(k);
          if (v) { try { out.push(JSON.parse(v)); } catch {} }
        }
      } catch (e) { return json({ error: 'read failed', detail: String(e) }, 500); }
      return json({ total: out.length, leads: out });
    }

    if (url.pathname === '/stats') {
      let count = 0;
      if (env.RATE_KV) { try { count = Number(await env.RATE_KV.get('audit_count') || 0); } catch {} }
      return json({ audits: count, version: '3.2.0', engine: 'evidence-based', signals: 167, external_sources: ['PageSpeed Insights (free)'], brand: '3webs', network: '5thElement.ai', a2a: '/a2a', agent_card: '/.well-known/agent-card.json' });
    }


    /* ═══════════ A2A v1.0 — JSON-RPC 2.0 endpoint ═══════════
       Skills: obs_one_shot · obs_permanent · obs_diff · obs_explain · obs_catalogue */
    /* /explain — REST twin of the a2a obs_explain skill, matching capabilities.json's declared endpoint */
    if (url.pathname === '/explain' && request.method === 'POST') {
      let body; try { body = await request.json(); } catch { return json({ error: 'invalid json' }, 400); }
      const target = normalizeUrl(extractUrlFromText(body.url));
      const sigId = body.signal_id || body.signalId;
      if (!target || !sigId) return json({ error: 'url and signal_id are required' }, 400);
      let found = null, dim = null;
      for (const d of Object.keys(SIG)) { const s = SIG[d].find(x => x.id === sigId); if (s) { found = s; dim = d; break; } }
      if (!found) return json({ error: 'unknown signal_id ' + sigId }, 400);
      const ev = await gatherEvidence(target);
      if (!ev.mainOk) return json({ url: target.href, status: 'unreachable' }, 200);
      const v = evalSignal(found, ev, await fetchPageSpeed(target.href, env));
      return json({ url: target.href, signal: { id: found.id, name: found.n, dimension: dim, category: found.c, weight: found.w },
        verdict: v.status, score: v.score ?? null, evidence: v.method });
    }

    /* ---------- /session — citire ----------
       Publica sesiunea curenta si toate cele cunoscute, cu datele lor.
       Public: numarul de sesiune nu e un secret, e o eticheta de timp, iar
       interfata are nevoie de el ca sa umple campul de alegere. */
    if (url.pathname === '/session' && request.method === 'GET') {
      const all = await listSessions(env);
      return json({
        current: all.current,
        stamp: await sessionStamp(env),
        format: {
          pattern: 'NNNN + C | H | T',
          C: 'current — the working line; incremented on each new operating session. A trailing space means the same as C.',
          H: 'frozen — a reference taken when work moves between environments. Never changes. Optional.',
          T: 'derived — the one writable copy of a frozen H. Only one may be open at a time.'
        },
        sessions: all.sessions
      });
    }

    /* ---------- /session — avansare, inghetare, derivare ----------
       Protejat cu aceeasi parola ca panoul de control. A deschide o sesiune
       noua e o decizie, nu un efect secundar al traficului: daca oricine ar
       putea incrementa C, numarul n-ar mai ancora nimic. */
    if (url.pathname === '/session' && request.method === 'POST') {
      const key = url.searchParams.get('key') || request.headers.get('x-cron-secret') || '';
      if (!env.CRON_SECRET) return json({ error: 'no access password configured' }, 503);
      if (key !== env.CRON_SECRET) return json({ error: 'unauthorized' }, 401);

      let body = {};
      try { body = await request.json(); } catch {}
      const action = String(body.action || 'open').toLowerCase();

      if (action === 'close-t') return json(await closeT(env));

      /* ---------- promote: inghetare + deschiderea liniei urmatoare ----------
         Un push in GitHub e chiar bascularea dintr-un mediu in altul, deci e
         momentul in care se face fotografia. Dar H primeste numarul sesiunii
         curente: din 0001C iese 0001H. Daca fiecare push ar doar congela, al
         doilea push din aceeasi sesiune ar produce tot 0001H si l-ar
         suprascrie pe primul — iar H e definit ca ceva ce nu se schimba
         niciodata.
         De aceea promote face doua lucruri deodata: ingheata C curent ca H,
         si deschide C urmator ca linie de lucru. Fiecare H ramane unic si
         corespunde exact unui deploy. */
      if (action === 'promote') {
        const frozen = await advanceSession(env, { kind: 'H', note: body.note || null });
        if (frozen.error) return json({ ...frozen, ok: false }, 409);
        const next = await advanceSession(env, { kind: 'C', note: 'opened after ' + frozen.id });
        return json({ ok: true, frozen, current: next,
          note: `${frozen.id} is now a permanent reference; work continues on ${next.id}.` });
      }

      const kind = String(body.kind || 'C').toUpperCase();
      if (!['C', 'H', 'T'].includes(kind)) return json({ error: 'kind must be C, H or T' }, 400);

      const result = await advanceSession(env, { kind, from: body.from || null, note: body.note || null });
      return json(result.error ? { ...result, ok: false } : { ok: true, session: result }, result.error ? 409 : 200);
    }

    /* ---------- /session/log ---------- */
    if (url.pathname === '/session/log' && request.method === 'GET') {
      if (!env.RATE_KV) return json({ error: 'storage not configured' }, 503);
      let log = [];
      try { log = JSON.parse(await env.RATE_KV.get('session:log') || '[]'); } catch {}
      return json({ total: log.length, events: log.slice(-200).reverse() });
    }

    /* ---------- /session/compare ----------
       Compara doua sesiuni prin observatiile facute in fiecare. Asta e
       motivul pentru care exista numerele: doua etichete, alese dintr-o
       lista, in loc de doua id-uri pe care trebuia sa le fi retinut.
       "C" si spatiu se normalizeaza la fel, deci ?a=0041&b=0042C merge. */
    if (url.pathname === '/session/compare' && request.method === 'GET') {
      if (!env.RATE_KV) return json({ error: 'storage not configured' }, 503);
      const cur = await getSession(env);
      const a = normalizeSession(url.searchParams.get('a')) || cur.id;
      const b = normalizeSession(url.searchParams.get('b')) || cur.id;
      const target = url.searchParams.get('url') || null;
      if (!a || !b) return json({ error: 'sessions must look like NNNN followed by C, H or T' }, 400);

      const collect = async (sid) => {
        const found = [];
        try {
          const listed = await env.RATE_KV.list({ prefix: 'obs:', limit: 1000 });
          for (const k of listed.keys) {
            const raw = await env.RATE_KV.get(k.name);
            if (!raw) continue;
            let r; try { r = JSON.parse(raw); } catch { continue; }
            if (r.session !== sid) continue;
            if (target && r.url !== target) continue;
            found.push({ observationId: r.observationId, url: r.url, at: r.at || r.ts,
                         global: r.global, scores: r.scores, tested: r.tested, na: r.na });
          }
        } catch {}
        found.sort((x, y) => String(x.at).localeCompare(String(y.at)));
        return found;
      };

      const [obsA, obsB] = [await collect(a), await collect(b)];
      const lastOf = (arr) => arr.length ? arr[arr.length - 1] : null;
      const la = lastOf(obsA), lb = lastOf(obsB);

      /* Delta numai daca ambele exista SI privesc acelasi site. Altfel am
         scadea scoruri a doua domenii diferite si am numi-o evolutie. */
      let delta = null;
      if (la && lb && la.url === lb.url) {
        delta = { url: la.url, global: (lb.global ?? 0) - (la.global ?? 0), scores: {} };
        for (const dim of Object.keys(lb.scores || {})) {
          const before = la.scores ? la.scores[dim] : null;
          const after = lb.scores[dim];
          if (before != null && after != null) delta.scores[dim] = after - before;
        }
      }

      return json({
        a: { session: a, observations: obsA.length, latest: la },
        b: { session: b, observations: obsB.length, latest: lb },
        delta,
        note: delta ? null
          : (la && lb ? 'The two sessions observed different sites; pass ?url= to compare the same one.'
                      : 'One of the sessions has no stored observation to compare.')
      });
    }

    /* /observation — citire read-only a unui raport deja produs.
       Cerut si de un audit extern: pana acum un raport nu putea fi reprodus
       decat rerulandu-l, deci nici verificat de altcineva. Acum are un URL
       stabil, iar paginile de detaliu se pot construi peste el in loc sa
       ceara motorului sa refaca munca. */
    if (url.pathname === '/observation' && request.method === 'GET') {
      const id = url.searchParams.get('id');
      if (!id) return json({ error: 'id is required' }, 400);
      if (!env.RATE_KV) return json({ error: 'observation storage is not configured' }, 503);
      let stored = null;
      try { stored = await env.RATE_KV.get('obs:' + id); } catch {}
      if (!stored) return json({ error: 'no stored observation with id ' + id,
        detail: 'Observations are retained for 90 days.' }, 404);
      return new Response(stored, { headers: { 'content-type': 'application/json',
        'cache-control': 'public, max-age=300', ...CORS } });
    }

    /* /diff — REST twin of the a2a obs_diff skill */
    if (url.pathname === '/diff' && request.method === 'POST') {
      let body; try { body = await request.json(); } catch { return json({ error: 'invalid json' }, 400); }
      const target = normalizeUrl(extractUrlFromText(body.url));
      const baseline = body.baseline_id || body.baselineId;
      if (!target || !baseline) return json({ error: 'url and baseline_id are required' }, 400);
      let stored = null;
      if (env.RATE_KV) { try { stored = await env.RATE_KV.get('obs:' + baseline); } catch {} }
      if (!stored) return json({ status: 'baseline_not_found',
        detail: 'No stored observation with id ' + baseline + '. Run /audit or obs_one_shot first and retain its observationId.' }, 200);
      const before = JSON.parse(stored);
      const ev = await gatherEvidence(target);
      if (!ev.mainOk) return json({ status: 'unreachable' }, 200);
      const after = evaluate(ev, await fetchPageSpeed(target.href, env));
      const changed = [];
      for (const d of Object.keys(after.signals)) {
        after.signals[d].forEach((s, i) => {
          const b = before.signals?.[d]?.[i];
          if (b && b.status !== s.status) changed.push({ dimension: d, id: s.id, name: s.n, from: b.status, to: s.status, evidence: s.method });
        });
      }
      return json({ url: target.href, baseline_id: baseline, global_before: before.global, global_after: after.global,
        delta: after.global - before.global, changed_signals: changed });
    }

    if (url.pathname === '/a2a' && request.method === 'POST') {
      let rpc;
      try { rpc = await request.json(); }
      catch { return json({ jsonrpc: '2.0', id: null,
        error: { code: -32700, message: 'Parse error' } }, 200); }

      const id = rpc.id ?? null;
      const rpcErr = (code, message, data) => json({ jsonrpc: '2.0', id,
        error: data ? { code, message, data } : { code, message } }, 200);

      if (rpc.jsonrpc !== '2.0') return rpcErr(-32600, 'Invalid Request: jsonrpc must be "2.0"');

      /* ---------- negociere de versiune A2A ----------
         Specificatia v1.0 (sectiunea 3.6): clientul trimite antetul A2A-Version;
         un antet absent INSEAMNA 0.3, nu "cea mai noua". Un agent poate expune
         mai multe interfete pe acelasi transport cu versiuni diferite.
         Deci nu e un hack de compatibilitate: e comportamentul cerut de standard.
         Diferentele de format intre 0.3 si 1.0:
           - 0.3: parts au discriminator `kind`, role este "user"/"agent"
           - 1.0: discriminatorul `kind` a fost ELIMINAT (Appendix A.2.1),
                  un Part contine exact unul dintre text/data/url/raw,
                  iar Role este enum: ROLE_USER / ROLE_AGENT */
      const verRaw = String(request.headers.get('A2A-Version') || url.searchParams.get('A2A-Version') || '').trim();
      const wireVersion = verRaw === '' ? '0.3' : verRaw.split('.').slice(0, 2).join('.');
      if (!['0.3', '1.0'].includes(wireVersion)) {
        return rpcErr(-32009, 'VersionNotSupportedError: this interface implements A2A 1.0 and 0.3',
          { requested: verRaw, supported: ['1.0', '0.3'] });
      }
      const isV1 = wireVersion === '1.0';

      /* tasks/get, tasks/cancel — backed by the same KV subscription record used by
         obs.permanent. These are the only long-lived "tasks" this Worker has: everything
         else (obs_one_shot, obs_diff, obs_explain, obs_catalogue) completes synchronously
         within message/send and has no separate task to look up afterwards. */
      /* A2A v1.0 foloseste nume canonice de metoda (SendMessage, GetTask,
         CancelTask, ListTasks); `message/send` si `tasks/get` sunt aliasuri
         pre-1.0 (v0.3). Cardul declara v1.0, deci acceptam numele canonice —
         plus aliasurile vechi, pentru clientii care inca le folosesc. */
      const METHOD_ALIASES = {
        'SendMessage': 'message/send',
        'GetTask': 'tasks/get',
        'CancelTask': 'tasks/cancel',
        'ListTasks': 'tasks/list',
        'SendStreamingMessage': 'message/stream',
        'SubscribeToTask': 'tasks/resubscribe',
      };
      const method = METHOD_ALIASES[rpc.method] || rpc.method;

      if (method === 'tasks/get' || method === 'tasks/cancel') {
        const taskId = rpc.params && (rpc.params.id || rpc.params.taskId);
        if (!taskId) return rpcErr(-32602, 'Invalid params: id is required');
        if (!env.RATE_KV) return rpcErr(-32603, 'Internal error: task storage unavailable');
        let sub = null;
        try { sub = JSON.parse(await env.RATE_KV.get('sub:' + taskId)); } catch {}
        if (!sub) return rpcErr(-32001, 'Task not found', { id: taskId });
        /* TaskState: v1.0 foloseste enumul TASK_STATE_*, v0.3 sirurile scurte. */
        const stateOf = (s) => {
          const short = s === 'active' ? 'working' : s === 'cancelled' ? 'canceled'
            : s === 'target_unreachable' ? 'failed' : s === 'registered' ? 'submitted' : 'unknown';
          if (!isV1) return short;
          const map = { working: 'TASK_STATE_WORKING', canceled: 'TASK_STATE_CANCELED',
            failed: 'TASK_STATE_FAILED', submitted: 'TASK_STATE_SUBMITTED', unknown: 'TASK_STATE_UNSPECIFIED' };
          return map[short];
        };
        if (method === 'tasks/cancel') {
          sub.status = 'cancelled';
          sub.cancelledAt = new Date().toISOString();
          try { await env.RATE_KV.put('sub:' + taskId, JSON.stringify(sub)); } catch {}
        }
        const taskObj = {
          id: sub.id, contextId: sub.id,
          status: { state: stateOf(sub.status), timestamp: sub.lastRunAt || sub.cancelledAt || sub.registeredAt },
          metadata: { url: sub.url, interval: sub.interval, lastScore: sub.lastScore ?? null, threshold: sub.threshold }
        };
        /* Acelasi motiv ca la reply(): pe v1, Task se livreaza ca result.task. */
        return json({ jsonrpc: '2.0', id, result: isV1 ? { task: taskObj } : taskObj });
      }

      if (method !== 'message/send') return rpcErr(-32601,
        'Method not found. Supported (A2A v1.0 canonical names, pre-1.0 aliases also accepted): ' +
        'SendMessage (message/send), GetTask (tasks/get), CancelTask (tasks/cancel). ' +
        'message/stream is intentionally not implemented — see capabilities.streaming:false in the agent card; every skill here completes synchronously within message/send, so there is nothing to stream.');

      const msg = rpc.params && rpc.params.message;
      const parts = (msg && msg.parts) || [];
      /* Detectia partilor nu se mai bazeaza pe `kind`/`type`. In v1 un Part e
         identificat prin CAMPUL pe care il contine, iar `kind` nu mai exista.
         Codul vechi cauta doar kind==='data'/'text', deci o cerere v1 valida
         ({parts:[{text:"..."}]}) nu gasea nimic, payload ramanea gol si
         raspunsul era -32602 Invalid params — exact eroarea din audit. */
      const dataPart = parts.find(p => p && p.data !== undefined && p.data !== null)
        || parts.find(p => p && (p.kind === 'data' || p.type === 'data'));
      const textPart = parts.find(p => p && typeof p.text === 'string')
        || parts.find(p => p && (p.kind === 'text' || p.type === 'text'));
      const payload = (dataPart && (dataPart.data || dataPart.payload)) || {};
      const skill = payload.skill || (rpc.params && rpc.params.skill) || 'obs_one_shot';

      /* Rolul acceptat la intrare: "user" (0.3) sau ROLE_USER (1.0). Orice
         altceva e o cerere formata gresit, nu o tacere care produce un audit. */
      const inRole = String((msg && msg.role) || '').toUpperCase().replace('ROLE_', '');
      if (msg && inRole && inRole !== 'USER') {
        return rpcErr(-32602, 'Invalid params: message.role must be ROLE_USER (v1) or "user" (v0.3)');
      }

      /* Forma raspunsului la SendMessage. In A2A v1.0 `result` e o uniune si
         trebuie sa poarte discriminantul: result.message sau result.task.
         Pana acum trimiteam obiectul Message direct in `result`, ceea ce un
         client permisiv accepta si unul strict respinge — si tocmai clientii
         stricti sunt cei pentru care exista interfata.
         Pe 0.3 forma plata cu kind:'message' ramane cea corecta, deci ramane
         neschimbata; altfel am strica clientii existenti reparand standardul. */
      const reply = (obj) => json({
        jsonrpc: '2.0', id,
        result: isV1
          ? { message: { messageId: crypto.randomUUID(), role: 'ROLE_AGENT',
                         parts: [{ data: obj, mediaType: 'application/json' }] } }
          : { kind: 'message', role: 'agent',
              messageId: crypto.randomUUID(),
              parts: [{ kind: 'data', data: obj }] }
      });

      /* ── obs_catalogue ── */
      if (skill === 'obs_catalogue') {
        const cat = {};
        for (const dim of Object.keys(SIG)) {
          cat[dim] = SIG[dim].map(s => ({ id: s.id, name: s.n, category: s.c, weight: s.w }));
        }
        return reply({
          skill: 'obs_catalogue',
          total: Object.values(SIG).reduce((a, b) => a + b.length, 0),
          webs: {
            human_web: { dimensions: ['SEO'], question: 'What does a person see?' },
            ai_web: { dimensions: ['AEO', 'GEO', 'AIO'], question: 'What does an answer engine see?' },
            machine_web: { dimensions: ['AI_SIGNALS','A2A'], question: 'What does an agent see?' }
          },
          catalogue: cat
        });
      }

      /* ── obs_one_shot ── */
      if (skill === 'obs_one_shot') {
        const raw = payload.url || (textPart && textPart.text) || '';
        const target = normalizeUrl(extractUrlFromText(raw));
        if (!target) return rpcErr(-32602, 'Invalid params: a valid url is required');

        const ev = await gatherEvidence(target);
        if (!ev.mainOk) return reply({ skill: 'obs_one_shot', url: target.href,
          status: 'unreachable', detail: 'could not fetch ' + target.href });

        const psi = payload.pagespeed === false ? null : await fetchPageSpeed(target.href, env);
        const r = evaluate(ev, psi);
        const report = { url: target.href, ...r };
        report.sources = { pagespeed: psi ? psi.source : 'unavailable' };
        report.plan = buildActionPlan(report);

        const byWeb = {
          human_web: report.scores.SEO,
          ai_web: (() => {
            const v = ['AEO', 'GEO', 'AIO'].map(k => report.scores[k]).filter(x => x !== null);
            return v.length ? Math.round(v.reduce((a, b) => a + b, 0) / v.length) : null;
          })(),
          machine_web: (() => {
            const v = [report.scores.AI_SIGNALS, report.scores.A2A].filter(x => x !== null && x !== undefined);
            return v.length ? Math.round(v.reduce((a, b) => a + b, 0) / v.length) : null;
          })()
        };

        const observationId = 'obs_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
        const a2aStamp = await sessionStamp(env);
        const registryResult = await logToRegistry(ctx, report.url, 'audit_a2a');
        if (env.RATE_KV) {
          try {
            const n = Number(await env.RATE_KV.get('audit_count') || 0) + 1;
            await env.RATE_KV.put('audit_count', String(n));
            // persist the full report so obs_diff / REST-diff can find this as a baseline later
            Object.assign(report, a2aStamp);
            await env.RATE_KV.put('obs:' + observationId, JSON.stringify(report), { expirationTtl: 60 * 60 * 24 * 90 });
          } catch {}
        }
        return reply({ skill: 'obs_one_shot', mode: 'one-shot',
          observationId,
          url: report.url, global: report.global,
          three_webs: byWeb, dimensions: report.scores,
          tested: report.tested, not_applicable: report.na,
          signals: report.signals, plan: report.plan,
          determinism: 'rule-based; no score generated by a language model' });
      }

      /* ── obs_permanent ── */
      if (skill === 'obs_permanent') {
        if (payload.action === 'cancel') {
          const cancelId = payload.subscriptionId;
          if (!cancelId) return rpcErr(-32602, 'Invalid params: subscriptionId is required to cancel');
          if (!env.RATE_KV) return rpcErr(-32603, 'Internal error: subscription storage unavailable');
          let existing = null;
          try { existing = JSON.parse(await env.RATE_KV.get('sub:' + cancelId)); } catch {}
          if (!existing) return reply({ skill: 'obs_permanent', action: 'cancel', subscriptionId: cancelId, status: 'not_found' });
          existing.status = 'cancelled';
          existing.cancelledAt = new Date().toISOString();
          try { Object.assign(existing, { cancelledIn: (await sessionStamp(env)) }); await env.RATE_KV.put('sub:' + cancelId, JSON.stringify(existing)); } catch {}
          return reply({ skill: 'obs_permanent', action: 'cancel', subscriptionId: cancelId, status: 'cancelled' });
        }
        const target = normalizeUrl(String(payload.url || '').trim());
        if (!target) return rpcErr(-32602, 'Invalid params: a valid url is required');
        const interval = payload.interval || 'weekly';
        if (!['daily', 'weekly', 'monthly'].includes(interval))
          return rpcErr(-32602, 'Invalid params: interval must be daily, weekly or monthly');
        const notify = payload.notify || null;
        if (!notify) return rpcErr(-32602, 'Invalid params: notify (callback url or email) is required');
        const notifyCheck = await validateNotify(notify);
        if (!notifyCheck.ok) return rpcErr(-32602, 'Invalid params: ' + notifyCheck.reason);

        const subId = 'perm_' + crypto.randomUUID();
        const sub = { id: subId, url: target.href, interval, notify: notifyCheck.value,
          threshold: payload.threshold ?? 3, status: 'registered',
          registeredAt: new Date().toISOString() };

        /* Nu confirmam niciodata un abonament care nu a fost salvat.
           Varianta veche inghitea eroarea si returna oricum status:'registered'
           cu un subscriptionId — clientul credea ca monitorizarea e activa, dar
           nu exista nicaieri si nu ar fi rulat niciodata. */
        if (!env.RATE_KV) {
          return rpcErr(-32603, 'Internal error: subscription storage is not configured on this deployment, so the subscription cannot be persisted. Nothing was registered.');
        }
        try {
          Object.assign(sub, { createdIn: (await sessionStamp(env)) });
          await env.RATE_KV.put('sub:' + subId, JSON.stringify(sub));
        } catch (e) {
          return rpcErr(-32603, 'Internal error: failed to persist the subscription. Nothing was registered — please retry.');
        }
        return reply({ skill: 'obs_permanent', mode: 'permanent',
          subscriptionId: subId, url: sub.url, interval, notify,
          threshold: sub.threshold, status: 'registered',
          note: /^https?:\/\//i.test(notify)
            ? 'Scheduled re-observation runs via a Cloudflare Cron Trigger. Change notifications are POSTed to your callback URL.'
            : 'Scheduled re-observation runs via a Cloudflare Cron Trigger. Email delivery is pending an email provider binding — the subscription runs and records scores, but email notification is not yet sent; use a callback URL to receive notifications today.',
          cancel: { method: 'POST', path: '/a2a', skill: 'obs_permanent', action: 'cancel', subscriptionId: subId } });
      }

      /* ── obs_explain ── */
      if (skill === 'obs_explain') {
        const target = normalizeUrl(String(payload.url || '').trim());
        const sigId = payload.signal_id || payload.signalId;
        if (!target || !sigId) return rpcErr(-32602, 'Invalid params: url and signal_id are required');

        let found = null, dim = null;
        for (const d of Object.keys(SIG)) {
          const s = SIG[d].find(x => x.id === sigId);
          if (s) { found = s; dim = d; break; }
        }
        if (!found) return rpcErr(-32602, 'Invalid params: unknown signal_id ' + sigId);

        const ev = await gatherEvidence(target);
        if (!ev.mainOk) return reply({ skill: 'obs_explain', url: target.href, status: 'unreachable' });
        const v = evalSignal(found, ev, await fetchPageSpeed(target.href, env));
        return reply({ skill: 'obs_explain', url: target.href,
          signal: { id: found.id, name: found.n, dimension: dim, category: found.c, weight: found.w },
          verdict: v.status, score: v.score ?? null, evidence: v.method });
      }

      /* ── obs_diff ── */
      if (skill === 'obs_diff') {
        const target = normalizeUrl(String(payload.url || '').trim());
        const baseline = payload.baseline_id || payload.baselineId;
        if (!target || !baseline) return rpcErr(-32602, 'Invalid params: url and baseline_id are required');
        let stored = null;
        if (env.RATE_KV) {
          try { stored = await env.RATE_KV.get('obs:' + baseline); } catch {}
        }
        if (!stored) return reply({ skill: 'obs_diff', status: 'baseline_not_found',
          detail: 'No stored observation with id ' + baseline + '. Run obs_one_shot first and retain its observationId.' });
        const before = JSON.parse(stored);
        const ev = await gatherEvidence(target);
        if (!ev.mainOk) return reply({ skill: 'obs_diff', status: 'unreachable' });
        const after = evaluate(ev, await fetchPageSpeed(target.href, env));
        const changed = [];
        for (const d of Object.keys(after.signals)) {
          after.signals[d].forEach((s, i) => {
            const b = before.signals?.[d]?.[i];
            if (b && b.status !== s.status) changed.push({ dimension: d, id: s.id, name: s.n,
              from: b.status, to: s.status, evidence: s.method });
          });
        }
        return reply({ skill: 'obs_diff', url: target.href,
          baseline_id: baseline, global_before: before.global, global_after: after.global,
          delta: after.global - before.global, changed_signals: changed });
      }

      return rpcErr(-32601, 'Unknown skill: ' + skill,
        { supported: ['obs_one_shot', 'obs_permanent', 'obs_diff', 'obs_explain', 'obs_catalogue'] });
    }

    /* GET /a2a → serves the agent card, for discovery */
    if (url.pathname === '/a2a' && request.method === 'GET') {
      return Response.redirect(url.origin + '/.well-known/agent-card.json', 302);
    }

    /* /signals → the catalogue, plain REST */
    if (url.pathname === '/signals' && request.method === 'GET') {
      const cat = {};
      for (const dim of Object.keys(SIG)) {
        cat[dim] = SIG[dim].map(s => ({ id: s.id, name: s.n, category: s.c, weight: s.w }));
      }
      return json({ total: Object.values(SIG).reduce((a, b) => a + b.length, 0), catalogue: cat });
    }

    /* /observe → permanent observation, plain REST */
    if (url.pathname === '/observe' && request.method === 'POST') {
      let body; try { body = await request.json(); } catch { return json({ error: 'invalid json' }, 400); }
      const target = normalizeUrl(extractUrlFromText(body.url));
      if (!target) return json({ error: 'invalid url' }, 400);
      const interval = body.interval || 'weekly';
      if (!['daily','weekly','monthly'].includes(interval))
        return json({ error: 'interval must be daily, weekly or monthly' }, 400);
      if (!body.notify) return json({ error: 'notify (callback url or email) is required' }, 400);
      const notifyCheck = await validateNotify(body.notify);
      if (!notifyCheck.ok) return json({ error: notifyCheck.reason }, 400);
      const subId = 'perm_' + crypto.randomUUID();
      const sub = { id: subId, url: target.href, interval, notify: notifyCheck.value,
        threshold: body.threshold ?? 3, status: 'registered', registeredAt: new Date().toISOString() };
      if (!env.RATE_KV) {
        return json({ error: 'subscription storage is not configured on this deployment; nothing was registered' }, 503);
      }
      try {
        await env.RATE_KV.put('sub:' + subId, JSON.stringify(sub));
      } catch (e) {
        return json({ error: 'failed to persist the subscription; nothing was registered' }, 503);
      }
      return json(sub);
    }

    return env.ASSETS ? env.ASSETS.fetch(request) : new Response('3webs OBS engine — 3webobs.com', { headers: CORS });
  }
}
