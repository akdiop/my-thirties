import { CalmButton } from '@/components/CalmButton';
import { PlannedCard } from '@/components/PlannedCard';
import { Screen } from '@/components/ui';

export default function BienEtre() {
  return (
    <Screen title="Bien-être" subtitle="Votre corps et votre esprit, aujourd’hui">
      <CalmButton />
      <PlannedCard title="Votre journée bien-être" phase={3}>
        Humeur, séance prévue, challenges du jour, cycle et prochaine prière.
      </PlannedCard>
    </Screen>
  );
}
