"""Enrich the local JLPT lists from official EDRDG dictionary releases.

JMdict and KANJIDIC2 are Copyright the Electronic Dictionary Research and
Development Group and licensed under CC BY-SA 4.0. This script downloads the
latest official English JMdict and KANJIDIC2 XML archives when paths are omitted.
"""
from __future__ import annotations

import argparse
import gzip
import json
import tempfile
import urllib.request
import xml.etree.ElementTree as ET
from collections import defaultdict
from datetime import date
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
JSON_DIR = ROOT / "JSON"
JMdict_URL = "https://www.edrdg.org/pub/Nihongo/JMdict_e.gz"
KANJIDIC_URL = "https://www.edrdg.org/kanjidic/kanjidic2.xml.gz"
XML_LANG = "{http://www.w3.org/XML/1998/namespace}lang"
LICENSE_URL = "https://www.edrdg.org/edrdg/licence.html"


def download(url: str, destination: Path) -> Path:
    request = urllib.request.Request(url, headers={"User-Agent": "JLPT-Match-data-builder/1.0"})
    with urllib.request.urlopen(request, timeout=120) as response, destination.open("wb") as output:
        while chunk := response.read(1024 * 1024):
            output.write(chunk)
    return destination


def text_of(element: ET.Element) -> str:
    return "".join(element.itertext()).strip()


def load_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def match_jmdict(source: Path, vocabulary: dict[str, list[dict[str, Any]]]) -> tuple[dict, dict]:
    targets = {
        (word, row["reading"])
        for word, rows in vocabulary.items()
        for row in rows
        if row.get("reading")
    }
    collected: dict[tuple[str, str], dict[str, set[str]]] = defaultdict(
        lambda: {"meanings": set(), "parts_of_speech": set()}
    )
    collected_by_spelling: dict[str, dict[str, set[str]]] = defaultdict(
        lambda: {"meanings": set(), "parts_of_speech": set(), "readings": set()}
    )
    target_words = set(vocabulary)
    kana_only_targets = {
        word
        for word, rows in vocabulary.items()
        if any(row.get("reading") == word for row in rows)
        and all("\u3040" <= character <= "\u30ff" or character in "ー・ゔヵヶ" for character in word)
    }
    collected_by_reading: dict[str, dict[str, set[str]]] = defaultdict(
        lambda: {"meanings": set(), "parts_of_speech": set()}
    )

    with gzip.open(source, "rb") as xml_file:
        for _, entry in ET.iterparse(xml_file, events=("end",)):
            if entry.tag != "entry":
                continue
            kanji_forms = [text_of(item) for item in entry.findall("k_ele/keb")]
            for reading_element in entry.findall("r_ele"):
                reading = text_of(reading_element.find("reb")) if reading_element.find("reb") is not None else ""
                if not reading:
                    continue
                restrictions = {text_of(item) for item in reading_element.findall("re_restr")}
                forms = [form for form in kanji_forms if not restrictions or form in restrictions]
                pairs = {(form, reading) for form in forms}
                target_forms = [form for form in forms if form in target_words]
                if not kanji_forms or reading_element.find("re_nokanji") is not None:
                    pairs.add((reading, reading))
                relevant = pairs.intersection(targets)
                is_kana_target = reading in kana_only_targets
                if not relevant and not target_forms and not is_kana_target:
                    continue

                for sense in entry.findall("sense"):
                    allowed_words = {text_of(item) for item in sense.findall("stagk")}
                    allowed_readings = {text_of(item) for item in sense.findall("stagr")}
                    glosses = []
                    for gloss in sense.findall("gloss"):
                        language = gloss.attrib.get(XML_LANG, "eng")
                        value = text_of(gloss)
                        if language in ("eng", "") and value:
                            glosses.append(value)
                    if not glosses:
                        continue
                    parts = {text_of(item) for item in sense.findall("pos") if text_of(item)}
                    for word, pair_reading in relevant:
                        if allowed_words and word not in allowed_words:
                            continue
                        if allowed_readings and pair_reading not in allowed_readings:
                            continue
                        collected[(word, pair_reading)]["meanings"].update(glosses)
                        collected[(word, pair_reading)]["parts_of_speech"].update(parts)
                    for word in target_forms:
                        if allowed_words and word not in allowed_words:
                            continue
                        if allowed_readings and reading not in allowed_readings:
                            continue
                        collected_by_spelling[word]["meanings"].update(glosses)
                        collected_by_spelling[word]["parts_of_speech"].update(parts)
                        collected_by_spelling[word]["readings"].add(reading)
                    if is_kana_target:
                        if not allowed_readings or reading in allowed_readings:
                            collected_by_reading[reading]["meanings"].update(glosses)
                            collected_by_reading[reading]["parts_of_speech"].update(parts)
            entry.clear()

    enriched: dict[str, list[dict[str, Any]]] = {}
    missing: list[dict[str, Any]] = []
    matched = 0
    exact_matched = 0
    spelling_fallbacks = 0
    per_level: dict[str, dict[str, int]] = {f"N{level}": {"total": 0, "matched": 0} for level in range(1, 6)}
    for word, rows in vocabulary.items():
        enriched_rows = []
        for row in rows:
            pair = (word, row.get("reading", ""))
            record = collected.get(pair, {"meanings": set(), "parts_of_speech": set()})
            exact_meanings = record["meanings"]
            match_type = "exact"
            dictionary_readings: list[str] = []
            if exact_meanings:
                meanings = sorted(exact_meanings)
                parts = sorted(record["parts_of_speech"])
                exact_matched += 1
            else:
                fallback = collected_by_spelling.get(word, {"meanings": set(), "parts_of_speech": set(), "readings": set()})
                meanings = sorted(fallback["meanings"])
                parts = sorted(fallback["parts_of_speech"])
                dictionary_readings = sorted(fallback["readings"])
                match_type = "spelling-fallback" if meanings else "missing"
                if not meanings and word == row.get("reading") and word in kana_only_targets:
                    reading_fallback = collected_by_reading.get(word, {"meanings": set(), "parts_of_speech": set()})
                    meanings = sorted(reading_fallback["meanings"])
                    parts = sorted(reading_fallback["parts_of_speech"])
                    dictionary_readings = [word] if meanings else []
                    match_type = "kana-reading-fallback" if meanings else "missing"
                if meanings:
                    spelling_fallbacks += 1
            enriched_row = {
                **row,
                "meanings": meanings,
                "parts_of_speech": parts,
                "dictionary_readings": dictionary_readings,
                "match_type": match_type,
            }
            enriched_rows.append(enriched_row)
            level = row.get("level")
            if level in range(1, 6):
                bucket = per_level[f"N{level}"]
                bucket["total"] += 1
                if meanings:
                    matched += 1
                    bucket["matched"] += 1
                else:
                    missing.append({"word": word, **row})
        enriched[word] = enriched_rows
    return enriched, {
        "entries_total": sum(len(rows) for rows in vocabulary.values()),
        "entries_matched": matched,
        "entries_exact_reading_match": exact_matched,
        "entries_spelling_fallback": spelling_fallbacks,
        "entries_missing": len(missing),
        "by_level": per_level,
        "missing_examples": missing[:100],
    }


def parse_kanjidic(source: Path, kanji_levels: dict[str, int]) -> tuple[dict, dict]:
    details: dict[str, dict[str, Any]] = {}
    with gzip.open(source, "rb") as xml_file:
        for _, character_element in ET.iterparse(xml_file, events=("end",)):
            if character_element.tag != "character":
                continue
            literal_element = character_element.find("literal")
            literal = text_of(literal_element) if literal_element is not None else ""
            if not literal:
                character_element.clear()
                continue
            target = details.setdefault(literal, {
                "level": kanji_levels.get(literal),
                "meanings": [],
                "on_readings": [],
                "kun_readings": [],
                "name_readings": [],
                "stroke_count": None,
            })

            stroke = character_element.find("misc/stroke_count")
            if stroke is not None and stroke.text:
                target["stroke_count"] = int(stroke.text)
            for reading in character_element.findall("reading_meaning/rmgroup/reading"):
                reading_type = reading.attrib.get("r_type", "")
                value = text_of(reading)
                if not value:
                    continue
                if reading_type == "ja_on":
                    target["on_readings"].append(value)
                elif reading_type == "ja_kun":
                    target["kun_readings"].append(value)
            for meaning in character_element.findall("reading_meaning/rmgroup/meaning"):
                if meaning.attrib.get("m_lang", "en") == "en":
                    value = text_of(meaning)
                    if value:
                        target["meanings"].append(value)
            target["name_readings"].extend(text_of(item) for item in character_element.findall("reading_meaning/nanori") if text_of(item))
            character_element.clear()

    for target in details.values():
        for key in ("meanings", "on_readings", "kun_readings", "name_readings"):
            target[key] = list(dict.fromkeys(target[key]))
    jlpt_details = {
        character: details.get(character, {
            "level": level,
            "meanings": [],
            "on_readings": [],
            "kun_readings": [],
            "name_readings": [],
            "stroke_count": None,
        })
        for character, level in kanji_levels.items()
    }
    matched = sum(bool(item["meanings"]) for item in jlpt_details.values())
    with_readings = sum(bool(item["on_readings"] or item["kun_readings"]) for item in jlpt_details.values())
    return details, {
        "kanji_total": len(jlpt_details),
        "with_english_meanings": matched,
        "without_english_meanings": len(jlpt_details) - matched,
        "with_japanese_readings": with_readings,
        "without_japanese_readings": len(jlpt_details) - with_readings,
    }


def apply_single_kanji_fallback(vocabulary: dict[str, list[dict[str, Any]]], kanji_details: dict[str, dict[str, Any]]) -> dict[str, int]:
    applied = 0
    by_level = {f"N{level}": 0 for level in range(1, 6)}
    for word, rows in vocabulary.items():
        if len(word) != 1:
            continue
        detail = kanji_details.get(word)
        if not detail or not detail["meanings"]:
            continue
        for row in rows:
            if row["meanings"]:
                continue
            row["meanings"] = detail["meanings"]
            row["parts_of_speech"] = []
            row["match_type"] = "kanjidic-character-fallback"
            applied += 1
            by_level[f"N{row['level']}"] += 1
    return {"entries": applied, "by_level": by_level}


def summarize_vocabulary(vocabulary: dict[str, list[dict[str, Any]]], single_kanji_fallback: dict[str, int]) -> dict[str, Any]:
    totals = {f"N{level}": {"total": 0, "matched": 0} for level in range(1, 6)}
    type_counts: dict[str, int] = defaultdict(int)
    missing = []
    total = matched = 0
    for word, rows in vocabulary.items():
        for row in rows:
            total += 1
            level = row.get("level")
            if level in range(1, 6):
                bucket = totals[f"N{level}"]
                bucket["total"] += 1
            kind = row.get("match_type", "missing")
            if row.get("meanings"):
                matched += 1
                type_counts[kind] += 1
                if level in range(1, 6):
                    bucket["matched"] += 1
            else:
                missing.append({"word": word, "reading": row.get("reading", ""), "level": level})
    return {
        "entries_total": total,
        "entries_matched": matched,
        "entries_exact_reading_match": type_counts["exact"],
        "entries_spelling_fallback": type_counts["spelling-fallback"],
        "entries_kana_reading_fallback": type_counts["kana-reading-fallback"],
        "entries_kanjidic_character_fallback": type_counts["kanjidic-character-fallback"],
        "entries_missing": total - matched,
        "by_level": totals,
        "kanjidic_fallbacks_by_level": single_kanji_fallback["by_level"],
        "missing_examples": missing[:100],
    }


def main() -> None:
    parser = argparse.ArgumentParser(description="Build definition/reading data for every local JLPT item.")
    parser.add_argument("--jmdict", type=Path, help="Existing JMdict_e.gz; omitted means download latest official release")
    parser.add_argument("--kanjidic", type=Path, help="Existing kanjidic2.xml.gz; omitted means download latest official release")
    args = parser.parse_args()

    JSON_DIR.mkdir(parents=True, exist_ok=True)
    vocabulary = load_json(JSON_DIR / "JLPT_vocab_ALL.json")
    kanji_levels = load_json(JSON_DIR / "JLPT_kanji_ALL.json")
    with tempfile.TemporaryDirectory(prefix="jlpt-dictionary-") as temporary:
        temporary_dir = Path(temporary)
        jmdict_file = args.jmdict or download(JMdict_URL, temporary_dir / "JMdict_e.gz")
        kanjidic_file = args.kanjidic or download(KANJIDIC_URL, temporary_dir / "kanjidic2.xml.gz")
        enriched_vocab, _ = match_jmdict(jmdict_file, vocabulary)
        all_kanji_details, kanji_report = parse_kanjidic(kanjidic_file, kanji_levels)
    single_kanji_fallback = apply_single_kanji_fallback(enriched_vocab, all_kanji_details)
    vocab_report = summarize_vocabulary(enriched_vocab, single_kanji_fallback)
    kanji_details = {
        character: all_kanji_details.get(character, {
            "level": level,
            "meanings": [],
            "on_readings": [],
            "kun_readings": [],
            "name_readings": [],
            "stroke_count": None,
        })
        for character, level in kanji_levels.items()
    }

    (JSON_DIR / "JLPT_vocab_enriched.json").write_text(json.dumps(enriched_vocab, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    (JSON_DIR / "JLPT_kanji_details.json").write_text(json.dumps(kanji_details, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    report = {
        "generated": date.today().isoformat(),
        "sources": {
            "vocabulary": {"name": "JMdict English", "url": JMdict_URL, "license": "CC BY-SA 4.0", "license_url": LICENSE_URL},
            "kanji": {"name": "KANJIDIC2", "url": KANJIDIC_URL, "license": "CC BY-SA 4.0", "license_url": LICENSE_URL},
        },
        "vocabulary": vocab_report,
        "kanji": kanji_report,
    }
    missing_examples = report["vocabulary"].pop("missing_examples")
    (JSON_DIR / "data_coverage.json").write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    (JSON_DIR / "unmatched_vocab.json").write_text(json.dumps(missing_examples, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
