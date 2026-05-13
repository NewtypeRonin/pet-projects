from __future__ import annotations

import argparse
import re
from pathlib import Path
from typing import List, Optional, Pattern, Tuple

VIDEO_EXTENSIONS = {
    ".mkv",
    ".mp4",
    ".avi",
    ".mov",
    ".webm",
    ".ts",
    ".flv",
    ".wmv",
    ".mpg",
    ".mpeg",
    ".m4v",
}

SUBTITLE_EXTENSIONS = {".srt", ".ass"}

SKIP_PATTERNS = [
    r"\bOP\b",
    r"\bED\b",
    r"\bCM\b",
    r"\bPV\b",
    r"_CMHD",
    r"\bPreview\b",
    r"\bTrailer\b",
    r"\bCredit(s)?\b",
    r"\bSpecial\b",
    r"\bBonus\b",
    r"Promo",
    r"OP1",
    r"OP2",
    r"ED1",
    r"ED2"
    r"OP1_BD",
    r"OP2_BD",
    r"ED1_BD",
    r"ED2_BD"
]

SKIP_REGEX: Pattern[str] = re.compile("|".join(SKIP_PATTERNS), re.IGNORECASE)
EPISODE_REGEX: Pattern[str] = re.compile(r"S(\d{1,2})E(\d{1,3})", re.IGNORECASE)
LANGUAGE_ALIASES = {
    "english": "en",
    "eng": "en",
    "en": "en",
    "japanese": "jp",
    "jp": "jp",
    "ja": "jp",
    "jpn": "jp",
    "korean": "kr",
    "kr": "kr",
    "ko": "kr",
    "chinese": "zh",
    "zh": "zh",
    "spanish": "es",
    "es": "es",
    "french": "fr",
    "fr": "fr",
    "portuguese": "pt",
    "pt": "pt",
}


def sanitize_title(title: str) -> str:
    return re.sub(r'[<>:"/\\|?*]+', '-', title).strip()


def natural_sort_key(value: str) -> List[object]:
    parts = re.split(r"(\d+)", value)
    return [int(part) if part.isdigit() else part.lower() for part in parts]


def is_video_file(path: Path) -> bool:
    return path.is_file() and path.suffix.lower() in VIDEO_EXTENSIONS


def is_subtitle_file(path: Path) -> bool:
    return path.is_file() and path.suffix.lower() in SUBTITLE_EXTENSIONS


def should_skip_file(path: Path) -> bool:
    return bool(SKIP_REGEX.search(path.stem))


def parse_episode_from_name(path: Path) -> Optional[Tuple[int, int]]:
    match = EPISODE_REGEX.search(path.stem)
    if not match:
        return None
    return int(match.group(1)), int(match.group(2))


def normalize_subtitle_language(language: str) -> Optional[str]:
    normalized = language.strip().lower().replace(" ", "")
    if not normalized:
        return None
    if normalized in LANGUAGE_ALIASES:
        return LANGUAGE_ALIASES[normalized]
    if normalized.startswith("en"):
        return "en"
    if normalized.startswith(("jp", "ja")):
        return "jp"
    if normalized.startswith("ko"):
        return "kr"
    if normalized.startswith("zh"):
        return "zh"
    if normalized.startswith("es"):
        return "es"
    if normalized.startswith("fr"):
        return "fr"
    if normalized.startswith("pt"):
        return "pt"
    return normalized[:2]


def find_candidate_files(directory: Path) -> List[Path]:
    return sorted(
        [path for path in directory.iterdir() if is_video_file(path) and not should_skip_file(path)],
        key=lambda path: natural_sort_key(path.name),
    )


def find_candidate_subtitles(directory: Path) -> List[Path]:
    return sorted(
        [path for path in directory.iterdir() if is_subtitle_file(path) and not should_skip_file(path)],
        key=lambda path: natural_sort_key(path.name),
    )


def confirm(prompt: str) -> bool:
    while True:
        answer = input(f"{prompt} [y/N]: ").strip().lower()
        if answer in {"y", "yes"}:
            return True
        if answer in {"n", "no", ""}:
            return False
        print("Please enter 'y' or 'n'.")


def prompt_subtitle_language() -> Optional[str]:
    if not confirm("Subtitle files detected. Would you like to specify a subtitle language?"):
        return None
    language = input("Enter subtitle language (e.g. en, jp, english, japanese): ").strip()
    normalized = normalize_subtitle_language(language)
    if not normalized:
        print("No valid subtitle language entered. Subtitle files will not be renamed.")
    return normalized


def build_video_target_name(title: str, season: int, episode: int, extension: str) -> str:
    return f"{title} S{season:02d}E{episode:02d}{extension}"


def build_subtitle_target_name(title: str, season: int, episode: int, language: str, extension: str) -> str:
    return f"{title} S{season:02d}E{episode:02d}.{language}{extension}"


def rename_files(
    directory: Path,
    title: str,
    season: int,
    subtitle_language: Optional[str],
    dry_run: bool = False,
) -> int:
    title = sanitize_title(title)
    videos = find_candidate_files(directory)
    subtitles = find_candidate_subtitles(directory)

    if not videos and not subtitles:
        print("No eligible video or subtitle files found in the directory.")
        return 0

    preview: List[tuple[Path, Path]] = []

    if videos:
        for index, path in enumerate(videos, start=1):
            target_name = build_video_target_name(title, season, index, path.suffix)
            preview.append((path, directory / target_name))

    if subtitles and subtitle_language:
        for index, path in enumerate(subtitles, start=1):
            parsed = parse_episode_from_name(path)
            if parsed:
                season_num, episode_num = parsed
            else:
                season_num, episode_num = season, index
            target_name = build_subtitle_target_name(
                title,
                season_num,
                episode_num,
                subtitle_language,
                path.suffix,
            )
            preview.append((path, directory / target_name))

    print(f"Found {len(videos)} video file(s) and {len(subtitles)} subtitle file(s).")
    if subtitles and not subtitle_language:
        print("Subtitle files will be skipped because no subtitle language was specified.")

    if not preview:
        print("No files to rename after filtering.")
        return 0

    print("\nPreview of changes:")
    for old, new in preview:
        print(f"  {old.name} -> {new.name}")

    if dry_run:
        print("\nDry run complete. No files were renamed.")
        return len(preview)

    if not confirm("Proceed with these renames?"):
        print("Operation cancelled.")
        return 0

    renamed_count = 0
    for old_path, new_path in preview:
        if old_path.resolve(strict=False) == new_path.resolve(strict=False):
            continue
        if new_path.exists():
            print(f"Skipping because target already exists: {new_path.name}")
            continue
        old_path.rename(new_path)
        renamed_count += 1
        print(f"Renamed: {old_path.name} -> {new_path.name}")

    print(f"\nRenamed {renamed_count} file(s).")
    return renamed_count


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Rename video and subtitle files for Jellyfin using the '{title} S0XEXX' schema."
    )
    parser.add_argument(
        "directory",
        nargs="?",
        default=".",
        help="Directory containing the files to rename.",
    )
    parser.add_argument("--title", help="Show title to use in the renamed files.")
    parser.add_argument(
        "--season",
        type=int,
        default=1,
        help="Season number to use for video files (default: 1).",
    )
    parser.add_argument(
        "--subtitle-language",
        help="Subtitle language code to add to subtitle file names (e.g. en, jp).",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Show the rename preview without changing files.",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    directory = Path(args.directory).expanduser().resolve()
    if not directory.exists() or not directory.is_dir():
        print(f"Directory does not exist or is not a directory: {directory}")
        raise SystemExit(1)

    title = args.title or input("Enter the show title: ").strip()
    while not title:
        title = input("Title cannot be empty. Enter the show title: ").strip()

    season = args.season
    if season < 1:
        print("Season number must be 1 or greater.")
        raise SystemExit(1)

    subtitle_language = normalize_subtitle_language(args.subtitle_language) if args.subtitle_language else None
    if not subtitle_language and any(is_subtitle_file(path) for path in directory.iterdir()):
        subtitle_language = prompt_subtitle_language()

    rename_files(
        directory,
        title,
        season,
        subtitle_language,
        dry_run=args.dry_run,
    )


if __name__ == "__main__":
    main()
