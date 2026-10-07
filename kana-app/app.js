const HIRAGANA = [
  { id: 'hiragana-a', char: 'あ', romaji: 'a', accepts: ['a'] },
  { id: 'hiragana-i', char: 'い', romaji: 'i', accepts: ['i'] },
  { id: 'hiragana-u', char: 'う', romaji: 'u', accepts: ['u'] },
  { id: 'hiragana-e', char: 'え', romaji: 'e', accepts: ['e'] },
  { id: 'hiragana-o', char: 'お', romaji: 'o', accepts: ['o'] },
  { id: 'hiragana-ka', char: 'か', romaji: 'ka', accepts: ['ka'] },
  { id: 'hiragana-ki', char: 'き', romaji: 'ki', accepts: ['ki'] },
  { id: 'hiragana-ku', char: 'く', romaji: 'ku', accepts: ['ku'] },
  { id: 'hiragana-ke', char: 'け', romaji: 'ke', accepts: ['ke'] },
  { id: 'hiragana-ko', char: 'こ', romaji: 'ko', accepts: ['ko'] },
  { id: 'hiragana-sa', char: 'さ', romaji: 'sa', accepts: ['sa'] },
  { id: 'hiragana-shi', char: 'し', romaji: 'shi', accepts: ['shi', 'si'] },
  { id: 'hiragana-su', char: 'す', romaji: 'su', accepts: ['su'] },
  { id: 'hiragana-se', char: 'せ', romaji: 'se', accepts: ['se'] },
  { id: 'hiragana-so', char: 'そ', romaji: 'so', accepts: ['so'] },
  { id: 'hiragana-ta', char: 'た', romaji: 'ta', accepts: ['ta'] },
  { id: 'hiragana-chi', char: 'ち', romaji: 'chi', accepts: ['chi', 'ti'] },
  { id: 'hiragana-tsu', char: 'つ', romaji: 'tsu', accepts: ['tsu', 'tu'] },
  { id: 'hiragana-te', char: 'て', romaji: 'te', accepts: ['te'] },
  { id: 'hiragana-to', char: 'と', romaji: 'to', accepts: ['to'] },
  { id: 'hiragana-na', char: 'な', romaji: 'na', accepts: ['na'] },
  { id: 'hiragana-ni', char: 'に', romaji: 'ni', accepts: ['ni'] },
  { id: 'hiragana-nu', char: 'ぬ', romaji: 'nu', accepts: ['nu'] },
  { id: 'hiragana-ne', char: 'ね', romaji: 'ne', accepts: ['ne'] },
  { id: 'hiragana-no', char: 'の', romaji: 'no', accepts: ['no'] },
  { id: 'hiragana-ha', char: 'は', romaji: 'ha', accepts: ['ha'] },
  { id: 'hiragana-hi', char: 'ひ', romaji: 'hi', accepts: ['hi'] },
  { id: 'hiragana-fu', char: 'ふ', romaji: 'fu', accepts: ['fu', 'hu'] },
  { id: 'hiragana-he', char: 'へ', romaji: 'he', accepts: ['he'] },
  { id: 'hiragana-ho', char: 'ほ', romaji: 'ho', accepts: ['ho'] },
  { id: 'hiragana-ma', char: 'ま', romaji: 'ma', accepts: ['ma'] },
  { id: 'hiragana-mi', char: 'み', romaji: 'mi', accepts: ['mi'] },
  { id: 'hiragana-mu', char: 'む', romaji: 'mu', accepts: ['mu'] },
  { id: 'hiragana-me', char: 'め', romaji: 'me', accepts: ['me'] },
  { id: 'hiragana-mo', char: 'も', romaji: 'mo', accepts: ['mo'] },
  { id: 'hiragana-ya', char: 'や', romaji: 'ya', accepts: ['ya'] },
  { id: 'hiragana-yu', char: 'ゆ', romaji: 'yu', accepts: ['yu'] },
  { id: 'hiragana-yo', char: 'よ', romaji: 'yo', accepts: ['yo'] },
  { id: 'hiragana-ra', char: 'ら', romaji: 'ra', accepts: ['ra'] },
  { id: 'hiragana-ri', char: 'り', romaji: 'ri', accepts: ['ri'] },
  { id: 'hiragana-ru', char: 'る', romaji: 'ru', accepts: ['ru'] },
  { id: 'hiragana-re', char: 'れ', romaji: 're', accepts: ['re'] },
  { id: 'hiragana-ro', char: 'ろ', romaji: 'ro', accepts: ['ro'] },
  { id: 'hiragana-wa', char: 'わ', romaji: 'wa', accepts: ['wa'] },
  { id: 'hiragana-wo', char: 'を', romaji: 'wo', accepts: ['wo'] },
  { id: 'hiragana-n', char: 'ん', romaji: 'n', accepts: ['n', 'nn'] },
  { id: 'hiragana-ga', char: 'が', romaji: 'ga', accepts: ['ga'] },
  { id: 'hiragana-gi', char: 'ぎ', romaji: 'gi', accepts: ['gi'] },
  { id: 'hiragana-gu', char: 'ぐ', romaji: 'gu', accepts: ['gu'] },
  { id: 'hiragana-ge', char: 'げ', romaji: 'ge', accepts: ['ge'] },
  { id: 'hiragana-go', char: 'ご', romaji: 'go', accepts: ['go'] },
  { id: 'hiragana-ja', char: 'じゃ', romaji: 'ja', accepts: ['ja', 'jya'] },
  { id: 'hiragana-ju', char: 'じゅ', romaji: 'ju', accepts: ['ju', 'jyu'] },
  { id: 'hiragana-jo', char: 'じょ', romaji: 'jo', accepts: ['jo', 'jyo'] },
  { id: 'hiragana-sha', char: 'しゃ', romaji: 'sha', accepts: ['sha', 'sya'] },
  { id: 'hiragana-shu', char: 'しゅ', romaji: 'shu', accepts: ['shu', 'syu'] },
  { id: 'hiragana-sho', char: 'しょ', romaji: 'sho', accepts: ['sho', 'syo'] },
  { id: 'hiragana-cha', char: 'ちゃ', romaji: 'cha', accepts: ['cha', 'tya'] },
  { id: 'hiragana-chu', char: 'ちゅ', romaji: 'chu', accepts: ['chu', 'tyu'] },
  { id: 'hiragana-cho', char: 'ちょ', romaji: 'cho', accepts: ['cho', 'tyo'] },
  { id: 'hiragana-kya', char: 'きゃ', romaji: 'kya', accepts: ['kya'] },
  { id: 'hiragana-kyu', char: 'きゅ', romaji: 'kyu', accepts: ['kyu'] },
  { id: 'hiragana-kyo', char: 'きょ', romaji: 'kyo', accepts: ['kyo'] },
  { id: 'hiragana-nya', char: 'にゃ', romaji: 'nya', accepts: ['nya'] },
  { id: 'hiragana-nyu', char: 'にゅ', romaji: 'nyu', accepts: ['nyu'] },
  { id: 'hiragana-nyo', char: 'にょ', romaji: 'nyo', accepts: ['nyo'] },
  { id: 'hiragana-hya', char: 'ひゃ', romaji: 'hya', accepts: ['hya'] },
  { id: 'hiragana-hyu', char: 'ひゅ', romaji: 'hyu', accepts: ['hyu'] },
  { id: 'hiragana-hyo', char: 'ひょ', romaji: 'hyo', accepts: ['hyo'] },
  { id: 'hiragana-mya', char: 'みゃ', romaji: 'mya', accepts: ['mya'] },
  { id: 'hiragana-myu', char: 'みゅ', romaji: 'myu', accepts: ['myu'] },
  { id: 'hiragana-myo', char: 'みょ', romaji: 'myo', accepts: ['myo'] },
  { id: 'hiragana-rya', char: 'りゃ', romaji: 'rya', accepts: ['rya'] },
  { id: 'hiragana-ryu', char: 'りゅ', romaji: 'ryu', accepts: ['ryu'] },
  { id: 'hiragana-ryo', char: 'りょ', romaji: 'ryo', accepts: ['ryo'] },
  { id: 'hiragana-ya', char: 'や', romaji: 'ya', accepts: ['ya'] }
];

const KATAKANA = [
  { id: 'katakana-a', char: 'ア', romaji: 'a', accepts: ['a'] },
  { id: 'katakana-i', char: 'イ', romaji: 'i', accepts: ['i'] },
  { id: 'katakana-u', char: 'ウ', romaji: 'u', accepts: ['u'] },
  { id: 'katakana-e', char: 'エ', romaji: 'e', accepts: ['e'] },
  { id: 'katakana-o', char: 'オ', romaji: 'o', accepts: ['o'] },
  { id: 'katakana-ka', char: 'カ', romaji: 'ka', accepts: ['ka'] },
  { id: 'katakana-ki', char: 'キ', romaji: 'ki', accepts: ['ki'] },
  { id: 'katakana-ku', char: 'ク', romaji: 'ku', accepts: ['ku'] },
  { id: 'katakana-ke', char: 'ケ', romaji: 'ke', accepts: ['ke'] },
  { id: 'katakana-ko', char: 'コ', romaji: 'ko', accepts: ['ko'] },
  { id: 'katakana-sa', char: 'サ', romaji: 'sa', accepts: ['sa'] },
  { id: 'katakana-shi', char: 'シ', romaji: 'shi', accepts: ['shi', 'si'] },
  { id: 'katakana-su', char: 'ス', romaji: 'su', accepts: ['su'] },
  { id: 'katakana-se', char: 'セ', romaji: 'se', accepts: ['se'] },
  { id: 'katakana-so', char: 'ソ', romaji: 'so', accepts: ['so'] },
  { id: 'katakana-ta', char: 'タ', romaji: 'ta', accepts: ['ta'] },
  { id: 'katakana-chi', char: 'チ', romaji: 'chi', accepts: ['chi', 'ti'] },
  { id: 'katakana-tsu', char: 'ツ', romaji: 'tsu', accepts: ['tsu', 'tu'] },
  { id: 'katakana-te', char: 'テ', romaji: 'te', accepts: ['te'] },
  { id: 'katakana-to', char: 'ト', romaji: 'to', accepts: ['to'] },
  { id: 'katakana-na', char: 'ナ', romaji: 'na', accepts: ['na'] },
  { id: 'katakana-ni', char: 'ニ', romaji: 'ni', accepts: ['ni'] },
  { id: 'katakana-nu', char: 'ヌ', romaji: 'nu', accepts: ['nu'] },
  { id: 'katakana-ne', char: 'ネ', romaji: 'ne', accepts: ['ne'] },
  { id: 'katakana-no', char: 'ノ', romaji: 'no', accepts: ['no'] },
  { id: 'katakana-ha', char: 'ハ', romaji: 'ha', accepts: ['ha'] },
  { id: 'katakana-hi', char: 'ヒ', romaji: 'hi', accepts: ['hi'] },
  { id: 'katakana-fu', char: 'フ', romaji: 'fu', accepts: ['fu', 'hu'] },
  { id: 'katakana-he', char: 'ヘ', romaji: 'he', accepts: ['he'] },
  { id: 'katakana-ho', char: 'ホ', romaji: 'ho', accepts: ['ho'] },
  { id: 'katakana-ma', char: 'マ', romaji: 'ma', accepts: ['ma'] },
  { id: 'katakana-mi', char: 'ミ', romaji: 'mi', accepts: ['mi'] },
  { id: 'katakana-mu', char: 'ム', romaji: 'mu', accepts: ['mu'] },
  { id: 'katakana-me', char: 'メ', romaji: 'me', accepts: ['me'] },
  { id: 'katakana-mo', char: 'モ', romaji: 'mo', accepts: ['mo'] },
  { id: 'katakana-ya', char: 'ヤ', romaji: 'ya', accepts: ['ya'] },
  { id: 'katakana-yu', char: 'ユ', romaji: 'yu', accepts: ['yu'] },
  { id: 'katakana-yo', char: 'ヨ', romaji: 'yo', accepts: ['yo'] },
  { id: 'katakana-ra', char: 'ラ', romaji: 'ra', accepts: ['ra'] },
  { id: 'katakana-ri', char: 'リ', romaji: 'ri', accepts: ['ri'] },
  { id: 'katakana-ru', char: 'ル', romaji: 'ru', accepts: ['ru'] },
  { id: 'katakana-re', char: 'レ', romaji: 're', accepts: ['re'] },
  { id: 'katakana-ro', char: 'ロ', romaji: 'ro', accepts: ['ro'] },
  { id: 'katakana-wa', char: 'ワ', romaji: 'wa', accepts: ['wa'] },
  { id: 'katakana-wo', char: 'ヲ', romaji: 'wo', accepts: ['wo'] },
  { id: 'katakana-n', char: 'ン', romaji: 'n', accepts: ['n', 'nn'] },
  { id: 'katakana-ga', char: 'ガ', romaji: 'ga', accepts: ['ga'] },
  { id: 'katakana-gi', char: 'ギ', romaji: 'gi', accepts: ['gi'] },
  { id: 'katakana-gu', char: 'グ', romaji: 'gu', accepts: ['gu'] },
  { id: 'katakana-ge', char: 'ゲ', romaji: 'ge', accepts: ['ge'] },
  { id: 'katakana-go', char: 'ゴ', romaji: 'go', accepts: ['go'] },
  { id: 'katakana-ja', char: 'ジャ', romaji: 'ja', accepts: ['ja', 'jya'] },
  { id: 'katakana-ju', char: 'ジュ', romaji: 'ju', accepts: ['ju', 'jyu'] },
  { id: 'katakana-jo', char: 'ジョ', romaji: 'jo', accepts: ['jo', 'jyo'] },
  { id: 'katakana-sha', char: 'シャ', romaji: 'sha', accepts: ['sha', 'sya'] },
  { id: 'katakana-shu', char: 'シュ', romaji: 'shu', accepts: ['shu', 'syu'] },
  { id: 'katakana-sho', char: 'ショ', romaji: 'sho', accepts: ['sho', 'syo'] },
  { id: 'katakana-cha', char: 'チャ', romaji: 'cha', accepts: ['cha', 'tya'] },
  { id: 'katakana-chu', char: 'チュ', romaji: 'chu', accepts: ['chu', 'tyu'] },
  { id: 'katakana-cho', char: 'チョ', romaji: 'cho', accepts: ['cho', 'tyo'] },
  { id: 'katakana-kya', char: 'キャ', romaji: 'kya', accepts: ['kya'] },
  { id: 'katakana-kyu', char: 'キュ', romaji: 'kyu', accepts: ['kyu'] },
  { id: 'katakana-kyo', char: 'キョ', romaji: 'kyo', accepts: ['kyo'] },
  { id: 'katakana-nya', char: 'ニャ', romaji: 'nya', accepts: ['nya'] },
  { id: 'katakana-nyu', char: 'ニュ', romaji: 'nyu', accepts: ['nyu'] },
  { id: 'katakana-nyo', char: 'ニョ', romaji: 'nyo', accepts: ['nyo'] },
  { id: 'katakana-hya', char: 'ヒャ', romaji: 'hya', accepts: ['hya'] },
  { id: 'katakana-hyu', char: 'ヒュ', romaji: 'hyu', accepts: ['hyu'] },
  { id: 'katakana-hyo', char: 'ヒョ', romaji: 'hyo', accepts: ['hyo'] },
  { id: 'katakana-mya', char: 'ミャ', romaji: 'mya', accepts: ['mya'] },
  { id: 'katakana-myu', char: 'ミュ', romaji: 'myu', accepts: ['myu'] },
  { id: 'katakana-myo', char: 'ミョ', romaji: 'myo', accepts: ['myo'] },
  { id: 'katakana-rya', char: 'リャ', romaji: 'rya', accepts: ['rya'] },
  { id: 'katakana-ryu', char: 'リュ', romaji: 'ryu', accepts: ['ryu'] },
  { id: 'katakana-ryo', char: 'リョ', romaji: 'ryo', accepts: ['ryo'] }
];

const MODE_MAP = {
  mixed: [...HIRAGANA, ...KATAKANA],
  hiragana: HIRAGANA,
  katakana: KATAKANA
};

const state = {
  mode: 'mixed',
  current: null,
  correct: 0,
  attempted: 0,
  streak: 0,
  missWeight: new Map(),
  history: []
};

const correctValue = document.getElementById('correctValue');
const attemptedValue = document.getElementById('attemptedValue');
const accuracyValue = document.getElementById('accuracyValue');
const kanaDisplay = document.getElementById('kanaDisplay');
const answerForm = document.getElementById('answerForm');
const answerInput = document.getElementById('answerInput');
const feedback = document.getElementById('feedback');
const sessionSummary = document.getElementById('sessionSummary');
const streakValue = document.getElementById('streakValue');
const historyList = document.getElementById('historyList');
const resetButton = document.getElementById('resetButton');
const skipButton = document.getElementById('skipButton');

function normalizeAnswer(raw) {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[-\s]+/g, '')
    .replace(/^(?:ll|l)/, 'l');
}

function getModePool() {
  return MODE_MAP[state.mode] || MODE_MAP.mixed;
}

function getWeightedPool() {
  const pool = getModePool();
  const weights = pool.map((item) => {
    const weight = 1 + (state.missWeight.get(item.id) || 0) * 4;
    return { item, weight };
  });

  const totalWeight = weights.reduce((sum, entry) => sum + entry.weight, 0);
  let roll = Math.random() * totalWeight;

  for (const entry of weights) {
    roll -= entry.weight;
    if (roll <= 0) {
      return entry.item;
    }
  }

  return weights[weights.length - 1].item;
}

function applyFontVariation() {
  const fontStacks = [
    '"Hiragino Sans", "Yu Gothic", "Meiryo", "MS Gothic", sans-serif',
    '"MS Mincho", "Yu Mincho", serif',
    '"Segoe UI", "Noto Sans JP", sans-serif',
    '"Yu Gothic", "Meiryo", sans-serif'
  ];
  const family = fontStacks[Math.floor(Math.random() * fontStacks.length)];
  kanaDisplay.style.fontFamily = family;
}

function renderStats() {
  const accuracy = state.attempted ? Math.round((state.correct / state.attempted) * 100) : 0;
  correctValue.textContent = String(state.correct);
  attemptedValue.textContent = String(state.attempted);
  accuracyValue.textContent = `${accuracy}%`;
  sessionSummary.textContent = `${state.correct} / ${state.attempted} right`;
  streakValue.textContent = `Streak: ${state.streak}`;
}

function setFeedback(message, tone = 'neutral') {
  feedback.textContent = message;
  feedback.className = `feedback ${tone}`;
}

function renderHistory() {
  historyList.innerHTML = '';

  state.history.slice(0, 8).forEach((entry) => {
    const item = document.createElement('li');
    item.className = entry.type;

    const char = document.createElement('span');
    char.className = 'history-char';
    char.textContent = entry.char;

    const answer = document.createElement('span');
    answer.className = 'history-answer';
    answer.textContent = entry.message;

    item.append(char, answer);
    historyList.appendChild(item);
  });
}

function nextQuestion() {
  const item = getWeightedPool();
  state.current = item;
  answerInput.value = '';
  answerInput.focus();
  kanaDisplay.textContent = item.char;
  applyFontVariation();
}

function addHistory(char, message, type) {
  state.history.unshift({ char, message, type });
  renderHistory();
}

function checkAnswer() {
  if (!state.current) {
    nextQuestion();
    return;
  }

  const inputValue = normalizeAnswer(answerInput.value);
  const acceptedAnswers = state.current.accepts.map((entry) => normalizeAnswer(entry));
  const isCorrect = acceptedAnswers.includes(inputValue);

  state.attempted += 1;

  if (isCorrect) {
    state.correct += 1;
    state.streak += 1;
    state.missWeight.set(state.current.id, Math.max(0, (state.missWeight.get(state.current.id) || 0) - 1));
    setFeedback(`Correct — ${state.current.char} = ${state.current.romaji}`, 'success');
    addHistory(state.current.char, `✓ ${state.current.romaji}`, 'correct');
  } else {
    state.streak = 0;
    state.missWeight.set(state.current.id, (state.missWeight.get(state.current.id) || 0) + 3);
    setFeedback(`Not quite — ${state.current.char} is ${state.current.romaji}.`, 'error');
    addHistory(state.current.char, `✕ ${state.current.romaji}`, 'incorrect');
  }

  renderStats();
  setTimeout(() => {
    nextQuestion();
  }, 650);
}

function skipQuestion() {
  if (!state.current) {
    nextQuestion();
    return;
  }

  state.attempted += 1;
  state.streak = 0;
  state.missWeight.set(state.current.id, (state.missWeight.get(state.current.id) || 0) + 2);
  setFeedback(`Skipped — ${state.current.char} is ${state.current.romaji}.`, 'error');
  addHistory(state.current.char, `↷ ${state.current.romaji}`, 'incorrect');
  renderStats();
  setTimeout(() => {
    nextQuestion();
  }, 800);
}

function resetSession() {
  state.correct = 0;
  state.attempted = 0;
  state.streak = 0;
  state.missWeight = new Map();
  state.history = [];
  setFeedback('Ready to begin.', 'neutral');
  renderHistory();
  renderStats();
  nextQuestion();
}

answerForm.addEventListener('submit', (event) => {
  event.preventDefault();
  checkAnswer();
});

skipButton.addEventListener('click', skipQuestion);
resetButton.addEventListener('click', resetSession);

document.querySelectorAll('.mode-button').forEach((button) => {
  button.addEventListener('click', () => {
    state.mode = button.dataset.mode;
    document.querySelectorAll('.mode-button').forEach((item) => {
      item.classList.toggle('active', item === button);
    });
    nextQuestion();
  });
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js').catch((error) => {
      console.warn('Service worker registration failed:', error);
    });
  });
}

renderStats();
nextQuestion();
