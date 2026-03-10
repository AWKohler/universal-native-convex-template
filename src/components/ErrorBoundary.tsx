import { Component, type ErrorInfo, type ReactNode } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { sendReactErrorToParent } from '../lib/ParentCommunication';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });

    sendReactErrorToParent(
      error.message,
      error.stack ?? '',
      errorInfo.componentStack ?? '',
    );

    console.error('React Error Boundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const { error, errorInfo } = this.state;

      if (Platform.OS === 'web') {
        return (
          <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            color: '#ff6b6b',
            fontFamily: 'ui-monospace, monospace',
            fontSize: '14px',
            padding: '20px',
            overflow: 'auto',
            zIndex: 99999,
          }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <h1 style={{ color: '#ff6b6b', fontSize: '24px', marginBottom: '16px' }}>
                Runtime Error
              </h1>
              <div style={{
                backgroundColor: 'rgba(255, 107, 107, 0.1)',
                border: '1px solid #ff6b6b',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '16px',
              }}>
                <div style={{ color: '#fff', fontWeight: 'bold', marginBottom: '8px' }}>
                  {error?.message || 'Unknown error'}
                </div>
                {error?.stack && (
                  <pre style={{
                    color: '#aaa',
                    fontSize: '12px',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    margin: 0,
                  }}>
                    {error.stack}
                  </pre>
                )}
              </div>
              {errorInfo?.componentStack && (
                <div style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '8px',
                  padding: '16px',
                }}>
                  <div style={{ color: '#888', marginBottom: '8px' }}>Component Stack:</div>
                  <pre style={{
                    color: '#666',
                    fontSize: '12px',
                    whiteSpace: 'pre-wrap',
                    margin: 0,
                  }}>
                    {errorInfo.componentStack}
                  </pre>
                </div>
              )}
              <button
                onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
                style={{
                  marginTop: '20px',
                  padding: '10px 20px',
                  backgroundColor: '#ff6b6b',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                Try Again
              </button>
            </div>
          </div>
        );
      }

      return (
        <View style={styles.container}>
          <Text style={styles.title}>Runtime Error</Text>
          <ScrollView style={styles.scroll}>
            <View style={styles.errorBox}>
              <Text style={styles.message}>{error?.message || 'Unknown error'}</Text>
              {error?.stack && (
                <Text style={styles.stack}>{error.stack}</Text>
              )}
            </View>
            {errorInfo?.componentStack && (
              <View style={styles.stackBox}>
                <Text style={styles.stackLabel}>Component Stack:</Text>
                <Text style={styles.stack}>{errorInfo.componentStack}</Text>
              </View>
            )}
          </ScrollView>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.setState({ hasError: false, error: null, errorInfo: null })}
          >
            <Text style={styles.buttonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    color: '#ff6b6b',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    fontFamily: 'monospace',
  },
  scroll: {
    flexGrow: 0,
    maxHeight: '60%',
    marginBottom: 16,
  },
  errorBox: {
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderWidth: 1,
    borderColor: '#ff6b6b',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  message: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontFamily: 'monospace',
    fontSize: 14,
    marginBottom: 8,
  },
  stack: {
    color: '#aaa',
    fontFamily: 'monospace',
    fontSize: 12,
  },
  stackBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 16,
  },
  stackLabel: {
    color: '#888',
    fontSize: 12,
    marginBottom: 6,
  },
  button: {
    backgroundColor: '#ff6b6b',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default ErrorBoundary;
