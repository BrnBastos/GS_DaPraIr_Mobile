import { Action } from '@/components/ui/Action';
import { AppText } from '@/components/ui/AppText';
import { Screen } from '@/components/ui/Screen';
import { Badge, Card } from '@/components/ui/controls';
export default function AboutScreen() {
  return (
    <Screen title="Sobre o Dá Pra Ir?" backHref="/preferencias">
      <Badge label="Projeto acadêmico · CitizenTech" tone="sage" />
      <AppText variant="display">Antes de sair, conheça o caminho.</AppText>
      <AppText>
        Um companheiro de preparação para PCDs, pessoas autistas e famílias que levam uma criança às
        consultas.
      </AppText>
      <Card>
        <AppText variant="heading">Um bairro para começar</AppText>
        <AppText>
          O recorte é Vila Mariana, em São Paulo. Os oito locais, os guias e os relatos iniciais são
          fictícios. As fotografias são ilustrativas, de acervo Unsplash, e não retratam os
          estabelecimentos descritos.
        </AppText>
      </Card>
      <Card>
        <AppText variant="heading">Seus registros ficam aqui</AppText>
        <AppText>
          Preferências, visitas, preparativos, relatos e avisos são guardados neste aparelho. Não há
          conta, rastreamento de localização ou publicação em uma rede externa neste MVP.
        </AppText>
      </Card>
      <Card>
        <AppText variant="heading">Informação com contexto</AppText>
        <AppText>
          Avisos valem 24 horas. Guias e relatos valem 90 dias desde a última confirmação. Um
          registro vencido permanece no histórico e deixa de sustentar recomendações.
          Compatibilidade considera suas preferências e as informações válidas disponíveis.
        </AppText>
      </Card>
      <Action href="/" label="Explorar os locais" />
    </Screen>
  );
}
