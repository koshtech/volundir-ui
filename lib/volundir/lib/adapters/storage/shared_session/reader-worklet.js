// This worklet demonstrates reading values from Shared Storage.
// It registers a "log-values" operation that will print all stored entries
// to the worklet's private console (visible in DevTools Application tab).

register('log-values', async (data) => {
  // Access all keys in Shared Storage
  const entries = await sharedStorage.entries();

  console.log(' [shared_storage] Contents:');
  for await (const [key, value] of entries) {
    console.log(`   ${key} = ${value}`);
  }
});
