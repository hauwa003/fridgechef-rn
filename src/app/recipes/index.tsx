import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Spacing } from '../../constants/Spacing';
import { Card } from '../../components/ui/Card';
import { FilterPill } from '../../components/ui/FilterPill';
import { TopBar } from '../../components/ui/TopBar';
import { mockRecipes } from '../../data/mock';

export default function RecipeListScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <TopBar title="Recipe Suggestions" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.resultCount}>
          {mockRecipes.length} recipes found
        </Text>

        {/* Sort/Filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          <FilterPill label="Best Match" active />
          <FilterPill label="Quick" />
          <FilterPill label="Easy" />
          <FilterPill label="Popular" />
        </ScrollView>

        {/* Recipe Cards */}
        <View style={styles.cards}>
          {mockRecipes.map((recipe) => (
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
    gap: Spacing.lg,
  },
  resultCount: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  filters: {
    gap: Spacing.sm,
    paddingRight: Spacing.xl,
  },
  cards: {
    gap: Spacing.lg,
  },
});
