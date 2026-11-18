import { AppState, View } from 'react-native';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { Repository } from '@/db/repository';
import type { Snapshot } from '@/domain/models';
import { UserFacingError } from '@/domain/errors';
import { colors } from '@/theme/tokens';
import { AppText } from '@/components/ui/AppText';
import { Action } from '@/components/ui/Action';
import { Screen } from '@/components/ui/Screen';
import { Loading } from '@/components/ui/controls';
import { getApplication } from './application';

type Perform = <T>(action: (repository: Repository) => Promise<T>, message?: string) => Promise<T>;
const Context = createContext<{
  data: Snapshot;
  now: Date;
  perform: Perform;
  refresh: () => Promise<void>;
} | null>(null);
export function AppProvider({ children }: PropsWithChildren) {
  const [data, setData] = useState<Snapshot | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(() => new Date());
  const [toast, setToast] = useState<{ id: number; text: string } | null>(null);
  const insets = useSafeAreaInsets();
  const refresh = useCallback(async () => {
    const repository = await getApplication();
    setData(await repository.readSnapshot());
    setNow(new Date());
  }, []);
  const initialize = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      await refresh();
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [refresh]);
  useEffect(() => {
    let mounted = true;
    void getApplication()
      .then((repository) => repository.readSnapshot())
      .then((snapshot) => {
        if (mounted) {
          setData(snapshot);
          setNow(new Date());
        }
      })
      .catch(() => {
        if (mounted) setError(true);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 4500);
    return () => clearTimeout(id);
  }, [toast]);
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') setNow(new Date());
    });
    return () => subscription.remove();
  }, []);
  useEffect(() => {
    if (!data) return;
    const dates = [...data.places, ...data.evidence, ...data.notices, ...data.reports]
      .map((item) => Date.parse(item.expiresAt))
      .filter((date) => date > now.getTime());
    if (!dates.length) return;
    const timeout = setTimeout(
      () => setNow(new Date()),
      Math.min(Math.min(...dates) - now.getTime() + 10, 2147483647),
    );
    return () => clearTimeout(timeout);
  }, [data, now]);
  const perform: Perform = useCallback(
    async (action, message) => {
      const repository = await getApplication();
      const result = await action(repository);
      await refresh();
      if (message) setToast({ id: Date.now(), text: message });
      return result;
    },
    [refresh],
  );
  if (loading && !data)
    return (
      <Screen title="Dá Pra Ir?">
        <Loading label="Preparando os locais do bairro…" />
      </Screen>
    );
  if (error && !data)
    return (
      <Screen title="Não foi possível carregar">
        <AppText>Seu conteúdo não foi apagado. Tente abrir os dados novamente.</AppText>
        <Action label="Tentar novamente" onPress={() => void initialize()} />
      </Screen>
    );
  if (!data) return null;
  return (
    <Context value={{ data, now, perform, refresh }}>
      <View style={{ flex: 1 }}>
        {children}
        {toast ? (
          <View
            key={toast.id}
            pointerEvents="none"
            style={{
              position: 'absolute',
              left: 16,
              right: 16,
              bottom: Math.max(insets.bottom, 8) + 88,
              backgroundColor: colors.text,
              padding: 16,
              borderRadius: 12,
            }}
          >
            <AppText
              accessibilityRole="alert"
              accessibilityLiveRegion="polite"
              style={{ color: colors.white }}
            >
              {toast.text}
            </AppText>
          </View>
        ) : null}
      </View>
    </Context>
  );
}
export function useApp() {
  const value = useContext(Context);
  if (!value) throw new Error('AppProvider ausente.');
  return value;
}
export function useTask() {
  const [busy, setBusy] = useState(false);
  const inFlight = useRef(false);
  const [error, setError] = useState<string | null>(null);
  async function execute<T>(action: () => Promise<T>, success?: (value: T) => void) {
    if (inFlight.current) return;
    inFlight.current = true;
    setBusy(true);
    setError(null);
    try {
      const value = await action();
      success?.(value);
      return value;
    } catch (reason) {
      setError(
        reason instanceof UserFacingError
          ? reason.message
          : 'Não foi possível salvar agora. Seu preenchimento foi mantido. Tente novamente.',
      );
    } finally {
      inFlight.current = false;
      setBusy(false);
    }
  }
  return { busy, error, setError, execute };
}
