import { useLocalSearchParams } from 'expo-router';
import { singleParam } from '@/components/navigation/params';
import { AccompanyScreen } from '@/features/visits/AccompanyScreen';
export default function AccompanyRoute() {
  const { visitId } = useLocalSearchParams<{ visitId?: string | string[] }>();
  return <AccompanyScreen visitId={singleParam(visitId)} />;
}
