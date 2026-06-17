import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/Colors';
import { FontFamily } from '../../constants/Typography';
import { mockRecipes } from '../../data/mock';

export default function RecipeDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const recipe = mockRecipes.find((r) => r.id === id) ?? mockRecipes[0];

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.heroImage}>
            <Text style={styles.heroEmoji}>🍽️</Text>
          </View>
          {/* Gradient overlay */}
          <LinearGradient
            colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.85)']}
            locations={[0, 0.6, 1]}
            style={styles.heroOverlay}
          />

          {/* Top controls */}
          <SafeAreaView style={styles.heroControls} edges={['top']}>
            <Pressable style={styles.heroButton} onPress={() => router.back()}>
              <Text style={styles.heroButtonText}>←</Text>
            </Pressable>
            <View style={styles.heroRight}>
              <Pressable style={styles.heroButton}>
                <Text style={styles.heroButtonText}>↗</Text>
              </Pressable>
              <Pressable style={styles.heroButton}>
                <Text style={styles.heroButtonText}>♡</Text>
              </Pressable>
            </View>
          </SafeAreaView>

          {/* Category badge */}
          <View style={styles.categoryBadge}>
            <Text style={styles.badgeFlag}>{recipe.cuisineEmoji}</Text>
            <Text style={styles.badgeText}>{recipe.cuisine.toUpperCase()}</Text>
          </View>

          {/* Title */}
          <Text style={styles.heroTitle}>{recipe.title}</Text>

          {/* Match badge */}
          <View style={styles.matchBadge}>
            <Text style={styles.matchSpark}>✨</Text>
            <Text style={styles.matchText}>{recipe.matchPercent}% match</Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Meta Panel */}
          <View style={styles.metaPanel}>
            <View style={styles.matchColumn}>
              <Text style={styles.matchPercent}>{recipe.matchPercent}%</Text>
              <Text style={styles.matchLabel}>FRIDGE MATCH</Text>
              <Text style={styles.matchSub}>{recipe.ingredients.length} of {recipe.ingredients.length + 2}{'\n'}ingredients</Text>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.statsColumn}>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>TIME</Text>
                <View style={styles.statValue}>
                  <Text style={styles.statNumber}>{recipe.cookTime.replace(' min', '')}</Text>
                  <Text style={styles.statUnit}>min</Text>
                </View>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statRow}>
                <Text style={[styles.statLabel, { color: Colors.blueLabel }]}>SERVINGS</Text>
                <View style={styles.statValue}>
                  <Text style={styles.statNumber}>{recipe.servings}</Text>
                  <Text style={styles.statUnit}>people</Text>
                </View>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statRow}>
                <Text style={[styles.statLabel, { color: Colors.accent }]}>DIFFICULTY</Text>
                <Text style={styles.statNumber}>{recipe.difficulty}</Text>
              </View>
            </View>
          </View>

          {/* Fridge ingredients */}
          <View style={styles.fridgeCard}>
            <View style={styles.fridgeStripe} />
            <View style={styles.fridgeInner}>
              <View style={styles.fridgeLabelRow}>
                <Text style={styles.fridgeSpark}>✨</Text>
                <Text style={styles.fridgeLabel}>WHAT'S FROM YOUR FRIDGE</Text>
              </View>
              <View style={styles.fridgeChips}>
                {recipe.ingredients.slice(0, 3).map((ing, i) => (
                  <View key={i} style={styles.fridgeChip}>
                    <Text style={styles.fridgeChipText}>✓ {ing.toLowerCase()}</Text>
                  </View>
                ))}
                <View style={styles.missingChip}>
                  <Text style={styles.missingChipText}>+ 2 missing</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Ingredients */}
          <View style={styles.ingredientsHeader}>
            <View>
              <Text style={styles.ingredientsTitle}>Ingredients</Text>
              <Text style={styles.ingredientsSub}>amounts scale with servings</Text>
            </View>
            <View style={styles.servingStepper}>
              <Pressable style={styles.stepperButton}>
                <Text style={styles.stepperText}>−</Text>
              </Pressable>
              <View style={styles.stepperValue}>
                <Text style={styles.stepperNumber}>{recipe.servings}</Text>
                <Text style={styles.stepperUnit}>serv</Text>
              </View>
              <Pressable style={styles.stepperButton}>
                <Text style={[styles.stepperText, { color: Colors.primary }]}>+</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.ingredientDividerThick} />

          {recipe.ingredients.map((ing, i) => (
            <View key={i}>
              <View style={styles.ingredientRow}>
                <View style={styles.ingredientLeft}>
                  <View style={i < 3 ? styles.checkCircle : styles.uncheckedCircle}>
                    {i < 3 && <Text style={styles.checkMark}>✓</Text>}
                  </View>
                  <Text style={[styles.ingredientName, i >= 3 && styles.ingredientNameMissing]}>
                    {ing}
                  </Text>
                </View>
                <Text style={styles.ingredientAmount}>2 medium</Text>
              </View>
              <View style={styles.ingredientDivider} />
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Sticky CTA */}
      <View style={styles.stickyFooter}>
        <Pressable
          style={styles.startButton}
          onPress={() => router.push(`/cook/${recipe.id}`)}
        >
          <Text style={styles.startButtonTitle}>Start cooking</Text>
          <Text style={styles.startButtonSub}>
            {recipe.cookTime} · {recipe.steps.length} steps · works with substitutions
          </Text>
        </Pressable>
        <Text style={styles.shoppingText}>🛒  Add 2 missing to shopping list</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  hero: {
    height: 420,
    position: 'relative',
    justifyContent: 'flex-end',
  },
  heroImage: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroEmoji: { fontSize: 80 },
  heroOverlay: {
    position: 'absolute',
    top: 220, left: 0, right: 0, bottom: 0,
  },
  heroControls: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 6,
  },
  heroRight: {
    flexDirection: 'row',
    gap: 6,
  },
  heroButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroButtonText: {
    fontSize: 20,
    color: Colors.textPrimary,
  },
  categoryBadge: {
    position: 'absolute',
    left: 16,
    bottom: 132,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.accent,
    borderRadius: 20,
    paddingLeft: 12,
    paddingRight: 14,
    paddingVertical: 8,
    shadowColor: '#801A1A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  badgeFlag: { fontSize: 14 },
  badgeText: {
    fontFamily: FontFamily.bold,
    fontSize: 12,
    color: Colors.white,
    letterSpacing: 0.48,
  },
  heroTitle: {
    position: 'absolute',
    left: 24,
    bottom: 52,
    fontFamily: FontFamily.heading,
    fontSize: 34,
    color: Colors.white,
    letterSpacing: -1.36,
    lineHeight: 38,
    width: 345,
  },
  matchBadge: {
    position: 'absolute',
    right: 16,
    bottom: 40,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primary,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    shadowColor: '#00661A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  matchSpark: { fontSize: 12 },
  matchText: {
    fontFamily: FontFamily.bold,
    fontSize: 12,
    color: Colors.white,
    letterSpacing: -0.24,
  },
  content: {
    padding: 24,
    gap: 24,
  },
  metaPanel: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 20,
    gap: 16,
    shadowColor: '#1A1A1A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
  },
  matchColumn: { gap: 4 },
  matchPercent: {
    fontFamily: FontFamily.heading,
    fontSize: 48,
    color: Colors.primary,
    letterSpacing: -1.92,
    lineHeight: 52,
  },
  matchLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: 10,
    color: Colors.primary,
    letterSpacing: 0.8,
  },
  matchSub: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  metaDivider: {
    width: 1,
    backgroundColor: Colors.border,
  },
  statsColumn: {
    flex: 1,
  },
  statRow: {
    gap: 2,
    paddingVertical: 6,
  },
  statLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: 9,
    color: Colors.saffron,
    letterSpacing: 0.72,
  },
  statValue: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  statNumber: {
    fontFamily: FontFamily.bold,
    fontSize: 16,
    color: Colors.textPrimary,
    letterSpacing: -0.64,
  },
  statUnit: {
    fontFamily: FontFamily.medium,
    fontSize: 11,
    color: Colors.textTertiary,
  },
  statDivider: {
    height: 1,
    backgroundColor: Colors.border,
  },
  fridgeCard: {
    flexDirection: 'row',
    backgroundColor: Colors.primaryBg,
    borderRadius: 14,
    overflow: 'hidden',
  },
  fridgeStripe: {
    width: 4,
    backgroundColor: Colors.primary,
  },
  fridgeInner: {
    flex: 1,
    padding: 16,
    paddingVertical: 14,
    gap: 12,
  },
  fridgeLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  fridgeSpark: { fontSize: 11 },
  fridgeLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: 11,
    color: Colors.primary,
    letterSpacing: 0.88,
  },
  fridgeChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  fridgeChip: {
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: 13,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  fridgeChipText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 12,
    color: Colors.primary,
  },
  missingChip: {
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.accent,
    borderStyle: 'dashed',
    borderRadius: 13,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  missingChipText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 12,
    color: Colors.accent,
  },
  ingredientsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ingredientsTitle: {
    fontFamily: FontFamily.heading,
    fontSize: 20,
    color: Colors.textPrimary,
    letterSpacing: -0.8,
  },
  ingredientsSub: {
    fontFamily: FontFamily.medium,
    fontSize: 11,
    color: Colors.textTertiary,
  },
  servingStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 22,
  },
  stepperButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperText: {
    fontFamily: FontFamily.bold,
    fontSize: 20,
    color: Colors.textPrimary,
  },
  stepperValue: {
    width: 56,
    height: 36,
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    gap: 4,
  },
  stepperNumber: {
    fontFamily: FontFamily.bold,
    fontSize: 17,
    color: Colors.textPrimary,
    letterSpacing: -0.68,
  },
  stepperUnit: {
    fontFamily: FontFamily.medium,
    fontSize: 10,
    color: Colors.textTertiary,
  },
  ingredientDividerThick: {
    height: 2,
    backgroundColor: Colors.textPrimary,
    marginTop: -12,
  },
  ingredientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  ingredientLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uncheckedCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colors.textTertiary,
  },
  checkMark: {
    fontSize: 12,
    color: Colors.white,
  },
  ingredientName: {
    fontFamily: FontFamily.semiBold,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  ingredientNameMissing: {
    fontFamily: FontFamily.medium,
  },
  ingredientAmount: {
    fontFamily: FontFamily.semiBold,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  ingredientDivider: {
    height: 1,
    backgroundColor: Colors.border,
  },
  stickyFooter: {
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 8,
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: Colors.primary,
    borderRadius: 28,
    paddingVertical: 12,
    paddingHorizontal: 24,
    width: '100%',
    alignItems: 'center',
    gap: 4,
    shadowColor: 'rgba(0,153,26,0.25)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 16,
  },
  startButtonTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 17,
    color: Colors.white,
    letterSpacing: -0.34,
  },
  startButtonSub: {
    fontFamily: FontFamily.medium,
    fontSize: 11,
    color: 'rgba(255,255,255,0.85)',
  },
  shoppingText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 13,
    color: Colors.textSecondary,
    paddingTop: 4,
  },
});
