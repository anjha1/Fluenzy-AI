// Engine logic verification — mirrors the key patterns from engine.ts
// Run with: node src/app/train/promptiq/test-engine.js

function computeTaskScores(p) {
  const s = {
    Coding: 0, 'SQL Generation': 0, Debugging: 0, 'Code Review': 0,
    'Information Extraction': 0, Summarization: 0, Translation: 0,
    Classification: 0, RAG: 0, 'Data Analysis': 0, 'Content Generation': 0,
    'Structured Output': 0, 'Agentic Task': 0, 'Question Answering': 0,
    Research: 0, 'Customer Support': 0, Other: 1,
  };

  if (/\b(select|insert|update|delete|create table|join|where|group by)\b/.test(p)) s['SQL Generation'] += 45;
  if (/\b(debug|find (the )?(bug|error)|not working|broken|failing)\b/.test(p)) s['Debugging'] += 40;
  if (/\b(fix (this|the|my) (code|function|bug|error))\b/.test(p)) s['Debugging'] += 30;
  if (/\b(review.*code|code review|refactor|improve.*code|critique)\b/.test(p)) s['Code Review'] += 40;
  if (/\b(summarize|summarise|summary|tldr|tl;dr|condense|brief|abstract)\b/.test(p)) s['Summarization'] += 35;
  if (/\b(translate|translation|localiz)\b/.test(p)) s['Translation'] += 45;
  if (/\b(classify|categorize|sentiment)\b/.test(p)) s['Classification'] += 30;
  if (/\b(based on (the |this )?(following|provided|given) (context|document|information))\b/.test(p)) s['RAG'] += 50;
  if (/\b(customer support|helpdesk|ticket|complaint|refund|support agent)\b/.test(p)) s['Customer Support'] += 35;

  const extractVerb = /\b(extract|pull out|retrieve|scrape)\b/.test(p);
  const extractSrc  = /\b(from (the |this )?(text|document|file|data|following|below|resume|email|article|pdf|passage))\b/.test(p);
  if (extractVerb && extractSrc) s['Information Extraction'] += 45;
  if (/\b(named entity|ner|entity recognition)\b/.test(p)) s['Information Extraction'] += 35;
  // Only add minor extraction points when coding score is low
  if (s['Coding'] < 20 && extractVerb && /\b(name|email|phone|date|price)\b/.test(p)) s['Information Extraction'] += 15;

  const cv  = (p.match(/\b(create|build|implement|write|develop|make|generate|code|program)\b/g) || []).length;
  const ca  = (p.match(/\b(website|web app|webapp|application|app|game|component|function|api|endpoint|service|module|script|program|tool|bot|dashboard|landing page|form|calculator|timer|todo)\b/g) || []).length;
  const tl  = (p.match(/\b(html|css|javascript|js|typescript|ts|python|java|react|vue|angular|node|nodejs|php|ruby|go|rust|tailwind|bootstrap|svelte|nextjs)\b/g) || []).length;
  const fe  = /\.(html|css|js|ts|py|java|jsx|tsx|php|rb|go|rs)\b/.test(p) ? 20 : 0;
  const sf  = /\b(single (file|html|page)|index\.html|one file|self-contained)\b/.test(p) ? 15 : 0;
  s['Coding'] += cv * 8 + ca * 12 + tl * 18 + fe + sf;

  return s;
}

function classify(prompt) {
  const p   = prompt.toLowerCase();
  const raw = computeTaskScores(p);
  const entries = Object.entries(raw).filter(([, v]) => v > 0).sort(([, a], [, b]) => b - a);
  if (!entries.length || entries[0][1] <= 1) return { task: 'Other', conf: 0.55 };
  const top = entries[0];
  const sec = entries[1] ? entries[1][1] : 0;
  const gap = top[1] - sec;
  const conf = Math.min(0.99, Math.max(0.60, 0.55 + (gap / top[1]) * 0.44));
  return { task: top[0], conf: +conf.toFixed(2), raw: top[1] };
}

function detectRole(prompt) {
  const patterns = [
    /you are (?:a |an |the )?(?:[\w][\w\s,()-]{2,70}?)(?=\.|,|\n|$)/i,
    /act as (?:a |an |the )?(?:[\w][\w\s,()-]{2,70}?)(?=\.|,|\n|$)/i,
    /behave (?:like|as) (?:a |an |the )?(?:[\w][\w\s,()-]{2,70}?)(?=\.|,|\n|$)/i,
    /assume the role of (?:[\w][\w\s,()-]{2,70}?)(?=\.|,|\n|$)/i,
    /you're (?:a |an |the )?(?:[\w][\w\s,()-]{2,70}?)(?=\.|,|\n|$)/i,
    /as (?:a |an )?(?:experienced|senior|expert|professional|skilled|certified|veteran) [\w\s\/,()-]{2,60}?(?=[.,;:])/i,
  ];
  for (const re of patterns) {
    const m = prompt.match(re);
    if (m) return m[0].trim();
  }
  return null;
}

function detectOutput(prompt) {
  const patterns = [
    /\b(return|output|produce|generate|respond with)\s+(?:a |an |the )?(?:complete|full|working|valid|executable)?\s*(json|html|markdown|code|list|function|class|script|program|file|page|application)\b/i,
    /\b(single (file|html|page)|complete (application|program|code)|entire (application|file))\b/i,
    /\b(json (object|array|schema)|valid json|structured (output|response))\b/i,
    /\b(return (only|just)(?: the)? (code|json|html|function|result|output))\b/i,
    /\b(only (return|output|provide)(?: the)? (code|json|html|result))\b/i,
    /\b(fully (working|functional|complete|implemented)|not (pseudocode|placeholders?|incomplete))\b/i,
    /\b(generate the (entire|complete|whole|full) (application|code|file|implementation))\b/i,
    /\b(the (output|result|response) (should|must|will) (be|contain|include))\b/i,
  ];
  for (const re of patterns) { if (re.test(prompt)) return true; }
  return false;
}

// ─── Test Cases ───────────────────────────────────────────────────────────────

const TESTS = [
  // Task classification
  {
    group: 'Task Classification',
    name:  'Tic-Tac-Toe game → Coding',
    prompt:'You are a game developer. Create a simple Tic-Tac-Toe web game using HTML, CSS and JavaScript. Generate the entire application inside a single index.html file.',
    check: r => r.task === 'Coding',
    desc:  r => `task=${r.task} (score=${r.raw}) conf=${r.conf}`,
  },
  {
    group: 'Task Classification',
    name:  'Extract from resume → Information Extraction',
    prompt:'Extract name, email, phone number and company from the following resume.',
    check: r => r.task === 'Information Extraction',
    desc:  r => `task=${r.task}`,
  },
  {
    group: 'Task Classification',
    name:  'Summarize report → Summarization',
    prompt:'Summarize this 20-page report in 300 words.',
    check: r => r.task === 'Summarization',
    desc:  r => `task=${r.task}`,
  },
  {
    group: 'Task Classification',
    name:  'Find bug in Java → Debugging',
    prompt:'Find the bug in this Java code and explain how to fix it.',
    check: r => r.task === 'Debugging',
    desc:  r => `task=${r.task}`,
  },
  {
    group: 'Task Classification',
    name:  'SQL SELECT query → SQL Generation',
    prompt:'Write a SQL SELECT query to find all users who joined in the last 30 days from the users table.',
    check: r => r.task === 'SQL Generation',
    desc:  r => `task=${r.task}`,
  },
  {
    group: 'Task Classification',
    name:  'Translate to French → Translation',
    prompt:'Translate the following English text to French.',
    check: r => r.task === 'Translation',
    desc:  r => `task=${r.task}`,
  },
  {
    group: 'Task Classification',
    name:  'Hospital website → Coding (not Extraction)',
    prompt:'You are a senior web developer. Build a hospital management website with appointment booking using React and TypeScript.',
    check: r => r.task === 'Coding',
    desc:  r => `task=${r.task}`,
  },
  {
    group: 'Task Classification',
    name:  'Dashboard + CSV extracts → Coding (Coding wins over Extraction)',
    prompt:'Create a dashboard that shows sales data and extracts key metrics from uploaded CSV files.',
    check: r => r.task === 'Coding',
    desc:  r => `task=${r.task} raw=${r.raw}`,
  },
  // Role detection
  {
    group: 'Role Detection',
    name:  '"You are a game developer" → detected',
    prompt:'You are a game developer. Create a Tic-Tac-Toe game.',
    check: () => detectRole('You are a game developer. Create a Tic-Tac-Toe game.') !== null,
    desc:  () => `evidence: "${detectRole('You are a game developer. Create a Tic-Tac-Toe game.')}"`,
  },
  {
    group: 'Role Detection',
    name:  '"Act as a database expert" → detected',
    prompt:'Act as a database expert. Write a SQL query.',
    check: () => detectRole('Act as a database expert. Write a SQL query.') !== null,
    desc:  () => `evidence: "${detectRole('Act as a database expert. Write a SQL query.')}"`,
  },
  {
    group: 'Role Detection',
    name:  '"Assume the role of a cybersecurity analyst" → detected',
    prompt:'Assume the role of a cybersecurity analyst. Review this code for security vulnerabilities.',
    check: () => detectRole('Assume the role of a cybersecurity analyst. Review this code for security vulnerabilities.') !== null,
    desc:  () => `evidence: "${detectRole('Assume the role of a cybersecurity analyst. Review this code for security vulnerabilities.')}"`,
  },
  {
    group: 'Role Detection',
    name:  '"As an experienced UI/UX designer" → detected',
    prompt:'As an experienced UI/UX designer, review this wireframe.',
    check: () => detectRole('As an experienced UI/UX designer, review this wireframe.') !== null,
    desc:  () => `evidence: "${detectRole('As an experienced UI/UX designer, review this wireframe.')}"`,
  },
  {
    group: 'Role Detection',
    name:  'No role in simple extraction prompt → not detected',
    prompt:'Extract name, email from the following resume.',
    check: () => detectRole('Extract name, email from the following resume.') === null,
    desc:  () => `result: ${detectRole('Extract name, email from the following resume.')}`,
  },
  // Output detection
  {
    group: 'Output Detection',
    name:  '"Generate entire application inside single index.html" → detected',
    prompt:'Generate the entire application inside a single index.html file. The final output must contain fully working code.',
    check: () => detectOutput('Generate the entire application inside a single index.html file. The final output must contain fully working code.'),
    desc:  () => 'output pattern matched',
  },
  {
    group: 'Output Detection',
    name:  '"Return only the code" → detected',
    prompt:'Return only the code. No explanations.',
    check: () => detectOutput('Return only the code. No explanations.'),
    desc:  () => detectOutput('Return only the code. No explanations.') ? 'output pattern matched' : 'FAILED — no match',
  },
  {
    group: 'Output Detection',
    name:  'Vague prompt → output NOT detected',
    prompt:'Do something with data.',
    check: () => !detectOutput('Do something with data.'),
    desc:  () => 'no output pattern',
  },
];

// ─── Runner ───────────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;
let currentGroup = '';

console.log('\n' + '═'.repeat(60));
console.log('  PromptIQ Engine Test Suite');
console.log('═'.repeat(60) + '\n');

for (const t of TESTS) {
  if (t.group !== currentGroup) {
    currentGroup = t.group;
    console.log(`\n── ${currentGroup} ──`);
  }

  // For task tests, classify; for others, pass dummy
  const result = t.group === 'Task Classification' ? classify(t.prompt) : {};
  const ok = t.check(result);

  if (ok) passed++;
  else     failed++;

  const icon = ok ? '✅' : '❌';
  console.log(`${icon} ${t.name}`);
  console.log(`   ${t.desc(result)}`);
}

console.log('\n' + '─'.repeat(60));
console.log(`  ${passed}/${TESTS.length} passed   ${failed > 0 ? failed + ' FAILED' : '(all green)'}`);
console.log('─'.repeat(60) + '\n');

process.exit(failed > 0 ? 1 : 0);
