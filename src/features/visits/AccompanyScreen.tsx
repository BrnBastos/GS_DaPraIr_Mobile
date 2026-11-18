import { useState } from 'react';
import { router } from 'expo-router';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { Action } from '@/components/ui/Action';
import { AppText } from '@/components/ui/AppText';
import { Icon } from '@/components/ui/Icon';
import { PressableSurface } from '@/components/ui/PressableSurface';
import { Screen } from '@/components/ui/Screen';
import { Badge, Card, ErrorLine, InlineNotice, ui } from '@/components/ui/controls';
import { STAGES, NEEDS } from '@/domain/models';
import { isCurrent } from '@/domain/compatibility';
import { scheduledLabel } from '@/domain/dates';
import { useApp, useTask } from '@/services/AppProvider';
import { colors } from '@/theme/tokens';
import { FactRow, NoRecord, StageNotices } from '@/features/shared';
export function AccompanyScreen({ visitId }: { visitId?: string }) {
  const { data, now, perform } = useApp();
  const { width, fontScale } = useWindowDimensions();
  const stackSteps = width < 300 || fontScale >= 1.4;
  const visit = data.visits.find((item) => item.id === visitId);
  const [index, setIndex] = useState(visit?.currentStage ?? 0);
  const task = useTask();
  if (!visit) return <NoRecord kind="Visita" />;
  const place = data.places.find((item) => item.id === visit.placeId)!;
  const stage = STAGES[index];
  const step = place.steps[index];
  const back = { pathname: '/visitas/[id]' as const, params: { id: visit.id } };
  const marked = visit.status === 'in_progress' && visit.currentStage === index;
  const linked = NEEDS.filter((need) => need.stage === stage.id && visit.needs.includes(need.key));
  const done = visit.items.filter((item) => item.checked).length;
  const mark = () =>
    void task.execute(() =>
      perform(
        (repo) =>
          repo.updateVisit(visit.id, {
            status: 'in_progress',
            currentStage: index,
          }),
        'Etapa da visita registrada.',
      ),
    );
  const finish = () =>
    void task.execute(
      () =>
        perform(
          (repo) =>
            repo.updateVisit(visit.id, {
              status: 'completed',
              currentStage: index,
            }),
          'Visita finalizada. Conte como foi quando quiser.',
        ),
      () => router.replace(back),
    );
  if (visit.status === 'completed')
    return (
      <Screen title="Visita concluída" backHref={back}>
        <Card>
          <Icon name="check-circle" size={40} color={colors.primary} />
          <AppText variant="display">Seu percurso ficou registrado.</AppText>
          <Action href={back} label="Ver roteiro e contar como foi" />
        </Card>
      </Screen>
    );
  return (
    <Screen
      title="Agora vou"
      backHref={back}
      footer={
        <>
          <ErrorLine message={task.error} />
          {index === STAGES.length - 1 ? (
            <Action label="Finalizar visita" loading={task.busy} onPress={finish} />
          ) : (
            <Action
              label={
                marked
                  ? 'Etapa registrada'
                  : visit.status === 'planned'
                    ? 'Começar visita nesta etapa'
                    : 'Estou nesta etapa'
              }
              disabled={marked}
              loading={task.busy}
              onPress={mark}
            />
          )}
          <View style={ui.row}>
            <Action
              label="Anterior"
              style={{ flex: 1 }}
              appearance="text"
              disabled={index === 0}
              onPress={() => setIndex(index - 1)}
            />
            <Action
              label="Próxima etapa"
              style={{ flex: 1 }}
              appearance="outline"
              disabled={index === STAGES.length - 1}
              onPress={() => setIndex(index + 1)}
            />
          </View>
        </>
      }
    >
      <View style={ui.gap8}>
        <AppText variant="heading">{place.name}</AppText>
        <AppText variant="small" muted>
          {scheduledLabel(visit.scheduledAt)}
        </AppText>
        <Badge
          label={
            visit.status === 'planned'
              ? 'Você decide quando começar'
              : `Etapa registrada: ${STAGES[visit.currentStage].title}`
          }
          tone="sage"
        />
      </View>
      <View style={styles.focus}>
        <View style={ui.row}>
          <View style={styles.stageIcon}>
            <Icon name={stage.icon} size={24} color={colors.forest} />
          </View>
          <AppText variant="overline" style={styles.phaseLabel}>
            Etapa {index + 1} de {STAGES.length}
          </AppText>
        </View>
        <AppText variant="hero" style={styles.focusText}>
          {stage.title}
        </AppText>
        <AppText style={styles.focusText}>
          {isCurrent(place, now)
            ? step.description
            : 'O guia desta etapa está desatualizado. Confirme as condições com o local.'}
        </AppText>
      </View>
      <View style={ui.gap8}>
        <AppText variant="heading">Seu percurso</AppText>
        <View style={[styles.steps, stackSteps && styles.stepsStack]}>
          {STAGES.map((item, position) => {
            const selected = position === index;
            const recorded = visit.status === 'in_progress' && position === visit.currentStage;
            return (
              <PressableSurface
                key={item.id}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                accessibilityLabel={`${position + 1}. ${item.title}${recorded ? ', etapa registrada' : ''}`}
                onPress={() => setIndex(position)}
                style={[
                  styles.step,
                  stackSteps && styles.stepStack,
                  selected && styles.stepSelected,
                ]}
              >
                <View style={[styles.stepDot, selected && styles.stepDotSelected]}>
                  <Icon
                    name={recorded ? 'check' : item.icon}
                    size={17}
                    color={selected ? colors.white : colors.primary}
                  />
                </View>
                <AppText variant="overline" style={styles.stepLabel}>
                  {item.title}
                </AppText>
              </PressableSurface>
            );
          })}
        </View>
      </View>
      {linked.length ? (
        <Card>
          <AppText variant="heading">Atenção nesta etapa</AppText>
          {linked.map((need) => (
            <FactRow key={need.key} place={place} need={need.key} selected />
          ))}
        </Card>
      ) : null}
      <StageNotices place={place} stage={stage.id} />
      <InlineNotice>
        Escolher uma etapa na tela permite consultá-la. O andamento só muda ao tocar no botão de
        registro.
      </InlineNotice>
      <Card>
        <AppText variant="heading">
          Preparativos: {done} de {visit.items.length}
        </AppText>
        {visit.items
          .filter((item) => !item.checked)
          .slice(0, 3)
          .map((item) => (
            <AppText key={item.id} variant="small" muted>
              • {item.text}
            </AppText>
          ))}
        <Action href={back} label="Abrir meu roteiro" appearance="outline" />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  focus: { backgroundColor: colors.forest, borderRadius: 22, padding: 20, gap: 10 },
  stageIcon: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: colors.leaf,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phaseLabel: { color: colors.leaf, flex: 1, marginLeft: 4 },
  focusText: { color: colors.white },
  steps: { flexDirection: 'row', gap: 4 },
  stepsStack: { flexDirection: 'column' },
  step: {
    flex: 1,
    minWidth: 48,
    minHeight: 64,
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 2,
    borderRadius: 12,
  },
  stepStack: { flex: 0, flexDirection: 'row', paddingHorizontal: 10, gap: 10 },
  stepSelected: { backgroundColor: colors.sage },
  stepDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.soft,
  },
  stepDotSelected: { backgroundColor: colors.primary },
  stepLabel: { textAlign: 'center', flexShrink: 1 },
});
