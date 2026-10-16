# 言葉の書庫 — Kotoba Archive

A standalone, installable, offline Japanese study app styled as a restrained early-2000s visual-novel archive. The existing Kana Match app remains separate in `../kana-app/`.

## Modes

- **Vocabulary:** all 8,505 word/reading/level entries, N1–N5 filters, word → reading or reading → word prompts, English glosses, and dictionary notes. Readings accept kana or romaji; romaji and katakana are normalized to hiragana for checking.
- **Kanji Match:** all 2,211 kanji, filtered by N1–N5, presented as a single plain character to type. Meanings, readings, and stroke counts appear after checking.
- **Stroke Order:** search/filter all kanji and study a complete, numbered KanjiVG diagram. The Next stroke button highlights strokes in order without hiding the complete character.
- Weighted review, score, accuracy, streak, and recent answer history.

### Dictionary coverage

The original JLPT files remain intact. The generated `JSON/JLPT_vocab_enriched.json` contains readings plus source glosses, dictionary readings when spelling fallback was needed, match provenance, and part-of-speech tags. `JSON/JLPT_kanji_details.json` contains KANJIDIC2 meanings, on/kun/name readings, and stroke counts for the app's JLPT kanji.

The most recent report in `JSON/data_coverage.json` records matches for 8,415 of 8,505 vocabulary records: 7,917 exact reading matches, 60 same-spelling fallbacks, 431 kana-reading fallbacks, and 7 single-kanji meaning fallbacks. **90 source vocabulary records remain unmatched**; `JSON/unmatched_vocab.json` lists them for review, and the app leaves their definitions empty rather than inventing translations. All 2,211 JLPT kanji have KANJIDIC2 meanings and Japanese readings in this build. Coverage and source versions can be refreshed using `tools/enrich_jlpt_data.py`.

Dictionary data is from the Electronic Dictionary Research and Development Group's JMdict/EDICT and KANJIDIC2 projects, licensed under CC BY-SA 4.0. Stroke diagrams are from KanjiVG under CC BY-SA 3.0. Use the in-app **Sources** panel for attribution, links, and license details.

## Run locally

From the repository root, serve the project over HTTP and open `http://localhost:8000/Kanji-game/`. For example, Python's built-in static server can serve the root. Opening `index.html` using a `file:` URL will not enable service workers.

## Offline and phone use

The service worker automatically caches the full app, both original lists, the enriched vocabulary, kanji meanings/readings, and coverage report. After a successful first online visit, the vocab and kanji games and all JLPT data work offline; the footer confirms **OFFLINE READY · VOCAB + KANJI SAVED** when it verifies those files in the device cache. Stroke SVGs are fetched from [KanjiVG](https://github.com/KanjiVG/kanjivg) into a separate persistent cache when accessed. To make the entire supplied JLPT stroke list available offline too, open Stroke Order mode while online and choose **Save all strokes offline**; this optional download can take a while.

For phone installation, publish the repository to a static HTTPS host (GitHub Pages works with this folder layout):

1. Push this repository to GitHub and enable Pages for the `main` branch, serving from the repository root. Keep the `Kanji-game/JSON/` folder alongside these app files in the published site.
2. On the phone, open `https://<account>.github.io/<repository>/Kanji-game/` while online.
3. **Android:** in Chrome, use the menu and choose **Install app** (or **Add to Home screen**). **iPhone:** in Safari, tap **Share → Add to Home Screen**.
4. Open the installed icon once while online. Wait for the footer to say **OFFLINE READY · VOCAB + KANJI SAVED**; this confirms the app shell, full vocabulary database, and full kanji database/meanings are cached locally. Open Stroke Order once online and use **Save all strokes offline** if the complete stroke library should work offline too.

The web app is not an APK. Service workers require HTTPS (except localhost), so a plain `http://<computer-ip>:8000` address is only a quick page preview—not an offline-capable install on a phone.

Kana Match is a separate PWA at `/kana-app/` on the same site. Both manifests have distinct folder-based app IDs and both service workers are limited to their own folder/cache, so they can coexist without one clearing the other's offline study data. If the phone says Kana Match is already installed, remove the old Kana Match app/shortcut first, then open its exact `/kana-app/` URL and install it again.

## Refresh dictionary data

Run `python tools/enrich_jlpt_data.py` from this folder while connected to the internet. The standard-library script downloads the official English JMdict and KANJIDIC2 releases, rebuilds the enriched JSON and coverage report, and records source URLs and license. Previously downloaded release archives can be supplied as `--jmdict` and `--kanjidic` paths to reproduce a data build.
