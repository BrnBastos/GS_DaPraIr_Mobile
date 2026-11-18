import Feather from '@expo/vector-icons/Feather';
import { Inter_400Regular } from '@expo-google-fonts/inter/400Regular';
import { Inter_500Medium } from '@expo-google-fonts/inter/500Medium';
import { Inter_600SemiBold } from '@expo-google-fonts/inter/600SemiBold';
import { useFonts } from 'expo-font';
import { DefaultTheme, Stack, ThemeProvider, type ErrorBoundaryProps } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Action } from '@/components/ui/Action';
import { Screen } from '@/components/ui/Screen';
import { FontContext } from '@/theme/FontContext';
import { colors } from '@/theme/tokens';
import { AppProvider } from '@/services/AppProvider';

void SplashScreen.preventAutoHideAsync().catch(() => {
  // No navegador ou durante Fast Refresh, a splash pode já estar oculta.
});

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: colors.background,
    text: colors.text,
    primary: colors.primary,
    border: colors.border,
  },
};

export const unstable_settings = { initialRouteName: '(tabs)' };

export function ErrorBoundary({ retry }: ErrorBoundaryProps) {
  useEffect(() => {
    void SplashScreen.hideAsync().catch(() => {});
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Screen
        title="Não foi possível abrir esta tela."
        description="Tente carregar a tela novamente para continuar."
      >
        <Action
          label="Tentar novamente"
          onPress={() => {
            void retry();
          }}
          icon="refresh-cw"
        />
      </Screen>
    </SafeAreaProvider>
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    ...Feather.font,
  });

  useEffect(() => {
    if (loaded || error) {
      void SplashScreen.hideAsync().catch(() => {});
    }
  }, [loaded, error]);

  if (!loaded && !error) return null;

  return (
    <SafeAreaProvider>
      <FontContext value={loaded}>
        <ThemeProvider value={navigationTheme}>
          <StatusBar style="dark" />
          <AppProvider>
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: colors.background },
                animation: 'none',
              }}
            >
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="locais/[id]" options={{ title: 'Ficha do local' }} />
              <Stack.Screen name="visitas/nova" options={{ title: 'Nova visita' }} />
              <Stack.Screen name="visitas/[id]" options={{ title: 'Plano de visita' }} />
              <Stack.Screen name="preferencias/editar" options={{ title: 'Suas preferências' }} />
              <Stack.Screen name="relatos/novo" options={{ title: 'Novo relato' }} />
              <Stack.Screen name="avisos/novo" options={{ title: 'Novo aviso' }} />
              <Stack.Screen name="ensaio/[localId]" options={{ title: 'Pré-visita guiada' }} />
              <Stack.Screen name="acompanhar/[visitId]" options={{ title: 'Agora vou' }} />
              <Stack.Screen name="sobre" options={{ title: 'Sobre o Dá Pra Ir?' }} />
              <Stack.Screen name="+not-found" options={{ title: 'Página não encontrada' }} />
            </Stack>
          </AppProvider>
        </ThemeProvider>
      </FontContext>
    </SafeAreaProvider>
  );
}
