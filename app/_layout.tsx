import '../global.css';

import { ConvexProvider } from 'convex/react';
import { Stack } from 'expo-router';
import ErrorBoundary from '../src/components/ErrorBoundary';
import { convexClient } from '../src/convexClient';
import {
  captureAndSendHtmlSnapshot,
  initParentCommunication,
} from '../src/lib/ParentCommunication';

// ============================================================================
// DO NOT REMOVE: Initialize debug communication with parent IDE window.
// Called at module level (not inside a component) so console interception
// is active before the first React render.
// ============================================================================
initParentCommunication();
captureAndSendHtmlSnapshot();

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <ConvexProvider client={convexClient}>
        <Stack screenOptions={{ headerShown: false }} />
      </ConvexProvider>
    </ErrorBoundary>
  );
}
