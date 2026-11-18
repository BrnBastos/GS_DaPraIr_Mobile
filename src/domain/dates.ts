export function formatDate(value: string, includeTime = false) {
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    ...(includeTime ? ({ hour: '2-digit', minute: '2-digit' } as const) : {}),
  }).format(new Date(value));
}
export function scheduledLabel(value: string | null) {
  return value ? formatDate(value, true) : 'Em planejamento';
}

export function parseSchedule(day: string, time: string): { value: string | null; error?: string } {
  if (!day.trim() && !time.trim()) return { value: null };
  if (!day.trim()) return { value: null, error: 'Escolha uma data para informar o horário.' };
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(day);
  if (!match) return { value: null, error: 'Informe uma data no formato DD/MM/AAAA.' };
  const [, dd, mm, yyyy] = match;
  const normalizedTime = time.trim() || '09:00';
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(normalizedTime))
    return { value: null, error: 'Informe um horário válido, como 14:30.' };
  const utc = new Date(`${yyyy}-${mm}-${dd}T${normalizedTime}:00-03:00`);
  if (
    !Number.isFinite(utc.getTime()) ||
    formatDate(utc.toISOString()) !== day ||
    Number(yyyy) < 2020 ||
    Number(yyyy) > 2100
  )
    return { value: null, error: 'Informe uma data válida.' };
  return { value: utc.toISOString() };
}
