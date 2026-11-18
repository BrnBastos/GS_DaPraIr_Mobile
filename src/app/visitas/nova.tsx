import { useLocalSearchParams } from 'expo-router';

import { singleParam } from '@/components/navigation/params';
import { NewVisitScreen } from '@/features/visits/NewVisitScreen';

export default function NewVisitRoute() {
  const { localId } = useLocalSearchParams<{ localId?: string | string[] }>();
  return <NewVisitScreen localId={singleParam(localId)} />;
}
