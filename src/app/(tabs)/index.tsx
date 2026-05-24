import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Spacing, Radii } from '../../constants/Spacing';
import { Card } from '../../components/ui/Card';
import { mockRecipes } from '../../data/mock';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Good evening 👋</Text>
          <Text style={styles.title}>My Cookbook</Text>
        </View>

        {/* Scan CTA */}
        <Pressable
          style={styles.scanCard}
          onPress={() => router.push('/camera')}
        >
          <Text style={styles.scanEmoji}>📸</Text>
          <View style={styles.scanText}>
            <Text style={styles.scanTitle}>Scan your fridge</Text>
            <Text style={styles.scanDescription}>Find recipes with what you have</Text>
          </View>
        </Pressable>

        {/* Recent Recipes */}
        <Text style={styles.sectionTitle}>Recent Recipes</Text>
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
    gap: Spacing.xl,
  },
  header: {
    gap: Spacing.xs,
  },
  greeting: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  title: {
    ...Typography.h1,
    color: Colors.textPrimary,
  },
  scanCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
    gap: Spacing.lg,
  },
  scanEmoji: {
    fontSize: 40,
  },
  scanText: {
    flex: 1,
    gap: Spacing.xs,
  },
  scanTitle: {
    ...Typography.subtitle,
    color: Colors.textPrimary,
  },
  scanDescription: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
  },
  cards: {
    gap: Spacing.lg,
  },
});
