import { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Modal,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/Colors';
import { FontFamily } from '../../constants/Typography';
import { mockRecipeListRecipes } from '../../data/mock';
import MingCuteIcon from '../../components/MingCuteIcon';
import { RecipeListRecipe } from '../../types';

// ─── Helpers ───────────────────────────────────────────────

function matchBadgeBg(percent: number): string {
  return percent >= 80 ? Colors.primary : Colors.saffron;
}

function difficultyColor(difficulty: string): string {
  switch (difficulty) {
    case 'Easy':
      return Colors.primary;
    case 'Medium':
      return Colors.saffronDark;
    default:
      return Colors.textDark;
  }
}

type ScreenState = 'loading' | 'empty' | 'loaded';

type SortOption = 'best_match' | 'quickest' | 'popular' | 'newest' | 'difficulty';

type ActiveFilters = {
  cuisines: string[];
  time: string | null;
  dietary: string[];
};

// ─── Sort / Filter Data ────────────────────────────────────

const SORT_OPTIONS: {
  id: SortOption;
  emoji: string;
  title: string;
  description: string;
}[] = [
  { id: 'best_match', emoji: '⭐', title: 'Best match', description: 'Recipes using most of your ingredients' },
  { id: 'quickest', emoji: '⚡', title: 'Quickest first', description: 'Shortest cook time' },
  { id: 'popular', emoji: '📚', title: 'Most popular', description: 'Community favorites' },
  { id: 'newest', emoji: '🆕', title: 'Newest additions', description: 'Recently added recipes' },
  { id: 'difficulty', emoji: '🌶', title: 'Difficulty', description: 'Easiest recipes first' },
];

const CUISINE_CHIPS = ['Italian', 'Asian', 'Mexican', 'Mediterranean', 'American'];
const TIME_CHIPS = ['Under 15 min', '15-30 min', '30-60 min', '1 hour+'];
const DIETARY_CHIPS = ['Vegetarian', 'Vegan', 'Gluten-free', 'Dairy-free'];

function chipSelectedColor(label: string): string {
  // Cuisine colors
  if (label === 'Italian') return '#E53845';
  if (label === 'Asian') return Colors.saffronDark;
  if (label === 'Mexican') return '#E57300';
  if (label === 'Mediterranean') return Colors.blue;
  if (label === 'American') return Colors.textDark;
  // Time colors
  if (label.includes('15') || label.includes('30') || label.includes('hour')) return Colors.saffron;
  // Dietary colors
  if (label === 'Vegetarian' || label === 'Vegan') return Colors.primary;
  if (label === 'Gluten-free' || label === 'Dairy-free') return Colors.blue;
  return Colors.textDark;
}

// ─── Determine banner variant from recipes ──────────────────

type BannerVariant = 'default' | 'high' | 'low';

function getBannerVariant(recipes: RecipeListRecipe[]): BannerVariant {
  if (recipes.length === 0) return 'default';
  const highCount = recipes.filter((r) => r.matchPercent >= 80).length;
  if (highCount === recipes.length) return 'high';
  if (highCount <= 1) return 'low';
  return 'default';
}

// ─── Main Screen ────────────────────────────────────────────

export default function RecipeListScreen() {
  const router = useRouter();
  const [screenState, setScreenState] = useState<ScreenState>('loading');
  const [recipes, setRecipes] = useState<RecipeListRecipe[]>([]);
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const [showSortSheet, setShowSortSheet] = useState(false);
  const [activeSort, setActiveSort] = useState<SortOption>('best_match');
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    cuisines: [],
    time: null,
    dietary: [],
  });
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Loading animation
  useEffect(() => {
    const t1 = setTimeout(() => setLoadingProgress(1), 800);
    const t2 = setTimeout(() => setLoadingProgress(2), 1600);
    const t3 = setTimeout(() => {
      setRecipes(mockRecipeListRecipes);
      setScreenState('loaded');
    }, 3100);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const bannerVariant = getBannerVariant(recipes);
  const featured = recipes[0];
  const rest = recipes.slice(1);

  // Filter count for CTA label
  const filterCount = activeFilters.cuisines.length +
    (activeFilters.time ? 1 : 0) +
    activeFilters.dietary.length;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* ── Top Bar ── */}
      <View style={styles.topBar}>
        <Pressable style={styles.iconBtn} onPress={() => router.replace('/(tabs)')}>
          <MingCuteIcon name="arrow_left_line" size={18} color={Colors.textDark} />
        </Pressable>

        <View style={styles.titleColumn}>
          <Text style={styles.topTitle}>
            {screenState === 'empty' ? 'Your recipes' : "Tonight's recipes"}
          </Text>
          {screenState === 'loaded' && (
            <Text style={styles.topSubtitle}>
              Recipes from your 12 ingredients
            </Text>
          )}
        </View>

        <Pressable style={styles.iconBtn}>
          {screenState === 'empty' ? (
            <MingCuteIcon name="search_line" size={18} color={Colors.textDark} />
          ) : (
            <MingCuteIcon name="menu_line" size={18} color={Colors.textDark} />
          )}
        </Pressable>
      </View>

      {/* ── Loading State ── */}
      {screenState === 'loading' && <LoadingState progress={loadingProgress} />}

      {/* ── Empty State ── */}
      {screenState === 'empty' && <EmptyState />}

      {/* ── Loaded State ── */}
      {screenState === 'loaded' && featured && (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Summary Banner */}
          <SummaryBanner variant={bannerVariant} recipes={recipes} />

          {/* Filter / Sort Chips */}
          <View style={styles.chipRow}>
            <View style={styles.chipLeft}>
              <Pressable
                style={styles.chip}
                onPress={() => setShowFilterSheet(true)}
              >
                <Text style={styles.chipEmoji}>⚡</Text>
                <Text style={styles.chipLabel}>Quick</Text>
              </Pressable>
              <Pressable
                style={styles.chip}
                onPress={() => setShowFilterSheet(true)}
              >
                <Text style={styles.chipEmoji}>🌿</Text>
                <Text style={styles.chipLabel}>Veggie</Text>
              </Pressable>
            </View>

            <Pressable
              style={styles.chip}
              onPress={() => setShowSortSheet(true)}
            >
              <Text style={styles.chipEmoji}>↕</Text>
              <Text style={styles.chipLabel}>Best match</Text>
            </Pressable>
          </View>

          {/* Recipe List */}
          <View style={styles.listContainer}>
            {/* Featured Card */}
            <Pressable
              style={styles.featuredCard}
              onPress={() => router.push(`/recipes/${featured.id}`)}
            >
              <View style={[styles.featuredPhoto, { backgroundColor: featured.placeholderBg }]}>
                <Text style={styles.featuredPhotoEmoji}>{featured.placeholderEmoji}</Text>

                <View style={[styles.overlayBadge, styles.categoryBadge, { backgroundColor: featured.cuisineBadgeColor }]}>
                  <Text style={styles.overlayBadgeEmoji}>{featured.cuisineEmoji}</Text>
                  <Text style={styles.overlayBadgeText}>{featured.cuisine}</Text>
                </View>

                <View
                  style={[
                    styles.overlayBadge,
                    styles.matchBadgeOverlay,
                    { backgroundColor: matchBadgeBg(featured.matchPercent) },
                  ]}
                >
                  <MingCuteIcon name="star_fill" size={11} color={Colors.white} style={{ marginRight: 4 }} />
                  <Text style={styles.overlayBadgeText}>{featured.matchPercent}%</Text>
                </View>
              </View>

              <View style={styles.featuredInfo}>
                <Text style={styles.featuredTitle}>{featured.title}</Text>

                <View style={styles.metaRow}>
                  <View style={styles.metaItem}>
                    <MingCuteIcon name="time_line" size={13} color={Colors.saffronDark} style={{ marginRight: 3 }} />
                    <Text style={[styles.metaText, { color: Colors.saffronDark }]}>{featured.cookTime}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <MingCuteIcon name="group_line" size={13} color={Colors.textDark} style={{ marginRight: 3 }} />
                    <Text style={[styles.metaText, { color: Colors.textDark }]}>{featured.servings} servings</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <MingCuteIcon name="flash_line" size={13} color={difficultyColor(featured.difficulty)} style={{ marginRight: 3 }} />
                    <Text style={[styles.metaText, { color: difficultyColor(featured.difficulty) }]}>{featured.difficulty}</Text>
                  </View>
                </View>

                {featured.description && (
                  <Text style={styles.featuredDesc}>{featured.description}</Text>
                )}
              </View>
            </Pressable>

            {/* Compact Cards */}
            {rest.map((recipe) => (
              <CompactCard key={recipe.id} recipe={recipe} onPress={() => router.push(`/recipes/${recipe.id}`)} />
            ))}
          </View>
        </ScrollView>
      )}

      {/* ── Filter Sheet Modal ── */}
      <FilterSheet
        visible={showFilterSheet}
        activeFilters={activeFilters}
        onClose={() => setShowFilterSheet(false)}
        onApply={(filters) => {
          setActiveFilters(filters);
          setShowFilterSheet(false);
        }}
        recipeCount={recipes.length}
      />

      {/* ── Sort Sheet Modal ── */}
      <SortSheet
        visible={showSortSheet}
        activeSort={activeSort}
        onClose={() => setShowSortSheet(false)}
        onSelect={(sort) => {
          setActiveSort(sort);
          setShowSortSheet(false);
        }}
      />
    </SafeAreaView>
  );
}

// ─── Loading State Component ────────────────────────────────

function LoadingState({ progress }: { progress: number }) {
  const dot1 = useRef(new Animated.Value(0.3)).current;
  const dot2 = useRef(new Animated.Value(0.3)).current;
  const dot3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animate = (dot: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0.3, duration: 400, useNativeDriver: true }),
        ]),
      );
    const a1 = animate(dot1, 0);
    const a2 = animate(dot2, 200);
    const a3 = animate(dot3, 400);
    a1.start();
    a2.start();
    a3.start();
    return () => {
      a1.stop();
      a2.stop();
      a3.stop();
    };
  }, [dot1, dot2, dot3]);

  return (
    <View style={styles.loadingContainer}>
      {/* Sparkle circle */}
      <LinearGradient
        colors={[Colors.greenLightBg, Colors.loadingGradientEnd]}
        style={styles.loadingCircle}
      >
        <Text style={styles.loadingEmoji}>✨</Text>
      </LinearGradient>

      <Text style={styles.loadingTitle}>Cooking up recipes...</Text>
      <Text style={styles.loadingSubtitle}>
        Matching 12 ingredients to thousands of recipes
      </Text>

      {/* Animated dots */}
      <View style={styles.dotsRow}>
        {[dot1, dot2, dot3].map((dot, i) => (
          <Animated.View
            key={i}
            style={[styles.animDot, { opacity: dot }]}
          />
        ))}
      </View>

      {/* Progress checklist */}
      <View style={styles.progressCard}>
        <View style={styles.progressRow}>
          <Text style={styles.progressCheck}>✓</Text>
          <Text style={[styles.progressText, progress >= 1 && styles.progressDone]}>
            Analyzing your 12 ingredients
          </Text>
        </View>
        <View style={styles.progressRow}>
          <Text style={styles.progressCheck}>✓</Text>
          <Text style={[styles.progressText, progress >= 2 && styles.progressDone]}>
            Matching against recipe database
          </Text>
        </View>
        <View style={styles.progressRow}>
          <Text style={styles.progressSpinner}>⏳</Text>
          <Text style={[styles.progressText, styles.progressActive]}>
            Ranking by match score...
          </Text>
        </View>
      </View>
    </View>
  );
}

// ─── Empty State Component ──────────────────────────────────

function EmptyState() {
  return (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyCircle}>
        <Text style={styles.emptyEmoji}>🥄</Text>
      </View>
      <Text style={styles.emptyTitle}>No matches yet</Text>
      <Text style={styles.emptySubtitle}>
        Add ingredients to your fridge to find recipe matches
      </Text>

      <Pressable style={styles.emptyCta}>
        <Text style={styles.emptyCtaText}>Add more ingredients</Text>
      </Pressable>
      <Pressable style={styles.emptyOutlineCta}>
        <Text style={styles.emptyOutlineCtaText}>Browse pantry recipes</Text>
      </Pressable>
    </View>
  );
}

// ─── Summary Banner Component ───────────────────────────────

function SummaryBanner({
  variant,
  recipes,
}: {
  variant: BannerVariant;
  recipes: RecipeListRecipe[];
}) {
  const best = recipes[0];

  return (
    <LinearGradient
      colors={[Colors.promoGradientStart, Colors.promoGradientEnd]}
      start={{ x: 0, y: 0.5 }}
      end={{ x: 1, y: 0.5 }}
      style={styles.banner}
    >
      {variant === 'default' && (
        <>
          <View style={styles.bannerLabelRow}>
            <MingCuteIcon name="sparkles_fill" size={12} color={Colors.primary} />
            <Text style={[styles.bannerLabelText, { color: Colors.primary }]}>
              {recipes.length} RECIPES FOUND
            </Text>
          </View>
          <Text style={styles.bannerTitle}>What can I cook?</Text>
          <Text style={styles.bannerSubtitle}>
            Best match: {best?.title} · {best?.cookTime}
          </Text>
        </>
      )}

      {variant === 'high' && (
        <>
          <View style={styles.bannerLabelRow}>
            <Text style={styles.bannerLabelEmoji}>🎉</Text>
            <Text style={[styles.bannerLabelText, { color: Colors.primary }]}>
              {recipes.length} GREAT MATCHES · AI FOUND
            </Text>
          </View>
          <Text style={styles.bannerTitle}>You've got options!</Text>
        </>
      )}

      {variant === 'low' && (
        <>
          <View style={styles.bannerLabelRow}>
            <MingCuteIcon name="information_fill" size={12} color={Colors.saffronDark} />
            <Text style={[styles.bannerLabelText, { color: Colors.saffronDark }]}>
              FRIDGE IS LIMITED · {recipes.length} PARTIAL MATCHES
            </Text>
          </View>
          <Text style={styles.bannerTitle}>Few exact matches</Text>
          <Text style={styles.bannerSubtitle}>
            Add more ingredients or try these partial matches
          </Text>
        </>
      )}
    </LinearGradient>
  );
}

// ─── Compact Card Component ─────────────────────────────────

function CompactCard({
  recipe,
  onPress,
}: {
  recipe: RecipeListRecipe;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.compactCard} onPress={onPress}>
      <View style={[styles.compactThumb, { backgroundColor: recipe.placeholderBg }]}>
        <Text style={styles.compactThumbEmoji}>{recipe.placeholderEmoji}</Text>
      </View>

      <View style={styles.compactInfo}>
        {/* Name + match badge row */}
        <View style={styles.compactNameRow}>
          <Text style={styles.compactName} numberOfLines={1}>
            {recipe.title}
          </Text>
          <View style={[styles.compactMatchBadge, { backgroundColor: matchBadgeBg(recipe.matchPercent) }]}>
            <Text style={styles.compactMatchText}>{recipe.matchPercent}%</Text>
          </View>
        </View>

        {/* Cuisine badge */}
        <View style={[styles.compactCuisineBadge, { backgroundColor: recipe.cuisineBadgeColor }]}>
          <Text style={styles.compactCuisineEmoji}>{recipe.cuisineEmoji}</Text>
          <Text style={styles.compactCuisineText}>{recipe.cuisine}</Text>
        </View>

        {/* Meta line */}
        <View style={styles.compactMetaRow}>
          <MingCuteIcon name="time_line" size={11} color={Colors.saffronDark} />
          <Text style={styles.compactMetaTime}>{recipe.cookTime}</Text>
          <Text style={styles.compactMetaDot}>·</Text>
          <MingCuteIcon name="flash_line" size={11} color={difficultyColor(recipe.difficulty)} />
          <Text style={[styles.compactMetaDifficulty, { color: difficultyColor(recipe.difficulty) }]}>
            {recipe.difficulty}
          </Text>
        </View>

        {/* Ingredient bar */}
        <View style={styles.ingredientBar}>
          <View style={styles.ingredientDots}>
            {Array.from({ length: recipe.totalCount }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.ingredientDot,
                  {
                    backgroundColor:
                      i < recipe.matchedCount ? Colors.primary : Colors.saffron,
                  },
                ]}
              />
            ))}
          </View>
          <Text style={styles.ingredientText}>{recipe.ingredientMatch}</Text>
        </View>
      </View>
    </Pressable>
  );
}

// ─── Filter Sheet Modal ─────────────────────────────────────

function FilterSheet({
  visible,
  activeFilters,
  onClose,
  onApply,
  recipeCount,
}: {
  visible: boolean;
  activeFilters: ActiveFilters;
  onClose: () => void;
  onApply: (filters: ActiveFilters) => void;
  recipeCount: number;
}) {
  const [localFilters, setLocalFilters] = useState<ActiveFilters>(activeFilters);

  useEffect(() => {
    if (visible) setLocalFilters(activeFilters);
  }, [visible, activeFilters]);

  const toggleCuisine = (c: string) =>
    setLocalFilters((prev) => ({
      ...prev,
      cuisines: prev.cuisines.includes(c)
        ? prev.cuisines.filter((x) => x !== c)
        : [...prev.cuisines, c],
    }));

  const toggleTime = (t: string) =>
    setLocalFilters((prev) => ({
      ...prev,
      time: prev.time === t ? null : t,
    }));

  const toggleDietary = (d: string) =>
    setLocalFilters((prev) => ({
      ...prev,
      dietary: prev.dietary.includes(d)
        ? prev.dietary.filter((x) => x !== d)
        : [...prev.dietary, d],
    }));

  const resetAll = () =>
    setLocalFilters({ cuisines: [], time: null, dietary: [] });

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <Pressable style={styles.modalOverlayTouch} onPress={onClose} />
        <View style={styles.sheetContainer}>
          {/* Handle */}
          <View style={styles.sheetHandle} />

          {/* Header */}
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Filters</Text>
            <Pressable onPress={resetAll}>
              <Text style={styles.sheetResetText}>Reset all</Text>
            </Pressable>
          </View>

          {/* CUISINE */}
          <Text style={styles.filterSectionTitle}>CUISINE</Text>
          <View style={styles.filterChipWrap}>
            {CUISINE_CHIPS.map((c) => {
              const selected = localFilters.cuisines.includes(c);
              return (
                <Pressable
                  key={c}
                  style={[
                    styles.filterChip,
                    selected && { backgroundColor: chipSelectedColor(c), borderColor: chipSelectedColor(c) },
                  ]}
                  onPress={() => toggleCuisine(c)}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      selected && { color: Colors.white },
                    ]}
                  >
                    {c}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* TIME */}
          <Text style={styles.filterSectionTitle}>TIME</Text>
          <View style={styles.filterChipWrap}>
            {TIME_CHIPS.map((t) => {
              const selected = localFilters.time === t;
              return (
                <Pressable
                  key={t}
                  style={[
                    styles.filterChip,
                    selected && { backgroundColor: chipSelectedColor(t), borderColor: chipSelectedColor(t) },
                  ]}
                  onPress={() => toggleTime(t)}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      selected && { color: Colors.white },
                    ]}
                  >
                    {t}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* DIETARY */}
          <Text style={styles.filterSectionTitle}>DIETARY</Text>
          <View style={styles.filterChipWrap}>
            {DIETARY_CHIPS.map((d) => {
              const selected = localFilters.dietary.includes(d);
              return (
                <Pressable
                  key={d}
                  style={[
                    styles.filterChip,
                    selected && { backgroundColor: chipSelectedColor(d), borderColor: chipSelectedColor(d) },
                  ]}
                  onPress={() => toggleDietary(d)}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      selected && { color: Colors.white },
                    ]}
                  >
                    {d}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* CTA */}
          <Pressable
            style={styles.filterCta}
            onPress={() => onApply(localFilters)}
          >
            <Text style={styles.filterCtaText}>
              Show {recipeCount} recipes
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

// ─── Sort Sheet Modal ───────────────────────────────────────

function SortSheet({
  visible,
  activeSort,
  onClose,
  onSelect,
}: {
  visible: boolean;
  activeSort: SortOption;
  onClose: () => void;
  onSelect: (sort: SortOption) => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <Pressable style={styles.modalOverlayTouch} onPress={onClose} />
        <View style={styles.sheetContainer}>
          {/* Handle */}
          <View style={styles.sheetHandle} />

          {/* Header */}
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Sort by</Text>
            <Pressable style={styles.sortCloseBtn} onPress={onClose}>
              <MingCuteIcon name="close_line" size={16} color={Colors.textDark} />
            </Pressable>
          </View>

          {/* Sort Options */}
          {SORT_OPTIONS.map((option) => {
            const selected = activeSort === option.id;
            return (
              <Pressable
                key={option.id}
                style={[
                  styles.sortRow,
                  selected && {
                    backgroundColor: Colors.sortActiveBg,
                    borderColor: Colors.sortActiveBorder,
                    borderWidth: 1.5,
                  },
                ]}
                onPress={() => onSelect(option.id)}
              >
                <View style={styles.sortIconCircle}>
                  <Text style={styles.sortIconEmoji}>{option.emoji}</Text>
                </View>
                <View style={styles.sortTextCol}>
                  <Text style={styles.sortOptionTitle}>{option.title}</Text>
                  <Text style={styles.sortOptionDesc}>{option.description}</Text>
                </View>
                {selected && (
                  <MingCuteIcon name="check_fill" size={18} color={Colors.primary} />
                )}
              </Pressable>
            );
          })}
        </View>
      </View>
    </Modal>
  );
}

// ─── Styles ─────────────────────────────────────────────────

const styles = StyleSheet.create({
  /* Container */
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  /* Top Bar */
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 4,
    paddingBottom: 8,
    backgroundColor: Colors.white,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleColumn: {
    alignItems: 'center',
  },
  topTitle: {
    fontSize: 16,
    fontFamily: FontFamily.heading,
    color: Colors.textPrimary,
    letterSpacing: -0.32,
  },
  topSubtitle: {
    fontSize: 11,
    fontFamily: FontFamily.medium,
    color: Colors.textMuted,
  },

  /* Summary Banner */
  banner: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 4,
  },
  bannerLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  bannerLabelText: {
    fontSize: 10,
    fontFamily: FontFamily.bold,
    letterSpacing: 0.6,
  },
  bannerLabelEmoji: {
    fontSize: 12,
  },
  bannerTitle: {
    fontSize: 22,
    fontFamily: FontFamily.heading,
    color: Colors.textPrimary,
    letterSpacing: -0.88,
  },
  bannerSubtitle: {
    fontSize: 13,
    fontFamily: FontFamily.medium,
    color: '#666666',
  },

  /* Filter Chips */
  chipRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 8,
  },
  chipLeft: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.chipBorder,
    borderRadius: 16,
    paddingLeft: 11,
    paddingRight: 13,
    paddingVertical: 7,
  },
  chipEmoji: {
    fontSize: 11,
    marginRight: 4,
  },
  chipLabel: {
    fontSize: 11,
    fontFamily: FontFamily.bold,
    color: Colors.textDark,
    letterSpacing: -0.22,
  },

  /* Recipe List Container */
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    gap: 12,
  },

  /* Featured Card */
  featuredCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    overflow: 'hidden',
  },
  featuredPhoto: {
    height: 170,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  featuredPhotoEmoji: {
    fontSize: 56,
  },
  overlayBadge: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    paddingLeft: 10,
    paddingRight: 12,
    paddingVertical: 6,
  },
  categoryBadge: {
    top: 14,
    left: 14,
  },
  matchBadgeOverlay: {
    top: 14,
    right: 14,
  },
  overlayBadgeEmoji: {
    fontSize: 11,
    marginRight: 4,
  },
  overlayBadgeText: {
    fontSize: 11,
    fontFamily: FontFamily.bold,
    color: Colors.white,
    letterSpacing: 0.22,
  },
  featuredInfo: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 8,
  },
  featuredTitle: {
    fontSize: 20,
    fontFamily: FontFamily.heading,
    color: Colors.textPrimary,
    letterSpacing: -0.6,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 13,
    fontFamily: FontFamily.semiBold,
  },
  featuredDesc: {
    fontSize: 12,
    fontFamily: FontFamily.medium,
    color: Colors.textMuted,
    lineHeight: 17,
  },

  /* Compact Card */
  compactCard: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    padding: 12,
    gap: 12,
    flexDirection: 'row',
  },
  compactThumb: {
    width: 96,
    height: 96,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactThumbEmoji: {
    fontSize: 36,
  },
  compactInfo: {
    flex: 1,
    gap: 4,
  },
  compactNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  compactName: {
    flex: 1,
    fontSize: 15,
    fontFamily: FontFamily.heading,
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  compactMatchBadge: {
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  compactMatchText: {
    fontSize: 10,
    fontFamily: FontFamily.bold,
    color: Colors.white,
    letterSpacing: 0.2,
  },
  compactCuisineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 8,
    paddingLeft: 7,
    paddingRight: 8,
    paddingVertical: 3,
  },
  compactCuisineEmoji: {
    fontSize: 9,
    marginRight: 3,
  },
  compactCuisineText: {
    fontSize: 9,
    fontFamily: FontFamily.bold,
    color: Colors.white,
    letterSpacing: 0.36,
  },
  compactMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  compactMetaTime: {
    fontSize: 11,
    fontFamily: FontFamily.semiBold,
    color: Colors.saffronDark,
  },
  compactMetaDot: {
    fontSize: 10,
    color: '#B3B3B3',
  },
  compactMetaDifficulty: {
    fontSize: 11,
    fontFamily: FontFamily.semiBold,
  },
  ingredientBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ingredientDots: {
    flexDirection: 'row',
    gap: 3,
  },
  ingredientDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  ingredientText: {
    fontSize: 11,
    fontFamily: FontFamily.semiBold,
    color: '#666666',
  },

  /* ── Loading State ── */
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    gap: 12,
  },
  loadingCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  loadingEmoji: {
    fontSize: 32,
  },
  loadingTitle: {
    fontSize: 20,
    fontFamily: FontFamily.heading,
    color: Colors.textPrimary,
    letterSpacing: -0.4,
  },
  loadingSubtitle: {
    fontSize: 13,
    fontFamily: FontFamily.medium,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 4,
    marginBottom: 16,
  },
  animDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  progressCard: {
    backgroundColor: Colors.blueBg,
    borderWidth: 1.5,
    borderColor: Colors.blueBorder,
    borderRadius: 14,
    padding: 16,
    gap: 12,
    width: '100%',
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  progressCheck: {
    fontSize: 14,
    color: Colors.primary,
    fontFamily: FontFamily.bold,
  },
  progressSpinner: {
    fontSize: 14,
  },
  progressText: {
    fontSize: 13,
    fontFamily: FontFamily.medium,
    color: Colors.textMuted,
  },
  progressDone: {
    color: Colors.textTertiary,
  },
  progressActive: {
    color: Colors.blueText,
    fontFamily: FontFamily.semiBold,
  },

  /* ── Empty State ── */
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    gap: 12,
  },
  emptyCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.emptyCircleBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  emptyEmoji: {
    fontSize: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: FontFamily.heading,
    color: Colors.textPrimary,
    letterSpacing: -0.4,
  },
  emptySubtitle: {
    fontSize: 13,
    fontFamily: FontFamily.medium,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 8,
  },
  emptyCta: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
  },
  emptyCtaText: {
    fontSize: 15,
    fontFamily: FontFamily.bold,
    color: Colors.white,
  },
  emptyOutlineCta: {
    borderWidth: 1.5,
    borderColor: Colors.chipBorder,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
  },
  emptyOutlineCtaText: {
    fontSize: 15,
    fontFamily: FontFamily.bold,
    color: Colors.textDark,
  },

  /* ── Modal / Sheet shared ── */
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlayBg,
    justifyContent: 'flex-end',
  },
  modalOverlayTouch: {
    flex: 1,
  },
  sheetContainer: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 36,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.progressInactive,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sheetTitle: {
    fontSize: 20,
    fontFamily: FontFamily.heading,
    color: Colors.textPrimary,
    letterSpacing: -0.4,
  },
  sheetResetText: {
    fontSize: 13,
    fontFamily: FontFamily.semiBold,
    color: Colors.saffronDark,
  },

  /* ── Filter Sheet ── */
  filterSectionTitle: {
    fontSize: 11,
    fontFamily: FontFamily.bold,
    color: Colors.textTertiary,
    letterSpacing: 1,
    marginTop: 8,
    marginBottom: 10,
  },
  filterChipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  filterChip: {
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.chipActiveBorder,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  filterChipText: {
    fontSize: 12,
    fontFamily: FontFamily.bold,
    color: Colors.textPrimary,
  },
  filterCta: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  filterCtaText: {
    fontSize: 15,
    fontFamily: FontFamily.bold,
    color: Colors.white,
  },

  /* ── Sort Sheet ── */
  sortCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    backgroundColor: Colors.surfaceMuted,
    marginBottom: 8,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  sortIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sortIconEmoji: {
    fontSize: 16,
  },
  sortTextCol: {
    flex: 1,
  },
  sortOptionTitle: {
    fontSize: 14,
    fontFamily: FontFamily.bold,
    color: Colors.textPrimary,
  },
  sortOptionDesc: {
    fontSize: 11,
    fontFamily: FontFamily.medium,
    color: Colors.textMuted,
    marginTop: 1,
  },
});
