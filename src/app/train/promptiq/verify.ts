/**
 * Verification script — runs engine.ts logic on test prompts and prints results.
 * Run with: npx ts-node --esm src/app/train/promptiq/verify.ts
 * (or copy-paste into browser console after transpiling)
 */

// We can't import ES modules directly in ts-node without config, so we inline a lightweight version.

type TaskType = string;

/* ─── minimal task classifier (mirrors engine.ts logic) ─── */
function computeTaskScores(p: string): Record<string, number> {
  const scores: Record<string, number> = {
    'Coding': 0, 'Debugging': 0, 'Code Review': 0, 'SQL Generation': 0,
    'Summarization': 0, 'Classification': 0, 'Information Extraction': 0,
    'Translation': 0, 'Other': 1,
  };

  if (/\b(select|insert|update|delete|create table|join|where|group by)\b/.test(p)) scores['SQL Generation'] += 45;
  if (/\b(debug|find (the )?(bug|error)|not working|broken|failing|what.s wrong)\b/.test(p)) scores['Debugging'] += 40;
  if (/\b(review.*code|code review|refactor|critique)\b/.test(p)) scores['Code Review'] += 40;
  if (/\b(summarize|summary|tldr|condense|brief)\b/.test(p)) scores['Summarization'] += 35;
  if (/\b(translate|translation)\b/.test(p)) scores['Translation'] += 45;
  if (/\b(classify|categorize|sentiment)\b/.test(p)) scores['Classification'] += 30;

  // Information Extraction — requires BOTH verb AND source
  const extractVerb   = /\b(extract|pull out|retrieve|scrape)\b/.test(p);
  const extractSource = /\b(from (the |this )?(text|document|file|data|content|following|below|resume|email|article|page|pdf))\b/.test(p);
  if (extractVerb && extractSource) scores['Information Extraction'] += 45;
  if (/\b(named entity|ner|entity recognition)\b/.test(p)) scores['Information Extraction'] += 35;

  const codingVerbs     = (p.match(/\b(create|build|implement|write|develop|make|generate|code|program)\b/g) || []).length;
  const codingArtifacts = (p.match(/\b(website|web app|application|app|game|component|function|class|api|service|module|script|program|dashboard|landing page|form)\b/g) || []).length;
  const techLangs       = (p.match(/\b(html|css|javascript|js|typescript|python|java|react|vue|angular|node|php|ruby|go|rust)\b/g) || []).length;
  const fileExt         = /\.(html|css|js|ts|py|java|jsx|tsx)\b/.test(p) ? 20 : 0;
  const singleFile      = /\b(single (file|html|page)|index\.html|one file)\b/.test(p) ? 15 : 0;
  scores['Coding'] += codingVerbs * 8 + codingArtifacts * 12 + techLangs * 18 + fileExt + singleFile;

  return scores;
}

function classify(prompt: string): { task: string; confidence: number; alternates: string } {
  const p = prompt.toLowerCase();
  const raw = computeTaskScores(p);
  const entries = Object.entries(raw).filter(([,v]) => v > 0).sort(([,a],[,b]) => b - a);
  if (entries.length === 0 || entries[0][1] <= 1) return { task: 'Other', confidence: 0.55, alternates: '' };

  const top = entries[0];
  const second = entries[1];
  const gap = top[1] - (second ? second[1] : 0);
  const conf = Math.min(0.99, Math.max(0.60, 0.55 + (gap / top[1]) * 0.44));
  const alts = entries.slice(1, 3).filter(([,s]) => s >= top[1] * 0.35).map(([t]) => t).join(', ');

  return { task: top[0], confidence: parseFloat(conf.toFixed(2)), alternates: alts };
}

/* ─── minimal role detector ─── */
function detectRole(prompt: string): { present: boolean; evidence?: string } {
  const patterns: RegExp[] = [
    /you are (?:a |an |the )?(?:[\w][\w\s,()-]{2,70}?)(?=\.|,|\n|$)/i,
    /act as (?:a |an |the )?(?:[\w][\w\s,()-]{2,70}?)(?=\.|,|\n|$)/i,
    /behave (?:like|as) (?:a |an |the )?(?:[\w][\w\s,()-]{2,70}?)(?=\.|,|\n|$)/i,
    /assume the role of (?:[\w][\w\s,()-]{2,70}?)(?=\.|,|\n|$)/i,
    /you're (?:a |an |the )?(?:[\w][\w\s,()-]{2,70}?)(?=\.|,|\n|$)/i,
    /as (?:a |an )?(?:experienced|senior|expert|professional|skilled) [\w\s,()-]{2,60}?(?=\.|,|\n|$)/i,
  ];
  for (const re of patterns) {
    const m = prompt.match(re);
    if (m) return { present: true, evidence: m[0].trim() };
  }
  return { present: false };
}

/* ─── TEST SUITE ─── */

const tests = [
  {
    name: 'Tic-Tac-Toe game (with role)',
    prompt: 'You are a game developer. Create a simple Tic-Tac-Toe web game using HTML, CSS and JavaScript. Generate the entire application inside a single index.html file. The game must support: Two-player gameplay, Player turns, Win detection, Draw detection, Restart button, Responsive design',
    expectedTask: 'Coding',
    expectedRolePresent: true,
  },
  {
    name: 'Information extraction',
    prompt: 'Extract name, email, phone number and company from the following resume.',
    expectedTask: 'Information Extraction',
    expectedRolePresent: false,
  },
  {
    name: 'Summarization',
    prompt: 'Summarize this 20-page report in 300 words.',
    expectedTask: 'Summarization',
    expectedRolePresent: false,
  },
  {
    name: 'SQL query',
    prompt: 'Write a SQL query to find all users who signed up in the last 30 days and have made at least one purchase. Use the users and orders tables.',
    expectedTask: 'SQL Generation',
    expectedRolePresent: false,
  },
  {
    name: 'Debugging',
    prompt: 'Find the bug in this Java code and explain how to fix it.',
    expectedTask: 'Debugging',
    expectedRolePresent: false,
  },
  {
    name: 'Role: Act as',
    prompt: 'Act as a senior Python developer. Write a REST API with FastAPI that handles user authentication.',
    expectedTask: 'Coding',
    expectedRolePresent: true,
  },
  {
    name: 'Role: Assume the role',
    prompt: 'Assume the role of a cybersecurity analyst. Review this code for security vulnerabilities.',
    expectedTask: 'Code Review',
    expectedRolePresent: true,
  },
  {
    name: 'Translation',
    prompt: 'Translate the following English text to French.',
    expectedTask: 'Translation',
    expectedRolePresent: false,
  },
];

let passed = 0;
let failed = 0;

console.log('\n═══════════════════════════════════════════════════════');
console.log('  PromptIQ Engine Verification');
console.log('═══════════════════════════════════════════════════════\n');

for (const t of tests) {
  const c = classify(t.prompt);
  const r = detectRole(t.prompt);

  const taskOk = c.task === t.expectedTask;
  const roleOk = r.present === t.expectedRolePresent;
  const ok = taskOk && roleOk;

  if (ok) passed++;
  else failed++;

  console.log(`${ok ? '✅' : '❌'} ${t.name}`);
  console.log(`   Task: ${c.task} (expected: ${t.expectedTask}) ${taskOk ? '✓' : '✗'} · conf: ${Math.round(c.confidence * 100)}%${c.alternates ? ` · alts: ${c.alternates}` : ''}`);
  console.log(`   Role: ${r.present ? `DETECTED — "${r.evidence?.slice(0,50)}"` : 'not present'} (expected: ${t.expectedRolePresent ? 'present' : 'absent'}) ${roleOk ? '✓' : '✗'}`);
  console.log('');
}

console.log(`═══════════════════════════════════════════════════════`);
console.log(`  Results: ${passed}/${tests.length} passed, ${failed} failed`);
console.log(`═══════════════════════════════════════════════════════\n`);

if (failed > 0) process.exit(1);
