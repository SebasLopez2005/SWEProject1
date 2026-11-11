import { useState } from 'react';
import { View } from 'react-native';
import type { Unit } from '../../domain/types';
import { useSession } from '../../state/session';
import { Button, Card, Screen, Segmented, T } from '../../ui/kit';
import { colors } from '../../ui/theme';

/** FW-10: choose kg or lb at first use. */
export default function Onboarding() {
  const { repo } = useSession();
  const [unit, setUnit] = useState<Unit>('kg');
  return (
    <Screen>
      <View style={{ height: 48 }} />
      <T variant="title">Welcome to Repwise</T>
      <T color={colors.muted}>Which unit do your plates and machines use? You can change this any time in Settings; past weights are converted for display and never rewritten.</T>
      <Card>
        <Segmented label="Weight unit" value={unit} onChange={setUnit} options={[{ value: 'kg', label: 'Kilograms (kg)' }, { value: 'lb', label: 'Pounds (lb)' }]} />
        <T variant="small" color={colors.muted}>Example: {unit === 'kg' ? '60 kg (132.3 lb)' : '135 lb (61.2 kg)'}</T>
      </Card>
      <Button title="Continue" onPress={() => repo.updateSettings({ unit, unitChosen: true })} />
    </Screen>
  );
}
