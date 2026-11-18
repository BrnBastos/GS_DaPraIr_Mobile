export const NEEDS = [
  {
    key: 'stepFree',
    label: 'Entrada sem degraus',
    sentence: 'Preciso de uma entrada sem degraus.',
    icon: 'log-in',
    group: 'Mobilidade',
    question: 'A entrada está sem degraus e disponível?',
    stage: 'enter',
  },
  {
    key: 'quiet',
    label: 'Menos ruído',
    sentence: 'Menos ruído faz diferença.',
    icon: 'volume-1',
    group: 'Ambiente',
    question: 'Como está o ruído no ambiente de espera?',
    stage: 'wait',
  },
  {
    key: 'lowCrowd',
    label: 'Menos movimento',
    sentence: 'Uma espera com menos movimento ajuda.',
    icon: 'users',
    group: 'Ambiente',
    question: 'Qual período costuma ter menos movimento?',
    stage: 'wait',
  },
  {
    key: 'predictability',
    label: 'Etapas conhecidas',
    sentence: 'Quero conhecer as etapas antes de chegar.',
    icon: 'list',
    group: 'Comunicação',
    question: 'Quais são as etapas da visita e o que pode mudar?',
    stage: 'consult',
  },
] as const;

export type NeedKey = (typeof NEEDS)[number]['key'];
export const STAGES = [
  { id: 'arrive', title: 'Chegar', icon: 'map-pin', color: 'blue' },
  { id: 'enter', title: 'Entrar', icon: 'log-in', color: 'sage' },
  { id: 'wait', title: 'Esperar', icon: 'clock', color: 'lavender' },
  { id: 'consult', title: 'Consultar', icon: 'message-circle', color: 'blue' },
  { id: 'leave', title: 'Sair', icon: 'check-circle', color: 'sage' },
] as const;
export type StageId = (typeof STAGES)[number]['id'];
export type Origin = 'demo' | 'local';
export type Dated = { recordedAt: string; confirmedAt: string; expiresAt: string };
export type Step = { id: StageId; title: string; description: string; detail: string };
export type Place = Dated & {
  id: string;
  name: string;
  category: string;
  address: string;
  neighborhood: string;
  description: string;
  imageKey: string;
  entrance: string;
  quietHours: string;
  steps: Step[];
};
export type Evidence = Dated & {
  id: string;
  placeId: string;
  need: NeedKey;
  value: boolean | null;
  detail: string;
};
export type Notice = Dated & {
  id: string;
  placeId: string;
  need: NeedKey;
  title: string;
  text: string;
  effect: 'barrier' | 'info';
  resolvedAt: string | null;
  origin: Origin;
};
export type NoticeEvent = {
  id: string;
  noticeId: string;
  kind: 'registered' | 'confirmed' | 'resolved';
  createdAt: string;
};
export type Report = Dated & {
  id: string;
  placeId: string;
  visitId: string | null;
  outcome: 'success' | 'difficulty';
  need: NeedKey | null;
  text: string;
  origin: Origin;
};
export type ChecklistItem = {
  id: string;
  visitId: string;
  text: string;
  checked: boolean;
  position: number;
  kind: 'personal' | 'confirmation';
};
export type Visit = {
  id: string;
  placeId: string;
  scheduledAt: string | null;
  needs: NeedKey[];
  status: 'planned' | 'in_progress' | 'completed';
  currentStage: number;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  items: ChecklistItem[];
};
export type Snapshot = {
  places: Place[];
  evidence: Evidence[];
  needs: NeedKey[];
  visits: Visit[];
  reports: Report[];
  notices: Notice[];
  noticeEvents: NoticeEvent[];
  guidePositions: Record<string, number>;
  firstRunAt: string;
};
export type Seed = Pick<Snapshot, 'places' | 'evidence' | 'reports' | 'notices'>;
export const DAY = 86_400_000;
export const GUIDE_TTL = 90 * DAY;
export const NOTICE_TTL = DAY;

export function needLabel(key: NeedKey) {
  return NEEDS.find((need) => need.key === key)!.label;
}
export function createId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
