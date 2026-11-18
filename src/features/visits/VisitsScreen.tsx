import { View } from 'react-native';
import { Action } from '@/components/ui/Action';
import { AppText } from '@/components/ui/AppText';
import { Artwork } from '@/components/ui/Artwork';
import { Screen } from '@/components/ui/Screen';
import { Card, ui } from '@/components/ui/controls';
import { useApp } from '@/services/AppProvider';
import { storyArt } from '@/services/story-art';
import { colors } from '@/theme/tokens';
import { DemoFooter, VisitCard } from '@/features/shared';
export function VisitsScreen() {
  const { data } = useApp();
  return (
    <Screen
      tab
      title="Minhas visitas"
      headerRight={<Action href="/visitas/nova" label="Nova" icon="plus" appearance="text" />}
    >
      {!data.visits.length ? (
        <Card
          style={{
            alignItems: 'stretch',
            backgroundColor: colors.butter,
            borderColor: colors.butter,
          }}
        >
          <Artwork
            source={storyArt.plan}
            style={{ width: 128, height: 128, borderRadius: 16, alignSelf: 'center' }}
          />
          <AppText variant="display">Sua próxima visita pode começar aqui.</AppText>
          <AppText muted>
            Conheça o local, prepare seu roteiro e volte a ele quando precisar.
          </AppText>
          <Action href="/" label="Escolher um local" />
        </Card>
      ) : (
        (
          [
            { status: 'in_progress', title: 'Em andamento' },
            { status: 'planned', title: 'Planejadas' },
            { status: 'completed', title: 'Concluídas' },
          ] as const
        ).map((group) => {
          const visits = data.visits.filter((visit) => visit.status === group.status);
          return visits.length ? (
            <View key={group.status} style={ui.gap16}>
              <AppText variant="heading">{group.title}</AppText>
              {visits.map((visit) => (
                <VisitCard key={visit.id} visit={visit} />
              ))}
            </View>
          ) : null;
        })
      )}
      <DemoFooter />
    </Screen>
  );
}
