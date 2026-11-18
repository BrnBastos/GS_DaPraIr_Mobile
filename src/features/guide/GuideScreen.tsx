import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Action } from '@/components/ui/Action';
import { AppText } from '@/components/ui/AppText';
import { Artwork } from '@/components/ui/Artwork';
import { Icon } from '@/components/ui/Icon';
import { Screen } from '@/components/ui/Screen';
import { Badge, Card, Chip, ErrorLine, InlineNotice, ui } from '@/components/ui/controls';
import { NEEDS, STAGES } from '@/domain/models';
import { isCurrent } from '@/domain/compatibility';
import { formatDate } from '@/domain/dates';
import { useApp, useTask } from '@/services/AppProvider';
import { stageArt } from '@/services/story-art';
import { colors } from '@/theme/tokens';
import { DemoLabel, FactRow, NoRecord, StageNotices } from '@/features/shared';
export function GuideScreen({ localId, visitId }: { localId?: string; visitId?: string }) {
  const { data, now, perform } = useApp();
  const [together, setTogether] = useState(false);
  const [details, setDetails] = useState(false);
  const [all, setAll] = useState(false);
  const task = useTask();
  const place = data.places.find((item) => item.id === localId);
  if (!place) return <NoRecord />;
  const visit = data.visits.find((item) => item.id === visitId && item.placeId === place.id);
  const needs = visit?.needs ?? data.needs;
  const index = data.guidePositions[place.id] ?? 0;
  const stage = STAGES[index];
  const art = stageArt[stage.id];
  const step = place.steps[index];
  const fresh = isCurrent(place, now);
  const linked = NEEDS.filter((need) => need.stage === stage.id && needs.includes(need.key));
  const change = (position: number) => {
    setDetails(false);
    void task.execute(() => perform((repo) => repo.saveGuidePosition(place.id, position)));
  };
  const finalHref = visit
    ? { pathname: '/visitas/[id]' as const, params: { id: visit.id } }
    : { pathname: '/visitas/nova' as const, params: { localId: place.id } };
  return (
    <Screen
      title={together ? 'Ver junto' : 'Pré-visita guiada'}
      backHref={
        visit
          ? { pathname: '/visitas/[id]', params: { id: visit.id } }
          : { pathname: '/locais/[id]', params: { id: place.id } }
      }
      headerRight={
        <Action
          label={together ? 'Sair' : 'Ver junto'}
          accessibilityHint={together ? 'Sair do modo Ver junto' : undefined}
          icon={together ? undefined : 'book-open'}
          appearance="text"
          onPress={() => setTogether(!together)}
        />
      }
      footer={
        <>
          <ErrorLine message={task.error} />
          <View style={ui.row}>
            <Action
              label="Anterior"
              appearance="outline"
              style={{ flex: 1 }}
              disabled={index === 0 || task.busy}
              onPress={() => change(index - 1)}
            />
            {index < 4 ? (
              <Action
                label="Próximo"
                style={{ flex: 1 }}
                disabled={task.busy}
                onPress={() => change(index + 1)}
              />
            ) : (
              <Action
                href={finalHref}
                label={visit ? 'Voltar ao roteiro' : 'Preparar visita'}
                style={{ flex: 1 }}
              />
            )}
          </View>
        </>
      }
    >
      <View style={ui.gap8}>
        <View style={ui.row}>
          <AppText variant="small" muted style={{ flex: 1 }}>
            {place.name}
          </AppText>
          <DemoLabel />
        </View>
        <AppText variant="label" style={{ color: colors.primary }}>
          Passo {index + 1} de 5 · {stage.title}
        </AppText>
        <View style={ui.row}>
          {STAGES.map((item, position) => (
            <View
              key={item.id}
              style={{
                height: 4,
                flex: 1,
                borderRadius: 4,
                backgroundColor:
                  position === index
                    ? colors.primary
                    : position < index
                      ? colors.leaf
                      : colors.border,
              }}
            />
          ))}
        </View>
      </View>
      <View style={styles.scene}>
        <View style={[styles.illustration, together && styles.togetherIllustration]}>
          <Artwork
            source={art.source}
            alt={`Cena ilustrativa: ${art.alt}`}
            style={styles.sceneImage}
          />
        </View>
        <View style={[styles.sceneCopy, { backgroundColor: colors[stage.color] }]}>
          <View style={ui.row}>
            <Icon name={stage.icon} size={17} color={colors.primary} />
            <AppText variant="overline" style={{ flex: 1 }}>
              Cena ilustrativa · {stage.title}
            </AppText>
          </View>
          <AppText variant={together ? 'hero' : 'display'}>{step.title}</AppText>
          <AppText style={together ? { fontSize: 20, lineHeight: 28 } : undefined}>
            {fresh ? step.description : 'Esta parte do guia precisa de uma nova confirmação.'}
          </AppText>
        </View>
      </View>
      {!fresh ? (
        <InlineNotice tone="peach" title="Guia desatualizado">
          {`Última confirmação em ${formatDate(place.confirmedAt)}. Consulte o local antes de usar essa descrição como referência.`}
        </InlineNotice>
      ) : null}
      {linked.length ? (
        <Card>
          <AppText variant="heading">Você pediu atenção a esta parte</AppText>
          {linked.map((need) => (
            <FactRow key={need.key} place={place} need={need.key} selected />
          ))}
        </Card>
      ) : null}
      <StageNotices place={place} stage={stage.id} />
      <Action
        label={details ? 'Ocultar detalhes' : 'Ver detalhes deste passo'}
        appearance="text"
        onPress={() => setDetails(!details)}
      />
      {details ? (
        <Card>
          {!fresh ? <Badge label="Descrição histórica · desatualizada" tone="peach" /> : null}
          <AppText>{step.detail}</AppText>
          <AppText variant="small" muted>
            Guia confirmado em {formatDate(place.confirmedAt)}. A ordem pode mudar no dia do
            atendimento.
          </AppText>
        </Card>
      ) : null}
      <Action
        label={all ? 'Ocultar todos os passos' : 'Ver todos os passos'}
        appearance="outline"
        onPress={() => setAll(!all)}
      />
      {all ? (
        <View style={ui.wrap}>
          {STAGES.map((item, position) => (
            <Chip
              key={item.id}
              label={`${position + 1}. ${item.title}`}
              selected={index === position}
              icon={item.icon}
              onPress={() => change(position)}
            />
          ))}
        </View>
      ) : null}
      <AppText variant="small" muted>
        Você está conhecendo o guia. O andamento da visita é registrado separadamente em “Agora
        vou”.
      </AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scene: { borderRadius: 22, overflow: 'hidden', backgroundColor: colors.sage },
  illustration: { width: '100%', aspectRatio: 16 / 9 },
  togetherIllustration: { aspectRatio: 3 / 2 },
  sceneImage: { width: '100%', height: '100%' },
  sceneCopy: { padding: 18, gap: 8 },
});
