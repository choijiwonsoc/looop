import type { Member } from './types';

// No real accounts yet — every browser acts as this one identity.
// Replace once auth exists.
export const CURRENT_USER: Member = {
  id: 'you',
  name: 'You',
  color: '#2F5EFF',
};