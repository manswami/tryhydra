import {fileExists, readFile, writeFile} from '@shopify/cli-kit/node/fs';
import {joinPath} from '@shopify/cli-kit/node/path';
import {renderConfirmationPrompt} from '@shopify/cli-kit/node/ui';
import {type AssetsDir, getAssetsDir} from '../../build.js';

export type CssStrategy =
  | 'tailwind'
  | 'css-modules'
  | 'vanilla-extract'
  | 'postcss';

export const SETUP_CSS_STRATEGIES: CssStrategy[] = [
  'tailwind',
  'vanilla-extract',
  'css-modules',
  'postcss',
];

export async function copyAssets(
  feature: AssetsDir,
  assets: Record<string, string>,
  rootDirectory: string,
  replacer = (content: string, filename: string) => content,
) {
  const setupAssetsPath = await getAssetsDir(feature);

  return Promise.all(
    Object.entries(assets).map(async ([source, destination]) => {
      const content = await readFile(joinPath(setupAssetsPath, source));
      await writeFile(
        joinPath(rootDirectory, destination),
        replacer(content, source),
      );
    }),
  );
}

export async function canWriteFiles(
  assetMap: Record<string, string>,
  directory: string,
  force: boolean,
) {
  const fileExistPromises = Object.values(assetMap).map((file) =>
    fileExists(joinPath(directory, file)).then((exists) =>
      exists ? file : null,
    ),
  );

  const existingFiles = (await Promise.all(fileExistPromises)).filter(
    Boolean,
  ) as string[];

  if (existingFiles.length > 0) {
    if (!force) {
      const overwrite = await renderConfirmationPrompt({
        message: `Some files already exist (${existingFiles.join(
          ', ',
        )}). Overwrite?`,
        defaultValue: false,
      });

      if (!overwrite) {
        return false;
      }
    }
  }

  return true;
}
