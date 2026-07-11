#!/usr/bin/env bash
# Refresh the Chat-project upload bundle from the repo's source-of-truth files.
#
# The Chat project needs a few files that live elsewhere in the repo (they change
# as the mod evolves). Rather than keep stale duplicates, this script copies the
# current versions into chat-project/knowledge/ so you can (re-)upload one folder.
#
# Run it before creating the project, and again before re-uploading after a
# milestone (LeaderText.xml and MOD-STATUS.md drift the fastest).
#
#   cd ~/dev/civ7-netaji-mod && ./chat-project/sync.sh

set -euo pipefail
here="$(cd "$(dirname "$0")/.." && pwd)"   # repo root
dest="$here/chat-project/knowledge"
mkdir -p "$dest"

cp "$here/DESIGN.md"                  "$dest/DESIGN.md"
cp "$here/README.md"                  "$dest/MOD-STATUS.md"       # repo README = current status
cp "$here/text/en_us/LeaderText.xml"  "$dest/LeaderText.xml"

echo "Synced Chat-project knowledge bundle -> $dest"
ls -1 "$dest"
