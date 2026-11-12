import { Text, VStack } from '@expo/ui/swift-ui';
import { font, foregroundStyle, padding } from '@expo/ui/swift-ui/modifiers';
import { createLiveActivity } from 'expo-widgets';

type Props = { from: number; end: number; paused: string };
function RestActivity(props: Props) {
  'widget';
  const interval = { lower: new Date(props.from), upper: new Date(props.end) };
  return {
    banner: <VStack modifiers={[padding({ all: 14 })]}>
      <Text modifiers={[font({ weight: 'bold' }), foregroundStyle('#e7c994')]}>Formwork · Between sets</Text>
      {props.paused ? <Text>Paused · {props.paused}</Text> :
        <Text timerInterval={interval} countsDown modifiers={[font({ size: 30, weight: 'bold' })]} />}
    </VStack>,
    compactLeading: <Text>Rest</Text>,
    compactTrailing: props.paused ? <Text>{props.paused}</Text> : <Text timerInterval={interval} countsDown />,
    minimal: <Text>Rest</Text>,
    expandedCenter: props.paused ? <Text>Paused · {props.paused}</Text> : <Text timerInterval={interval} countsDown />,
  };
}
export default createLiveActivity('FormworkRest', RestActivity);
