import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Spacing, Radii } from '../../constants/Spacing';

interface IngredientRowProps {
  emoji: string;
  name: string;
  selected: boolean;
  onToggle?: () => void;
}

export function IngredientRow({ emoji, name, selected, onToggle }: IngredientRowProps) {
  return (
    <Pressable onPress={onToggle} style={styles.container}>
      <View style={styles.left}>
        <Text style={styles.emoji}>{emoji}</Text>
        <Text style={styles.name}>{name}</Text>
      </View>
      <View style={[styles.checkbox, selected && styles.checked]}>
        {selected && <Text style={styles.checkmark}>✓</Text>}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  emoji: {
    fontSize: 24,
  },
  name: {
    ...Typography.body,
    color: Colors.textPrimary,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: Radii.sm,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkmark: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
});
