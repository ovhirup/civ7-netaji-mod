#!/usr/bin/env bash
# Assemble a clean Steam Workshop upload folder — just the playable mod, no dev
# cruft. Point the SDK uploader (Windows) or the SteamCMD .vdf `contentfolder`
# at build/upload/. Safe to re-run; build/ is gitignored.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/build/upload"

rm -rf "$OUT"
mkdir -p "$OUT/art" "$OUT/audio"

# Manifest + code/data/text/ui (everything the game loads)
cp "$ROOT/netaji-bose.modinfo" "$OUT/"
cp -R "$ROOT/config" "$ROOT/data" "$ROOT/text" "$ROOT/ui" "$OUT/"
cp "$ROOT/README.md" "$ROOT/LICENSE" "$OUT/"

# Art: all referenced PNGs; drop the raw-drop folder, the dev script, and the
# Steam-page banner (workshop_banner.png is the listing preview, not game content).
rsync -a \
  --exclude 'incoming/' \
  --exclude 'incoming' \
  --exclude 'process_art.py' \
  --exclude 'workshop_banner.png' \
  "$ROOT/art/" "$OUT/art/"

# Audio: only the two files the modinfo ImportFiles. The theme/take tracks are
# Workshop-PAGE media (in-game audio is an engine dead-end) — they stay out of
# the mod content.
cp "$ROOT/audio/bose_vo_test.webm" "$ROOT/audio/bose_vo_test_opus.webm" "$OUT/audio/"

# Sanity: every art/audio path the modinfo references must exist in the build.
missing=0
while IFS= read -r rel; do
  [ -f "$OUT/$rel" ] || { echo "MISSING in build: $rel"; missing=1; }
done < <(grep -oE "(art|audio)/[a-z0-9_]+\.(png|webm)" "$ROOT/netaji-bose.modinfo" | sort -u)

echo "----"
echo "Built: $OUT"
du -sh "$OUT"
echo "files: $(find "$OUT" -type f | wc -l | tr -d ' ')"
[ "$missing" -eq 0 ] && echo "OK — all modinfo-referenced assets present." || { echo "FAIL — missing assets above."; exit 1; }
