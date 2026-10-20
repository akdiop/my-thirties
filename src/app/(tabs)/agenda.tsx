import { PlannedCard } from '@/components/PlannedCard';
import { Screen, StatusBadge } from '@/components/ui';

export default function Agenda() {
  return (
    <Screen title="Agenda">
      <StatusBadge status="not-developed" />
      <PlannedCard title="Jour, semaine, mois" phase={2}>
        Événements, récurrences, rappels, tâches datées, séances, prières et préparations, avec les calendriers de votre iPhone.
      </PlannedCard>
    </Screen>
  );
}
