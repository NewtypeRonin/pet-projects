# Pet Project Scripts

A collection of small server-side tools I use to practice Python, automation, and personal home server workflows.

## What’s here

- `j1fm_pull_script.py`
  - Reads the currently playing track from J1FM and pulls together the song metadata.
  - Built to make it easy to add a song to Spotify, YouTube, or any other listening service.

- `keigo_correct.py`
  - Converts casual Japanese phrases into polite or honorific Japanese.
  - Uses a JSON-based rule set so the conversion logic is easy to extend and maintain.

- `mass_rename.py`
  - Renames files to a shared naming convention.
  - Designed for media server uploads and organizing large batches of files.

- `nihongo_conjugation.py`
  - A small Japanese verb conjugation quiz game.
  - Still a work in progress, but useful for practicing conjugation patterns.

- `weather_saya.py`
  - Retrieves weather for a U.S. town and finds a similar temperature in a Japanese town.
  - A quick way to compare weather across two different regions.

## Notes

- These scripts live in `scripts/` so the repo stays simple and focused.
- Keep the root `README.md` for overall setup, while this file covers the script-level details.
- I’ll add a `docs/` folder later if the tools become more polished or need more extensive documentation.
