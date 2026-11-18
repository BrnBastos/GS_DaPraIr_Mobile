import type { ImageSourcePropType } from 'react-native';
import type { StageId } from '@/domain/models';

export const storyArt = {
  neighborhood: require('@/assets/illustrations/bairro.jpg') as ImageSourcePropType,
  preferences: require('@/assets/illustrations/preferencias.jpg') as ImageSourcePropType,
  plan: require('@/assets/illustrations/roteiro.jpg') as ImageSourcePropType,
  feedback: require('@/assets/illustrations/relato.jpg') as ImageSourcePropType,
};

export const stageArt: Record<StageId, { source: ImageSourcePropType; alt: string }> = {
  arrive: {
    source: require('@/assets/illustrations/chegar.jpg'),
    alt: 'Uma família se aproxima de uma clínica de bairro pela calçada.',
  },
  enter: {
    source: require('@/assets/illustrations/entrar.jpg'),
    alt: 'Uma recepcionista cumprimenta o pai e a criança no balcão.',
  },
  wait: {
    source: require('@/assets/illustrations/esperar.jpg'),
    alt: 'Pai e filha sentados juntos na sala de espera.',
  },
  consult: {
    source: require('@/assets/illustrations/consultar.jpg'),
    alt: 'Uma profissional conversa com a criança e o pai no consultório.',
  },
  leave: {
    source: require('@/assets/illustrations/sair.jpg'),
    alt: 'Pai e filha saem pela porta da clínica.',
  },
};
