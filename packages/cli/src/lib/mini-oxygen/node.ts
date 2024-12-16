import {AsyncLocalStorage} from 'node:async_hooks';
import {readFile} from '@shopify/cli-kit/node/fs';
import {renderSuccess} from '@shopify/cli-kit/node/ui';
import colors from '@shopify/cli-kit/node/colors';
import {AbortError} from '@shopify/cli-kit/node/error';
import type {MiniOxygenOptions as InternalMiniOxygenOptions} from '@shopify/mini-oxygen/node';
import {DEFAULT_INSPECTOR_PORT} from '../flags.js';
import type {MiniOxygenInstance, MiniOxygenOptions} from './types.js';
import {
  SUBREQUEST_PROFILER_ENDPOINT,
  logRequestLine,
  handleMiniOxygenImportFail,
} from './common.js';
import {
  H2O_BINDING_NAME,
  createLogRequestEvent,
  handleDebugNetworkRequest,
  setConstructors,
} from '../request-events.js';
import {findPort} from '../find-port.js';
import {getUtilityBannerlines} from '../dev-shared.js';
import {outputNewline} from '@shopify/cli-kit/node/output';
import {importLocal} from '../import-utils.js';

export async function startNodeServer({
  appPort,
  watch = false,
  buildPathWorkerFile,
  buildPathClient,
  env,
  debug = false,
  inspectorPort,
  root,
}: MiniOxygenOptions): Promise<MiniOxygenInstance> {
  type MiniOxygenType = typeof import('@shopify/mini-oxygen/node');
  const {startServer, Request, Response} = await importLocal<MiniOxygenType>(
    '@shopify/mini-oxygen/node',
    root,
  ).catch(handleMiniOxygenImportFail);

  setConstructors({Response});

  const logRequestEvent = createLogRequestEvent();
  const asyncLocalStorage = new AsyncLocalStorage();
  const serviceBindings = {
    [H2O_BINDING_NAME]: {
      fetch: async (request: Request) =>
        logRequestEvent(
          new Request(request.url, {
            method: 'POST',
            body: JSON.stringify({
              ...(asyncLocalStorage.getStore() as Record<string, string>),
              ...((await request.json()) as Record<string, string>),
            }),
          }),
        ),
    },
  };

  if (debug) {
    if (!inspectorPort) inspectorPort = await findPort(DEFAULT_INSPECTOR_PORT);
    (await import('node:inspector')).open(inspectorPort);
  }

  const readWorkerFile = () =>
    readFile(buildPathWorkerFile).catch((error) => {
      throw new AbortError(
        `Could not read worker file.\n\n` + error.stack,
        'Did you build the project?',
      );
    });

  const miniOxygen = await startServer({
    script: await readWorkerFile(),
    workerFile: buildPathWorkerFile,
    assetsDir: buildPathClient,
    publicPath: '',
    port: appPort,
    watch,
    autoReload: watch,
    modules: true,
    env: {
      ...env,
      ...process.env,
      ...serviceBindings,
    },
    log: () => {},
    async onRequest(request, defaultDispatcher) {
      const url = new URL(request.url);
      if (url.pathname === SUBREQUEST_PROFILER_ENDPOINT) {
        return handleDebugNetworkRequest(request);
      }

      const requestId = request.headers.get('request-id')!;
      const startTimeMs = Date.now();

      // Provide headers to sub-requests and dispatch the request.
      const response = await asyncLocalStorage.run(
        {requestId, purpose: request.headers.get('purpose')},
        () => defaultDispatcher(request),
      );

      const endTimeMs = Date.now();

      logRequestLine({
        request: {
          url: request.url,
          method: request.method,
          headers: Object.fromEntries(request.headers.entries()),
        },
        response: {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
        },
        meta: {
          startTimeMs,
          endTimeMs,
          durationMs: startTimeMs > 0 ? endTimeMs - startTimeMs : 0,
        },
      });

      return response;
    },
  });

  const listeningAt = `http://localhost:${miniOxygen.port}`;

  return {
    listeningAt,
    port: miniOxygen.port,
    async reload(options) {
      const nextOptions: Partial<InternalMiniOxygenOptions> = {};

      if (options?.env) {
        nextOptions.env = {
          ...options.env,
          ...(process.env as Record<string, string>),
        };
      }

      nextOptions.script = await readWorkerFile();

      await miniOxygen.reload(nextOptions);
    },
    showBanner(options) {
      outputNewline();

      const customSections = [];

      if (options?.host) {
        customSections.push({body: getUtilityBannerlines(options.host)});
      }

      if (debug && inspectorPort) {
        customSections.push({
          body: {warn: `Debugger listening on ws://localhost:${inspectorPort}`},
        });
      }

      renderSuccess({
        headline: `${options?.headlinePrefix ?? ''}MiniOxygen (Node Sandbox) ${
          options?.mode ?? 'development'
        } server running.`,
        body: [
          `View ${
            options?.appName ? colors.cyan(options?.appName) : 'Hydrogen'
          } app:`,
          {link: {url: options?.host || listeningAt}},
        ],
        customSections,
      });
      console.log('');
    },
    async close() {
      await miniOxygen.close();
    },
  };
}
