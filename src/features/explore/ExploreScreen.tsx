import { useState } from 'react';
import { Modal, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { Action } from '@/components/ui/Action';
import { AppText } from '@/components/ui/AppText';
import { Artwork } from '@/components/ui/Artwork';
import { Screen } from '@/components/ui/Screen';
import { Icon } from '@/components/ui/Icon';
import { Card, CheckRow, Chip, SearchField, ui } from '@/components/ui/controls';
import { NEEDS, type NeedKey } from '@/domain/models';
import { assessNeed, matchesSearch } from '@/domain/compatibility';
import { useApp } from '@/services/AppProvider';
import { storyArt } from '@/services/story-art';
import { colors } from '@/theme/tokens';
import { DemoFooter, DemoLabel, PlaceCard, VisitCard } from '@/features/shared';

export function ExploreScreen() {
  const { data, now } = useApp();
  const { width, fontScale } = useWindowDimensions();
  const stackHero = width < 350 || fontScale >= 1.4;
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<NeedKey[]>([]);
  const [unknown, setUnknown] = useState(false);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<NeedKey[]>([]);
  const [draftUnknown, setDraftUnknown] = useState(false);
  const toggle = (key: NeedKey) =>
    setFilters((current) =>
      current.includes(key) ? current.filter((item) => item !== key) : [...current, key],
    );
  const places = data.places.filter(
    (place) =>
      matchesSearch(`${place.name} ${place.category} ${place.neighborhood}`, query) &&
      filters.every((need) => {
        const state = assessNeed(place, need, data.evidence, data.notices, now).state;
        return state === 'yes' || (unknown && state === 'unknown');
      }),
  );
  const active = data.visits.find((visit) => visit.status === 'in_progress');
  const next =
    active ??
    data.visits
      .filter(
        (visit) =>
          visit.status === 'planned' &&
          visit.scheduledAt &&
          Date.parse(visit.scheduledAt) >= now.getTime(),
      )
      .sort((a, b) => a.scheduledAt!.localeCompare(b.scheduledAt!))[0] ??
    data.visits.find((visit) => visit.status === 'planned' && !visit.scheduledAt);
  const showFilters = () => {
    setDraft(filters);
    setDraftUnknown(unknown);
    setOpen(true);
  };
  return (
    <Screen tab title="Dá Pra Ir?" headerRight={<DemoLabel />}>
      <View style={ui.gap16}>
        <View style={ui.row}>
          <Icon name="map-pin" size={16} color={colors.primary} />
          <AppText variant="small" muted>
            Vila Mariana, São Paulo
          </AppText>
        </View>
        <SearchField value={query} onChangeText={setQuery} />
        <View style={ui.wrap}>
          <Chip
            label="Sem degraus"
            selected={filters.includes('stepFree')}
            onPress={() => toggle('stepFree')}
          />
          <Chip
            label="Menos ruído"
            selected={filters.includes('quiet')}
            onPress={() => toggle('quiet')}
          />
          <Chip
            label={`Filtros${filters.length ? ` (${filters.length})` : ''}`}
            icon="sliders"
            selected={filters.length > 0 || unknown}
            onPress={showFilters}
          />
        </View>
      </View>
      {!query && !filters.length ? (
        next ? (
          <View style={ui.gap8}>
            <AppText variant="heading">
              {active ? 'Sua visita em andamento' : 'Sua próxima visita'}
            </AppText>
            <VisitCard visit={next} />
          </View>
        ) : (
          <View style={styles.hero}>
            <View style={[styles.heroRow, stackHero && styles.heroStack]}>
              <View style={styles.heroCopy}>
                <AppText variant="overline" style={styles.heroLabel}>
                  Antes de sair
                </AppText>
                <AppText variant="display" style={styles.heroTitle}>
                  Conheça o caminho
                </AppText>
                <AppText variant="small" style={styles.heroLabel}>
                  Prepare a consulta do seu jeito.
                </AppText>
              </View>
              <Artwork
                source={storyArt.neighborhood}
                style={[styles.heroImage, stackHero && styles.heroImageStack]}
              />
            </View>
            <Action
              href="/visitas/nova"
              label="Preparar uma visita"
              icon="arrow-right"
              appearance="outline"
            />
          </View>
        )
      ) : null}
      <View style={ui.gap16}>
        <View style={ui.row}>
          <AppText variant="heading" style={{ flex: 1 }}>
            Locais no bairro
          </AppText>
          <AppText variant="small" muted>
            {places.length} {places.length === 1 ? 'local' : 'locais'}
          </AppText>
        </View>
        {places.length ? (
          places.map((place) => <PlaceCard key={place.id} place={place} />)
        ) : (
          <Card>
            <Icon name="search" size={28} color={colors.primary} />
            <AppText variant="heading">Nenhum local com esses filtros</AppText>
            <AppText muted>
              Tente outro nome ou inclua locais que ainda precisam de confirmação.
            </AppText>
            <Action
              label="Limpar busca e filtros"
              appearance="outline"
              onPress={() => {
                setQuery('');
                setFilters([]);
                setUnknown(false);
              }}
            />
            {filters.length ? (
              <Action
                label="Incluir informações insuficientes"
                appearance="text"
                onPress={() => setUnknown(true)}
              />
            ) : null}
          </Card>
        )}
      </View>
      {!data.needs.length ? (
        <Action
          href="/preferencias/editar"
          appearance="outline"
          label="Definir minhas preferências"
          icon="sliders"
        />
      ) : null}
      <DemoFooter />
      <Modal visible={open} transparent animationType="none" onRequestClose={() => setOpen(false)}>
        <View style={[ui.scrim, { justifyContent: 'flex-end' }]}>
          <View accessibilityViewIsModal style={[ui.dialog, { maxHeight: '90%', maxWidth: 640 }]}>
            <AppText variant="header">Filtrar locais</AppText>
            <AppText variant="small" muted>
              Selecione características confirmadas por informações válidas.
            </AppText>
            <ScrollView keyboardShouldPersistTaps="handled">
              {NEEDS.map((need) => (
                <CheckRow
                  key={need.key}
                  label={need.label}
                  checked={draft.includes(need.key)}
                  onPress={() =>
                    setDraft((current) =>
                      current.includes(need.key)
                        ? current.filter((item) => item !== need.key)
                        : [...current, need.key],
                    )
                  }
                />
              ))}
              <CheckRow
                label="Mostrar também informações insuficientes"
                description="Os locais continuam identificados como a confirmar."
                checked={draftUnknown}
                onPress={() => setDraftUnknown(!draftUnknown)}
              />
            </ScrollView>
            <Action
              label="Aplicar filtros"
              onPress={() => {
                setFilters(draft);
                setUnknown(draftUnknown);
                setOpen(false);
              }}
            />
            <Action
              label="Limpar filtros"
              appearance="text"
              onPress={() => {
                setDraft([]);
                setDraftUnknown(false);
              }}
            />
            <Action label="Cancelar" appearance="text" onPress={() => setOpen(false)} />
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { backgroundColor: colors.forest, borderRadius: 22, padding: 16, gap: 12 },
  heroRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  heroStack: { flexDirection: 'column-reverse', alignItems: 'stretch' },
  heroCopy: { flex: 1, gap: 4 },
  heroTitle: { color: colors.white },
  heroLabel: { color: colors.leaf },
  heroImage: { width: '44%', maxWidth: 180, aspectRatio: 1, borderRadius: 14 },
  heroImageStack: { width: 120, alignSelf: 'flex-start' },
});
