import { ConvexReactClient } from 'convex/react';

/**
 * Convex is provisioned by the platform. We assume EXPO_PUBLIC_CONVEX_URL is
 * injected by the orchestrator before runtime (via .env or platform secrets).
 */
const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL;

if (!convexUrl) {
  throw new Error(
    'EXPO_PUBLIC_CONVEX_URL missing. Add it to .env.local or inject it via platform secrets.',
  );
}

export const convexClient = new ConvexReactClient(convexUrl);
