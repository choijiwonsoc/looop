import type { Member } from './types';

const STORAGE_KEY = 'looop_identity';
const AVATAR_COLORS = ['#2F5EFF', '#C88A2A', '#8A9A7E', '#E85D4A', '#7C5CBF', '#1F9E8E'];

function randomId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return 'u-' + Math.random().toString(36).slice(2, 10);
}

export function getIdentity(): Member {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // corrupted storage — fall through and create a fresh identity
  }
  const identity: Member = {
    id: randomId(),
    name: 'You',
    color: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(identity));
  return identity;
}

export function setIdentityName(name: string): Member {
  const identity = getIdentity();
  const updated = { ...identity, name: name.trim() || 'You' };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}