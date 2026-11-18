import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { Action } from '@/components/ui/Action';
import { AppText } from '@/components/ui/AppText';
import { Artwork } from '@/components/ui/Artwork';
import { Screen } from '@/components/ui/Screen';
import { Icon } from '@/components/ui/Icon';
import { Badge, Card, ui } from '@/components/ui/controls';
import { NEEDS } from '@/domain/models';
import { useApp } from '@/services/AppProvider';
import { storyArt } from '@/services/story-art';
import { colors } from '@/theme/tokens';
import { DemoFooter } from '@/features/shared';
export function PreferencesScreen() {
  const { data } = useApp();
  const { width, fontScale } = useWindowDimensions();
  const stack = width < 350 || fontScale >= 1.4;
  return (
    <Screen tab title="Preferências">
      <View style={[styles.masthead, stack && styles.stack]}>
        <Artwork source={storyArt.preferences} style={styles.art} />
        <View style={ui.grow}>
          <AppText variant="overline">O que faz diferença</AppText>
          <AppText variant="hero">Seu jeito de ir</AppText>
        </View>
      </View>
      <View style={ui.gap16}>
        <AppText variant="heading">Suas escolhas</AppText>
        {data.needs.length ? (
          <View style={styles.choices}>
            {NEEDS.filter((need) => data.needs.includes(need.key)).map((need) => (
              <View key={need.key} style={styles.choice}>
                <View style={styles.iconWell}>
                  <Icon name={need.icon} size={20} color={colors.primary} />
                </View>
                <AppText style={{ flex: 1 }}>{need.label}</AppText>
                <Icon name="check" size={18} color={colors.primary} />
              </View>
            ))}
          </View>
        ) : (
          <AppText muted>
            Escolha o que você quer que o app destaque nos locais e no passo a passo.
          </AppText>
        )}
        <Action
          href="/preferencias/editar"
          label={data.needs.length ? 'Editar preferências' : 'Definir preferências'}
        />
      </View>
      <Card>
        <AppText variant="heading">Informações no seu controle</AppText>
        <AppText variant="small" muted>
          As escolhas ficam neste aparelho. Você pode alterá-las quando quiser, sem informar
          diagnóstico ou dados da criança.
        </AppText>
        <Badge label="Sem conta · sem diagnóstico" tone="sage" />
      </Card>
      <Action href="/sobre" appearance="text" label="Sobre o Dá Pra Ir?" icon="info" />
      <DemoFooter />
    </Screen>
  );
}

const styles = StyleSheet.create({
  masthead: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lavender,
    borderRadius: 22,
    gap: 16,
    padding: 16,
  },
  stack: { flexDirection: 'column', alignItems: 'stretch' },
  art: { width: 104, height: 104, borderRadius: 16 },
  choices: { gap: 6 },
  choice: {
    ...ui.row,
    minHeight: 52,
    borderBottomWidth: 1,
    borderColor: colors.border,
    paddingVertical: 8,
  },
  iconWell: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.sage,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
