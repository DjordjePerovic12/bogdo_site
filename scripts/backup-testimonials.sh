#!/bin/bash
# Pulls the live testimonials.json from the prod server and, if it differs
# from the last local backup, saves a new timestamped copy under backups/testimonials/.
# Run manually any time, and automatically as the first step of deploy.sh.
set -e

SSH_KEY="$HOME/.ssh/id_ed25519_bogdo"
REMOTE="root@164.90.236.159"
REMOTE_DIR="/var/www/bogdo"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKUP_DIR="$SCRIPT_DIR/backups/testimonials"
mkdir -p "$BACKUP_DIR"

TMP_FILE="$(mktemp)"
trap 'rm -f "$TMP_FILE"' EXIT

echo "Fetching live testimonials.json from $REMOTE..."
if ! ssh -i "$SSH_KEY" "$REMOTE" "cat $REMOTE_DIR/data/testimonials.json" > "$TMP_FILE"; then
  echo "ERROR: failed to fetch testimonials.json from the server." >&2
  exit 1
fi

if [ ! -s "$TMP_FILE" ]; then
  echo "ERROR: fetched testimonials.json is empty — refusing to treat this as a valid backup." >&2
  exit 1
fi

LAST_BACKUP="$(ls -1 "$BACKUP_DIR"/testimonials-*.json 2>/dev/null | sort | tail -n 1)"

if [ -n "$LAST_BACKUP" ] && cmp -s "$TMP_FILE" "$LAST_BACKUP"; then
  echo "No changes since last backup ($(basename "$LAST_BACKUP"))."
  exit 0
fi

TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
NEW_BACKUP="$BACKUP_DIR/testimonials-$TIMESTAMP.json"
cp "$TMP_FILE" "$NEW_BACKUP"

if [ -n "$LAST_BACKUP" ]; then
  OLD_IDS="$(python3 -c "import json,sys; print('\n'.join(sorted(t['id'] for t in json.load(open(sys.argv[1])))))" "$LAST_BACKUP")"
  NEW_IDS="$(python3 -c "import json,sys; print('\n'.join(sorted(t['id'] for t in json.load(open(sys.argv[1])))))" "$NEW_BACKUP")"
  ADDED=$(comm -13 <(echo "$OLD_IDS") <(echo "$NEW_IDS") | grep -c . || true)
  REMOVED=$(comm -23 <(echo "$OLD_IDS") <(echo "$NEW_IDS") | grep -c . || true)
  echo "Saved new backup: $(basename "$NEW_BACKUP") (+$ADDED / -$REMOVED reviews vs. last backup)"
else
  COUNT=$(python3 -c "import json; print(len(json.load(open('$NEW_BACKUP'))))")
  echo "Saved first backup: $(basename "$NEW_BACKUP") ($COUNT reviews)"
fi
