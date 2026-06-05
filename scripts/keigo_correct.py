import json  # For managing Keigo lesson dictionaries and state
import logging  # For structured application logging inside the pod
import sqlite3  # For a simple, zero-configuration local database
from fastapi import FastAPI, HTTPException  # For building high-performance APIs
from janome.tokenizer import Tokenizer  # For advanced Japanese text processing and tokenization
import re  # For regular expressions to identify keigo patterns, we might not use this but let's keep it imported for now
#import json #Let's import this later once we have a JSON ready to go.

from pathlib import Path


def load_keigo_corrections():
    # Build a path to the JSON correction file in the same folder as this script.
    data_path = Path(__file__).resolve().parent / "keigo_corrections.json"

    # Open the file using UTF-8 so Japanese text reads correctly.
    with data_path.open("r", encoding="utf-8") as f:
        data = json.load(f)

    # Normalize the loaded JSON into a flat dict of casual -> keigo strings.
    corrections = {}
    if isinstance(data.get("corrections"), dict):
        # If the JSON contains a dict directly, use it as-is.
        corrections = data["corrections"]
    elif isinstance(data.get("corrections"), list):
        # If the JSON uses a list of objects, build a mapping from casual to keigo.
        corrections = {item["casual"]: item["keigo"] for item in data["corrections"]}
    else:
        # If the file format is unexpected, raise an error so the problem is visible immediately.
        raise ValueError("keigo_corrections.json must contain a 'corrections' dict or list")

    return corrections

# Loads the correction map once at startup, so we don't have to read the file every time we correct text.
KEIGO_CORRECTIONS = load_keigo_corrections()

def correct_to_keigo(input_text):
    t = Tokenizer()
    phrase_map = {}
    for key, repl in KEIGO_CORRECTIONS.items():
        key_tokens = tuple(tok.surface for tok in t.tokenize(key))
        phrase_map[key_tokens] = repl
    #sort phrase tuples by length in descending order to ensure longer phrases are replaced first
    phrase_tuples = sorted(phrase_map.keys(), key=len, reverse=True)
    tokens = list(t.tokenize(input_text))
    surfaces = [tok.surface for tok in tokens]

    i = 0
    output_parts = []
    while i < len(tokens):
        matched = False
        for phrase in phrase_tuples:
            L = len(phrase)
            if i + L <= len(tokens) and tuple(surfaces[i:i+L]) == phrase:
                output_parts.append(phrase_map[phrase])
                i += L
                matched = True
                break
        if matched:
            continue
        #single-token fallback (surface then base form)
        tok = tokens[i]
        if tok.surface in KEIGO_CORRECTIONS:
            output_parts.append(KEIGO_CORRECTIONS[tok.surface])
        elif tok.base_form in KEIGO_CORRECTIONS:
            output_parts.append(KEIGO_CORRECTIONS[tok.base_form])
        else:
            output_parts.append(tok.surface)
        i += 1

    output_text = ''.join(output_parts)    
    return output_text


# Let's test the function with some input
if __name__ == "__main__":
    test_input = "私は行きます。あなたは食べますか？"
    corrected_text = correct_to_keigo(test_input)
    print("Original Text: ", test_input)
    print("Corrected Text: ", corrected_text)