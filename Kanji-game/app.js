const STROKE_BASE = 'https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji/';
const STROKE_CACHE = 'kotoba-kanjivg-strokes-v1';
const KANA_DATA = window.KANA_MATCH_DATA;
const state = {
  mode: 'vocabulary', level: 'all', direction: 'word-reading', kanaMode: 'mixed', vocab: [], kanji: [],
  current: null, correct: 0, attempted: 0, streak: 0, missWeight: new Map(), history: [],
  questionToken: 0, strokePaths: [], strokeIndex: 0
};
const $ = (selector) => document.querySelector(selector);
const promptDisplay = $('#promptDisplay');
const answerInput = $('#answerInput');
const feedback = $('#feedback');
const historyList = $('#historyList');

const ROMAJI_KANA = new Map();
const ROMAJI_ROWS = {
  '': ['あ', 'い', 'う', 'え', 'お'],
  k: ['か', 'き', 'く', 'け', 'こ'],
  s: ['さ', 'し', 'す', 'せ', 'そ'],
  t: ['た', 'ち', 'つ', 'て', 'と'],
  n: ['な', 'に', 'ぬ', 'ね', 'の'],
  h: ['は', 'ひ', 'ふ', 'へ', 'ほ'],
  m: ['ま', 'み', 'む', 'め', 'も'],
  w: ['わ', 'ゐ', 'う', 'ゑ', 'を'],
  r: ['ら', 'り', 'る', 'れ', 'ろ'],
  g: ['が', 'ぎ', 'ぐ', 'げ', 'ご'],
  z: ['ざ', 'じ', 'ず', 'ぜ', 'ぞ'],
  d: ['だ', 'ぢ', 'づ', 'で', 'ど'],
  b: ['ば', 'び', 'ぶ', 'べ', 'ぼ'],
  p: ['ぱ', 'ぴ', 'ぷ', 'ぺ', 'ぽ']
};
const ROMAJI_VOWELS = ['a', 'i', 'u', 'e', 'o'];
Object.entries(ROMAJI_ROWS).forEach(([consonant, kana]) => {
  kana.forEach((character, index) => ROMAJI_KANA.set(`${consonant}${ROMAJI_VOWELS[index]}`, character));
});
[['ya', 'や'], ['yu', 'ゆ'], ['yo', 'よ']].forEach(([romaji, kana]) => ROMAJI_KANA.set(romaji, kana));
[
  ['tokyo', 'とうきょう'], ['kyoto', 'きょうと'],
  ['shi', 'し'], ['si', 'し'], ['chi', 'ち'], ['ti', 'ち'], ['tsu', 'つ'], ['tu', 'つ'],
  ['fu', 'ふ'], ['hu', 'ふ'], ['ji', 'じ'], ['zi', 'じ'], ['wo', 'を'], ['nn', 'ん'],
  ['wi', 'うぃ'], ['we', 'うぇ'], ['vu', 'ゔ'], ['va', 'ゔぁ'], ['vi', 'ゔぃ'], ['ve', 'ゔぇ'], ['vo', 'ゔぉ'],
  ['kwa', 'くぁ'], ['kwi', 'くぃ'], ['kwe', 'くぇ'], ['kwo', 'くぉ'],
  ['sye', 'しぇ'], ['she', 'しぇ'], ['che', 'ちぇ'], ['je', 'じぇ'], ['jye', 'じぇ'],
  ['tsa', 'つぁ'], ['tsi', 'つぃ'], ['tse', 'つぇ'], ['tso', 'つぉ'],
  ['sha', 'しゃ'], ['shu', 'しゅ'], ['sho', 'しょ'], ['sya', 'しゃ'], ['syu', 'しゅ'], ['syo', 'しょ'],
  ['cha', 'ちゃ'], ['chu', 'ちゅ'], ['cho', 'ちょ'], ['tya', 'ちゃ'], ['tyu', 'ちゅ'], ['tyo', 'ちょ'],
  ['ja', 'じゃ'], ['ju', 'じゅ'], ['jo', 'じょ'], ['jya', 'じゃ'], ['jyu', 'じゅ'], ['jyo', 'じょ'],
  ['nya', 'にゃ'], ['nyu', 'にゅ'], ['nyo', 'にょ'], ['hya', 'ひゃ'], ['hyu', 'ひゅ'], ['hyo', 'ひょ'],
  ['mya', 'みゃ'], ['myu', 'みゅ'], ['myo', 'みょ'], ['rya', 'りゃ'], ['ryu', 'りゅ'], ['ryo', 'りょ'],
  ['gya', 'ぎゃ'], ['gyu', 'ぎゅ'], ['gyo', 'ぎょ'], ['bya', 'びゃ'], ['byu', 'びゅ'], ['byo', 'びょ'],
  ['pya', 'ぴゃ'], ['pyu', 'ぴゅ'], ['pyo', 'ぴょ'], ['kya', 'きゃ'], ['kyu', 'きゅ'], ['kyo', 'きょ'],
  ['dya', 'ぢゃ'], ['dyu', 'ぢゅ'], ['dyo', 'ぢょ'], ['tha', 'てゃ'], ['thi', 'てぃ'], ['thu', 'てゅ'], ['the', 'てぇ'], ['tho', 'てょ'],
  ['xya', 'ゃ'], ['xyu', 'ゅ'], ['xyo', 'ょ'], ['lya', 'ゃ'], ['lyu', 'ゅ'], ['lyo', 'ょ'],
  ['xtu', 'っ'], ['xtsu', 'っ'], ['ltu', 'っ'], ['ltsu', 'っ'], ['xwa', 'ゎ'], ['lwa', 'ゎ']
].forEach(([romaji, kana]) => ROMAJI_KANA.set(romaji, kana));
const ROMAJI_KEYS = [...ROMAJI_KANA.keys()].sort((a, b) => b.length - a.length);
const LONG_VOWEL_BY_KANA = new Map();
[
  ['あ', 'あかさたなはまやらわがざだばぱぁゃゎ'],
  ['い', 'いきしちにひみりぎじぢびぴゐ'],
  ['う', 'うくすつぬふむゆるぐずづぶぷゔ'],
  ['え', 'えけせてねへめれげぜでべぺゑぇ'],
  ['お', 'おこそとのほもよろごぞどぼぽをぉ']
].forEach(([vowel, kana]) => [...kana].forEach((character) => LONG_VOWEL_BY_KANA.set(character, vowel)));

function normalizeJapaneseAnswer(value) {
  let input = value.trim().normalize('NFKC').toLowerCase()
    .replace(/[ā]/g, 'aa').replace(/[ī]/g, 'ii').replace(/[ū]/g, 'uu')
    .replace(/[ē]/g, 'ee').replace(/[ō]/g, 'ou');
  let output = '';
  for (let index = 0; index < input.length;) {
    const character = input[index];
    const code = character.codePointAt(0);
    if (code >= 0x30a1 && code <= 0x30f6) {
      output += String.fromCodePoint(code - 0x60);
      index += character.length;
      continue;
    }
    if (/[a-z]/.test(character)) {
      if (input.startsWith('tch', index)) {
        output += 'っ';
        index += 1;
        continue;
      }
      if (character === 'n' && input[index + 1] === "'") {
        output += 'ん';
        index += 2;
        continue;
      }
      if (character === 'n' && input[index + 1] === 'n') {
        const following = input[index + 2] || '';
        if (!following || !/[aiueoy]/.test(following)) {
          output += 'ん';
          index += 2;
          continue;
        }
        output += 'ん';
        index += 1;
        continue;
      }
      if (character === 'n' && (!input[index + 1] || !/[aiueoy]/.test(input[index + 1]))) {
        output += 'ん';
        index += 1;
        continue;
      }
      if (character !== 'n' && input[index + 1] === character && !/[aiueo]/.test(character)) {
        output += 'っ';
        index += 1;
        continue;
      }
      const match = ROMAJI_KEYS.find((romaji) => input.startsWith(romaji, index));
      if (match) {
        output += ROMAJI_KANA.get(match);
        index += match.length;
        continue;
      }
      output += character;
      index += 1;
      continue;
    }
    if (/[\s\-‐‑‒–—.,，。・:;!?！？'"“”‘’()[\]{}（）「」『』]/u.test(character)) {
      index += character.length;
      continue;
    }
    output += character;
    index += character.length;
  }
  return output
    .replace(/おう/g, 'おお')
    .replace(/えい/g, 'ええ')
    .replace(/こんにちわ/g, 'こんにちは')
    .replace(/こんばんわ/g, 'こんばんは')
    .replace(/([ぁ-ゖ])ー/g, (mark, previous) => `${previous}${LONG_VOWEL_BY_KANA.get(previous) || 'ー'}`);
}

function normalize(value) {
  return normalizeJapaneseAnswer(value);
}
function setFeedback(message, tone = 'neutral') {
  feedback.textContent = message;
  feedback.className = `feedback ${tone}`;
}
function renderStats() {
  $('#correctValue').textContent = String(state.correct);
  $('#attemptedValue').textContent = String(state.attempted);
  $('#accuracyValue').textContent = `${state.attempted ? Math.round(state.correct / state.attempted * 100) : 0}%`;
  $('#sessionSummary').textContent = `${state.correct} / ${state.attempted} right`;
  $('#streakValue').textContent = `Streak: ${state.streak}`;
}
function renderHistory() {
  historyList.replaceChildren();
  state.history.slice(0, 8).forEach((entry) => {
    const row = document.createElement('li');
    row.className = entry.type;
    const prompt = document.createElement('span');
    prompt.className = 'history-char';
    prompt.textContent = entry.prompt;
    const answer = document.createElement('span');
    answer.className = 'history-answer';
    answer.textContent = entry.answer;
    row.append(prompt, answer);
    historyList.append(row);
  });
}
function getPool() {
  if (state.mode === 'kana-match') return KANA_DATA[state.kanaMode] || KANA_DATA.mixed;
  const pool = state.mode === 'vocabulary' ? state.vocab : state.kanji;
  return state.level === 'all' ? pool : pool.filter((entry) => entry.level === Number(state.level));
}
function choose(pool) {
  if (!pool.length) return null;
  const entries = pool.map((item) => ({ item, weight: 1 + 4 * (state.missWeight.get(item.id) || 0) }));
  let roll = Math.random() * entries.reduce((total, entry) => total + entry.weight, 0);
  for (const entry of entries) {
    roll -= entry.weight;
    if (roll <= 0) return entry.item;
  }
  return entries[entries.length - 1].item;
}
function svgUrl(character) {
  return `${STROKE_BASE}${character.codePointAt(0).toString(16).padStart(5, '0')}.svg`;
}
function parseSvg(source) {
  const svgSource = source.replace(/<!DOCTYPE[\s\S]*?\]>\s*/i, '');
  const parsed = new DOMParser().parseFromString(svgSource, 'image/svg+xml');
  if (parsed.querySelector('parsererror')) throw new Error('Invalid stroke SVG');
  const svg = document.importNode(parsed.documentElement, true);
  svg.removeAttribute('width');
  svg.removeAttribute('height');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', 'Kanji with numbered stroke order');
  svg.classList.add('kanjivg-diagram');
  const originalPaths = [...svg.querySelectorAll('g[id^="kvg:StrokePaths_"] path[id]')]
    .filter((path) => /-s\d+$/.test(path.id))
    .sort((a, b) => Number(a.id.match(/-s(\d+)$/)[1]) - Number(b.id.match(/-s(\d+)$/)[1]));
  if (!originalPaths.length) throw new Error('Stroke paths not found');
  originalPaths.forEach((path, index) => {
    path.dataset.stroke = String(index);
  });
  svg.querySelectorAll('g[id^="kvg:StrokeNumbers_"] text').forEach((number) => {
    number.setAttribute('fill', '#75685d');
  });
  return { svg, paths: originalPaths, count: originalPaths.length };
}
async function loadSvg(character) {
  const url = svgUrl(character);
  const cache = await caches.open(STROKE_CACHE);
  let response = await cache.match(url);
  if (!response) {
    response = await fetch(url);
    if (response.ok) await cache.put(url, response.clone());
  }
  if (!response.ok) throw new Error(`Diagram unavailable (${response.status})`);
  return parseSvg(await response.text());
}
function showPrompt(item) {
  $('#nextQuestionButton').hidden = true;
  $('#answerDetails').hidden = true;
  $('#answerDetails').replaceChildren();
  const isKana = state.mode === 'kana-match';
  $('#levelBadge').textContent = isKana ? state.kanaMode.toUpperCase() : state.level === 'all' ? 'ALL LEVELS' : `JLPT N${state.level}`;
  $('#speakerLabel').textContent = isKana ? 'KANA DESK' : state.mode === 'vocabulary' ? 'VOCABULARY DESK' : 'KANJI DESK';
  $('#fontBank').hidden = !isKana;
  promptDisplay.replaceChildren();
  $('#questionLabel').textContent = isKana
    ? 'Type the pronunciation'
    : state.mode === 'vocabulary'
      ? state.direction === 'word-reading' ? 'Type the reading (kana or romaji)' : 'Type the Japanese word'
      : 'Type the kanji shown';
  $('#answerLabel').textContent = isKana
    ? 'Romanized kana answer'
    : state.mode === 'vocabulary'
      ? state.direction === 'word-reading' ? 'Kana reading answer' : 'Japanese word answer'
      : 'Kanji character answer';
  answerInput.placeholder = isKana
    ? 'Example: ka or jyu'
    : state.mode === 'vocabulary'
      ? state.direction === 'word-reading' ? 'Type the reading in kana or romaji' : 'Type the word in Japanese'
      : 'Type the kanji character';
  answerInput.setAttribute('inputmode', isKana ? 'latin' : 'text');
  if (isKana) {
    $('#fontBank').querySelectorAll('.font-sample').forEach((sample) => { sample.textContent = item.char; });
    promptDisplay.classList.add('kana-display');
    promptDisplay.textContent = item.char;
    applyKanaFontVariation();
  } else if (state.mode === 'vocabulary') {
    promptDisplay.style.fontFamily = '';
    promptDisplay.classList.remove('kana-display');
    promptDisplay.textContent = state.direction === 'word-reading' ? item.word : preferredReading(item);
  } else {
    promptDisplay.style.fontFamily = '';
    promptDisplay.classList.remove('kana-display');
    promptDisplay.textContent = item.char;
  }
}
function applyKanaFontVariation() {
  const fonts = [
    '"Hiragino Sans", "Yu Gothic", "Meiryo", "MS Gothic", sans-serif',
    '"MS Mincho", "Yu Mincho", serif',
    '"Segoe UI", "Noto Sans JP", sans-serif',
    '"Yu Gothic", "Meiryo", sans-serif'
  ];
  promptDisplay.style.fontFamily = fonts[Math.floor(Math.random() * fonts.length)];
}
async function nextQuestion() {
  state.questionToken += 1;
  const item = choose(getPool());
  state.current = item;
  answerInput.value = '';
  if (!item) {
    promptDisplay.textContent = '—';
    $('#questionLabel').textContent = 'No entries for this level.';
    setFeedback('Choose another JLPT level.', 'neutral');
    return;
  }
  showPrompt(item);
  setFeedback('Type your answer to begin.', 'neutral');
  answerInput.focus({ preventScroll: true });
}
function preferredReading(item) {
  return item.match_type === 'exact' || !item.dictionary_readings?.length ? item.reading : item.dictionary_readings[0];
}
function correctAnswers(item) {
  if (state.mode === 'kana-match') return item.accepts;
  if (state.mode === 'kanji') return [item.char];
  if (state.direction === 'reading-word') return [item.word];
  return [...new Set([item.reading, ...(item.dictionary_readings || [])].filter(Boolean))];
}
function questionText(item) {
  if (state.mode === 'kana-match') return item.char;
  if (state.mode === 'kanji') return item.char;
  return state.direction === 'word-reading' ? item.word : preferredReading(item);
}
function appendDetailGroup(parent, label, values) {
  if (!values?.length) return;
  const group = document.createElement('section');
  group.className = 'detail-group';
  const title = document.createElement('h4');
  title.textContent = label;
  const list = document.createElement('ul');
  values.forEach((value) => {
    const entry = document.createElement('li');
    entry.textContent = value;
    list.append(entry);
  });
  group.append(title, list);
  parent.append(group);
}
function renderAnswerDetails(item) {
  const panel = $('#answerDetails');
  panel.replaceChildren();
  if (state.mode === 'kana-match') {
    panel.hidden = true;
    return;
  } else if (state.mode === 'kanji') {
    renderKanjiDetails(item, panel);
  } else {
    const meanings = item.meanings || [];
    if (meanings.length) appendDetailGroup(panel, 'English meaning', meanings);
    else {
      const missing = document.createElement('p');
      missing.className = 'detail-missing';
      missing.textContent = 'No matching English dictionary entry was found for this source item.';
      panel.append(missing);
    }
    if (item.parts_of_speech?.length) {
      const tags = document.createElement('p');
      tags.className = 'detail-meta';
      tags.textContent = `Dictionary tags: ${item.parts_of_speech.join(' · ')}`;
      panel.append(tags);
    }
    if (item.match_type && item.match_type !== 'exact' && item.dictionary_readings?.length) {
      const note = document.createElement('p');
      note.className = 'detail-meta';
      note.textContent = item.match_type === 'kana-reading-fallback'
        ? 'English gloss matched by kana reading; JMdict may list the entry under a kanji spelling.'
        : `JLPT list reading: ${item.reading} · dictionary reading${item.dictionary_readings.length > 1 ? 's' : ''}: ${item.dictionary_readings.join('、')}`;
      panel.append(note);
    }
  }
  panel.hidden = !panel.childElementCount;
}
function renderKanjiDetails(item, parent) {
  const detail = item.dictionary;
  if (!detail) return;
  appendDetailGroup(parent, 'Meaning', detail.meanings);
  appendDetailGroup(parent, 'On readings', detail.on_readings);
  appendDetailGroup(parent, 'Kun readings', detail.kun_readings);
  if (detail.stroke_count) {
    const count = document.createElement('p');
    count.className = 'detail-meta';
    count.textContent = `${detail.stroke_count} strokes · JLPT N${item.level}`;
    parent.append(count);
  }
}
function submit(skipped = false) {
  const item = state.current;
  if (!item) return;
  const answers = correctAnswers(item);
  const answer = state.mode === 'kana-match'
    ? item.romaji
    : state.mode === 'vocabulary' && state.direction === 'word-reading' ? preferredReading(item) : answers[0];
  const isCorrect = !skipped && answers.some((candidate) => normalize(answerInput.value) === normalize(candidate));
  state.attempted += 1;
  if (isCorrect) {
    state.correct += 1;
    state.streak += 1;
    state.missWeight.set(item.id, Math.max(0, (state.missWeight.get(item.id) || 0) - 1));
    setFeedback(`Correct — ${item.char}${state.mode === 'kana-match' ? ` = ${item.romaji}` : state.mode === 'kanji' ? ` · N${item.level}` : ` = ${answer}`}`, 'success');
  } else {
    state.streak = 0;
    state.missWeight.set(item.id, (state.missWeight.get(item.id) || 0) + (skipped ? 2 : 3));
    setFeedback(`${skipped ? 'Skipped' : 'Not quite'} — ${item.char}${state.mode === 'kana-match' ? ` is ${item.romaji}` : state.mode === 'kanji' ? ` · N${item.level}` : ` = ${answer}`}`, 'error');
  }
  renderAnswerDetails(item);
  $('#nextQuestionButton').hidden = false;
  $('#nextQuestionButton').focus({ preventScroll: true });
  state.history.unshift({ prompt: questionText(item), answer: `${isCorrect ? '✓' : skipped ? '↷' : '✕'} ${answer}`, type: isCorrect ? 'correct' : 'incorrect' });
  renderHistory();
  renderStats();
}
function changeMode(mode) {
  state.mode = mode;
  const isStroke = mode === 'stroke';
  const isKana = mode === 'kana-match';
  document.body.classList.toggle('kana-match-theme', isKana);
  $('.brand-copy h1').textContent = isKana ? 'Kana Match' : '言葉の書庫';
  $('.brand-copy .eyebrow').textContent = isKana ? 'OFFLINE STUDY · KANA' : 'STUDY ROOM · RECORD 01';
  $('.brand-subtitle').innerHTML = isKana ? 'HIRAGANA <span>+</span> KATAKANA PRACTICE' : 'KOTOBA ARCHIVE <span>—</span> Japanese study';
  $('#quizControls').hidden = isStroke;
  $('#scorePanel').hidden = isStroke;
  $('#quizPanel').hidden = isStroke;
  $('#answerForm').hidden = isStroke;
  $('#feedback').hidden = isStroke;
  $('#sessionPanel').hidden = isStroke;
  $('#strokePanel').hidden = !isStroke;
  $('#kanaControls').hidden = !isKana;
  $('#levelSelect').closest('.control-label').hidden = isKana;
  $('#kanaControls').querySelectorAll('.kana-set-button').forEach((button) => {
    button.classList.toggle('active', button.dataset.kanaMode === state.kanaMode);
  });
  $('#directionControl').hidden = mode !== 'vocabulary';
  document.querySelectorAll('.mode-button').forEach((button) => button.classList.toggle('active', button.dataset.mode === mode));
  if (isStroke) renderKanji();
  else nextQuestion();
}
function buildVocabulary(data) {
  const list = [];
  let index = 0;
  for (const [word, rows] of Object.entries(data)) {
    for (const row of rows) {
      if (row.reading && Number.isInteger(row.level) && row.level >= 1 && row.level <= 5) {
        list.push({ id: `v${index++}`, word, reading: row.reading, level: row.level, meanings: row.meanings || [], parts_of_speech: row.parts_of_speech || [], dictionary_readings: row.dictionary_readings || [], match_type: row.match_type || 'missing' });
      }
    }
  }
  return list;
}
function buildKanji(data, details) {
  return Object.entries(data)
    .filter(([character, level]) => Array.from(character).length === 1 && Number.isInteger(level) && level >= 1 && level <= 5)
    .map(([character, level]) => ({ id: `k-${character}`, char: character, level, dictionary: details[character] || null }));
}
async function loadData() {
  try {
    const [vocabResponse, kanjiResponse, detailsResponse] = await Promise.all([fetch('./JSON/JLPT_vocab_enriched.json'), fetch('./JSON/JLPT_kanji_ALL.json'), fetch('./JSON/JLPT_kanji_details.json')]);
    if (!vocabResponse.ok || !kanjiResponse.ok || !detailsResponse.ok) throw new Error('Could not read the enriched JLPT JSON data.');
    const [vocabData, kanjiData, details] = await Promise.all([vocabResponse.json(), kanjiResponse.json(), detailsResponse.json()]);
    state.vocab = buildVocabulary(vocabData);
    state.kanji = buildKanji(kanjiData, details);
    setFeedback(`Loaded ${state.vocab.length.toLocaleString()} vocabulary entries and ${state.kanji.length.toLocaleString()} kanji.`, 'success');
    verifyOfflineData();
    await nextQuestion();
    renderKanji();
  } catch (error) {
    console.error(error);
    setFeedback('Could not load the JSON files in Kanji-game/JSON. Reload while online and verify both files are present.', 'error');
  }
}
async function verifyOfflineData() {
  const status = $('#offlineStatus');
  if (!('serviceWorker' in navigator) || !('caches' in window)) {
    status.textContent = 'OFFLINE INSTALL NEEDS HTTPS';
    status.classList.add('offline-warning');
    return;
  }
  try {
    await navigator.serviceWorker.ready;
    const requiredFiles = [
      './index.html', './style.css?v=14', './kana-data.js?v=2', './app.js?v=14',
      './JSON/JLPT_vocab_ALL.json', './JSON/JLPT_kanji_ALL.json',
      './JSON/JLPT_vocab_enriched.json', './JSON/JLPT_kanji_details.json'
    ];
    const cached = await Promise.all(requiredFiles.map(async (path) =>
      Boolean(await caches.match(new URL(path, document.baseURI).href))
    ));
    const missing = requiredFiles.filter((_, index) => !cached[index]);
    if (missing.length) {
      status.textContent = `OFFLINE CACHE INCOMPLETE · ${missing.length} FILES`;
      status.title = `Open online and reload to cache: ${missing.join(', ')}`;
      status.classList.add('offline-warning');
      return;
    }
    status.textContent = 'OFFLINE READY · KANA + JLPT DATA SAVED';
    status.title = 'App shell, hiragana/katakana practice data, and all vocabulary and kanji study data are saved on this device.';
    status.classList.remove('offline-warning');
  } catch {
    status.textContent = 'OFFLINE CACHE NOT CONFIRMED';
    status.classList.add('offline-warning');
  }
}
function renderKanji() {
  if (!state.kanji.length) return;
  const level = $('#kanjiLevelSelect').value;
  const query = normalize($('#kanjiSearch').value);
  const matches = state.kanji.filter((item) => (level === 'all' || item.level === Number(level)) && (!query || item.char.includes(query)));
  const list = $('#kanjiList');
  list.replaceChildren();
  $('#kanjiCount').textContent = `${matches.length.toLocaleString()} kanji`;
  matches.forEach((item) => {
    const li = document.createElement('li');
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'kanji-result';
    button.textContent = `${item.char} · N${item.level}`;
    button.addEventListener('click', () => openStroke(item));
    li.append(button);
    list.append(li);
  });
}
async function openStroke(item) {
  const viewer = $('#strokeViewer');
  const host = $('#strokeSvg');
  viewer.hidden = false;
  host.textContent = 'Loading stroke diagram…';
  $('#strokeTitle').textContent = `${item.char} · JLPT N${item.level}`;
  $('#strokeStep').textContent = '';
  const dictionaryInfo = $('#kanjiDictionaryInfo');
  dictionaryInfo.replaceChildren();
  renderKanjiDetails(item, dictionaryInfo);
  dictionaryInfo.hidden = !dictionaryInfo.childElementCount;
  viewer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  try {
    const { svg, paths, count } = await loadSvg(item.char);
    state.strokePaths = paths;
    state.strokeIndex = 0;
    host.replaceChildren(svg);
    updateStrokeStep(count);
  } catch (error) {
    host.textContent = navigator.onLine ? `Could not load stroke data for ${item.char}.` : `Stroke data for ${item.char} has not been saved offline yet.`;
    $('#strokeStep').textContent = error.message;
  }
}
function updateStrokeStep(count = state.strokePaths.length) {
  state.strokePaths.forEach((path, index) => {
    const color = index === state.strokeIndex - 1 ? '#8a4147' : index < state.strokeIndex ? '#b99a62' : '#413638';
    path.setAttribute('stroke', color);
  });
  $('#strokeStep').textContent = state.strokeIndex === 0
    ? `${count} strokes · follow the numbered diagram, then highlight each stroke in order.`
    : `Stroke ${state.strokeIndex} of ${count} highlighted`;
  $('#nextStrokeButton').textContent = state.strokeIndex >= count ? 'Complete' : 'Next stroke';
  $('#nextStrokeButton').disabled = state.strokeIndex >= count;
}
async function downloadAllStrokes() {
  const button = $('#downloadStrokesButton');
  button.disabled = true;
  let finished = 0;
  let failed = 0;
  let cursor = 0;
  const total = state.kanji.length;
  button.textContent = `Saving 0 / ${total}`;
  async function worker() {
    while (cursor < total) {
      const item = state.kanji[cursor++];
      try {
        await loadSvg(item.char);
        finished += 1;
      } catch { failed += 1; }
      if ((finished + failed) % 20 === 0 || finished + failed === total) button.textContent = `Saving ${finished + failed} / ${total}`;
    }
  }
  await Promise.all(Array.from({ length: 5 }, worker));
  button.disabled = false;
  button.textContent = 'Save all strokes offline';
  setFeedback(`Stroke download complete: ${finished.toLocaleString()} saved, ${failed.toLocaleString()} unavailable.`, failed ? 'error' : 'success');
}

$('#answerForm').addEventListener('submit', (event) => { event.preventDefault(); submit(); });
$('#skipButton').addEventListener('click', () => submit(true));
$('#nextQuestionButton').addEventListener('click', nextQuestion);
$('#resetButton').addEventListener('click', () => {
  state.correct = 0; state.attempted = 0; state.streak = 0; state.missWeight.clear(); state.history = [];
  renderStats(); renderHistory(); setFeedback('Ready to begin.', 'neutral'); nextQuestion();
});
document.querySelectorAll('.mode-button').forEach((button) => button.addEventListener('click', () => changeMode(button.dataset.mode)));
$('#kanaControls').querySelectorAll('.kana-set-button').forEach((button) => button.addEventListener('click', () => {
  state.kanaMode = button.dataset.kanaMode;
  $('#kanaControls').querySelectorAll('.kana-set-button').forEach((option) => option.classList.toggle('active', option === button));
  nextQuestion();
}));
$('#levelSelect').addEventListener('change', (event) => { state.level = event.target.value; nextQuestion(); });
$('#directionSelect').addEventListener('change', (event) => { state.direction = event.target.value; nextQuestion(); });
$('#kanjiLevelSelect').addEventListener('change', renderKanji);
$('#kanjiSearch').addEventListener('input', renderKanji);
$('#downloadStrokesButton').addEventListener('click', downloadAllStrokes);
$('#sourcesButton').addEventListener('click', () => $('#sourcesDialog').showModal());
$('#closeSourcesButton').addEventListener('click', () => $('#sourcesDialog').close());
$('#sourcesDialog').addEventListener('click', (event) => {
  if (event.target === $('#sourcesDialog')) $('#sourcesDialog').close();
});
$('#closeStrokeButton').addEventListener('click', () => { $('#strokeViewer').hidden = true; });
$('#restartStrokeButton').addEventListener('click', () => { state.strokeIndex = 0; updateStrokeStep(); });
$('#nextStrokeButton').addEventListener('click', () => { state.strokeIndex = Math.min(state.strokeIndex + 1, state.strokePaths.length); updateStrokeStep(); });
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js')
      .then(() => verifyOfflineData())
      .catch((error) => {
        console.warn('Service worker registration failed:', error);
        $('#offlineStatus').textContent = 'OFFLINE CACHE NOT AVAILABLE';
        $('#offlineStatus').classList.add('offline-warning');
      });
  });
}
renderStats();
loadData();
