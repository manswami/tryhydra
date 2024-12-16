import type {Types} from '@graphql-codegen/plugin-helpers';
import {
  preset as internalPreset,
  type PresetConfig as InternalPresetConfig,
} from '@shopify/graphql-codegen';
import {getDefaultOptions} from './defaults.js';

export type PresetConfig = Partial<InternalPresetConfig>;

export const preset: Types.OutputPreset<PresetConfig> = {
  [Symbol.for('name')]: 'hydrogen',
  buildGeneratesSection: (options) => {
    try {
      const defaultOptions = getDefaultOptions(options.baseOutputDir);

      return internalPreset.buildGeneratesSection({
        ...options,
        presetConfig: {
          importTypes: {
            namespace: defaultOptions.namespacedImportName,
            from: defaultOptions.importTypesFrom,
          },
          interfaceExtension: defaultOptions.interfaceExtensionCode,
          ...options.presetConfig,
        } satisfies PresetConfig,
      });
    } catch (err) {
      const error = err as Error;

      error.message = error.message.replace(
        '[@shopify/graphql-codegen]',
        '[hydrogen-preset]',
      );

      throw error;
    }
  },
};
