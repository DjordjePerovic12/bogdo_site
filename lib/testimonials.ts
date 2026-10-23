import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const FILE = path.join(DATA_DIR, 'testimonials.json');

export interface Testimonial {
  id: string;
  name: string;
  text: string;
  rating: number;
  date: string;
  approved: boolean;
}

function ensureFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, '[]', 'utf-8');
}

export function readAll(): Testimonial[] {
  ensureFile();
  return JSON.parse(fs.readFileSync(FILE, 'utf-8'));
}

function writeAll(data: Testimonial[]) {
  ensureFile();
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2), 'utf-8');
}

export function getApproved(): Testimonial[] {
  return readAll().filter((t) => t.approved);
}

export function addTestimonial(name: string, text: string, rating: number): Testimonial {
  const all = readAll();
  const entry: Testimonial = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    name,
    text,
    rating,
    date: new Date().toISOString(),
    approved: false,
  };
  all.push(entry);
  writeAll(all);
  return entry;
}

export function approveTestimonial(id: string): boolean {
  const all = readAll();
  const t = all.find((t) => t.id === id);
  if (!t) return false;
  t.approved = true;
  writeAll(all);
  return true;
}

export function deleteTestimonial(id: string): boolean {
  const all = readAll();
  const next = all.filter((t) => t.id !== id);
  if (next.length === all.length) return false;
  writeAll(next);
  return true;
}
