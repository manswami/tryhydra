import {mergePackageJson} from '../../file.js';
import {getCodeFormatOptions} from '../../format-code.js';
import {injectVitePlugin} from './replacers.js';
import {getAssetsDir} from '../../build.js';
import type {CssSetupConfig, CssSetupResult} from './common.js';

export async function setupVanillaExtract({
  rootDirectory,
}: CssSetupConfig): Promise<undefined | CssSetupResult> {
  const workPromise = Promise.all([
    mergePackageJson(await getAssetsDir('vanilla-extract'), rootDirectory),
    getCodeFormatOptions(rootDirectory).then((formatConfig) =>
      injectVitePlugin(rootDirectory, formatConfig, {
        path: '@vanilla-extract/vite-plugin',
        name: 'vanillaExtractPlugin',
        isDefault: false,
      }),
    ),
  ]);

  return {
    workPromise,
    generatedAssets: [],
    needsInstallDeps: true,
  };
}
