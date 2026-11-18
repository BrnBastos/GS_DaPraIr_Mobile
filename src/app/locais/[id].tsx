import { useLocalSearchParams } from 'expo-router';

import { singleParam } from '@/components/navigation/params';
import { PlaceDetailsScreen } from '@/features/places/PlaceDetailsScreen';

export default function PlaceDetailsRoute() {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  return <PlaceDetailsScreen id={singleParam(id)} />;
}
