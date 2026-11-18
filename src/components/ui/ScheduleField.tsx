import { View } from 'react-native';
import { FormField, ui } from './controls';
export function ScheduleField({
  day,
  time,
  onChange,
}: {
  day: string;
  time: string;
  onChange: (day: string, time: string) => void;
  onEditingChange?: (editing: boolean) => void;
}) {
  return (
    <View style={ui.gap16}>
      <FormField
        label="Data (opcional)"
        placeholder="DD/MM/AAAA"
        value={day}
        onChangeText={(value) => onChange(value, time)}
        maxLength={10}
        keyboardType="numbers-and-punctuation"
      />
      <FormField
        label="Horário (opcional)"
        placeholder="HH:mm"
        value={time}
        onChangeText={(value) => onChange(day, value)}
        maxLength={5}
        help="Informe o horário já marcado. O app não faz agendamentos."
      />
    </View>
  );
}
