import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Action } from '@/components/ui/Action';
import { AppText } from '@/components/ui/AppText';
import { Artwork } from '@/components/ui/Artwork';
import { Icon } from '@/components/ui/Icon';
import { Screen } from '@/components/ui/Screen';
import { Badge, Card, ErrorLine, InlineNotice, Segments, ui } from '@/components/ui/controls';
import { NEEDS, type Notice, type Report } from '@/domain/models';
import { formatDate } from '@/domain/dates';
import { isCurrent } from '@/domain/compatibility';
import { useApp, useTask } from '@/services/AppProvider';
import { placeImages } from '@/services/place-images';
import { colors } from '@/theme/tokens';
import { DemoFooter, DemoLabel, FactRow, NoRecord, PlaceStatus } from '@/features/shared';

export function ReportCard({ report }: { report: Report }) {
  const { now } = useApp();
  return (
    <Card>
      <View style={[ui.row, { flexWrap: 'wrap' }]}>
        <Badge
          label={report.outcome === 'success' ? 'Deu certo' : 'Teve dificuldade'}
          tone={report.outcome === 'success' ? 'sage' : 'peach'}
        />
        <Badge label={report.origin === 'demo' ? 'Relato de demonstração' : 'Seu relato'} />
        {!isCurrent(report, now) ? <Badge label="Desatualizado" tone="peach" /> : null}
      </View>
      {report.text ? (
        <AppText>{report.text}</AppText>
      ) : (
        <AppText variant="small" muted>
          Experiência registrada sem motivo adicional.
        </AppText>
      )}
      <AppText variant="small" muted>
        Registrado em {formatDate(report.recordedAt)} · última confirmação{' '}
        {formatDate(report.confirmedAt)}. Validade até {formatDate(report.expiresAt)}.
      </AppText>
    </Card>
  );
}

function NoticeCard({ notice }: { notice: Notice }) {
  const { data, now, perform } = useApp();
  const [history, setHistory] = useState(false);
  const task = useTask();
  const active = !notice.resolvedAt && isCurrent(notice, now);
  const events = data.noticeEvents
    .filter((event) => event.noticeId === notice.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return (
    <Card>
      <View style={ui.wrap}>
        <Badge
          label={notice.resolvedAt ? 'Resolvido' : active ? 'Aviso válido' : 'Desatualizado'}
          tone={notice.resolvedAt ? 'sage' : active ? 'peach' : 'soft'}
        />
        <Badge label={notice.origin === 'demo' ? 'Demonstração' : 'Registro neste aparelho'} />
      </View>
      <AppText variant="heading">{notice.title}</AppText>
      {notice.text ? <AppText variant="small">{notice.text}</AppText> : null}
      <AppText variant="small" muted>
        Registrado em {formatDate(notice.recordedAt, true)}. Última confirmação:{' '}
        {formatDate(notice.confirmedAt, true)}.
      </AppText>
      <AppText variant="small" muted>
        {notice.resolvedAt
          ? `Resolução registrada em ${formatDate(notice.resolvedAt, true)}.`
          : `Validade até ${formatDate(notice.expiresAt, true)}.${active ? '' : ' Vencimento não significa resolução.'}`}
      </AppText>
      {!notice.resolvedAt ? (
        <View style={ui.gap8}>
          <Action
            label="Confirmar que continua"
            appearance="outline"
            disabled={task.busy}
            onPress={() =>
              void task.execute(() =>
                perform(
                  (repo) => repo.updateNotice(notice.id, 'confirmed'),
                  'Aviso confirmado por mais 24 horas.',
                ),
              )
            }
          />
          <Action
            label="Registrar resolução"
            appearance="text"
            disabled={task.busy}
            onPress={() =>
              void task.execute(() =>
                perform(
                  (repo) => repo.updateNotice(notice.id, 'resolved'),
                  'Resolução registrada no histórico.',
                ),
              )
            }
          />
        </View>
      ) : null}
      <ErrorLine message={task.error} />
      <Action
        appearance="text"
        label={history ? 'Ocultar histórico' : 'Ver confirmações e resolução'}
        onPress={() => setHistory(!history)}
      />
      {history ? (
        <View style={ui.gap8}>
          {events.map((event) => (
            <AppText key={event.id} variant="small" muted>
              {event.kind === 'registered'
                ? 'Registrado'
                : event.kind === 'confirmed'
                  ? 'Confirmado'
                  : 'Resolvido'}{' '}
              · {formatDate(event.createdAt, true)}
            </AppText>
          ))}
        </View>
      ) : null}
    </Card>
  );
}

export function PlaceDetailsScreen({ id }: { id?: string }) {
  const { data, now } = useApp();
  const [section, setSection] = useState('about');
  const place = data.places.find((item) => item.id === (id === 'previa' ? 'clinica-jardim' : id));
  if (!place) return <NoRecord />;
  const reports = data.reports.filter((item) => item.placeId === place.id);
  const notices = data.notices.filter((item) => item.placeId === place.id);
  const ordered = [...NEEDS].sort(
    (a, b) => Number(data.needs.includes(b.key)) - Number(data.needs.includes(a.key)),
  );
  const barriers = notices.filter((notice) => notice.effect === 'barrier');
  return (
    <Screen title="Detalhes do local" backHref="/" headerRight={<DemoLabel />}>
      <View style={styles.profile}>
        <Artwork
          source={placeImages[place.imageKey]}
          style={styles.cover}
          alt="Foto ilustrativa de um ambiente de atendimento."
        />
        <View style={styles.profileBody}>
          <View style={ui.gap8}>
            <AppText variant="overline" style={styles.coverLabel}>
              Foto ilustrativa · {place.category}
            </AppText>
            <AppText variant="hero">{place.name}</AppText>
            <View style={ui.row}>
              <Icon name="map-pin" size={17} color={colors.primary} />
              <AppText variant="small" muted style={{ flex: 1 }}>
                {place.address}
              </AppText>
            </View>
          </View>
          <View style={styles.status}>
            <PlaceStatus place={place} needs={data.needs} />
          </View>
          <Action
            href={{ pathname: '/ensaio/[localId]', params: { localId: place.id } }}
            label="Ver o passo a passo"
            icon="play-circle"
          />
          <Action
            href={{ pathname: '/visitas/nova', params: { localId: place.id } }}
            label="Preparar minha visita"
            appearance="text"
            icon="calendar"
          />
        </View>
      </View>
      <Segments
        value={section}
        onChange={setSection}
        options={[
          { value: 'about', label: 'Como é' },
          { value: 'reports', label: 'Como foi' },
          { value: 'notices', label: 'Como está' },
        ]}
      />
      {section === 'about' ? (
        <>
          <View style={ui.gap8}>
            <AppText variant="heading">Para a sua visita</AppText>
            <AppText variant="small" muted>
              {place.description}
            </AppText>
          </View>
          <Card>
            {ordered.map((need) => (
              <FactRow
                key={need.key}
                place={place}
                need={need.key}
                selected={data.needs.includes(need.key)}
              />
            ))}
          </Card>
          <InlineNotice
            tone={isCurrent(place, now) ? 'blue' : 'peach'}
            title={isCurrent(place, now) ? 'Sobre este guia' : 'Guia desatualizado'}
          >
            {`Última confirmação em ${formatDate(place.confirmedAt)}. Válido até ${formatDate(place.expiresAt)}. Fotos e informações são de demonstração.`}
          </InlineNotice>
          {!data.needs.length ? (
            <Action
              href="/preferencias/editar"
              label="Definir minhas preferências"
              appearance="outline"
            />
          ) : null}
        </>
      ) : null}
      {section === 'reports' ? (
        <>
          <View style={ui.gap8}>
            <AppText variant="heading">Experiências da visita</AppText>
            <AppText variant="small" muted>
              {reports.length} {reports.length === 1 ? 'registro' : 'registros'} com data. Relatos
              gerais não confirmam todos os recursos do local.
            </AppText>
          </View>
          <Action
            href={{ pathname: '/relatos/novo', params: { localId: place.id } }}
            label="Contar como foi"
            appearance="outline"
          />
          {reports.length ? (
            reports.map((report) => <ReportCard key={report.id} report={report} />)
          ) : (
            <Card>
              <AppText>Ainda não há relatos sobre este local.</AppText>
            </Card>
          )}
        </>
      ) : null}
      {section === 'notices' ? (
        <>
          <View style={ui.gap8}>
            <AppText variant="heading">Avisos e barreiras</AppText>
            <AppText variant="small" muted>
              {notices.filter((notice) => !notice.resolvedAt && isCurrent(notice, now)).length}{' '}
              avisos válidos agora · {barriers.length}{' '}
              {barriers.length === 1 ? 'registro de barreira' : 'registros de barreiras'} no
              histórico.
            </AppText>
          </View>
          <Action
            href={{ pathname: '/avisos/novo', params: { localId: place.id } }}
            label="Registrar aviso de hoje"
            appearance="outline"
            icon="flag"
          />
          {notices.length ? (
            notices.map((notice) => <NoticeCard key={notice.id} notice={notice} />)
          ) : (
            <Card>
              <AppText variant="heading">Sem avisos registrados</AppText>
              <AppText variant="small" muted>
                A ausência de avisos não confirma as condições do local. Confira o guia e o que
                falta saber.
              </AppText>
            </Card>
          )}
        </>
      ) : null}
      <DemoFooter />
    </Screen>
  );
}

const styles = StyleSheet.create({
  profile: {
    backgroundColor: colors.white,
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  cover: { width: '100%', height: 186, backgroundColor: colors.soft },
  profileBody: { padding: 16, gap: 12 },
  coverLabel: { color: colors.primary },
  status: { backgroundColor: colors.background, borderRadius: 12, padding: 12 },
});
