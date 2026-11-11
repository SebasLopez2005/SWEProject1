import { NativeTabs } from 'expo-router/native-tabs';
import { colors } from '../../../ui/theme';

/** Native iOS tab bar (Liquid Glass on iOS 26) — UI-04. */
export default function TabsLayout() {
  return (
    <NativeTabs tintColor={colors.accent} minimizeBehavior="onScrollDown">
      <NativeTabs.Trigger name="(train)">
        <NativeTabs.Trigger.Icon sf={{ default: 'figure.strengthtraining.traditional', selected: 'figure.strengthtraining.traditional' }} />
        <NativeTabs.Trigger.Label>Train</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="routines">
        <NativeTabs.Trigger.Icon sf={{ default: 'list.bullet.rectangle', selected: 'list.bullet.rectangle.fill' }} />
        <NativeTabs.Trigger.Label>Routines</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="history">
        <NativeTabs.Trigger.Icon sf={{ default: 'calendar', selected: 'calendar' }} />
        <NativeTabs.Trigger.Label>History</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="progress">
        <NativeTabs.Trigger.Icon sf={{ default: 'chart.xyaxis.line', selected: 'chart.xyaxis.line' }} />
        <NativeTabs.Trigger.Label>Progress</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Icon sf={{ default: 'person.crop.circle', selected: 'person.crop.circle.fill' }} />
        <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
