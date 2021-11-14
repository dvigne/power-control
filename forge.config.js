const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const packageJson = require('./package.json');

const { version } = packageJson;
const iconDir = path.resolve(__dirname, 'assets', 'logos','png');

if (process.env['WINDOWS_CODESIGN_FILE']) {
  const certPath = path.join(__dirname, 'win-certificate.pfx');
  const certExists = fs.existsSync(certPath);

  if (certExists) {
    process.env['WINDOWS_CODESIGN_FILE'] = certPath;
  }
}

const commonLinuxConfig = {
  bin: 'volt',
  icon: path.resolve(iconDir, '128x128.png'),
  mimeType: ['x-scheme-handler/volt'],
};

const commonDarwinConfig = {
  name: 'Volt',
  icon: path.resolve(iconDir, '128x128.icns')
}

const config = {
  // hooks: {
  //   postPackage: (forgeConfig, options) => {
  //     if (process.platform == "darwin") {
  //       let appPath = path.resolve(options.outputPaths[0], 'Volt.app');
  //       console.log(`Signing App: ${appPath}`);
  //       exec(`codesign --force --deep --sign - ${appPath}`,
  //       (err, stdout, stderr) => {
  //         if (err) {
  //           console.log(`ERROR: ${err}`);
  //         }
  //         if (stdout) {
  //           console.log(stdout);
  //         }
  //         if (stderr) {
  //           console.log(stderr);
  //         }
  //       });
  //     }
  //   }
  // },
  packagerConfig: {
    name: 'Volt',
    executableName: 'volt',
    asar: true,
    icon: path.resolve(iconDir, '128x128'),
    appBundleId: 'com.dvigne.volt',
    usageDescription: { },
    appCategoryType: 'public.app-category.utilities',
    protocols: [
      {
        name: 'Volt',
      },
    ],
    win32metadata: {
      CompanyName: 'Derick Vigne',
      OriginalFilename: 'Volt',
    },
    osxSign: {
      identity: 'Developer ID Application: Derick Vigne (CX7HBEUFA7)',
      hardenedRuntime: true,
      'gatekeeper-assess': false,
      entitlements: 'entitlements.plist',
      'entitlements-inherit': 'entitlements.plist',
      'signature-flags': 'library',
    },
  },
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      platforms: ['win32'],
      config: (arch) => {
        const certificateFile = process.env.CI
          ? path.join(__dirname, 'cert.p12')
          : process.env.WINDOWS_CERTIFICATE_FILE;

        if (!certificateFile || !fs.existsSync(certificateFile)) {
          console.warn(
            `Warning: Could not find certificate file at ${certificateFile}`,
          );
        }

        return {
          name: 'Volt',
          authors: 'Derick Vigne',
          exe: 'volt.exe',
          icon: path.resolve(iconDir, "128x128.ico"),
          noMsi: false,
          setupExe: `volt-${version}-win32-${arch}-setup.exe`,
          setupMsi: `volt-${version}-win32-${arch}-setup.msi`,
          setupIcon: path.resolve(iconDir, '128x128.ico'),
          certificateFile: process.env['WINDOWS_CODESIGN_FILE'],
          certificatePassword: process.env['WINDOWS_CODESIGN_PASSWORD'],
        };
      },
    },
    {
      name: '@electron-forge/maker-dmg',
      platforms: ['darwin'],
      arch: ['arm64', 'x64'],
      config: commonDarwinConfig
    },
    {
      name: '@electron-forge/maker-deb',
      platforms: ['linux'],
      config: commonLinuxConfig,
    },
    {
      name: '@electron-forge/maker-rpm',
      platforms: ['linux'],
      config: commonLinuxConfig,
    },
  ],
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'dvigne',
          name: 'volt',
        },
        draft: true,
        prerelease: false,
      },
    },
  ],
};

function notarizeMaybe() {
  if (process.platform !== 'darwin') {
    return;
  }

  if (!process.env.CI) {
    console.log(`Not in CI, skipping notarization`);
    return;
  }

  if (!process.env.APPLE_ID || !process.env.APPLE_ID_PASSWORD) {
    console.warn(
      'Should be notarizing, but environment variables APPLE_ID or APPLE_ID_PASSWORD are missing!',
    );
    return;
  }

  config.packagerConfig.osxNotarize = {
    appBundleId: 'com.dvigne.volt',
    appleId: process.env.APPLE_ID,
    appleIdPassword: process.env.APPLE_ID_PASSWORD,
    ascProvider: 'CX7HBEUFA7',
  };
}

notarizeMaybe();

// Finally, export it
module.exports = config;
