export function notifyMutation() {
  window.dispatchEvent(new CustomEvent('looop:mutated'));
}