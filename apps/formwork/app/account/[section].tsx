import { useLocalSearchParams, useRouter } from 'expo-router';
import { Bodyweight, ExportData, Goals, Report } from '../../src/ProfileData';
import { MuscleMap } from '../../src/MuscleMap';
import { Settings } from '../../src/Settings';
import { Header, Page } from '../../src/ui';

const sections = {
  muscles: { title: 'Muscle activity', Component: MuscleMap }, report: { title: 'Monthly report', Component: Report },
  goals: { title: 'Lift goals', Component: Goals }, bodyweight: { title: 'Bodyweight', Component: Bodyweight },
  export: { title: 'Export my data', Component: ExportData }, settings: { title: 'Settings', Component: Settings },
};

export default function Section() {
  const { section } = useLocalSearchParams<{ section: keyof typeof sections }>();
  const router = useRouter();
  const route = sections[section];
  const Component = route?.Component;
  return <Page><Header eyebrow="PROFILE" title={route?.title ?? 'Section unavailable'} back={() => router.canGoBack() ? router.back() : router.replace('/profile')} />
    {Component ? <Component /> : null}</Page>;
}
