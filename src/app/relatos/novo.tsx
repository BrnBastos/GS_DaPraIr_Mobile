import { useLocalSearchParams } from 'expo-router';

import { singleParam } from '@/components/navigation/params';
import { ContributionScreen } from '@/features/community/ContributionScreen';

export default function NewReportRoute() {
  const { localId, visitId } = useLocalSearchParams<{
    localId?: string | string[];
    visitId?: string | string[];
  }>();
  return (
    <ContributionScreen
      kind="relato"
      localId={singleParam(localId)}
      visitId={singleParam(visitId)}
    />
  );
}
