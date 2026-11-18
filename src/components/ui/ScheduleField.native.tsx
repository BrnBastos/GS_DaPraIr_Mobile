import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Platform, View } from 'react-native';
import { formatDate } from '@/domain/dates';
import { Action } from './Action';
import { AppText } from './AppText';
import { ui } from './controls';

type Props = {
  day: string;
  time: string;
  onChange: (day: string, time: string) => void;
  onEditingChange?: (editing: boolean) => void;
};
function initialDate(day: string, time: string) {
  const [dd, mm, yyyy] = (day || formatDate(new Date().toISOString())).split('/');
  return new Date(`${yyyy}-${mm}-${dd}T${time || '09:00'}:00-03:00`);
}
export function ScheduleField({ day, time, onChange, onEditingChange }: Props) {
  const [mode, setMode] = useState<'date' | 'time' | null>(null);
  const [draft, setDraft] = useState(() => initialDate(day, time));
  const close = () => {
    setMode(null);
    onEditingChange?.(false);
  };
  const commit = (date: Date) => {
    const selectedTime = new Intl.DateTimeFormat('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    }).format(date);
    onChange(formatDate(date.toISOString()), selectedTime);
    close();
  };
  return (
    <View style={ui.gap8}>
      <AppText variant="label">Data e horário (opcional)</AppText>
      <Action
        label={day ? `${day}${time ? ` · ${time}` : ''}` : 'Escolher data e horário'}
        icon="calendar"
        appearance="outline"
        onPress={() => {
          setDraft(initialDate(day, time));
          setMode('date');
          onEditingChange?.(true);
        }}
      />
      {mode ? (
        <>
          <DateTimePicker
            value={draft}
            mode={mode}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            locale="pt-BR"
            is24Hour
            timeZoneName="America/Sao_Paulo"
            onChange={(event, date) => {
              if (event.type === 'dismissed') {
                close();
                return;
              }
              if (!date) return;
              setDraft(date);
              if (Platform.OS !== 'ios') {
                if (mode === 'date') setMode('time');
                else commit(date);
              }
            }}
          />
          {Platform.OS === 'ios' ? (
            <>
              <Action
                label={mode === 'date' ? 'Escolher horário' : 'Concluir data e horário'}
                onPress={() => (mode === 'date' ? setMode('time') : commit(draft))}
              />
              <Action label="Cancelar seleção" appearance="text" onPress={close} />
            </>
          ) : null}
        </>
      ) : null}
      {day && !mode ? (
        <Action label="Deixar sem data" appearance="text" onPress={() => onChange('', '')} />
      ) : null}
      <AppText variant="small" muted>
        Informe o horário já marcado. O app não faz agendamentos.
      </AppText>
    </View>
  );
}
