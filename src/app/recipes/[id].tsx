import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Spacing, Radii } from '../../constants/Spacing';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { TopBar } from '../../components/ui/TopBar';
import { mockRecipes } from '../../data/mock';

export default function RecipeDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const recipe = mockRecipes.find((r) => r.id === id) ?? mockRecipes[0];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <TopBar
        title={recipe.title}
        rightAction={
          <Pressable>
            <Text style={styles.saveIcon}>{recipe.saved ? '❤️' : '🤍'}</Text>
          </Pressable>
        }
      />
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Hero image placeholder */}
        <View style={styles.hero}>
          <Text style={styles.heroEmoji}>🍽️</Text>
        </View>

        {/* Badges */}
        <View style={styles.badges}>
          <Badge label={`${recipe.cuisineEmoji} ${recipe.cuisine}`} variant="cuisine" />
          <Badge label={`✨ ${recipe.matchPercent}% match`} variant="match" />
        </View>

        {/* Meta */}
        <View style={styles.meta}>
          <View style={styles.metaItem}>
            <Text style={styles.metaValue}>{recipe.cookTime}</Text>
            <Text style={styles.metaLabel}>Cook time</Text>
          </View>
          <View style={styles.metaDivider} />
          <View style={styles.metaItem}>
            <Text style={styles.metaValue}>{recipe.servings}</Text>
            <Text style={styles.metaLabel}>Servings</Text>
          </View>
          <View style={styles.metaDivider} />
          <View style={styles.metaItem}>
            <Text style={styles.metaValue}>{recipe.difficulty}</Text>
            <Text style={styles.metaLabel}>Difficulty</Text>
          </View>
        </View>

        {/* Ingredients */}
        <Text style={styles.sectionTitle}>Ingredients</Text>
        <View style={styles.ingredientList}>
          {recipe.ingredients.map((ing, i) => (
            <Text key={i} style={styles.ingredientItem}>• {ing}</Text>
          ))}
        </View>

        {/* Steps preview */}
        <Text style={styles.sectionTitle}>Steps ({recipe.steps.length})</Text>
        {recipe.steps.map((step) => (
          <View key={step.number} style={styles.stepRow}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>{step.number}</Text>
            </View>
            <Text style={styles.stepTitle}>{step.title}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Start Cooking"
          onPress={() => router.push(`/cook/${recipe.id}`)}
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
    padding: Spacing.xl,
    gap: Spacing.xl,
    paddingBottom: Spacing.mega,
  },
  hero: {
    height: 200,
    backgroundColor: Colors.surface,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroEmoji: {
    fontSize: 64,
  },
  saveIcon: {
    fontSize: 22,
  },
  badges: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
  },
  metaItem: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  metaValue: {
    ...Typography.subtitle,
    color: Colors.textPrimary,
  },
  metaLabel: {
    ...Typography.caption,
    color: Colors.textTertiary,
  },
  metaDivider: {
    width: 1,
    height: 32,
    backgroundColor: Colors.border,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
  },
  ingredientList: {
    gap: Spacing.sm,
  },
  ingredientItem: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    ...Typography.caption,
    color: Colors.white,
  },
  stepTitle: {
    ...Typography.body,
    color: Colors.textPrimary,
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
});
