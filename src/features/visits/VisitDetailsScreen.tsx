import { useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { Action } from '@/components/ui/Action';
import { AppText } from '@/components/ui/AppText';
import { Artwork } from '@/components/ui/Artwork';
import { Icon } from '@/components/ui/Icon';
import { Screen } from '@/components/ui/Screen';
import {
  Badge,
  Card,
  CheckRow,
  ConfirmDialog,
  ErrorLine,
  FormField,
  IconButton,
  InlineNotice,
  ui,
} from '@/components/ui/controls';
import { assessNeed, evaluatePlace, isCurrent, sameNeeds } from '@/domain/compatibility';
import { scheduledLabel } from '@/domain/dates';
import { NEEDS } from '@/domain/models';
import { useApp, useTask } from '@/services/AppProvider';
import { storyArt } from '@/services/story-art';
import { colors } from '@/theme/tokens';
import { DemoFooter, DemoLabel, NoRecord, PlaceStatus } from '@/features/shared';
import { ReportCard } from '@/features/places/PlaceDetailsScreen';
export function VisitDetailsScreen({ id }: { id?: string }) {
  const { data, now, perform, refresh } = useApp();
  const { width, fontScale } = useWindowDimensions();
  const stackActions = width < 350 || fontScale >= 1.4;
  const [editing, setEditing] = useState<string | null>(null);
  const [itemText, setItemText] = useState('');
  const [removing, setRemoving] = useState<string | null>(null);
  const task = useTask();
  const visit = data.visits.find((item) => item.id === id);
  if (!visit) return <NoRecord kind="Visita" />;
  const place = data.places.find((item) => item.id === visit.placeId)!;
  const evaluation = evaluatePlace(place, visit.needs, data.evidence, data.notices, now);
  const entrance = assessNeed(place, 'stepFree', data.evidence, data.notices, now);
  const quiet = assessNeed(place, 'quiet', data.evidence, data.notices, now);
  const feedback = data.reports.find((item) => item.visitId === visit.id);
  const completed = visit.status === 'completed';
  const schedule = visit.scheduledAt
    ? scheduledLabel(visit.scheduledAt)
    : visit.status === 'planned'
      ? 'Em planejamento'
      : 'Sem horário informado';
  const done = visit.items.filter((item) => item.checked).length;
  const changed = !sameNeeds(visit.needs, data.needs);
  const saveItem = () =>
    void task.execute(
      async () => {
        if (editing === 'new')
          await perform((repo) => repo.addItem(visit.id, itemText), 'Preparativo adicionado.');
        else
          await perform(
            (repo) => repo.updateItem(editing!, { text: itemText }),
            'Preparativo atualizado.',
          );
      },
      () => {
        setEditing(null);
        setItemText('');
      },
    );
  const feedbackAction = (outcome: 'success' | 'difficulty') =>
    void task.execute(() =>
      perform(
        (repo) => repo.saveReport({ placeId: place.id, visitId: visit.id, outcome }),
        'Relato salvo neste aparelho.',
      ),
    );
  return (
    <Screen title="Meu roteiro" backHref="/visitas" headerRight={<DemoLabel />}>
      <View style={styles.ticket}>
        <View style={[styles.ticketTop, stackActions && styles.stack]}>
          <View style={ui.grow}>
            <Badge
              label={
                visit.status === 'planned' ? 'Planejada' : completed ? 'Concluída' : 'Em andamento'
              }
              tone={visit.status === 'in_progress' ? 'sage' : 'soft'}
            />
            <AppText variant="display">{place.name}</AppText>
            <AppText variant="small" muted>
              Local fictício · Vila Mariana
            </AppText>
          </View>
          {!completed ? <Artwork source={storyArt.plan} style={styles.planArt} /> : null}
        </View>
        <View style={styles.ticketBody}>
          <View style={ui.row}>
            <Icon name="calendar" size={18} color={colors.primary} />
            <AppText variant="label" style={{ flex: 1 }}>
              {schedule}
            </AppText>
          </View>
          {!completed ? (
            <Action
              href={{ pathname: '/acompanhar/[visitId]', params: { visitId: visit.id } }}
              label={visit.status === 'in_progress' ? 'Retomar visita' : 'Agora vou'}
              icon="navigation"
            />
          ) : null}
          <Action
            href={{
              pathname: '/ensaio/[localId]',
              params: { localId: place.id, visitId: visit.id },
            }}
            label="Ver o passo a passo"
            appearance="text"
            icon="book-open"
          />
        </View>
      </View>
      {completed ? (
        <View style={styles.feedbackPanel}>
          <View style={[styles.feedbackHeader, stackActions && styles.stack]}>
            <View style={ui.grow}>
              <AppText variant="overline">Depois da consulta</AppText>
              <AppText variant="display">Como foi para vocês?</AppText>
            </View>
            <Artwork source={storyArt.feedback} style={styles.feedbackArt} />
          </View>
          {feedback ? (
            <>
              <ReportCard report={feedback} />
              <Action
                href={{
                  pathname: '/relatos/novo',
                  params: { localId: place.id, visitId: visit.id },
                }}
                label={feedback.text ? 'Editar motivo' : 'Adicionar motivo (opcional)'}
                appearance="outline"
              />
            </>
          ) : (
            <>
              <AppText variant="small" muted>
                Um toque registra o retorno. Você pode acrescentar um motivo depois.
              </AppText>
              <View style={stackActions ? ui.gap8 : styles.feedbackActions}>
                <Action
                  label="Deu certo"
                  icon="smile"
                  appearance="outline"
                  style={stackActions ? undefined : { flex: 1 }}
                  disabled={task.busy}
                  onPress={() => feedbackAction('success')}
                />
                <Action
                  label="Tive dificuldade"
                  icon="message-circle"
                  appearance="outline"
                  style={stackActions ? undefined : { flex: 1 }}
                  disabled={task.busy}
                  onPress={() => feedbackAction('difficulty')}
                />
              </View>
            </>
          )}
        </View>
      ) : null}
      <View style={ui.gap16}>
        <AppText variant="heading">Para se preparar</AppText>
        <PlaceStatus place={place} needs={visit.needs} />
        <Card>
          <View style={ui.gap8}>
            <AppText variant="label">
              {visit.scheduledAt ? 'Seu horário marcado' : 'Horário a definir'}
            </AppText>
            <AppText>{schedule}</AppText>
            <AppText variant="small" muted>
              {quiet.state === 'yes' && isCurrent(place, now)
                ? `Segundo o guia, um período de menor ruído é: ${place.quietHours}. Esse contexto não altera um horário já agendado.`
                : 'Ainda falta confirmar um período mais tranquilo. O app não faz agendamentos.'}
            </AppText>
          </View>
          <View style={ui.gap8}>
            <AppText variant="label">Entrada</AppText>
            <AppText>
              {entrance.state === 'yes' && isCurrent(place, now)
                ? place.entrance
                : entrance.state === 'no'
                  ? 'Há uma barreira de acesso registrada. Confira os detalhes do local.'
                  : 'A entrada precisa de confirmação antes de sair.'}
            </AppText>
          </View>
          <View style={ui.gap8}>
            <AppText variant="label">Suas escolhas para esta visita</AppText>
            <AppText variant="small" muted>
              {visit.needs.length
                ? NEEDS.filter((need) => visit.needs.includes(need.key))
                    .map((need) => need.label)
                    .join(' · ')
                : 'Preferências ainda não definidas.'}
            </AppText>
          </View>
          {changed ? (
            <Action
              label="Aplicar minhas preferências atuais"
              appearance="outline"
              disabled={task.busy}
              onPress={() =>
                void task.execute(() =>
                  perform(
                    (repo) => repo.updateVisit(visit.id, { needs: [...data.needs] }),
                    'Preferências atualizadas neste roteiro.',
                  ),
                )
              }
            />
          ) : null}
        </Card>
      </View>
      {evaluation.assessments.some((item) => item.state === 'no') ? (
        <InlineNotice tone="peach" title="Atenção às barreiras">
          {evaluation.assessments
            .filter((item) => item.state === 'no')
            .map((item) => item.detail)
            .join(' ')}
        </InlineNotice>
      ) : null}
      {evaluation.questions.length ? (
        <View style={ui.gap16}>
          <AppText variant="heading">O que falta confirmar</AppText>
          {evaluation.questions.map((question) => {
            const added = visit.items.some((item) => item.text === question.text);
            return (
              <Card key={question.need}>
                <AppText>{question.text}</AppText>
                {added ? (
                  <Badge label="Na sua lista" tone="sage" />
                ) : (
                  <Action
                    label="Adicionar aos preparativos"
                    appearance="text"
                    disabled={task.busy}
                    onPress={() =>
                      void task.execute(() =>
                        perform(
                          (repo) => repo.addItem(visit.id, question.text, 'confirmation'),
                          'Pergunta adicionada à sua lista.',
                        ),
                      )
                    }
                  />
                )}
              </Card>
            );
          })}
        </View>
      ) : null}
      <Card style={styles.checklist}>
        <View style={ui.row}>
          <AppText variant="heading" style={{ flex: 1 }}>
            Meus preparativos
          </AppText>
          <Badge label={`${done}/${visit.items.length}`} tone="sage" />
        </View>
        <AppText variant="small" muted>
          {done} de {visit.items.length} concluídos. Marcar um item organiza sua visita; não
          confirma informações do local.
        </AppText>
        {visit.items.length > 0 ? (
          <View accessible={false} style={styles.track}>
            <View style={[styles.trackFill, { width: `${(done / visit.items.length) * 100}%` }]} />
          </View>
        ) : null}
        {visit.items.map((item) => (
          <CheckRow
            key={item.id}
            label={item.text}
            checked={item.checked}
            onPress={() =>
              void task.execute(() =>
                perform((repo) => repo.updateItem(item.id, { checked: !item.checked })),
              )
            }
            trailing={
              <View style={ui.row}>
                <IconButton
                  name="edit-2"
                  label={`Editar: ${item.text}`}
                  onPress={() => {
                    setEditing(item.id);
                    setItemText(item.text);
                  }}
                />
                <IconButton
                  name="trash-2"
                  label={`Remover: ${item.text}`}
                  onPress={() => setRemoving(item.id)}
                />
              </View>
            }
          />
        ))}
        {!visit.items.length ? (
          <AppText variant="small" muted>
            A lista está vazia. Adicione um preparativo que ajude sua família.
          </AppText>
        ) : null}
        {editing ? (
          <View style={ui.gap8}>
            <FormField
              label={editing === 'new' ? 'Novo preparativo' : 'Editar preparativo'}
              error={task.error}
              value={itemText}
              onChangeText={setItemText}
              maxLength={160}
              autoFocus
              placeholder="O que você quer lembrar?"
            />
            <Action label="Salvar preparativo" loading={task.busy} onPress={saveItem} />
            <Action
              label="Cancelar edição"
              appearance="text"
              onPress={() => {
                setEditing(null);
                setItemText('');
              }}
            />
          </View>
        ) : (
          <Action
            label="Adicionar preparativo"
            appearance="outline"
            icon="plus"
            onPress={() => {
              setEditing('new');
              setItemText('');
            }}
          />
        )}
        <ErrorLine message={task.error} />
      </Card>
      <Action
        href={{ pathname: '/locais/[id]', params: { id: place.id } }}
        label="Ver informações e avisos do local"
        appearance="outline"
      />
      <Action
        label="Reavaliar validade das informações"
        appearance="text"
        disabled={task.busy}
        onPress={() => void task.execute(refresh)}
      />
      <DemoFooter />
      <ConfirmDialog
        visible={Boolean(removing)}
        title="Remover preparativo?"
        description="O item será retirado desta lista pessoal. As informações do local continuam no histórico."
        confirmLabel="Remover preparativo"
        onCancel={() => setRemoving(null)}
        onConfirm={() => {
          const itemId = removing!;
          setRemoving(null);
          void task.execute(() =>
            perform((repo) => repo.updateItem(itemId, { removed: true }), 'Preparativo removido.'),
          );
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  ticket: { backgroundColor: colors.butter, borderRadius: 22, overflow: 'hidden' },
  ticketTop: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16 },
  stack: { flexDirection: 'column-reverse', alignItems: 'stretch' },
  planArt: { width: 100, height: 100, borderRadius: 14 },
  ticketBody: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.inputBorder,
    padding: 16,
    gap: 8,
  },
  feedbackPanel: { backgroundColor: colors.peach, borderRadius: 22, padding: 16, gap: 12 },
  feedbackHeader: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  feedbackActions: { flexDirection: 'row', alignItems: 'stretch', gap: 8 },
  feedbackArt: { width: 110, height: 76, borderRadius: 12 },
  checklist: { borderTopWidth: 4, borderTopColor: colors.primary },
  track: { height: 6, borderRadius: 4, backgroundColor: colors.soft, overflow: 'hidden' },
  trackFill: { height: '100%', backgroundColor: colors.primary },
});
