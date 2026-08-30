/* ===================================================================
   AUDIT-AI — REAL ENGINE — 3webobs.com
   Motor real: fetch site + fisiere de semnal, evaluare pe dovezi reale.
   ZERO PROFILES hardcodat. ZERO regex pe numele domeniului.
   Semnale nemasurabile fara API extern platit = NA (nu FAIL, nu inventat).
   =================================================================== */

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function json(obj, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS, ...extraHeaders },
  });
}

/* ---------- catalogul celor 167 de semnale (id, nume, categorie, greutate) ---------- */
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
  if (!/^https?:\/\//i.test(u)) u = 'https://' + u;
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
async function resolveHostIsPrivate(hostname) {
  if (looksLikeIpLiteral(hostname)) return isPrivateIPv4(hostname) || isPrivateIPv6(hostname);
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
async function safeFetch(url, opts = {}, hops = 0) {
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
      const loc = r.headers.get('location');
      if (!loc || hops >= 4) return { ok: false, status: r.status, text: '', error: 'blocked: redirect limit or missing Location' };
      let nextUrl;
      try { nextUrl = new URL(loc, target.href).href; } catch { return { ok: false, status: r.status, text: '', error: 'blocked: invalid redirect target' }; }
      clearTimeout(t);
      return safeFetch(nextUrl, opts, hops + 1);
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
    return { ok: false, status: 0, text: '', error: String(e) };
  } finally {
    clearTimeout(t);
  }
}

/* ---------- extrage toate blocurile JSON-LD si aplatizeaza @type ---------- */
function extractJsonLd(html) {
  const blocks = [];
  const re = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html))) {
    try {
      const parsed = JSON.parse(m[1].trim());
      blocks.push(parsed);
    } catch { /* json-ld invalid, ignorat */ }
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
      if (k !== '@type' && typeof node[k] === 'object') walk(node[k]);
    }
  }
  blocks.forEach(walk);
  return { blocks, types, nodes };
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
function logToRegistry(ctx, targetUrl, type) {
  if (!ctx || !ctx.waitUntil) return;
  ctx.waitUntil(
    fetch('https://gdpr.aiventure.ro/registry/log', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ site: '3webobs', url: targetUrl, type: type || 'audit' }),
    }).catch(() => {})
  );
}

async function attemptSafeInvocation(origin, caps) {
  const list = caps && Array.isArray(caps.capabilities) ? caps.capabilities : [];
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

async function gatherEvidence(target) {
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

  const safeInvocation = await attemptSafeInvocation(origin, jsonBodies['capabilities.json']);

  const html = main.text || '';
  const ld = extractJsonLd(html);
  const imgs = [...html.matchAll(/<img\b[^>]*>/gi)].map(m => m[0]);
  const imgsWithAlt = imgs.filter(t => /alt=["'][^"']+["']/i.test(t)).length;
  const links = [...html.matchAll(/<a\b[^>]+href=["']([^"']+)["']/gi)].map(m => m[1]);
  const internalLinks = links.filter(h => h.startsWith('/') || h.includes(target.host)).length;
  const externalLinks = links.filter(h => /^https?:\/\//i.test(h) && !h.includes(target.host)).length;
  const wordCount = html.replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .split(/\s+/).filter(Boolean).length;

  return {
    target, mainOk: main.ok, status: main.status, html,
    robots: robots.ok ? robots.text : null,
    sitemap: sitemap.ok, sitemapText: sitemap.ok ? sitemap.text : '',
    llms: llms.ok ? llms.text : null,
    aitxt: aitxt.ok ? aitxt.text : null,
    jsonFiles, jsonBodies, safeInvocation,
    ldTypes: ld.types, ldNodes: ld.nodes,
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
    robotsBots: {
      gptbot: /GPTBot/i.test(robots.text || ''),
      claudebot: /ClaudeBot/i.test(robots.text || ''),
      googleExtended: /Google-Extended/i.test(robots.text || ''),
      perplexitybot: /PerplexityBot/i.test(robots.text || ''),
      ccbot: /CCBot/i.test(robots.text || ''),
      anyDisallowAll: /User-agent:\s*\*[\s\S]{0,40}Disallow:\s*\/\s*$/im.test(robots.text || ''),
    },
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
        Person: /<address[\s>]/i.test(txt) || /founder|author|written by/i.test(plain),
        HowTo: /step\s*\d|first,|then,|finally,/i.test(plain)
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
    const ok = !!(card && card.protocolVersion && card.url && Array.isArray(card.skills) && card.skills.length);
    return ok ? {status:'pass',score:95,method:`agent card valid structural; ${card.skills.length} skills`}
              : ev.jsonFiles['.well-known/agent-card.json'] ? {status:'fail',score:20,method:'agent card prezent dar incomplet/invalid'} : {status:'fail',score:0,method:'agent card lipseste'};
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
    if (!card || !/^https:\/\//i.test(card.url||'')) return {status:'fail',score:0,method:'niciun endpoint HTTPS declarat in agent card'};
    const si = ev.safeInvocation;
    return si && si.attempted && si.ok
      ? {status:'pass',score:95,method:`endpoint declarat ${card.url} confirmat reachable printr-o invocare reala, non-destructiva (HTTP ${si.status})`}
      : {status:'partial',score:60,method:`endpoint declarat ${card.url}; reachability operationala nu a putut fi confirmata printr-un safe-test`};
  }
  if (/Machine Protocol Response Valid/i.test(sig.n)) {
    const si = ev.safeInvocation;
    if (!si || !si.attempted) return {status:'na',method:'niciun capability declarat safe_to_invoke:true cu side_effects:"none" — invocare reala imposibila fara risc de efecte secundare'};
    return si.validRpc
      ? {status:'pass',score:90,method:`raspuns JSON-RPC 2.0 valid la invocarea reala a skill-ului "${si.skillId}" (HTTP ${si.status})`}
      : {status:'fail',score:10,method:`invocare esuata sau raspuns JSON-RPC invalid (HTTP ${si.status||'n/a'}${si.error?': '+si.error:''})`};
  }
  if (/Capability Invocable Under Declared Contract/i.test(sig.n)) {
    const si = ev.safeInvocation;
    if (!si || !si.attempted) return {status:'na',method:'niciun capability declarat safe_to_invoke:true cu side_effects:"none" — invocare reala imposibila fara risc de efecte secundare'};
    return si.ok && si.validRpc
      ? {status:'pass',score:95,method:`skill "${si.skillId}" invocat cu succes exact prin contractul declarat in capabilities.json (HTTP ${si.status})`}
      : {status:'fail',score:10,method:`invocarea skill-ului declarat drept safe_to_invoke a esuat`};
  }
  if (/Capability Execution Verified/i.test(sig.n)) {
    const si = ev.safeInvocation;
    if (!si || !si.attempted) return {status:'na',method:'niciun capability declarat safe_to_invoke:true cu side_effects:"none" — verificare executie imposibila fara risc de efecte secundare'};
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

  if (/\.json/i.test(n)) {
    const fname = (n.match(/([\w.-]+\.json)/i) || [])[1];
    if (fname && fname in ev.jsonFiles) return ev.jsonFiles[fname]
      ? { status: 'pass', score: 85, method: `/${fname} raspunde 200` }
      : { status: 'fail', score: 0, method: `/${fname} lipseste` };
  }

  if (/agent[- ]?card|A2A/i.test(n)) return ev.jsonFiles['.well-known/agent-card.json']
    ? { status: 'pass', score: 85, method: '.well-known/agent-card.json prezent' }
    : { status: 'fail', score: 0, method: '.well-known/agent-card.json lipseste' };

  if (/sitemap/i.test(n)) return ev.sitemap
    ? { status: 'pass', score: 80, method: 'sitemap.xml raspunde 200' }
    : { status: 'fail', score: 10, method: 'sitemap.xml lipseste sau eroare' };

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
  if (/proof\.json SHA-256|Cryptographic IP Proof|proof\.json IP Anchoring/i.test(n)) {
    const ok = F['proof.json'] || F['ai-proof.json'];
    return ok
      ? { status: 'pass', score: 90, method: 'manifest de integritate publicat (proof.json)' }
      : { status: 'fail', score: 0, method: 'niciun manifest de integritate publicat' };
  }

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
  /Author Experience and Expertise Evidence/i, /External Experience Expertise/i,
  /Backlink Authority/i, /Backlink Source Diversity/i, /Referring Domain Evidence/i,
  /Anchor Text Diversity/i, /Suspicious Backlink Risk/i,
  /Domain History and Independent Authority/i,
  /Google Business Profile/i, /Local Identity Citation/i,
  /Independent Organization Profile Presence/i,
  /People-Also-Ask Topic Coverage/i, /Public Social Presence/i,
  /Public Engagement Metrics/i, /Private Behavioral Analytics/i,
  /Organic Search CTR/i, /Search Console Access/i, /Private Search Index Coverage/i,
];
function externalOnly(n) { return EXTERNAL_ONLY.some(rx => rx.test(n)); }

function evaluate(ev, psi) {
  const scores = {};
  const signals = {};
  let totalTested = 0, totalNa = 0;

  for (const dim of Object.keys(SIG)) {
    signals[dim] = [];
    let sum = 0, count = 0;
    for (const sig of SIG[dim]) {
      const r = evalSignal(sig, ev, psi);
      signals[dim].push({ id: sig.id, n: sig.n, c: sig.c, w: sig.w, status: r.status, score: r.score ?? null, method: r.method });
      if (r.status !== 'na') { sum += r.score; count++; totalTested++; } else { totalNa++; }
    }
    scores[dim] = count ? Math.round(sum / count) : null;
  }

  const validDims = Object.values(scores).filter(v => v !== null);
  const global = validDims.length ? Math.round(validDims.reduce((a, b) => a + b, 0) / validDims.length) : 0;

  return { scores, signals, global, tested: totalTested, na: totalNa, totalSignals: totalTested + totalNa };
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
    critical: { title: 'Repara imediat', items: chunk(top, 0).map(s => s.n), impact: 'Cele mai grele FAIL-uri gasite, pondere mare', delta: '+ puncte in cateva zile' },
    important: { title: 'Urmatorul pas', items: chunk(top, 1).map(s => s.n), impact: 'FAIL-uri cu pondere medie', delta: '+ puncte in 30 zile' },
    optimize: { title: 'Optimizare fina', items: chunk(top, 2).map(s => s.n), impact: 'Ajustari fine', delta: '+ puncte in 90 zile' },
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
  if (!env.RATE_KV) return;
  const list = await env.RATE_KV.list({ prefix: 'sub:' });
  const now = Date.now();
  const intervalMs = { daily: 86400000, weekly: 7 * 86400000, monthly: 30 * 86400000 };
  for (const k of list.keys) {
    let sub;
    try { sub = JSON.parse(await env.RATE_KV.get(k.name)); } catch { continue; }
    if (!sub || sub.status === 'cancelled') continue;
    const last = sub.lastRunAt ? new Date(sub.lastRunAt).getTime() : 0;
    if ((now - last) < (intervalMs[sub.interval] || intervalMs.weekly)) continue;
    const target = normalizeUrl(sub.url);
    if (!target) continue;
    try {
      const ev = await gatherEvidence(target);
      if (!ev.mainOk) { sub.lastRunAt = new Date().toISOString(); sub.status = 'target_unreachable';
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
      if (changed && sub.notify) {
        if (/^https?:\/\//i.test(sub.notify)) {
          try {
            await fetch(sub.notify, { method: 'POST', headers: { 'content-type': 'application/json' },
              body: JSON.stringify({ subscriptionId: sub.id, url: sub.url, previousScore: prevScore,
                newScore, delta, observedAt: sub.lastRunAt }) });
          } catch {}
        }
        /* notify e email — retinut, dar trimiterea efectiva asteapta un provider de email legat la Worker */
      }
    } catch {}
  }
}

export default {
  async scheduled(event, env, ctx) {
    ctx.waitUntil(runScheduledObservations(env));
  },
  async fetch(request, env, ctx) {
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

    if (url.pathname === '/audit' && request.method === 'POST') {
      let body;
      try { body = await request.json(); } catch { return json({ error: 'invalid json' }, 400); }
      const target = normalizeUrl(extractUrlFromText(body.url));
      if (!target) return json({ error: 'invalid url' }, 400);

      const ev = await gatherEvidence(target);
      if (!ev.mainOk) return json({ error: 'unreachable', detail: `nu am putut accesa ${target.href}`, status: ev.status }, 200);

      const psi = body.pagespeed === false ? null : await fetchPageSpeed(target.href, env);
      const evalResult = evaluate(ev, psi);
      const report = { url: target.href, ...evalResult };
      report.plan = buildActionPlan(report);
      report.sources = { pagespeed: psi ? psi.source : 'unavailable' };
      report.observationId = 'obs_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
      logToRegistry(ctx, target.href, 'audit');

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

    if (url.pathname === '/lead' && request.method === 'POST') {
      let body;
      try { body = await request.json(); } catch { return json({ error: 'invalid json' }, 400); }
      if (!body.email) return json({ error: 'email required' }, 400);
      if (env.RATE_KV) {
        try { await env.RATE_KV.put(`lead:${Date.now()}:${body.email}`, JSON.stringify({ email: body.email, url: body.url || '', ts: new Date().toISOString() })); } catch {}
      }
      return json({ ok: true });
    }

    if (url.pathname === '/stats') {
      let count = 0;
      if (env.RATE_KV) { try { count = Number(await env.RATE_KV.get('audit_count') || 0); } catch {} }
      return json({ audits: count, version: '3.0', engine: 'evidence-based', signals: 167, external_sources: ['PageSpeed Insights (free)'], brand: '3webs', network: '5thElement.ai', a2a: '/a2a', agent_card: '/.well-known/agent-card.json' });
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

      /* tasks/get, tasks/cancel — backed by the same KV subscription record used by
         obs.permanent. These are the only long-lived "tasks" this Worker has: everything
         else (obs_one_shot, obs_diff, obs_explain, obs_catalogue) completes synchronously
         within message/send and has no separate task to look up afterwards. */
      if (rpc.method === 'tasks/get' || rpc.method === 'tasks/cancel') {
        const taskId = rpc.params && (rpc.params.id || rpc.params.taskId);
        if (!taskId) return rpcErr(-32602, 'Invalid params: id is required');
        if (!env.RATE_KV) return rpcErr(-32603, 'Internal error: task storage unavailable');
        let sub = null;
        try { sub = JSON.parse(await env.RATE_KV.get('sub:' + taskId)); } catch {}
        if (!sub) return rpcErr(-32001, 'Task not found', { id: taskId });
        const stateOf = (s) => s === 'active' ? 'working' : s === 'cancelled' ? 'canceled'
          : s === 'target_unreachable' ? 'failed' : s === 'registered' ? 'submitted' : 'unknown';
        if (rpc.method === 'tasks/cancel') {
          sub.status = 'cancelled';
          sub.cancelledAt = new Date().toISOString();
          try { await env.RATE_KV.put('sub:' + taskId, JSON.stringify(sub)); } catch {}
        }
        return json({ jsonrpc: '2.0', id, result: {
          id: sub.id, contextId: sub.id,
          status: { state: stateOf(sub.status), timestamp: sub.lastRunAt || sub.cancelledAt || sub.registeredAt },
          metadata: { url: sub.url, interval: sub.interval, lastScore: sub.lastScore ?? null, threshold: sub.threshold }
        } });
      }

      if (rpc.method !== 'message/send') return rpcErr(-32601,
        'Method not found: this Worker supports message/send, tasks/get and tasks/cancel. ' +
        'message/stream is intentionally not implemented — see capabilities.streaming:false in the agent card; every skill here completes synchronously within message/send, so there is nothing to stream.');

      const msg = rpc.params && rpc.params.message;
      const parts = (msg && msg.parts) || [];
      const dataPart = parts.find(p => p.kind === 'data' || p.type === 'data');
      const textPart = parts.find(p => p.kind === 'text' || p.type === 'text');
      const payload = (dataPart && (dataPart.data || dataPart.payload)) || {};
      const skill = payload.skill || (rpc.params && rpc.params.skill) || 'obs_one_shot';

      const reply = (obj) => json({
        jsonrpc: '2.0', id,
        result: {
          kind: 'message', role: 'agent',
          messageId: crypto.randomUUID(),
          parts: [{ kind: 'data', data: obj }]
        }
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
        logToRegistry(ctx, report.url, 'audit_a2a');
        if (env.RATE_KV) {
          try {
            const n = Number(await env.RATE_KV.get('audit_count') || 0) + 1;
            await env.RATE_KV.put('audit_count', String(n));
            // persist the full report so obs_diff / REST-diff can find this as a baseline later
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
          try { await env.RATE_KV.put('sub:' + cancelId, JSON.stringify(existing)); } catch {}
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

        if (env.RATE_KV) {
          try { await env.RATE_KV.put('sub:' + subId, JSON.stringify(sub)); } catch {}
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
      if (env.RATE_KV) { try { await env.RATE_KV.put('sub:' + subId, JSON.stringify(sub)); } catch {} }
      return json(sub);
    }

    return env.ASSETS ? env.ASSETS.fetch(request) : new Response('3webs OBS engine — 3webobs.com', { headers: CORS });
  }
};
