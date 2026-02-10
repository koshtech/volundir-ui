
globalThis.stop = function(message) {
  console.warn('[Volundir][stop] Fatal Action: Requested emergency stop!');
  throw new Error(`[Volundir][stop] Message: ${message}`);
}
