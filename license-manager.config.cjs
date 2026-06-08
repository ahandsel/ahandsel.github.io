const { isMatchPackage } = require('@cybozu/license-manager');

/** @type {import('@cybozu/license-manager').Config} */
module.exports = {
  packageManager: 'pnpm',
  analyze: {
    allowLicenses: [
      '0BSD',
      'Apache-2.0',
      'BlueOak-1.0.0',
      'BSD-2-Clause',
      'BSD-3-Clause',
      'CC0-1.0',
      'ISC',
      'MIT',
      'MPL-2.0',
      'Unlicense',
      'GPL-3.0-only',
      'MIT OR Apache-2.0',
      'LGPL-3.0-or-later',
      '(MPL-2.0 OR Apache-2.0)',
    ],
    allowPackages: [
      // argparse v2+ is distributed under Python-2.0, which requires attention for usage.
      'argparse@2.0.1',
    ],
  },
  overrideLicense: (dep) => {
    // khroma is licensed under the MIT license.
    // https://github.com/fabiospampinato/khroma
    if (isMatchPackage(dep, 'khroma@2.1.0')) {
      return 'MIT';
    }
    // gitignore-parser
    if (isMatchPackage(dep, 'gitignore-parser@0.0.2')) {
      return 'Apache-2.0';
    }
  },
};
