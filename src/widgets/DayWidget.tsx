import { Text, VStack } from '@expo/ui/swift-ui';
import { font, foregroundStyle } from '@expo/ui/swift-ui/modifiers';
import { createWidget, type WidgetEnvironment } from 'expo-widgets';

export type DayWidgetProps = { heading: string; summary: string; priorityOne: string; priorityTwo: string; visible: boolean };

const DayView = (props: DayWidgetProps, environment: WidgetEnvironment) => {
  'widget';
  if (!props.visible) return (
    <VStack spacing={8}>
      <Text modifiers={[font({ weight: 'semibold', size: 17 }), foregroundStyle('#5A392B')]}>My Thirties</Text>
      <Text modifiers={[font({ size: 12 })]}>Votre espace personnel</Text>
    </VStack>
  );
  if (environment.widgetFamily === 'systemSmall') return (
    <VStack spacing={6}>
      <Text modifiers={[font({ weight: 'semibold', size: 15 })]}>Ma journée</Text>
      <Text>{props.summary}</Text>
      <Text>{props.priorityOne}</Text>
    </VStack>
  );
  return (
    <VStack spacing={6}>
      <Text modifiers={[font({ weight: 'semibold', size: 16 }), foregroundStyle('#5A392B')]}>{props.heading}</Text>
      <Text>{props.summary}</Text>
      <Text>{props.priorityOne}</Text>
      <Text>{props.priorityTwo}</Text>
    </VStack>
  );
};
export default createWidget('DayWidget', DayView);
