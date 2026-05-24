import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Spacing, Radii } from '../../constants/Spacing';
import { Badge } from './Badge';

interface CardProps {
  title: string;
  cuisine: string;
  cuisineEmoji: string;
  matchPercent: number;
  cookTime: string;
  onPress?: () => void;
}

export function Card({ title, cuisine, cuisineEmoji, matchPercent, cookTime, onPress }: CardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      <View style={styles.imagePlaceholder}>
        <Text style={styles.placeholderEmoji}>🍽️</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.badges}>
          <Badge label={`${cuisineEmoji} ${cuisine}`} variant="cuisine" />
          <Badge label={`✨ ${matchPercent}%`} variant="match" />
        </View>
        <Text style={styles.title} numberOfLines={2}>{title}</Text>
        <Text style={styles.meta}>{cookTime}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.9,
  },
  imagePlaceholder: {
    height: 160,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderEmoji: {
    fontSize: 48,
  },
  content: {
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  badges: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  title: {
    ...Typography.subtitle,
    color: Colors.textPrimary,
  },
  meta: {
    ...Typography.bodySmall,
    color: Colors.textTertiary,
  },
});
