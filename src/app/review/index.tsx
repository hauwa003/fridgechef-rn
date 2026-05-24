import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Spacing } from '../../constants/Spacing';
import { Button } from '../../components/ui/Button';
import { IngredientRow } from '../../components/ui/IngredientRow';
import { TopBar } from '../../components/ui/TopBar';
import { mockIngredients } from '../../data/mock';

export default function ReviewScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <TopBar title="Review Ingredients" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.subtitle}>
          We found {mockIngredients.length} ingredients. Deselect any you don't want to use.
        </Text>

        <View style={styles.list}>
          {mockIngredients.map((ingredient) => (
            <IngredientRow
              key={ingredient.id}
              emoji={ingredient.emoji}
              name={ingredient.name}
              selected={ingredient.selected}
            />
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={`Find Recipes (${mockIngredients.filter((i) => i.selected).length} ingredients)`}
          onPress={() => router.push('/recipes')}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    paddingBottom: Spacing.xxl,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
  },
  list: {
    backgroundColor: Colors.surface,
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
});
