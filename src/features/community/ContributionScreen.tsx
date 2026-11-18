import { useState } from 'react';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Action } from '@/components/ui/Action';
import { AppText } from '@/components/ui/AppText';
import { Artwork } from '@/components/ui/Artwork';
import { Screen } from '@/components/ui/Screen';
import { Card, Chip, ErrorLine, FormField, InlineNotice, ui } from '@/components/ui/controls';
import { NEEDS, type NeedKey } from '@/domain/models';
import { useApp, useTask } from '@/services/AppProvider';
import { storyArt } from '@/services/story-art';
import { colors } from '@/theme/tokens';
import { NoRecord } from '@/features/shared';
export function ContributionScreen({
  kind,
  localId,
  visitId,
}: {
  kind: 'relato' | 'aviso';
  localId?: string;
  visitId?: string;
}) {
  const { data, perform } = useApp();
  const place = data.places.find(
    (item) => item.id === (localId === 'previa' ? 'clinica-jardim' : localId),
  );
  const visit = data.visits.find((item) => item.id === visitId && item.placeId === place?.id);
  const existing = data.reports.find((item) => item.visitId === visit?.id);
  const [outcome, setOutcome] = useState<'success' | 'difficulty' | null>(
    existing?.outcome ?? null,
  );
  const [category, setCategory] = useState<NeedKey | null>(existing?.need ?? null);
  const [effect, setEffect] = useState<'barrier' | 'info' | null>(null);
  const [title, setTitle] = useState('');
  const [text, setText] = useState(existing?.text ?? '');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const task = useTask();
  if (!place) return <NoRecord />;
  const isReport = kind === 'relato';
  const back = visit
    ? { pathname: '/visitas/[id]' as const, params: { id: visit.id } }
    : { pathname: '/locais/[id]' as const, params: { id: place.id } };
  const save = () => {
    const errors: Record<string, string> = {};
    if (isReport && !outcome) errors.outcome = 'Escolha como foi a visita.';
    if (!isReport && !title.trim()) errors.title = 'Descreva brevemente o que aconteceu.';
    if (!isReport && !category) errors.category = 'Escolha a parte da visita relacionada ao aviso.';
    if (!isReport && !effect) errors.effect = 'Escolha se há uma barreira ou uma informação útil.';
    setFieldErrors(errors);
    if (Object.keys(errors).length) return;
    void task.execute(
      () =>
        isReport
          ? perform(
              (repo) =>
                repo.saveReport({
                  placeId: place.id,
                  visitId: visit?.id,
                  outcome: outcome!,
                  need: category,
                  text,
                }),
              'Relato salvo neste aparelho.',
            )
          : perform(
              (repo) =>
                repo.createNotice({
                  placeId: place.id,
                  need: category!,
                  effect: effect!,
                  title,
                  text,
                }),
              'Aviso salvo, válido por 24 horas.',
            ),
      () => (router.canGoBack() ? router.back() : router.replace(back)),
    );
  };
  return (
    <Screen
      title={isReport ? 'Como foi a visita?' : 'Novo aviso de hoje'}
      backHref={back}
      footer={
        <>
          <ErrorLine message={task.error} />
          <Action
            label={task.busy ? 'Salvando…' : isReport ? 'Salvar relato' : 'Salvar aviso'}
            loading={task.busy}
            onPress={save}
          />
        </>
      }
    >
      {isReport ? (
        <View style={styles.reportHeader}>
          <Artwork source={storyArt.feedback} style={styles.reportArt} />
          <View style={styles.reportCopy}>
            <AppText variant="overline">Depois da consulta</AppText>
            <AppText variant="display">{place.name}</AppText>
            <AppText variant="small" muted>
              Local fictício · relato neste aparelho
            </AppText>
          </View>
        </View>
      ) : (
        <Card>
          <AppText variant="heading">{place.name}</AppText>
          <AppText variant="small" muted>
            Local fictício · colaboração simulada
          </AppText>
        </Card>
      )}
      {isReport ? (
        <View style={ui.gap16}>
          <AppText variant="heading">Deu certo para vocês?</AppText>
          <View style={ui.wrap}>
            <Chip
              label="Deu certo"
              selected={outcome === 'success'}
              onPress={() => setOutcome('success')}
              icon="smile"
            />
            <Chip
              label="Tive dificuldade"
              selected={outcome === 'difficulty'}
              onPress={() => setOutcome('difficulty')}
              icon="message-circle"
            />
          </View>
          <ErrorLine message={fieldErrors.outcome ?? null} />
        </View>
      ) : (
        <>
          <FormField
            label="O que aconteceu?"
            placeholder="Ex.: elevador indisponível"
            value={title}
            onChangeText={setTitle}
            maxLength={100}
            error={fieldErrors.title}
          />
          <View style={ui.gap8}>
            <AppText variant="label">Tipo de aviso</AppText>
            <View style={ui.wrap}>
              <Chip
                label="Há uma barreira"
                selected={effect === 'barrier'}
                onPress={() => setEffect('barrier')}
              />
              <Chip
                label="Informação útil"
                selected={effect === 'info'}
                onPress={() => setEffect('info')}
              />
            </View>
            <ErrorLine message={fieldErrors.effect ?? null} />
          </View>
        </>
      )}
      <View style={ui.gap8}>
        <AppText variant="label">
          {isReport ? 'Assunto (opcional)' : 'Sobre qual parte da visita?'}
        </AppText>
        <View style={ui.wrap}>
          {NEEDS.map((need) => (
            <Chip
              key={need.key}
              label={need.label}
              selected={category === need.key}
              onPress={() => setCategory(category === need.key ? null : need.key)}
            />
          ))}
        </View>
        <ErrorLine message={fieldErrors.category ?? null} />
      </View>
      <FormField
        label={isReport ? 'Quer contar um pouco mais? (opcional)' : 'Detalhes (opcional)'}
        value={text}
        onChangeText={setText}
        multiline
        maxLength={600}
        placeholder={
          isReport
            ? 'O que ajudou ou dificultou a visita?'
            : 'O que outra pessoa precisa saber antes de sair?'
        }
        help="Evite nomes, diagnósticos e informações que identifiquem crianças."
      />
      <InlineNotice
        title={isReport ? 'Experiência registrada por 90 dias' : 'Aviso válido por 24 horas'}
      >
        {isReport
          ? 'O retorno geral não confirma todos os recursos do local. Você pode registrar uma barreira atual em um aviso separado.'
          : 'Outras confirmações neste aparelho podem renovar a validade. O aviso fica no histórico quando vencer ou for resolvido.'}
      </InlineNotice>
      <AppText variant="small" muted>
        Contribuição anônima, salva apenas neste aparelho. Este MVP simula a colaboração entre
        famílias.
      </AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  reportHeader: { backgroundColor: colors.peach, borderRadius: 22, overflow: 'hidden' },
  reportArt: { width: '100%', height: 150 },
  reportCopy: { padding: 16, gap: 4 },
});
