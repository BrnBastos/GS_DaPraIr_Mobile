import { useLocalSearchParams } from 'expo-router';

import { singleParam } from '@/components/navigation/params';
import { ContributionScreen } from '@/features/community/ContributionScreen';

export default function NewNoticeRoute() {
  const { localId } = useLocalSearchParams<{ localId?: string | string[] }>();
  return <ContributionScreen kind="aviso" localId={singleParam(localId)} />;
}
