#!/bin/bash
set -e

SSH_KEY="$HOME/.ssh/id_ed25519_bogdo"
REMOTE="root@164.90.236.159"
REMOTE_DIR="/var/www/bogdo"

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

echo "Backing up live testimonials..."
"$PROJECT_DIR/scripts/backup-testimonials.sh"

echo "Building..."
npm run build

echo "Syncing to server..."
rsync -az \
  -e "ssh -i $SSH_KEY" \
  --exclude='.git' \
  --exclude='node_modules' \
  --exclude='.env.local' \
  --exclude='.env.production' \
  --exclude='.next/cache' \
  --exclude='.next/dev' \
  --exclude='data/' \
  "$PROJECT_DIR/" \
  "$REMOTE:$REMOTE_DIR/"

echo "Installing dependencies on server..."
ssh -i "$SSH_KEY" "$REMOTE" "cd $REMOTE_DIR && npm install --omit=dev"

echo "Restarting..."
ssh -i "$SSH_KEY" "$REMOTE" "cd $REMOTE_DIR && pm2 restart bogdo"

echo "Done."
