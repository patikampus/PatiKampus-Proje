import { useRef, useState, useEffect } from 'react';
import {
  StyleSheet,
  ActivityIndicator,
  View,
  Text,
  TouchableOpacity,
  BackHandler,
  Platform,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

// ─────────────────────────────────────────────────────────────
// URL'yi buradan değiştirin. Frontend'i deploy edince
// (örn. https://patikampus.vercel.app) bu satıra yapıştırın.
// ─────────────────────────────────────────────────────────────
const APP_URL = 'https://mamakabi.ikbalperde.com/login';

const THEME_BG = '#0f0c29';

export default function App() {
  const webRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [canGoBack, setCanGoBack] = useState(false);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Android donanım geri tuşu: WebView'da geri git
  useEffect(() => {
    if (Platform.OS !== 'android') return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (canGoBack && webRef.current) {
        webRef.current.goBack();
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, [canGoBack]);

  const reload = () => {
    setError(null);
    setRefreshKey((k) => k + 1);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <StatusBar style="light" backgroundColor={THEME_BG} />

        {error ? (
          <ErrorView message={error} onRetry={reload} />
        ) : (
          <View style={styles.container}>
            <WebView
              key={refreshKey}
              ref={webRef}
              source={{ uri: APP_URL }}
              style={styles.webview}
              originWhitelist={['*']}
              javaScriptEnabled
              domStorageEnabled
              startInLoadingState
              allowsBackForwardNavigationGestures
              setSupportMultipleWindows={false}
              pullToRefreshEnabled
              onLoadStart={() => setLoading(true)}
              onLoadEnd={() => setLoading(false)}
              onNavigationStateChange={(state) => setCanGoBack(state.canGoBack)}
              onError={({ nativeEvent }) =>
                setError(nativeEvent.description || 'Sayfa yüklenemedi.')
              }
              onHttpError={({ nativeEvent }) => {
                if (nativeEvent.statusCode >= 500) {
                  setError(`Sunucu hatası (${nativeEvent.statusCode})`);
                }
              }}
              renderLoading={() => null}
            />

            {loading && (
              <View pointerEvents="none" style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color="#a78bfa" />
              </View>
            )}
          </View>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

function ErrorView({ message, onRetry }) {
  return (
    <ScrollView
      contentContainerStyle={styles.errorWrap}
      refreshControl={<RefreshControl refreshing={false} onRefresh={onRetry} />}
    >
      <Text style={styles.errorTitle}>Bağlantı sorunu</Text>
      <Text style={styles.errorMsg}>{message}</Text>
      <TouchableOpacity style={styles.retryBtn} onPress={onRetry}>
        <Text style={styles.retryText}>Tekrar Dene</Text>
      </TouchableOpacity>
      <Text style={styles.hint}>Aşağı çekerek de yenileyebilirsiniz.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: THEME_BG,
  },
  container: {
    flex: 1,
    backgroundColor: THEME_BG,
  },
  webview: {
    flex: 1,
    backgroundColor: THEME_BG,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME_BG,
  },
  errorWrap: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: THEME_BG,
  },
  errorTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 8,
  },
  errorMsg: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  retryBtn: {
    backgroundColor: '#7c3aed',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 14,
  },
  retryText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  hint: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    marginTop: 16,
    fontStyle: 'italic',
  },
});
