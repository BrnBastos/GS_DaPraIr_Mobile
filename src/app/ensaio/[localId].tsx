import { useLocalSearchParams } from 'expo-router';
import { singleParam } from '@/components/navigation/params';
import { GuideScreen } from '@/features/guide/GuideScreen';
export default function GuideRoute() {
  const { localId, visitId } = useLocalSearchParams<{
    localId?: string | string[];
    visitId?: string | string[];
  }>();
  return <GuideScreen localId={singleParam(localId)} visitId={singleParam(visitId)} />;
}
