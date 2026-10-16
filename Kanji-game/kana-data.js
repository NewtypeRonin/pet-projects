/* Kana Match data shared with the standalone Kana Match experience. */
(() => {
  const rows = [
    ['a', 'あ', 'ア'], ['i', 'い', 'イ'], ['u', 'う', 'ウ'], ['e', 'え', 'エ'], ['o', 'お', 'オ'],
    ['ka', 'か', 'カ'], ['ki', 'き', 'キ'], ['ku', 'く', 'ク'], ['ke', 'け', 'ケ'], ['ko', 'こ', 'コ'],
    ['sa', 'さ', 'サ'], ['shi', 'し', 'シ', 'si'], ['su', 'す', 'ス'], ['se', 'せ', 'セ'], ['so', 'そ', 'ソ'],
    ['ta', 'た', 'タ'], ['chi', 'ち', 'チ', 'ti'], ['tsu', 'つ', 'ツ', 'tu'], ['te', 'て', 'テ'], ['to', 'と', 'ト'],
    ['na', 'な', 'ナ'], ['ni', 'に', 'ニ'], ['nu', 'ぬ', 'ヌ'], ['ne', 'ね', 'ネ'], ['no', 'の', 'ノ'],
    ['ha', 'は', 'ハ'], ['hi', 'ひ', 'ヒ'], ['fu', 'ふ', 'フ', 'hu'], ['he', 'へ', 'ヘ'], ['ho', 'ほ', 'ホ'],
    ['ma', 'ま', 'マ'], ['mi', 'み', 'ミ'], ['mu', 'む', 'ム'], ['me', 'め', 'メ'], ['mo', 'も', 'モ'],
    ['ya', 'や', 'ヤ'], ['yu', 'ゆ', 'ユ'], ['yo', 'よ', 'ヨ'],
    ['ra', 'ら', 'ラ'], ['ri', 'り', 'リ'], ['ru', 'る', 'ル'], ['re', 'れ', 'レ'], ['ro', 'ろ', 'ロ'],
    ['wa', 'わ', 'ワ'], ['wo', 'を', 'ヲ'], ['n', 'ん', 'ン', 'nn'],
    ['ga', 'が', 'ガ'], ['gi', 'ぎ', 'ギ'], ['gu', 'ぐ', 'グ'], ['ge', 'げ', 'ゲ'], ['go', 'ご', 'ゴ'],
    ['za', 'ざ', 'ザ'], ['ji', 'じ', 'ジ', 'zi'], ['zu', 'ず', 'ズ'], ['ze', 'ぜ', 'ゼ'], ['zo', 'ぞ', 'ゾ'],
    ['da', 'だ', 'ダ'], ['di', 'ぢ', 'ヂ', 'dji'], ['du', 'づ', 'ヅ', 'dzu'], ['de', 'で', 'デ'], ['do', 'ど', 'ド'],
    ['ba', 'ば', 'バ'], ['bi', 'び', 'ビ'], ['bu', 'ぶ', 'ブ'], ['be', 'べ', 'ベ'], ['bo', 'ぼ', 'ボ'],
    ['pa', 'ぱ', 'パ'], ['pi', 'ぴ', 'ピ'], ['pu', 'ぷ', 'プ'], ['pe', 'ぺ', 'ペ'], ['po', 'ぽ', 'ポ']
  ];
  const palatalized = [
    ['ky', 'き', 'キ'], ['sh', 'し', 'シ', 'sy'], ['ch', 'ち', 'チ', 'ty'], ['ny', 'に', 'ニ'],
    ['hy', 'ひ', 'ヒ'], ['my', 'み', 'ミ'], ['ry', 'り', 'リ'], ['gy', 'ぎ', 'ギ'], ['j', 'じ', 'ジ', 'jy'],
    ['by', 'び', 'ビ'], ['py', 'ぴ', 'ピ'], ['dy', 'ぢ', 'ヂ']
  ];
  const smallY = [['a', 'ゃ', 'ャ'], ['u', 'ゅ', 'ュ'], ['o', 'ょ', 'ョ']];
  const kana = { hiragana: [], katakana: [] };
  const makeEntry = (script, id, character, romaji, aliases = []) => ({
    id: `kana-${script}-${id}`,
    char: character,
    romaji,
    accepts: [...new Set([romaji, ...aliases])],
    script
  });

  for (const [romaji, hira, kata, ...aliases] of rows) {
    kana.hiragana.push(makeEntry('hiragana', romaji, hira, romaji, aliases));
    kana.katakana.push(makeEntry('katakana', romaji, kata, romaji, aliases));
  }
  for (const [prefix, baseHira, baseKata, alternatePrefix] of palatalized) {
    for (const [vowel, smallHira, smallKata] of smallY) {
      const romaji = `${prefix}${vowel}`;
      const aliases = alternatePrefix ? [`${alternatePrefix}${vowel}`] : [];
      kana.hiragana.push(makeEntry('hiragana', romaji, `${baseHira}${smallHira}`, romaji, aliases));
      kana.katakana.push(makeEntry('katakana', romaji, `${baseKata}${smallKata}`, romaji, aliases));
    }
  }

  window.KANA_MATCH_DATA = {
    hiragana: kana.hiragana,
    katakana: kana.katakana,
    mixed: [...kana.hiragana, ...kana.katakana]
  };
})();
