import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Spacing, Radii } from '../../constants/Spacing';

interface BadgeProps {
  label: string;
  variant?: 'cuisine' | 'match';
}

export function Badge({ label, variant = 'cuisine' }: BadgeProps) {
  return (
    <View style={[styles.container, variant === 'match' && styles.matchContainer]}>
      <Text style={[styles.text, variant === 'match' && styles.matchText]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radii.sm,
    backgroundColor: Colors.background,
    alignSelf: 'flex-start',
  },
  matchContainer: {
    backgroundColor: '#E8F5E9',
  },
  text: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
  },
  matchText: {
    color: Colors.primary,
  },
});
