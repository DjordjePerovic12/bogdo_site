import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const FILE = path.join(DATA_DIR, 'referrers.json');

function ensureFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, '[]', 'utf-8');
}

export function readReferrers(): string[] {
  ensureFile();
  return JSON.parse(fs.readFileSync(FILE, 'utf-8'));
}

export function addReferrer(name: string): void {
  const all = readReferrers();
  const trimmed = name.trim();
  if (!trimmed || all.includes(trimmed)) return;
  all.push(trimmed);
  ensureFile();
  fs.writeFileSync(FILE, JSON.stringify(all, null, 2), 'utf-8');
}

export function deleteReferrer(name: string): boolean {
  const all = readReferrers();
  const next = all.filter((r) => r !== name);
  if (next.length === all.length) return false;
  ensureFile();
  fs.writeFileSync(FILE, JSON.stringify(next, null, 2), 'utf-8');
  return true;
}
