import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Spacing } from '../../constants/Spacing';
import { Card } from '../../components/ui/Card';
import { FilterPill } from '../../components/ui/FilterPill';
import { mockRecipes } from '../../data/mock';

export default function SavedRecipesScreen() {
  const router = useRouter();
  const savedRecipes = mockRecipes.filter((r) => r.saved);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Saved Recipes</Text>

        {/* Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          <FilterPill label="All" active />
          <FilterPill label="Italian" />
          <FilterPill label="Asian" />
          <FilterPill label="Mediterranean" />
          <FilterPill label="Mexican" />
        </ScrollView>

        {/* Recipe Cards */}
        {savedRecipes.length > 0 ? (
          <View style={styles.cards}>
            {savedRecipes.map((recipe) => (
              <Card
                key={recipe.id}
                title={recipe.title}
                cuisine={recipe.cuisine}
                cuisineEmoji={recipe.cuisineEmoji}
                matchPercent={recipe.matchPercent}
                cookTime={recipe.cookTime}
                onPress={() => router.push(`/recipes/${recipe.id}`)}
              />
            ))}
          </View>
        ) : (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>📖</Text>
            <Text style={styles.emptyTitle}>No saved recipes yet</Text>
            <Text style={styles.emptyDescription}>
              Recipes you save will appear here
            </Text>
          </View>
        )}
      </ScrollView>
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
  },
  title: {
    ...Typography.h1,
    color: Colors.textPrimary,
  },
  filters: {
    gap: Spacing.sm,
    paddingRight: Spacing.xl,
  },
  cards: {
    gap: Spacing.lg,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.mega,
    gap: Spacing.md,
  },
  emptyEmoji: {
    fontSize: 56,
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
  },
  emptyDescription: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
});
