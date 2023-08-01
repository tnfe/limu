/**
 * comes from immer git repo
 * https://github.com/immerjs/immer/blob/main/__performance_tests__/measure.mjs
 */

function measureTime(setup, fn) {
  if (!fn) {
    fn = setup;
    setup = () => {};
  }
  const args = setup();
  global.gc && global.gc();
  const startTime = Date.now();
  fn(args);
  const endTime = Date.now();
  return endTime - startTime;
}

exports.measure = function measure(name, setup, fn) {
  const times = [...Array(5)].map(() => measureTime(setup, fn));
  const medianTime = times.sort()[Math.round(times.length / 2)];
  console.log(`${name}: ${medianTime}ms`);
};
