import { useState } from 'react';
import { router } from 'expo-router';
import { View } from 'react-native';
import { Action } from '@/components/ui/Action';
import { AppText } from '@/components/ui/AppText';
import { Screen } from '@/components/ui/Screen';
import { Card, CheckRow, ErrorLine, Segments, ui } from '@/components/ui/controls';
import { NEEDS, type NeedKey } from '@/domain/models';
import { useApp, useTask } from '@/services/AppProvider';
export function PreferencesEditorScreen() {
  const { data, perform } = useApp();
  const [needs, setNeeds] = useState<NeedKey[]>(data.needs);
  const [group, setGroup] = useState('Mobilidade');
  const task = useTask();
  const toggle = (key: NeedKey) =>
    setNeeds((current) =>
      current.includes(key) ? current.filter((item) => item !== key) : [...current, key],
    );
  const save = () =>
    void task.execute(
      () => perform((repo) => repo.savePreferences(needs), 'Preferências salvas.'),
      () => (router.canGoBack() ? router.back() : router.replace('/preferencias')),
    );
  return (
    <Screen
      title="Suas preferências"
      backHref="/preferencias"
      footer={
        <>
          <ErrorLine message={task.error} />
          <Action
            label={task.busy ? 'Salvando…' : 'Salvar preferências'}
            loading={task.busy}
            onPress={save}
          />
        </>
      }
    >
      <View style={ui.gap8}>
        <AppText variant="display">O que ajuda na consulta?</AppText>
        <AppText muted>
          Selecione o que importa para você. É possível explorar os locais sem definir agora.
        </AppText>
      </View>
      <Segments
        value={group}
        onChange={setGroup}
        options={['Mobilidade', 'Ambiente', 'Comunicação'].map((label) => ({
          value: label,
          label,
        }))}
      />
      <Card>
        {NEEDS.filter((need) => need.group === group).map((need) => (
          <CheckRow
            key={need.key}
            label={need.sentence}
            checked={needs.includes(need.key)}
            onPress={() => toggle(need.key)}
          />
        ))}
      </Card>
      <Card style={{ backgroundColor: '#DEE9DE' }}>
        <AppText variant="label">
          {needs.length
            ? `Vamos destacar ${needs.length === 1 ? 'esta escolha' : 'estas escolhas'}.`
            : 'Você pode decidir depois.'}
        </AppText>
        <AppText variant="small">
          {needs.length
            ? NEEDS.filter((need) => needs.includes(need.key))
                .map((need) => need.label)
                .join(' · ')
            : 'Sem escolhas, o app mostra as informações dos locais e mantém a avaliação como insuficiente.'}
        </AppText>
      </Card>
      <Action href="/" appearance="text" label="Explorar sem alterar preferências" />
    </Screen>
  );
}
