import { Link } from 'expo-router';
import { Image, StyleSheet, View } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { Action } from '@/components/ui/Action';
import { Icon } from '@/components/ui/Icon';
import { PressableSurface } from '@/components/ui/PressableSurface';
import { Screen } from '@/components/ui/Screen';
import { Badge, Card, InlineNotice, StatusBadge, ui } from '@/components/ui/controls';
import { useApp } from '@/services/AppProvider';
import { placeImages } from '@/services/place-images';
import { assessNeed, evaluatePlace, isCurrent } from '@/domain/compatibility';
import { NEEDS, type NeedKey, type Place, type StageId, type Visit } from '@/domain/models';
import { formatDate, scheduledLabel } from '@/domain/dates';
import { colors } from '@/theme/tokens';

export function DemoLabel() {
  return <Badge label="Demonstração" />;
}
export function DemoFooter() {
  return (
    <AppText variant="small" muted>
      8 locais fictícios · fotos ilustrativas. Contribuições ficam neste aparelho.
    </AppText>
  );
}
export function NoRecord({ kind = 'Local' }: { kind?: 'Local' | 'Visita' }) {
  return (
    <Screen title={`${kind} não encontrado`} backHref={kind === 'Local' ? '/' : '/visitas'}>
      <Card>
        <Icon name="search" color={colors.primary} />
        <AppText>
          Não encontramos este registro. Você pode continuar pelos locais do bairro.
        </AppText>
        <Action label="Explorar locais" href="/" />
      </Card>
    </Screen>
  );
}
export function PlaceCard({
  place,
  onPress,
  selected,
}: {
  place: Place;
  onPress?: () => void;
  selected?: boolean;
}) {
  const { data, now } = useApp();
  const result = evaluatePlace(place, data.needs, data.evidence, data.notices, now);
  const content = (
    <PressableSurface
      onPress={onPress}
      accessibilityRole={onPress ? 'radio' : 'link'}
      accessibilityState={onPress ? { checked: Boolean(selected) } : undefined}
      accessibilityLabel={`${place.name}. ${place.category}. Local fictício. ${data.needs.length ? result.label : 'Conheça o passo a passo.'}`}
      style={StyleSheet.flatten([
        styles.place,
        selected && { borderColor: colors.primary, borderWidth: 2 },
      ])}
    >
      <Image source={placeImages[place.imageKey]} style={styles.thumbnail} accessible={false} />
      <View style={ui.grow}>
        <AppText variant="title">{place.name}</AppText>
        <AppText variant="small" muted>
          {place.category}
        </AppText>
        <AppText variant="overline" muted>
          Local fictício · Vila Mariana
        </AppText>
        <View style={{ flexDirection: 'row', gap: 6, alignItems: 'flex-start' }}>
          <Icon
            name={
              result.status === 'compatible'
                ? 'check-circle'
                : result.status === 'barrier'
                  ? 'alert-circle'
                  : 'info'
            }
            size={15}
            color={colors.primary}
          />
          <AppText variant="small" style={{ flex: 1, color: colors.primary }}>
            {data.needs.length ? result.label : 'Conheça os passos da visita'}
          </AppText>
        </View>
      </View>
      <Icon
        name={onPress ? (selected ? 'check-circle' : 'circle') : 'chevron-right'}
        size={20}
        color={colors.primary}
      />
    </PressableSurface>
  );
  return onPress ? (
    content
  ) : (
    <Link href={{ pathname: '/locais/[id]', params: { id: place.id } }} asChild>
      {content}
    </Link>
  );
}
export function VisitCard({ visit }: { visit: Visit }) {
  const { data } = useApp();
  const place = data.places.find((item) => item.id === visit.placeId)!;
  const count = visit.items.filter((item) => item.checked).length;
  const schedule = scheduledLabel(visit.scheduledAt, visit.status);
  const statusLabel = {
    in_progress: 'Em andamento',
    completed: 'Concluída',
    planned: 'Planejada',
  }[visit.status];
  const title =
    visit.status === 'in_progress'
      ? 'Retomar visita'
      : visit.status === 'completed'
        ? 'Ver visita e relato'
        : 'Continuar preparação';
  return (
    <Link href={{ pathname: '/visitas/[id]', params: { id: visit.id } }} asChild>
      <PressableSurface
        style={styles.visit}
        accessibilityRole="link"
        accessibilityLabel={`${place.name}. ${statusLabel}. ${schedule}. ${title}.`}
      >
        <View style={[ui.row, { alignItems: 'flex-start' }]}>
          <View style={ui.grow}>
            <AppText variant="title">{place.name}</AppText>
            <AppText variant="small" muted>
              {schedule}
            </AppText>
          </View>
          <Badge
            label={statusLabel}
            tone={visit.status === 'in_progress' ? 'sage' : 'soft'}
          />
        </View>
        {visit.items.length ? (
          <View style={ui.gap8}>
            <AppText variant="small" muted>
              {count} de {visit.items.length} preparativos concluídos
            </AppText>
            <View style={styles.track}>
              <View
                style={{
                  height: 4,
                  width: `${(count / visit.items.length) * 100}%`,
                  backgroundColor: colors.primary,
                  borderRadius: 4,
                }}
              />
            </View>
          </View>
        ) : null}
        <View style={ui.row}>
          <AppText variant="label" style={{ color: colors.primary, flex: 1 }}>
            {title}
          </AppText>
          <Icon name="arrow-right" size={20} color={colors.primary} />
        </View>
      </PressableSurface>
    </Link>
  );
}
export function FactRow({
  place,
  need,
  selected = false,
}: {
  place: Place;
  need: NeedKey;
  selected?: boolean;
}) {
  const { data, now } = useApp();
  const fact = assessNeed(place, need, data.evidence, data.notices, now);
  const definition = NEEDS.find((item) => item.key === need)!;
  return (
    <View style={styles.fact}>
      <View style={[styles.factIcon, { backgroundColor: selected ? colors.sage : colors.soft }]}>
        <Icon name={definition.icon} size={20} color={colors.primary} />
      </View>
      <View style={ui.grow}>
        <AppText variant="label">{definition.label}</AppText>
        {selected ? (
          <AppText variant="overline" style={{ color: colors.primary }}>
            Importante para você
          </AppText>
        ) : null}
        <AppText variant="small" muted>
          {fact.detail}
        </AppText>
        <AppText
          variant="small"
          style={{ color: fact.state === 'no' ? colors.danger : colors.muted }}
        >
          {fact.state === 'yes'
            ? 'Informação favorável'
            : fact.state === 'no'
              ? 'Barreira registrada'
              : fact.expired
                ? 'Desatualizado · confirmar novamente'
                : 'A confirmar'}
          {fact.confirmedAt ? ` · ${formatDate(fact.confirmedAt)}` : ''}
        </AppText>
      </View>
    </View>
  );
}
export function PlaceStatus({ place, needs }: { place: Place; needs: NeedKey[] }) {
  const { data, now } = useApp();
  const result = evaluatePlace(place, needs, data.evidence, data.notices, now);
  return (
    <View style={ui.gap8}>
      <StatusBadge status={result.status} label={result.label} />
      <AppText variant="small" muted>
        {!needs.length
          ? 'Defina suas preferências para avaliar este local.'
          : result.status === 'compatible'
            ? 'Com base nas informações válidas para as suas escolhas.'
            : result.status === 'barrier'
              ? 'Veja as barreiras e as informações que ainda precisam de confirmação.'
              : 'Há informações que precisam de confirmação antes da visita.'}
      </AppText>
    </View>
  );
}
export function StageNotices({ place, stage }: { place: Place; stage: StageId }) {
  const { data, now } = useApp();
  const notices = data.notices.filter(
    (notice) =>
      notice.placeId === place.id &&
      !notice.resolvedAt &&
      isCurrent(notice, now) &&
      NEEDS.some((need) => need.key === notice.need && need.stage === stage),
  );
  if (!notices.length) return null;
  return (
    <View style={ui.gap16}>
      {notices.map((notice) => (
        <InlineNotice
          key={notice.id}
          title={notice.title}
          tone={notice.effect === 'barrier' ? 'peach' : 'blue'}
        >
          {notice.text ? <AppText variant="small">{notice.text}</AppText> : null}
          <AppText variant="small" muted>
            {notice.origin === 'demo' ? 'Aviso de demonstração' : 'Aviso neste aparelho'} · válido
            até {formatDate(notice.expiresAt, true)}.
          </AppText>
        </InlineNotice>
      ))}
    </View>
  );
}
const styles = StyleSheet.create({
  place: {
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  thumbnail: {
    width: 80,
    height: 100,
    borderRadius: 10,
    backgroundColor: colors.soft,
  },
  visit: {
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    backgroundColor: colors.white,
    gap: 16,
  },
  track: {
    height: 4,
    borderRadius: 4,
    backgroundColor: colors.soft,
    overflow: 'hidden',
  },
  fact: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  factIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
