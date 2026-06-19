import { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, Pressable, Modal, StyleSheet,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/Colors';
import { FontFamily } from '../../constants/Typography';
import { mockRecipes } from '../../data/mock';
import MingCuteIcon from '../../components/MingCuteIcon';

// Mock substitute data
const SUBSTITUTES = [
  {
    name: 'Linguine',
    description:
      'Same pasta family, slightly wider and flatter. Holds the tomato sauce just as well, cooks in the same time.',
    stats: [
      { label: 'COOK', value: 'Same', icon: 'time_line' as const },
      { label: 'TEXTURE', value: 'Flatter', icon: 'leaf_line' as const },
      { label: 'SAUCE', value: 'Great', icon: 'fork_knife_line' as const },
    ],
  },
  {
    name: 'Penne',
    description:
      'Tube-shaped pasta that catches sauce inside. Slightly different texture but works great in tomato-based dishes.',
    stats: [
      { label: 'COOK', value: '+2 min', icon: 'time_line' as const },
      { label: 'TEXTURE', value: 'Firmer', icon: 'leaf_line' as const },
      { label: 'SAUCE', value: 'Great', icon: 'fork_knife_line' as const },
    ],
  },
  {
    name: 'Fusilli',
    description:
      'Spiral shape traps sauce beautifully. Fun alternative that kids love. Same cook time as spaghetti.',
    stats: [
      { label: 'COOK', value: 'Same', icon: 'time_line' as const },
      { label: 'TEXTURE', value: 'Twisty', icon: 'leaf_line' as const },
      { label: 'SAUCE', value: 'Best', icon: 'fork_knife_line' as const },
    ],
  },
];

export default function RecipeDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const recipe = mockRecipes.find((r) => r.id === id) ?? mockRecipes[0];

  // State
  const [saved, setSaved] = useState(recipe.saved);
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [servings, setServings] = useState(recipe.servings);
  const [isLoading, setIsLoading] = useState(false);
  const [substituteSheet, setSubstituteSheet] = useState<string | null>(null);
  const [substituteIndex, setSubstituteIndex] = useState(0);
  const [showShoppingSheet, setShowShoppingSheet] = useState(false);
  const [addedToShopping, setAddedToShopping] = useState(false);
  const [showShoppingToast, setShowShoppingToast] = useState(false);

  const availableCount = 3;
  const totalCount = recipe.ingredients.length + 2;
  const missingCount = totalCount - availableCount;
  const allMatch = missingCount === 0;

  // Missing ingredients for shopping sheet
  const missingIngredients = recipe.ingredients.slice(availableCount).map((name, i) => ({
    id: `miss-${i}`,
    name,
    amount: '2 medium',
  }));
  // Add phantom missing items to match missingCount
  const extraMissing = Array.from(
    { length: Math.max(0, missingCount - missingIngredients.length) },
    (_, i) => ({ id: `extra-${i}`, name: `Ingredient ${availableCount + missingIngredients.length + i + 1}`, amount: '1 unit' }),
  );
  const allMissing = [...missingIngredients, ...extraMissing];

  const [shoppingChecked, setShoppingChecked] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(allMissing.map((m) => [m.id, true])),
  );

  const checkedCount = Object.values(shoppingChecked).filter(Boolean).length;

  const handleAddToShopping = useCallback(() => {
    setShowShoppingSheet(false);
    setAddedToShopping(true);
    setShowShoppingToast(true);
    setTimeout(() => setShowShoppingToast(false), 3000);
  }, []);

  const toggleSaved = useCallback(() => {
    const next = !saved;
    setSaved(next);
    if (next) {
      setShowSavedToast(true);
      setTimeout(() => setShowSavedToast(false), 3000);
    }
  }, [saved]);

  const adjustServings = useCallback((delta: number) => {
    setServings((s) => Math.max(1, Math.min(12, s + delta)));
  }, []);

  const openSubstitute = useCallback((ingredientName: string) => {
    setSubstituteIndex(0);
    setSubstituteSheet(ingredientName);
  }, []);

  const currentSub = SUBSTITUTES[substituteIndex];

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.heroImage}>
            <MingCuteIcon name="fork_knife_fill" size={80} color={Colors.textTertiary} />
          </View>
          <LinearGradient
            colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.85)']}
            locations={[0, 0.6, 1]}
            style={styles.heroOverlay}
          />

          {/* Top controls */}
          <SafeAreaView style={styles.heroControls} edges={['top']}>
            <Pressable style={styles.heroButton} onPress={() => router.back()}>
              <MingCuteIcon name="arrow_left_line" size={20} color={Colors.textPrimary} />
            </Pressable>
            <View style={styles.heroRight}>
              <Pressable style={styles.heroButton}>
                <MingCuteIcon name="share_forward_line" size={20} color={Colors.textPrimary} />
              </Pressable>
              <Pressable
                style={[styles.heroButton, saved && styles.heroButtonSaved]}
                onPress={toggleSaved}
              >
                <MingCuteIcon
                  name={saved ? 'heart_fill' : 'heart_line'}
                  size={20}
                  color={saved ? Colors.accent : Colors.textPrimary}
                />
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
            <MingCuteIcon name="sparkles_fill" size={12} color={Colors.white} />
            <Text style={styles.matchText}>{recipe.matchPercent}% match</Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Saved Toast */}
          {showSavedToast && (
            <View style={styles.savedToast}>
              <MingCuteIcon name="heart_fill" size={18} color={Colors.accent} />
              <View style={styles.savedToastText}>
                <Text style={styles.savedToastTitle}>Saved to your recipes</Text>
                <Text style={styles.savedToastSub}>Find in your library anytime</Text>
              </View>
              <Pressable onPress={() => router.push('/(tabs)/saved')}>
                <Text style={styles.savedToastLink}>{'View →'}</Text>
              </Pressable>
            </View>
          )}

          {/* Shopping Toast */}
          {showShoppingToast && (
            <View style={styles.shoppingToast}>
              <MingCuteIcon name="shopping_cart_1_line" size={18} color={Colors.primary} />
              <View style={styles.savedToastText}>
                <Text style={styles.savedToastTitle}>{checkedCount} items added</Text>
                <Text style={styles.savedToastSub}>Check your shopping list</Text>
              </View>
              <MingCuteIcon name="check_fill" size={18} color={Colors.primary} />
            </View>
          )}

          {/* Loading Banner */}
          {isLoading && (
            <View style={styles.loadingBanner}>
              <MingCuteIcon name="sparkles_fill" size={20} color={Colors.blueText} />
              <View style={styles.loadingBannerText}>
                <Text style={styles.loadingTitle}>Regenerating recipe...</Text>
                <Text style={styles.loadingSub}>Updating ingredients for new preferences</Text>
              </View>
            </View>
          )}

          {/* Meta Panel */}
          <View style={[styles.metaPanel, isLoading && styles.dimmed]}>
            <View style={styles.matchColumn}>
              <Text style={styles.matchPercent}>{recipe.matchPercent}%</Text>
              <Text style={styles.matchLabel}>FRIDGE MATCH</Text>
              <Text style={styles.matchSub}>
                {availableCount} of {totalCount}{'\n'}ingredients
              </Text>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.statsColumn}>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>TIME</Text>
                <View style={styles.statValue}>
                  <Text style={styles.statNumber}>
                    {recipe.cookTime.replace(' min', '')}
                  </Text>
                  <Text style={styles.statUnit}>min</Text>
                </View>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statRow}>
                <Text style={[styles.statLabel, { color: Colors.blueLabel }]}>SERVINGS</Text>
                <View style={styles.statValue}>
                  <Text style={styles.statNumber}>{servings}</Text>
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
          <View style={[styles.fridgeCard, isLoading && styles.dimmed]}>
            <View style={styles.fridgeStripe} />
            <View style={styles.fridgeInner}>
              <View style={styles.fridgeLabelRow}>
                <MingCuteIcon name="sparkles_fill" size={11} color={Colors.primary} />
                <Text style={styles.fridgeLabel}>WHAT'S FROM YOUR FRIDGE</Text>
              </View>
              <View style={styles.fridgeChips}>
                {recipe.ingredients.slice(0, availableCount).map((ing, i) => (
                  <View key={i} style={styles.fridgeChip}>
                    <MingCuteIcon name="check_line" size={11} color={Colors.primary} />
                    <Text style={styles.fridgeChipText}>{ing.toLowerCase()}</Text>
                  </View>
                ))}
                {!allMatch && (
                  <View style={styles.missingChip}>
                    <Text style={styles.missingChipText}>+ {missingCount} missing</Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* Ingredients */}
          <View style={[isLoading && styles.dimmed]}>
            <View style={styles.ingredientsHeader}>
              <View>
                <Text style={styles.ingredientsTitle}>Ingredients</Text>
                <Text style={styles.ingredientsSub}>amounts scale with servings</Text>
              </View>
              <View style={styles.servingStepper}>
                <Pressable
                  style={styles.stepperButton}
                  onPress={() => adjustServings(-1)}
                >
                  <Text style={styles.stepperText}>−</Text>
                </Pressable>
                <View style={styles.stepperValue}>
                  <Text style={styles.stepperNumber}>{servings}</Text>
                  <Text style={styles.stepperUnit}>serv</Text>
                </View>
                <Pressable
                  style={styles.stepperButton}
                  onPress={() => adjustServings(1)}
                >
                  <Text style={[styles.stepperText, { color: Colors.primary }]}>+</Text>
                </Pressable>
              </View>
            </View>

            <View style={styles.ingredientDividerThick} />

            {recipe.ingredients.map((ing, i) => {
              const isAvailable = i < availableCount;
              const isMissing = !isAvailable;
              return (
                <View key={i}>
                  <View style={[styles.ingredientRow, isMissing && styles.ingredientRowMissing]}>
                    <View style={styles.ingredientInner}>
                      <View style={styles.ingredientLeft}>
                        <View style={isAvailable ? styles.checkCircle : styles.uncheckedCircle}>
                          {isAvailable && (
                            <MingCuteIcon name="check_line" size={12} color={Colors.white} />
                          )}
                        </View>
                        <Text
                          style={[
                            styles.ingredientName,
                            isMissing && styles.ingredientNameMissing,
                          ]}
                        >
                          {ing}
                        </Text>
                      </View>
                      <Text
                        style={[
                          styles.ingredientAmount,
                          isMissing && styles.ingredientAmountMissing,
                        ]}
                      >
                        2 medium
                      </Text>
                    </View>
                    {isMissing && (
                      <Pressable
                        style={styles.substituteRow}
                        onPress={() => openSubstitute(ing)}
                      >
                        <MingCuteIcon name="sparkles_fill" size={11} color={Colors.accent} />
                        <Text style={styles.substituteText}>{'Suggest substitute  →'}</Text>
                      </Pressable>
                    )}
                  </View>
                  <View style={styles.ingredientDivider} />
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Sticky CTA */}
      <View style={[styles.stickyFooter, { paddingBottom: Math.max(insets.bottom, 24) }]}>
        <Pressable
          style={[styles.startButton, isLoading && styles.startButtonDisabled]}
          onPress={() => !isLoading && router.push(`/cook/${recipe.id}`)}
          disabled={isLoading}
        >
          <Text style={styles.startButtonTitle}>
            {isLoading ? 'Updating...' : 'Start cooking'}
          </Text>
          <Text style={styles.startButtonSub}>
            {recipe.cookTime} · {recipe.steps.length} steps
            {!allMatch ? ' · works with substitutions' : ''}
          </Text>
        </Pressable>
        {!allMatch && !addedToShopping && (
          <Pressable style={styles.shoppingRow} onPress={() => setShowShoppingSheet(true)}>
            <MingCuteIcon name="shopping_cart_1_line" size={14} color={Colors.textSecondary} />
            <Text style={styles.shoppingText}>
              Add {missingCount} missing to shopping list
            </Text>
          </Pressable>
        )}
        {addedToShopping && (
          <View style={styles.shoppingRowDone}>
            <MingCuteIcon name="check_fill" size={14} color={Colors.primary} />
            <Text style={styles.shoppingTextDone}>Added to shopping list</Text>
          </View>
        )}
      </View>

      {/* Substitute Bottom Sheet */}
      <Modal
        visible={substituteSheet !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setSubstituteSheet(null)}
      >
        <Pressable style={styles.sheetOverlay} onPress={() => setSubstituteSheet(null)} />
        <View style={[styles.sheetContainer, { paddingBottom: Math.max(insets.bottom, 24) }]}>
          {/* Handle */}
          <View style={styles.sheetHandleRow}>
            <View style={styles.sheetHandle} />
          </View>

          {/* Header */}
          <View style={styles.sheetHeader}>
            <View style={styles.sheetHeaderLeft}>
              <View style={styles.sheetLabelRow}>
                <MingCuteIcon name="sparkles_fill" size={11} color={Colors.saffronDark} />
                <Text style={styles.sheetLabelText}>AI SUBSTITUTE FOR</Text>
              </View>
              <Text style={styles.sheetIngredientName}>{substituteSheet}</Text>
            </View>
            <Pressable style={styles.sheetClose} onPress={() => setSubstituteSheet(null)}>
              <MingCuteIcon name="close_line" size={16} color={Colors.textSecondary} />
            </Pressable>
          </View>

          {/* Image placeholder */}
          <View style={styles.sheetImageWrapper}>
            <View style={styles.sheetImage}>
              <MingCuteIcon name="fork_knife_fill" size={48} color={Colors.saffron} />
            </View>
          </View>

          {/* Substitute info */}
          <View style={styles.sheetInfo}>
            <View style={styles.sheetNameRow}>
              <Text style={styles.sheetSubName}>{currentSub.name}</Text>
              <View style={styles.bestMatchBadge}>
                <MingCuteIcon name="star_fill" size={11} color={Colors.white} />
                <Text style={styles.bestMatchText}>BEST MATCH</Text>
              </View>
            </View>
            <Text style={styles.sheetDescription}>{currentSub.description}</Text>

            {/* Stats chips */}
            <View style={styles.sheetStats}>
              {currentSub.stats.map((stat, i) => (
                <View key={i} style={styles.sheetStatChip}>
                  <View style={styles.sheetStatLabelRow}>
                    <MingCuteIcon name={stat.icon} size={10} color={Colors.textPrimary} />
                    <Text style={styles.sheetStatLabel}>{stat.label}</Text>
                  </View>
                  <Text style={styles.sheetStatValue}>{stat.value}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* CTA row */}
          <View style={styles.sheetCTARow}>
            <Pressable
              style={styles.sheetNavButton}
              onPress={() =>
                setSubstituteIndex((i) =>
                  (i - 1 + SUBSTITUTES.length) % SUBSTITUTES.length
                )
              }
            >
              <MingCuteIcon name="arrow_left_line" size={22} color={Colors.textPrimary} />
            </Pressable>
            <Pressable
              style={styles.sheetUseCTA}
              onPress={() => setSubstituteSheet(null)}
            >
              <Text style={styles.sheetUseText}>Use {currentSub.name}</Text>
            </Pressable>
            <Pressable
              style={styles.sheetNavButton}
              onPress={() =>
                setSubstituteIndex((i) => (i + 1) % SUBSTITUTES.length)
              }
            >
              <MingCuteIcon name="arrow_right_line" size={22} color={Colors.textPrimary} />
            </Pressable>
          </View>

          {/* Hint */}
          <Text style={styles.sheetHint}>
            {substituteIndex + 1} of {SUBSTITUTES.length} suggestions  •  Swipe to compare
          </Text>
        </View>
      </Modal>

      {/* Shopping List Bottom Sheet */}
      <Modal
        visible={showShoppingSheet}
        transparent
        animationType="slide"
        onRequestClose={() => setShowShoppingSheet(false)}
      >
        <Pressable style={styles.sheetOverlay} onPress={() => setShowShoppingSheet(false)} />
        <View style={[styles.sheetContainer, { paddingBottom: Math.max(insets.bottom, 24) }]}>
          {/* Handle */}
          <View style={styles.sheetHandleRow}>
            <View style={styles.sheetHandle} />
          </View>

          {/* Header */}
          <View style={styles.sheetHeader}>
            <View style={styles.sheetHeaderLeft}>
              <Text style={styles.sheetIngredientName}>Add to shopping list</Text>
              <Text style={styles.shopSheetSub}>
                {checkedCount} of {allMissing.length} items selected
              </Text>
            </View>
            <Pressable style={styles.sheetClose} onPress={() => setShowShoppingSheet(false)}>
              <MingCuteIcon name="close_line" size={16} color={Colors.textSecondary} />
            </Pressable>
          </View>

          {/* Ingredient rows */}
          <View style={styles.shopList}>
            {allMissing.map((item) => {
              const checked = shoppingChecked[item.id];
              return (
                <Pressable
                  key={item.id}
                  style={styles.shopRow}
                  onPress={() =>
                    setShoppingChecked((prev) => ({ ...prev, [item.id]: !prev[item.id] }))
                  }
                >
                  <View style={[styles.shopCheckbox, checked && styles.shopCheckboxChecked]}>
                    {checked && <MingCuteIcon name="check_line" size={12} color={Colors.white} />}
                  </View>
                  <View style={styles.shopItemInfo}>
                    <Text style={[styles.shopItemName, !checked && styles.shopItemUnchecked]}>
                      {item.name}
                    </Text>
                    <Text style={styles.shopItemAmount}>{item.amount}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>

          {/* CTA */}
          <View style={styles.shopCTARow}>
            <Pressable
              style={[styles.shopCTA, checkedCount === 0 && styles.shopCTADisabled]}
              onPress={checkedCount > 0 ? handleAddToShopping : undefined}
            >
              <MingCuteIcon name="shopping_cart_1_line" size={16} color={Colors.white} />
              <Text style={styles.shopCTAText}>
                Add {checkedCount} item{checkedCount !== 1 ? 's' : ''} to list
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },

  // Hero
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
  heroOverlay: {
    position: 'absolute',
    top: 220, left: 0, right: 0, bottom: 0,
  },
  heroControls: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
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
  heroButtonSaved: {
    backgroundColor: 'rgba(255,255,255,0.95)',
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
  matchText: {
    fontFamily: FontFamily.bold,
    fontSize: 12,
    color: Colors.white,
    letterSpacing: -0.24,
  },

  // Content
  content: {
    padding: 24,
    gap: 24,
  },
  dimmed: {
    opacity: 0.35,
  },

  // Saved Toast
  savedToast: {
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: '#FCD9D9',
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: 'rgba(229,51,51,0.15)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 16,
  },
  savedToastText: {
    flex: 1,
    gap: 1,
  },
  savedToastTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 14,
    color: Colors.textPrimary,
    letterSpacing: -0.56,
  },
  savedToastSub: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    color: '#666666',
  },
  savedToastLink: {
    fontFamily: FontFamily.semiBold,
    fontSize: 12,
    color: Colors.accent,
  },

  // Loading Banner
  loadingBanner: {
    backgroundColor: Colors.blueBg,
    borderWidth: 1,
    borderColor: Colors.blueBorder,
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  loadingBannerText: {
    flex: 1,
    gap: 2,
  },
  loadingTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 15,
    color: Colors.blueText,
    letterSpacing: -0.6,
  },
  loadingSub: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    color: '#59668C',
  },

  // Meta Panel
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
  statsColumn: { flex: 1 },
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

  // Fridge Card
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
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

  // Ingredients
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
    padding: 12,
    borderRadius: 8,
    gap: 4,
  },
  ingredientRowMissing: {
    backgroundColor: Colors.accentLight,
  },
  ingredientInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  ingredientAmountMissing: {
    color: Colors.textSecondary,
  },
  substituteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingLeft: 30,
  },
  substituteText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 12,
    color: Colors.accent,
  },
  ingredientDivider: {
    height: 1,
    backgroundColor: Colors.border,
  },

  // Sticky Footer
  stickyFooter: {
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingHorizontal: 24,
    paddingTop: 16,
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
  startButtonDisabled: {
    backgroundColor: '#D9D9D9',
    shadowOpacity: 0,
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
  shoppingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 4,
  },
  shoppingText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 13,
    color: Colors.textSecondary,
  },
  shoppingRowDone: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 4,
  },
  shoppingTextDone: {
    fontFamily: FontFamily.semiBold,
    fontSize: 13,
    color: Colors.primary,
  },
  shoppingToast: {
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.primaryBorder,
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: 'rgba(0,153,26,0.15)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 16,
  },

  // Shopping Sheet
  shopSheetSub: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  shopList: {
    paddingHorizontal: 24,
    paddingTop: 16,
    gap: 4,
  },
  shopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: Colors.background,
  },
  shopCheckbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: Colors.textTertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shopCheckboxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  shopItemInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shopItemName: {
    fontFamily: FontFamily.semiBold,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  shopItemUnchecked: {
    color: Colors.textTertiary,
    textDecorationLine: 'line-through',
  },
  shopItemAmount: {
    fontFamily: FontFamily.medium,
    fontSize: 13,
    color: Colors.textSecondary,
  },
  shopCTARow: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  shopCTA: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: 'rgba(0,153,26,0.25)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 16,
  },
  shopCTADisabled: {
    backgroundColor: '#D9D9D9',
    shadowOpacity: 0,
  },
  shopCTAText: {
    fontFamily: FontFamily.bold,
    fontSize: 16,
    color: Colors.white,
    letterSpacing: -0.32,
  },

  // Substitute Bottom Sheet
  sheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheetContainer: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 20,
  },
  sheetHandleRow: {
    alignItems: 'center',
    paddingBottom: 16,
  },
  sheetHandle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#CCCCC7',
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 6,
  },
  sheetHeaderLeft: {
    gap: 2,
  },
  sheetLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sheetLabelText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 11,
    color: Colors.saffronDark,
    letterSpacing: 0.88,
  },
  sheetIngredientName: {
    fontFamily: FontFamily.heading,
    fontSize: 22,
    color: Colors.textPrimary,
    letterSpacing: -0.88,
  },
  sheetClose: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Sheet image
  sheetImageWrapper: {
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  sheetImage: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    backgroundColor: Colors.splashGradientEnd,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Sheet info
  sheetInfo: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 12,
    gap: 12,
  },
  sheetNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sheetSubName: {
    fontFamily: FontFamily.heading,
    fontSize: 28,
    color: Colors.textPrimary,
    letterSpacing: -1.12,
  },
  bestMatchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingLeft: 10,
    paddingRight: 12,
    paddingVertical: 6,
  },
  bestMatchText: {
    fontFamily: FontFamily.bold,
    fontSize: 11,
    color: Colors.white,
    letterSpacing: 0.22,
  },
  sheetDescription: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  sheetStats: {
    flexDirection: 'row',
    gap: 8,
  },
  sheetStatChip: {
    flex: 1,
    backgroundColor: '#F7F7F2',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 2,
  },
  sheetStatLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sheetStatLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: 9,
    color: Colors.textTertiary,
    letterSpacing: 0.54,
  },
  sheetStatValue: {
    fontFamily: FontFamily.bold,
    fontSize: 13,
    color: Colors.textPrimary,
    letterSpacing: -0.26,
  },

  // Sheet CTA
  sheetCTARow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  sheetNavButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: '#E0E0D9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetUseCTA: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: 27,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(0,153,26,0.25)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 16,
  },
  sheetUseText: {
    fontFamily: FontFamily.bold,
    fontSize: 16,
    color: Colors.white,
    letterSpacing: -0.32,
  },
  sheetHint: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingTop: 6,
  },
});
