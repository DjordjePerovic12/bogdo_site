import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const FILE = path.join(DATA_DIR, 'referrals.json');

export interface ReferralEntry {
  id: string;
  bookingRef: string;
  tourSlug: string;
  tourName: string;
  tourType: 'group' | 'private';
  guests: number;
  totalPrice: number;
  referralSource: string;
  tourDate: string;
  createdAt: string;
}

function ensureFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, '[]', 'utf-8');
}

export function readAllReferrals(): ReferralEntry[] {
  ensureFile();
  return JSON.parse(fs.readFileSync(FILE, 'utf-8'));
}

export function addReferral(entry: Omit<ReferralEntry, 'id' | 'createdAt'>): ReferralEntry {
  const all = readAllReferrals();
  const record: ReferralEntry = {
    ...entry,
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    createdAt: new Date().toISOString(),
  };
  all.push(record);
  ensureFile();
  fs.writeFileSync(FILE, JSON.stringify(all, null, 2), 'utf-8');
  return record;
}
