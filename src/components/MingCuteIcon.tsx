import { Text, TextStyle, StyleProp } from 'react-native';
import { MingCuteGlyphMap, MingCuteIconName } from '../constants/MingCuteGlyphMap';

interface MingCuteIconProps {
  name: MingCuteIconName;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
}

export default function MingCuteIcon({ name, size = 24, color = '#000', style }: MingCuteIconProps) {
  const glyph = MingCuteGlyphMap[name];
  return (
    <Text
      style={[
        {
          fontFamily: 'MingCute',
          fontSize: size,
          color,
          lineHeight: size,
          textAlignVertical: 'center',
        },
        style,
      ]}
      selectable={false}
    >
      {String.fromCodePoint(glyph)}
    </Text>
  );
}
