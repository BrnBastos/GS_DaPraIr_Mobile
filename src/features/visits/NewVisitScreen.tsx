import { useState } from 'react';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Action } from '@/components/ui/Action';
import { AppText } from '@/components/ui/AppText';
import { Artwork } from '@/components/ui/Artwork';
import { Screen } from '@/components/ui/Screen';
import { ScheduleField } from '@/components/ui/ScheduleField';
import { Card, ErrorLine, InlineNotice, SearchField, ui } from '@/components/ui/controls';
import { evaluatePlace, matchesSearch } from '@/domain/compatibility';
import { parseSchedule } from '@/domain/dates';
import { useApp, useTask } from '@/services/AppProvider';
import { storyArt } from '@/services/story-art';
import { colors } from '@/theme/tokens';
import { DemoFooter, PlaceCard, PlaceStatus } from '@/features/shared';
export function NewVisitScreen({ localId }: { localId?: string }) {
  const { data, now, perform } = useApp();
  const [selected, setSelected] = useState(
    localId === 'previa' ? 'clinica-jardim' : (localId ?? ''),
  );
  const [choosing, setChoosing] = useState(!data.places.some((place) => place.id === selected));
  const [query, setQuery] = useState('');
  const [day, setDay] = useState('');
  const [time, setTime] = useState('');
  const [scheduleError, setScheduleError] = useState<string | null>(null);
  const [scheduleEditing, setScheduleEditing] = useState(false);
  const task = useTask();
  const place = data.places.find((item) => item.id === selected);
  const matchingPlaces = data.places.filter((item) =>
    matchesSearch(`${item.name} ${item.category}`, query),
  );
  const save = () => {
    if (!place) {
      task.setError('Escolha um local para preparar a visita.');
      return;
    }
    const scheduled = parseSchedule(day, time);
    if (scheduled.error) {
      setScheduleError(scheduled.error);
      return;
    }
    setScheduleError(null);
    const evaluation = evaluatePlace(place, data.needs, data.evidence, data.notices, now);
    void task.execute(
      () =>
        perform(
          (repo) =>
            repo.createVisit(place.id, scheduled.value, data.needs, evaluation.questions[0]?.text),
          'Visita salva. Seu roteiro está pronto.',
        ),
      (id) => router.replace({ pathname: '/visitas/[id]', params: { id } }),
    );
  };
  return (
    <Screen
      title="Nova visita"
      backHref="/visitas"
      footer={
        <>
          <ErrorLine message={task.error} />
          <Action
            label={task.busy ? 'Salvando…' : 'Salvar visita'}
            onPress={save}
            loading={task.busy}
            disabled={scheduleEditing}
          />
        </>
      }
    >
      <View style={styles.intro}>
        <View style={ui.grow}>
          <AppText variant="overline">Antes de sair</AppText>
          <AppText variant="display">Prepare a visita</AppText>
        </View>
        <Artwork source={storyArt.plan} style={styles.art} />
      </View>
      {choosing ? (
        <View style={ui.gap16}>
          <AppText variant="heading">Escolha um local</AppText>
          <SearchField value={query} onChangeText={setQuery} />
          {matchingPlaces.map((item) => (
            <PlaceCard
              key={item.id}
              place={item}
              selected={selected === item.id}
              onPress={() => {
                setSelected(item.id);
                setChoosing(false);
                task.setError(null);
              }}
            />
          ))}
          {!matchingPlaces.length ? (
            <Card>
              <AppText>Nenhum local encontrado com esse nome.</AppText>
              <Action label="Limpar busca" appearance="text" onPress={() => setQuery('')} />
            </Card>
          ) : null}
        </View>
      ) : place ? (
        <Card>
          <AppText variant="heading">{place.name}</AppText>
          <AppText variant="small" muted>
            {place.category} · Local fictício
          </AppText>
          <PlaceStatus place={place} needs={data.needs} />
          <Action label="Trocar local" appearance="text" onPress={() => setChoosing(true)} />
        </Card>
      ) : null}
      <Card>
        <ScheduleField
          day={day}
          onEditingChange={setScheduleEditing}
          time={time}
          onChange={(nextDay, nextTime) => {
            setDay(nextDay);
            setTime(nextTime);
            setScheduleError(null);
          }}
        />
        <ErrorLine message={scheduleError} />
      </Card>
      {!data.needs.length ? (
        <InlineNotice title="Do seu jeito">
          <AppText variant="small">
            Você ainda não definiu preferências. Pode salvar a visita e escolher depois.
          </AppText>
          <Action href="/preferencias/editar" label="Definir preferências" appearance="text" />
        </InlineNotice>
      ) : (
        <AppText variant="small" muted>
          As preferências atuais serão guardadas neste roteiro. Depois você poderá atualizá-las por
          escolha.
        </AppText>
      )}
      <DemoFooter />
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { ...ui.row, gap: 16, padding: 14, borderRadius: 20, backgroundColor: colors.butter },
  art: { width: 88, height: 88, borderRadius: 12 },
});
