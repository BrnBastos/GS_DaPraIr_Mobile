import {
  DAY,
  GUIDE_TTL,
  NOTICE_TTL,
  NEEDS,
  type Place,
  type NeedKey,
  type Seed,
} from '../domain/models.ts';

const definitions = [
  [
    'clinica-jardim',
    'Clínica Jardim',
    'Pediatria e família',
    'Um espaço de bairro para conhecer a consulta antes de chegar.',
    'jardim',
    [true, null, true, true],
    3,
  ],
  [
    'casa-serena',
    'Casa Serena',
    'Desenvolvimento infantil',
    'Recepção pequena, ambiente acolhedor e visita explicada por etapas.',
    'serena',
    [true, true, true, true],
    8,
  ],
  [
    'instituto-horizonte',
    'Instituto Horizonte',
    'Consultas e exames',
    'Um centro de atendimento com várias especialidades e circulação entre andares.',
    'horizonte',
    [false, true, false, true],
    4,
  ],
  [
    'clinica-alecrim',
    'Clínica Alecrim',
    'Saúde da criança',
    'Consultas em um espaço compartilhado com recepção movimentada.',
    'alecrim',
    [true, false, false, true],
    12,
  ],
  [
    'espaco-ponte',
    'Espaço Ponte',
    'Acolhimento e consultas',
    'As informações deste espaço precisam de uma nova confirmação.',
    'ponte',
    [null, null, null, true],
    96,
  ],
  [
    'centro-bem-viver',
    'Centro Bem Viver',
    'Atendimento familiar',
    'Um percurso simples, com uma pendência recente sobre o acesso.',
    'bem-viver',
    [true, true, true, true],
    9,
  ],
  [
    'centro-aurora',
    'Centro Aurora',
    'Consultas infantis',
    'Atendimento em uma casa adaptada, com condições diferentes em cada ambiente.',
    'aurora',
    [false, null, true, true],
    6,
  ],
  [
    'nucleo-caminho',
    'Núcleo Caminho',
    'Cuidado e desenvolvimento',
    'Um guia completo para a visita, com um aviso atual sobre a recepção.',
    'caminho',
    [true, true, true, true],
    2,
  ],
] as const;

export async function loadMockPlaces(firstRun: Date): Promise<Seed> {
  await new Promise((resolve) => setTimeout(resolve, 180));
  const dated = (age: number, ttl = GUIDE_TTL) => {
    const confirmedAt = new Date(firstRun.getTime() - age * DAY).toISOString();
    return {
      recordedAt: confirmedAt,
      confirmedAt,
      expiresAt: new Date(Date.parse(confirmedAt) + ttl).toISOString(),
    };
  };
  const places: Place[] = definitions.map(
    ([id, name, category, description, imageKey, values, age], index) => ({
      id,
      name,
      category,
      description,
      imageKey,
      neighborhood: 'Vila Mariana',
      address: `Endereço fictício ${index + 1} · Vila Mariana, São Paulo`,
      entrance:
        values[0] === true
          ? 'Entrada principal no térreo, segundo o guia.'
          : values[0] === false
            ? 'A entrada descrita tem degraus ou depende de elevador.'
            : 'A entrada ainda precisa ser confirmada.',
      quietHours: [
        'Terças e quintas, das 14h às 16h',
        'Segundas a quintas, das 9h às 10h',
        'Quartas, das 14h às 15h',
      ][index % 3],
      ...dated(age),
      steps: [
        {
          id: 'arrive',
          title: 'O primeiro passo é chegar.',
          description: 'Identifique a entrada principal antes de seguir para a recepção.',
          detail:
            'O guia de demonstração descreve a chegada pela fachada principal. O endereço e a fotografia são ilustrativos.',
        },
        {
          id: 'enter',
          title: 'Agora, a recepção.',
          description:
            values[0] === true
              ? 'Segundo o guia, a recepção fica no térreo, depois da entrada principal.'
              : 'Segundo o guia, é importante confirmar o acesso à recepção antes da visita.',
          detail:
            values[0] === true
              ? 'O guia descreve acesso sem degraus na entrada principal. Confira também os avisos recentes sobre o acesso.'
              : 'A entrada descrita tem uma barreira ou não foi confirmada. Veja os detalhes de acesso e os avisos.',
        },
        {
          id: 'wait',
          title: 'Uma pausa para esperar.',
          description: 'Depois da recepção, a família aguarda a chamada na sala de espera.',
          detail:
            values[1] === true
              ? 'O guia descreve uma sala com ruído reduzido em alguns períodos. O movimento pode mudar ao longo do dia.'
              : 'O ruído e o movimento podem variar. Veja o que já sabemos e as perguntas que faltam confirmar.',
        },
        {
          id: 'consult',
          title: 'Hora de entrar na consulta.',
          description: 'Ao ser chamada, a família segue para a sala de atendimento.',
          detail:
            'No guia de demonstração, a equipe chama na recepção. Confirme se há mudanças na ordem das etapas. O app não orienta procedimentos clínicos.',
        },
        {
          id: 'leave',
          title: 'A visita chega ao fim.',
          description:
            'Ao encerrar o atendimento, a família retorna à recepção e segue para a saída.',
          detail:
            'Confira com a recepção se existe alguma etapa administrativa pendente antes de sair.',
        },
      ],
    }),
  );
  const evidence = definitions.flatMap(([id, , , , , values, age]) =>
    NEEDS.map((need, index) => ({
      id: `${id}-${need.key}`,
      placeId: id,
      need: need.key as NeedKey,
      value: values[index],
      detail:
        values[index] === null
          ? 'Esta característica ainda não foi confirmada.'
          : [
              values[index]
                ? 'O guia descreve entrada sem degraus.'
                : 'O guia registra degraus ou dependência de elevador no acesso.',
              values[index]
                ? 'O guia descreve períodos com ruído reduzido.'
                : 'O guia registra ruído frequente na recepção.',
              values[index]
                ? 'Há períodos de menor movimento descritos no guia.'
                : 'A recepção costuma concentrar vários atendimentos.',
              'As cinco etapas da visita estão descritas no guia.',
            ][index],
      ...dated(id === 'clinica-jardim' && need.key === 'quiet' ? 94 : age),
    })),
  );
  const reports = places.flatMap((place, index) => [
    {
      id: `demo-relato-${index}-1`,
      placeId: place.id,
      visitId: null,
      outcome: 'success' as const,
      need: null,
      text: 'Conhecer as etapas antes da visita ajudou na organização da família.',
      origin: 'demo' as const,
      ...dated(5 + index),
    },
    {
      id: `demo-relato-${index}-2`,
      placeId: place.id,
      visitId: null,
      outcome: 'difficulty' as const,
      need: 'quiet' as const,
      text: 'Na visita descrita, o som da recepção ficou acima do que a família esperava.',
      origin: 'demo' as const,
      ...dated(index === 0 ? 95 : 10 + index),
    },
  ]);
  const notices: Seed['notices'] = [
    {
      id: 'demo-aviso-elevador',
      placeId: 'instituto-horizonte',
      need: 'stepFree',
      title: 'Elevador indisponível',
      text: 'O acesso ao andar de atendimento depende de confirmação com a recepção.',
      effect: 'barrier',
      resolvedAt: null,
      origin: 'demo',
      ...dated(0.12, NOTICE_TTL),
    },
    {
      id: 'demo-aviso-rampa',
      placeId: 'centro-bem-viver',
      need: 'stepFree',
      title: 'Acesso à rampa interrompido',
      text: 'Este aviso venceu sem registro de resolução. Confirme a entrada antes de sair.',
      effect: 'barrier',
      resolvedAt: null,
      origin: 'demo',
      ...dated(1.2, NOTICE_TTL),
    },
    {
      id: 'demo-aviso-obras',
      placeId: 'nucleo-caminho',
      need: 'quiet',
      title: 'Obras próximas à recepção',
      text: 'Há ruído de manutenção na área de espera, segundo o aviso de demonstração.',
      effect: 'barrier',
      resolvedAt: null,
      origin: 'demo',
      ...dated(0.08, NOTICE_TTL),
    },
  ];
  return { places, evidence, reports, notices };
}
