import { Platform } from 'react-native';

// ============================================================================
// DO NOT REMOVE: Debug infrastructure for parent window communication
// This forwards console logs, errors, and HMR events to the parent IDE.
// Without this, the agent's getBrowserLog tool will not work.
// ============================================================================

let initialized = false;

/**
 * Initialize parent window communication. Call this as early as possible
 * (module level in the root layout). Safe to call multiple times — guarded
 * by a flag so hot reloads won't re-register duplicate listeners.
 *
 * Only active on web (when the app is previewed inside an IDE iframe).
 */
export function initParentCommunication(): void {
  if (initialized) return;
  if (Platform.OS !== 'web') return;
  if (typeof window === 'undefined') return;
  initialized = true;

  // ── Console interception ──────────────────────────────────────────────────
  const originalConsole = {
    log: console.log.bind(console),
    warn: console.warn.bind(console),
    error: console.error.bind(console),
  };

  const forwardToParent = (level: string, ...args: unknown[]) => {
    try {
      window.parent.postMessage({
        type: 'IFRAME_CONSOLE',
        level,
        message: args
          .map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a)))
          .join(' '),
      }, '*');
    } catch {}
  };

  console.log = (...args) => { originalConsole.log(...args); forwardToParent('log', ...args); };
  console.warn = (...args) => { originalConsole.warn(...args); forwardToParent('warn', ...args); };
  console.error = (...args) => { originalConsole.error(...args); forwardToParent('error', ...args); };

  // ── Uncaught errors ───────────────────────────────────────────────────────
  window.addEventListener('error', (e) => {
    window.parent.postMessage({
      type: 'IFRAME_ERROR',
      message: e.message,
      filename: e.filename,
      lineno: e.lineno,
      colno: e.colno,
    }, '*');
  });

  // ── Unhandled promise rejections ──────────────────────────────────────────
  window.addEventListener('unhandledrejection', (e) => {
    window.parent.postMessage({
      type: 'IFRAME_ERROR',
      message: 'Unhandled Promise Rejection: ' + String(e.reason),
    }, '*');
  });

  // ── Expo / Metro HMR monitoring ───────────────────────────────────────────
  // module.hot exists in Metro web builds but addStatusHandler may not be
  // present in all environments (e.g. WebContainers). Guard before calling.
  // @ts-ignore
  if (typeof module !== 'undefined' && module.hot) {
    // @ts-ignore
    if (typeof module.hot.addStatusHandler === 'function') {
      // @ts-ignore
      module.hot.addStatusHandler((status: string) => {
        window.parent.postMessage({ type: 'EXPO_HMR', event: status }, '*');
      });
    }
    window.parent.postMessage({ type: 'EXPO_HMR', event: 'hmrModuleLoaded' }, '*');
  } else {
    window.parent.postMessage({ type: 'EXPO_HMR', event: 'hmrNotAvailable' }, '*');
  }
}

/**
 * Capture the full rendered HTML and send it to the parent IDE for thumbnail
 * generation. Fires 500 ms after the window load event so React has painted.
 *
 * DO NOT REMOVE: Enables automatic project thumbnail generation.
 */
export function captureAndSendHtmlSnapshot(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      try {
        const html = document.documentElement.outerHTML;
        window.parent.postMessage({ type: 'HTML_SNAPSHOT', html }, '*');
      } catch (e) {
        console.error('Could not send HTML snapshot:', e);
      }
    }, 500);
  });
}

/**
 * Forward a React error boundary catch to the parent IDE.
 * Called from ErrorBoundary.componentDidCatch.
 */
export function sendReactErrorToParent(
  message: string,
  stack: string,
  componentStack: string,
): void {
  if (typeof window === 'undefined') return;
  try {
    window.parent.postMessage({
      type: 'REACT_ERROR',
      message,
      stack,
      componentStack,
    }, '*');
  } catch {}
}
