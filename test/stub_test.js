const eq = require('assert').strictEqual;
const rollup = require('rollup').rollup;
const runInNewContext = require('vm').runInNewContext;
const stub = require('../dist/rollup-plugin-stub.cjs');

describe('stub', () => {
  it('allows stubbing exported variables', () => {
    return rollup({
      entry: 'test/examples/exported-var/main.js',
      plugins: [
        stub({ include: 'test/examples/**/*.js' })
      ]
    }).then(bundle => {
      const result = bundle.generate({ format: 'cjs' });
      const exports = {};
      const module = { exports };
      runInNewContext(result.code, { module, exports });
      eq(module.exports.zeroBeforeStub, 0);
      eq(module.exports.zeroAfterStub, 1);
    })
  });

  it('allows stubbing exported function declarations', () => {
    return rollup({
      entry: 'test/examples/exported-function/main.js',
      plugins: [
        stub({ include: 'test/examples/**/*.js' })
      ]
    }).then(bundle => {
      const result = bundle.generate({ format: 'cjs' });
      const exports = {};
      const module = { exports };
      runInNewContext(result.code, { module, exports });
      eq(module.exports.fnBeforeStub(), 0);
      eq(module.exports.fnAfterStub(), 42);
    });
  });

  it('allows stubbing exported function declarations that rely on hoisting', () => {
    return rollup({
      entry: 'test/examples/exported-function-hoisted/main.js',
      plugins: [
        stub({ include: 'test/examples/**/*.js' })
      ]
    }).then(bundle => {
      const result = bundle.generate({ format: 'cjs' });
      const exports = {};
      const module = { exports };
      runInNewContext(result.code, { module, exports });
      eq(module.exports.fnBeforeStub(), 0);
      eq(module.exports.fnAfterStub(), 42);
    });
  });

  it('allows stubbing exported const declarations', () => {
    return rollup({
      entry: 'test/examples/const/main.js',
      plugins: [
        stub({ include: 'test/examples/**/*.js' })
      ]
    }).then(bundle => {
      const result = bundle.generate({ format: 'cjs' });
      const exports = {};
      const module = { exports };
      runInNewContext(result.code, { module, exports });
      eq(module.exports.PIBeforeStub, 3.14);
      eq(module.exports.PIAfterStub, 999);
    });
  });

  it('allows resetting stubbed values', () => {
    return rollup({
      entry: 'test/examples/reset-stub/main.js',
      plugins: [
        stub({ include: 'test/examples/**/*.js' })
      ]
    }).then(bundle => {
      const result = bundle.generate({ format: 'cjs' });
      const exports = {};
      const module = { exports };
      runInNewContext(result.code, { module, exports });
      eq(module.exports.oneBeforeStub, 1);
      eq(module.exports.oneAfterStub, 734);
      eq(module.exports.oneAfterReset, 1);
    });
  });

  it('does not throw on `export {varName as default}``', () => {
    return rollup({
      entry: 'test/examples/export-default-brackets/main.js',
      plugins: [
        stub({ include: 'test/examples/export-default-brackets/main.js' })
      ]
    });
  });
});
