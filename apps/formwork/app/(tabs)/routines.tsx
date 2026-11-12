import { useState } from 'react';
import { useApp } from '../../src/state';
import { Routine } from '../../src/model';
import { Button, Empty, Header, Page } from '../../src/ui';
import { RoutineEditor, RoutineTile } from '../../src/Routines';
import { Start } from '../../src/Start';

export default function Routines() {
  const app = useApp();
  const [editing, setEditing] = useState<Routine | 'new'>();
  const [starting, setStarting] = useState<Routine>();
  return <Page>
    <Header eyebrow="PLAN YOUR TRAINING" title="Routines" subtitle="Keep your exercise order, set targets and rest in one reusable plan." />
    <Button label="New routine" tone="primary" onPress={() => setEditing('new')} />
    {app.routines.length ? app.routines.map(r => <RoutineTile key={r.id} routine={r}
      onPress={() => setEditing(r)} onStart={() => setStarting(r)} />)
      : <Empty title="No routines yet" detail="Add your first routine or save one from a finished workout." />}
    {editing ? <RoutineEditor routine={editing === 'new' ? undefined : editing} onClose={() => setEditing(undefined)} /> : null}
    {starting ? <Start routine={starting} onClose={() => setStarting(undefined)} /> : null}
  </Page>;
}
