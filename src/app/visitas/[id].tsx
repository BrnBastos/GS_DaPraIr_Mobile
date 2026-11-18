import { useLocalSearchParams } from 'expo-router';

import { singleParam } from '@/components/navigation/params';
import { VisitDetailsScreen } from '@/features/visits/VisitDetailsScreen';

export default function VisitDetailsRoute() {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  return <VisitDetailsScreen id={singleParam(id)} />;
}
