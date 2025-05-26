const jestConfig = {
  roots: ['<rootDir>'],
  testEnvironment: 'node',
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    // '<rootDir>/benchmark/lib/mutative.js',
    '!<rootDir>/src/inner-types.ts',
    // '!<rootDir>/src/core/helper.ts',
  ],
  setupFilesAfterEnv: [],
  testMatch: [
    // lastest passed case count: 533
    '<rootDir>/test/**/*.ts',

    // '<rootDir>/test/multi-ref/*.ts',
    // '<rootDir>/test/multi-ref/cpr-after-finish.ts',

    // '<rootDir>/test/api-params/readOnly.ts',
    // '<rootDir>/test/api-params/onOperate.ts',

    // '<rootDir>/test/complex/scope-change.ts',
    // '<rootDir>/test/complex/arr-from-set.ts',
    // '<rootDir>/test/complex/symbol-key.ts',
    // '<rootDir>/test/map-other/read-inner-symbol-key.ts',

    // '<rootDir>/test/api/api.ts',
    // '<rootDir>/test/api/immut.ts',
    // '<rootDir>/test/api/limuUtils.ts',
    // '<rootDir>/test/api/setAutoFreeze.ts',
    // '<rootDir>/test/api/setAutoFreezeFalse.ts',
    // '<rootDir>/test/immer-cases/2.{ts,js}',

    // '<rootDir>/test/array-base/push.ts',
    // '<rootDir>/test/array-base/slice.ts',
    // '<rootDir>/test/array-other/object-item.ts',
    // '<rootDir>/test/array-other/object-list.ts',
    // '<rootDir>/test/array-other/print.ts',
    // '<rootDir>/test/array-base/concat.ts',
    // '<rootDir>/test/array-base/flatMap.ts',
    // '<rootDir>/test/array-base/filter.ts',
    // '<rootDir>/test/array-base/splice.ts',
    // '<rootDir>/test/array-base/valueOf.ts',
    // '<rootDir>/test/array-base/values.ts',
    // '<rootDir>/test/array-base/map.ts',
    // '<rootDir>/test/array-base/copyWithin.ts',
    // '<rootDir>/test/array-base/flat.ts',
    // '<rootDir>/test/array-base/unshift.ts',
    // '<rootDir>/test/array-base/shift.ts',
    // '<rootDir>/test/array-base/sort.ts',
    // '<rootDir>/test/array-base/forEach.ts',
    // '<rootDir>/test/array-base/delete.ts',

    // '<rootDir>/test/array-other/case-push.ts',
    // '<rootDir>/test/array-other/object-item-nested.ts',
    // '<rootDir>/test/array-other/object-item.ts',
    // '<rootDir>/test/array-other/object-item-2.ts',
    // '<rootDir>/test/array-other/object-item-3.ts',
    // '<rootDir>/test/array-other/object-list.ts',
    // '<rootDir>/test/array-other/case1-of-helux.ts',

    // '<rootDir>/test/map-other/case-nested-object.ts',
    // '<rootDir>/test/map-other/case1.ts',
    // '<rootDir>/test/map-other/case2.ts',
    // '<rootDir>/test/map-other/object-map.ts',
    // '<rootDir>/test/map-other/see-frozen.ts',

    // '<rootDir>/test/map-base/get.ts',
    // '<rootDir>/test/map-base/has.ts',
    // '<rootDir>/test/map-base/keys.ts',
    // '<rootDir>/test/map-base/set.ts',
    // '<rootDir>/test/map-base/values.ts',
    // '<rootDir>/test/map-base/forEach.ts',

    // '<rootDir>/test/set-base/add.ts',
    // '<rootDir>/test/set-base/forEach.ts',
    // '<rootDir>/test/set-other/object-set-add.ts',
    // '<rootDir>/test/set-base/keys.ts',
    // '<rootDir>/test/set-base/size.ts',
    // '<rootDir>/test/set-base/values.ts',
    // '<rootDir>/test/set-base/clear.ts',
    // '<rootDir>/test/set-other/update-object-item.ts',
    // '<rootDir>/test/set-other/object-set.ts',
    // '<rootDir>/test/set-other/object-set-primitive-item.ts',

    // '<rootDir>/test/complex/case1.ts',
    // '<rootDir>/test/complex/case-push.ts',
    // '<rootDir>/test/complex/case-node-change.ts',
    // '<rootDir>/test/complex/obj-value-of.ts',

    // '<rootDir>/test/diff-with-immer/sort.ts',
  ],
  testPathIgnorePatterns: ['<rootDir>/test/_util.ts', '<rootDir>/test/_data.ts'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'ts-jest',
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '<rootDir>/fileTransform.js',
  },
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx|ts|tsx)$'],
  modulePaths: ['<rootDir>/src'],
  moduleFileExtensions: ['js', 'ts', 'json'],
  collectCoverage: true,
};

const { testMatch } = process.env;
if (testMatch) {
  console.log('------ found customized testMatch, start compute ------');
  let prefixedTestMatch = testMatch;

  // 改写前缀
  if (!testMatch.startsWith('<rootDir>')) {
    if (testMatch.startsWith('/')) prefixedTestMatch = `<rootDir>${testMatch}`;
    else prefixedTestMatch = `<rootDir>/${testMatch}`;
  }
  jestConfig.testMatch = [prefixedTestMatch];
  console.log(`computed testMatch: ${JSON.stringify(jestConfig.testMatch)}`);
} else {
  console.log(
    'Start loading the jest configuration file. If it is executed locally and you want to narrow the scope of a single test, you can add the testmatch prefix to execute it, such as',
  );
  // testMatch='test/yyy.ts' npm run test
  console.log("testMatch='test/yyy.ts' npm run test");
}

module.exports = jestConfig;
