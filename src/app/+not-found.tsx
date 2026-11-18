import { Action } from '@/components/ui/Action';
import { Screen } from '@/components/ui/Screen';

export default function NotFoundScreen() {
  return (
    <Screen
      title="Este caminho não foi encontrado."
      description="Volte para Explorar e continue a navegação."
      backHref="/"
    >
      <Action href="/" label="Voltar para Explorar" />
    </Screen>
  );
}
