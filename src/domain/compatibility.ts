import {
  NEEDS,
  type Evidence,
  type NeedKey,
  type Notice,
  type Place,
  type Dated,
} from './models.ts';

export function isCurrent(record: Dated, now = new Date()): boolean {
  const confirmed = Date.parse(record.confirmedAt);
  const expires = Date.parse(record.expiresAt);
  return (
    Number.isFinite(confirmed) &&
    Number.isFinite(expires) &&
    confirmed <= now.getTime() &&
    expires > now.getTime()
  );
}

export type Assessment = {
  need: NeedKey;
  state: 'yes' | 'no' | 'unknown';
  detail: string;
  confirmedAt: string | null;
  expired: boolean;
};

export function assessNeed(
  place: Place,
  need: NeedKey,
  evidence: Evidence[],
  notices: Notice[],
  now = new Date(),
): Assessment {
  const fact = evidence.find((item) => item.placeId === place.id && item.need === need);
  const barriers = notices.filter(
    (item) =>
      item.placeId === place.id &&
      item.need === need &&
      item.effect === 'barrier' &&
      !item.resolvedAt &&
      Date.parse(item.confirmedAt) <= now.getTime(),
  );
  const active = barriers
    .filter((item) => isCurrent(item, now))
    .sort((a, b) => b.confirmedAt.localeCompare(a.confirmedAt))[0];
  if (active)
    return {
      need,
      state: 'no',
      detail: active.title,
      confirmedAt: active.confirmedAt,
      expired: false,
    };
  // Um aviso vencido não prova resolução. Informação favorável mais antiga não
  // elimina a pendência de uma barreira posterior ainda sem resolução explícita.
  const lastBarrier = barriers.sort((a, b) => b.confirmedAt.localeCompare(a.confirmedAt))[0];
  if (lastBarrier && (!fact || lastBarrier.confirmedAt > fact.confirmedAt)) {
    return {
      need,
      state: 'unknown',
      detail: 'O último aviso venceu e ainda precisa de confirmação.',
      confirmedAt: lastBarrier.confirmedAt,
      expired: true,
    };
  }
  if (!isCurrent(place, now)) {
    return {
      need,
      state: 'unknown',
      detail: 'O guia que sustenta esta informação precisa de nova confirmação.',
      confirmedAt: place.confirmedAt,
      expired: true,
    };
  }
  if (!fact || !isCurrent(fact, now) || fact.value === null) {
    return {
      need,
      state: 'unknown',
      detail:
        fact && !isCurrent(fact, now)
          ? 'Informação desatualizada. Confirme novamente antes de sair.'
          : 'Ainda não há informação suficiente.',
      confirmedAt: fact?.confirmedAt ?? null,
      expired: Boolean(fact && !isCurrent(fact, now)),
    };
  }
  return {
    need,
    state: fact.value ? 'yes' : 'no',
    detail: fact.detail,
    confirmedAt: fact.confirmedAt,
    expired: false,
  };
}

export function evaluatePlace(
  place: Place,
  needs: NeedKey[],
  evidence: Evidence[],
  notices: Notice[],
  now = new Date(),
) {
  const assessments = needs.map((need) => assessNeed(place, need, evidence, notices, now));
  const status = assessments.some((item) => item.state === 'no')
    ? 'barrier'
    : !needs.length || assessments.some((item) => item.state === 'unknown')
      ? 'unknown'
      : 'compatible';
  const label = {
    barrier: 'Há barreiras',
    unknown: 'Informação insuficiente',
    compatible: 'Compatível com suas preferências',
  }[status];
  const questions = assessments
    .filter((item) => item.state === 'unknown')
    .map((item) => ({
      need: item.need,
      text: NEEDS.find((need) => need.key === item.need)!.question,
    }));
  return { status, label, assessments, questions } as const;
}

export function sameNeeds(left: NeedKey[], right: NeedKey[]) {
  return [...left].sort().join(',') === [...right].sort().join(',');
}

export function matchesSearch(text: string, query: string) {
  const normalize = (value: string) =>
    value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLocaleLowerCase('pt-BR');
  return normalize(text).includes(normalize(query.trim()));
}
