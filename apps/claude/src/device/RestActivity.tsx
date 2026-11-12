// iOS Live Activity for the rest countdown (TR-13). Rendered by the system
// from an absolute deadline, so it keeps counting while the app is suspended.
import { HStack, Image, Text, VStack } from '@expo/ui/swift-ui';
import { font, foregroundStyle, padding } from '@expo/ui/swift-ui/modifiers';
import { createLiveActivity, type LiveActivityEnvironment } from 'expo-widgets';

export type RestActivityProps = {
  exercise: string;
  startedAtMs: number;
  endsAtMs: number;
  paused: boolean;
  remainingLabel: string;
};

const RestActivity = (props: RestActivityProps, environment: LiveActivityEnvironment) => {
  'widget';
  const range = { lower: new Date(props.startedAtMs), upper: new Date(props.endsAtMs) };
  const timer = props.paused ? (
    <Text modifiers={[font({ weight: 'bold', size: 28 }), foregroundStyle('#E3C58F')]}>{props.remainingLabel}</Text>
  ) : (
    <Text timerInterval={range} countsDown modifiers={[font({ weight: 'bold', size: 28 }), foregroundStyle('#E3C58F')]} />
  );
  return {
    banner: (
      <HStack modifiers={[padding({ all: 14 })]}>
        <VStack alignment="leading">
          <Text modifiers={[font({ weight: 'semibold', size: 15 }), foregroundStyle(environment.colorScheme === 'dark' ? '#F2EFE9' : '#1C1C20')]}>
            {props.paused ? 'Rest paused' : 'Rest'}
          </Text>
          <Text modifiers={[font({ size: 13 }), foregroundStyle('#A8A39A')]}>Next: {props.exercise}</Text>
        </VStack>
        {timer}
      </HStack>
    ),
    compactLeading: <Image systemName="timer" />,
    compactTrailing: props.paused ? <Text>{props.remainingLabel}</Text> : <Text timerInterval={range} countsDown />,
    minimal: <Image systemName="timer" />,
    expandedCenter: <Text modifiers={[font({ weight: 'semibold' })]}>Rest · {props.exercise}</Text>,
    expandedBottom: timer,
  };
};

export default createLiveActivity('RestActivity', RestActivity);
