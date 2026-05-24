import { Pressable, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Spacing, Radii } from '../../constants/Spacing';

interface FilterPillProps {
  label: string;
  active?: boolean;
  onPress?: () => void;
}

export function FilterPill({ label, active, onPress }: FilterPillProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.container, active && styles.active]}
    >
      <Text style={[styles.text, active && styles.activeText]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radii.full,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  active: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  text: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  activeText: {
    color: Colors.white,
  },
});
