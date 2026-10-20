import { Text, VStack } from '@expo/ui/swift-ui';
import { font, foregroundStyle } from '@expo/ui/swift-ui/modifiers';
import { createWidget, type WidgetEnvironment } from 'expo-widgets';

export type LockWidgetProps = { countLabel: string; showCount: boolean };

const LockView = (props: LockWidgetProps, environment: WidgetEnvironment) => {
  'widget';
  if (environment.widgetFamily === 'accessoryCircular') {
    return <Text modifiers={[font({ weight: 'semibold', size: 14 })]}>MT</Text>;
  }
  if (environment.widgetFamily === 'accessoryInline') {
    return <Text>{props.showCount ? props.countLabel : 'My Thirties'}</Text>;
  }
  return (
    <VStack spacing={3}>
      <Text modifiers={[font({ weight: 'semibold', size: 14 }), foregroundStyle('#6B4A38')]}>My Thirties</Text>
      <Text modifiers={[font({ size: 12 })]}>{props.showCount ? props.countLabel : 'Mon espace personnel'}</Text>
    </VStack>
  );
};

export default createWidget('LockWidget', LockView);
