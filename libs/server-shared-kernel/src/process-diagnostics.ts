/*
 * Lightweight process diagnostics helpers.
 * Provides:
 *  - Registration of handlers for uncaughtException & unhandledRejection
 *  - Signal handlers (SIGINT, SIGTERM) with graceful shutdown hooks
 *  - Periodic heartbeat log (optional via env DIAGNOSTICS_HEARTBEAT_SECS)
 *  - One-time startup summary of key env / memory stats
 */

interface DiagnosticsOptions {
  serviceName?: string;
  enableHeartbeat?: boolean; // override env if provided
  heartbeatSeconds?: number; // override env if provided
  onShutdown?: () => Promise<void> | void; // custom cleanup
}

let registered = false;
let heartbeatTimer: NodeJS.Timeout | undefined;

export function registerProcessDiagnostics(opts: DiagnosticsOptions = {}) {
  if (registered) return; // avoid double registration in watch mode
  registered = true;

  const serviceName = opts.serviceName || process.env.SERVICE_NAME || 'server';
  const envHeartbeat = process.env.DIAGNOSTICS_HEARTBEAT_SECS
    ? Number(process.env.DIAGNOSTICS_HEARTBEAT_SECS)
    : undefined;
  const heartbeatSeconds =
    opts.heartbeatSeconds ??
    envHeartbeat ??
    (process.env.NODE_ENV === 'production' ? 60 : 30);
  const enableHeartbeat =
    opts.enableHeartbeat ?? process.env.DIAGNOSTICS_HEARTBEAT !== 'false';

  function log(msg: string, extra?: Record<string, unknown>) {
    const base: Record<string, unknown> = {
      ts: new Date().toISOString(),
      diag: true,
      service: serviceName,
      pid: process.pid,
      msg,
    };
    const merged = extra ? { ...base, ...extra } : base;
    // Single-line JSON for easy ingestion
    console.log(JSON.stringify(merged));
  }

  log('diagnostics_registered', {
    node: process.version,
    platform: process.platform,
    argv: process.argv.slice(2),
    env: {
      NODE_ENV: process.env.NODE_ENV,
      SERVER_PORT: process.env.SERVER_PORT,
      SERVER_HOST: process.env.SERVER_HOST,
      SERVICE_NAME: process.env.SERVICE_NAME,
    },
    memory: process.memoryUsage(),
  });

  process.on('uncaughtException', (err) => {
    log('uncaught_exception', { error: serializeError(err) });
  });
  process.on('unhandledRejection', (reason: unknown) => {
    log('unhandled_rejection', { reason: serializeError(reason) });
  });

  ['SIGINT', 'SIGTERM'].forEach((sig) => {
    process.on(sig as NodeJS.Signals, async () => {
      log('signal_received', { signal: sig });
      try {
        await opts.onShutdown?.();
        log('shutdown_complete', { signal: sig });
      } catch (e) {
        log('shutdown_error', { signal: sig, error: serializeError(e) });
      } finally {
        // 130: SIGINT (128 + 2), 143: SIGTERM (128 + 15) per standard shell exit codes
        const EXIT_CODE_SIGINT = 130;
        const EXIT_CODE_SIGTERM = 143;
        process.exit(sig === 'SIGINT' ? EXIT_CODE_SIGINT : EXIT_CODE_SIGTERM);
      }
    });
  });

  if (enableHeartbeat) {
    heartbeatTimer = setInterval(() => {
      const mem = process.memoryUsage();
      log('heartbeat', {
        rssMB: Math.round((mem.rss / 1024 / 1024) * 10) / 10,
        heapUsedMB: Math.round((mem.heapUsed / 1024 / 1024) * 10) / 10,
        uptimeSec: Math.round(process.uptime()),
      });
    }, heartbeatSeconds * 1000).unref();
  }
}

export function unregisterProcessDiagnostics() {
  if (heartbeatTimer) clearInterval(heartbeatTimer);
  heartbeatTimer = undefined;
  registered = false;
}

function serializeError(err: unknown) {
  if (!err) return null;
  if (err instanceof Error) {
    return {
      name: err.name,
      message: err.message,
      stack: err.stack,
    };
  }
  if (typeof err === 'object') return err;
  return { value: String(err) };
}
