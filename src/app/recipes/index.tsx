import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/Colors';
import { FontFamily } from '../../constants/Typography';
import { mockRecipes } from '../../data/mock';
import MingCuteIcon from '../../components/MingCuteIcon';

// Helper: map cuisine to badge color
function cuisineBadgeColor(cuisine: string): string {
  switch (cuisine) {
    case 'Mediterranean':
      return Colors.blue;
    case 'Italian':
      return Colors.accent;
    case 'Asian':
      return Colors.saffronDark;
    default:
      return Colors.textDark;
  }
}

// Helper: difficulty color
function difficultyColor(difficulty: string): string {
  switch (difficulty) {
    case 'Easy':
      return Colors.primary;
    case 'Medium':
      return Colors.saffronDark;
    case 'Hard':
      return Colors.accent;
    default:
      return Colors.textDark;
  }
}

// Helper: match badge bg
function matchBadgeBg(percent: number): string {
  return percent >= 80 ? Colors.primary : Colors.saffron;
}

// Helper: placeholder bg color per recipe
function placeholderBg(index: number): string {
  const palette = ['#FFECD2', '#D4F1C4', '#FFE0E0', '#D6E4FF', '#FFF3D6'];
  return palette[index % palette.length];
}

// Helper: placeholder emoji per recipe
function placeholderEmoji(index: number): string {
  const emojis = ['🍝', '🍚', '🥘', '🍲', '🥗'];
  return emojis[index % emojis.length];
}

// Compute matched/needed ingredients (mock: count how many of the recipe's
// ingredients are in our selected set)
const selectedIngredients = [
  'Chicken Breast',
  'Garlic',
  'Onion',
  'Tomato',
  'Olive Oil',
  'Rice',
  'Lemon',
];

function ingredientMatch(recipe: (typeof mockRecipes)[0]) {
  const matched = recipe.ingredients.filter((i) =>
    selectedIngredients.includes(i),
  ).length;
  const total = recipe.ingredients.length;
  const needed = total - matched;
  return { matched, total, needed };
}

export default function RecipeListScreen() {
  const router = useRouter();
  const featured = mockRecipes[0];
  const rest = mockRecipes.slice(1);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* ── Top Bar ── */}
      <View style={styles.topBar}>
        <Pressable style={styles.iconBtn} onPress={() => router.back()}>
          <MingCuteIcon name="arrow_left_line" size={18} color={Colors.textDark} />
        </Pressable>

        <View style={styles.titleColumn}>
          <Text style={styles.topTitle}>Tonight's recipes</Text>
          <Text style={styles.topSubtitle}>
            Recipes from your 12 ingredients
          </Text>
        </View>

        <Pressable style={styles.iconBtn}>
          <MingCuteIcon name="menu_line" size={18} color={Colors.textDark} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Summary Banner ── */}
        <LinearGradient
          colors={[Colors.promoGradientStart, Colors.promoGradientEnd]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.banner}
        >
          <MingCuteIcon name="sparkles_fill" size={12} color={Colors.primary} />
          <Text style={styles.bannerTitle}>What can I cook?</Text>
          <Text style={styles.bannerSubtitle}>
            Best match: Tomato Basil Pasta · 30 min
          </Text>
        </LinearGradient>

        {/* ── Filter / Sort Chips ── */}
        <View style={styles.chipRow}>
          <View style={styles.chipLeft}>
            <View style={styles.chip}>
              <MingCuteIcon name="flash_line" size={12} color={Colors.textDark} style={{ marginRight: 4 }} />
              <Text style={styles.chipLabel}>Quick</Text>
            </View>
            <View style={styles.chip}>
              <MingCuteIcon name="leaf_line" size={12} color={Colors.textDark} style={{ marginRight: 4 }} />
              <Text style={styles.chipLabel}>Veggie</Text>
            </View>
          </View>

          <View style={styles.chip}>
            <MingCuteIcon name="sort_descending_line" size={12} color={Colors.textDark} style={{ marginRight: 4 }} />
            <Text style={styles.chipLabel}>Best match</Text>
          </View>
        </View>

        {/* ── Recipe List ── */}
        <View style={styles.listContainer}>
          {/* Featured Card */}
          <Pressable
            style={styles.featuredCard}
            onPress={() => router.push(`/recipes/${featured.id}`)}
          >
            {/* Photo placeholder */}
            <View style={[styles.featuredPhoto, { backgroundColor: placeholderBg(0) }]}>
              <Text style={styles.featuredPhotoEmoji}>{placeholderEmoji(0)}</Text>

              {/* Category badge */}
              <View style={[styles.overlayBadge, styles.categoryBadge]}>
                <Text style={styles.overlayBadgeEmoji}>
                  {featured.cuisineEmoji}
                </Text>
                <Text style={styles.overlayBadgeText}>{featured.cuisine}</Text>
              </View>

              {/* Match badge */}
              <View
                style={[
                  styles.overlayBadge,
                  styles.matchBadgeOverlay,
                  { backgroundColor: matchBadgeBg(featured.matchPercent) },
                ]}
              >
                <MingCuteIcon name="star_fill" size={11} color={Colors.white} style={{ marginRight: 4 }} />
                <Text style={styles.overlayBadgeText}>
                  {featured.matchPercent}%
                </Text>
              </View>
            </View>

            {/* Info section */}
            <View style={styles.featuredInfo}>
              <Text style={styles.featuredTitle}>{featured.title}</Text>

              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <MingCuteIcon name="time_line" size={13} color={Colors.saffronDark} style={{ marginRight: 3 }} />
                  <Text style={[styles.metaText, { color: Colors.saffronDark }]}>
                    {featured.cookTime}
                  </Text>
                </View>
                <View style={styles.metaItem}>
                  <MingCuteIcon name="group_line" size={13} color={Colors.textDark} style={{ marginRight: 3 }} />
                  <Text style={[styles.metaText, { color: Colors.textDark }]}>
                    {featured.servings} servings
                  </Text>
                </View>
                <View style={styles.metaItem}>
                  <MingCuteIcon name="flash_line" size={13} color={difficultyColor(featured.difficulty)} style={{ marginRight: 3 }} />
                  <Text
                    style={[
                      styles.metaText,
                      { color: difficultyColor(featured.difficulty) },
                    ]}
                  >
                    {featured.difficulty}
                  </Text>
                </View>
              </View>

              <Text style={styles.featuredDesc}>
                A bright, zesty chicken dish with fresh herbs and a squeeze of
                lemon — perfect for a quick weeknight dinner.
              </Text>
            </View>
          </Pressable>

          {/* Compact Cards */}
          {rest.map((recipe, idx) => {
            const match = ingredientMatch(recipe);
            return (
              <Pressable
                key={recipe.id}
                style={styles.compactCard}
                onPress={() => router.push(`/recipes/${recipe.id}`)}
              >
                {/* Thumbnail */}
                <View
                  style={[
                    styles.compactThumb,
                    { backgroundColor: placeholderBg(idx + 1) },
                  ]}
                >
                  <Text style={styles.compactThumbEmoji}>
                    {placeholderEmoji(idx + 1)}
                  </Text>
                </View>

                {/* Info column */}
                <View style={styles.compactInfo}>
                  {/* Name + match badge row */}
                  <View style={styles.compactNameRow}>
                    <Text style={styles.compactName} numberOfLines={1}>
                      {recipe.title}
                    </Text>
                    <View
                      style={[
                        styles.compactMatchBadge,
                        {
                          backgroundColor: matchBadgeBg(recipe.matchPercent),
                        },
                      ]}
                    >
                      <Text style={styles.compactMatchText}>
                        {recipe.matchPercent}%
                      </Text>
                    </View>
                  </View>

                  {/* Cuisine badge */}
                  <View
                    style={[
                      styles.compactCuisineBadge,
                      { backgroundColor: cuisineBadgeColor(recipe.cuisine) },
                    ]}
                  >
                    <Text style={styles.compactCuisineEmoji}>
                      {recipe.cuisineEmoji}
                    </Text>
                    <Text style={styles.compactCuisineText}>
                      {recipe.cuisine}
                    </Text>
                  </View>

                  {/* Meta line */}
                  <View style={styles.compactMetaRow}>
                    <MingCuteIcon name="time_line" size={11} color={Colors.saffronDark} />
                    <Text style={styles.compactMetaTime}>
                      {recipe.cookTime}
                    </Text>
                    <Text style={styles.compactMetaDot}>{'·'}</Text>
                    <MingCuteIcon name="flash_line" size={11} color={difficultyColor(recipe.difficulty)} />
                    <Text
                      style={[
                        styles.compactMetaDifficulty,
                        { color: difficultyColor(recipe.difficulty) },
                      ]}
                    >
                      {recipe.difficulty}
                    </Text>
                  </View>

                  {/* Ingredient bar */}
                  <View style={styles.ingredientBar}>
                    <View style={styles.ingredientDots}>
                      {recipe.ingredients.map((ing, i) => (
                        <View
                          key={i}
                          style={[
                            styles.ingredientDot,
                            {
                              backgroundColor: selectedIngredients.includes(ing)
                                ? Colors.primary
                                : Colors.saffron,
                            },
                          ]}
                        />
                      ))}
                    </View>
                    <Text style={styles.ingredientText}>
                      {match.matched}/{match.total}
                      {match.needed > 0 && ` · need ${match.needed} more`}
                    </Text>
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  /* ── Container ── */
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

  /* ── Top Bar ── */
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
  iconBtnText: {
    fontSize: 18,
    fontFamily: FontFamily.bold,
    color: Colors.textDark,
  },
  menuBtnText: {
    fontSize: 14,
    fontFamily: FontFamily.bold,
    color: Colors.textDark,
  },
  titleColumn: {
    alignItems: 'center',
  },
  topTitle: {
    fontSize: 16,
    fontFamily: FontFamily.bold,
    color: Colors.textPrimary,
    letterSpacing: -0.32,
  },
  topSubtitle: {
    fontSize: 11,
    fontFamily: FontFamily.medium,
    color: Colors.textMuted,
  },

  /* ── Summary Banner ── */
  banner: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 4,
  },
  bannerLabel: {
    fontSize: 10,
    fontFamily: FontFamily.bold,
  },
  bannerTitle: {
    fontSize: 22,
    fontFamily: FontFamily.bold,
    color: Colors.textPrimary,
    letterSpacing: -0.88,
  },
  bannerSubtitle: {
    fontSize: 13,
    fontFamily: FontFamily.medium,
    color: '#666666',
  },

  /* ── Filter Chips ── */
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
    borderColor: '#D1D1CC',
    borderRadius: 16,
    paddingLeft: 11,
    paddingRight: 13,
    paddingVertical: 7,
  },
  chipEmoji: {
    fontSize: 11,
    fontFamily: FontFamily.bold,
    marginRight: 4,
  },
  chipLabel: {
    fontSize: 11,
    fontFamily: FontFamily.bold,
    color: Colors.textDark,
    letterSpacing: -0.22,
  },

  /* ── Recipe List Container ── */
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    gap: 12,
  },

  /* ── Featured Card ── */
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
    backgroundColor: '#E53845',
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

  /* Featured Info */
  featuredInfo: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 8,
  },
  featuredTitle: {
    fontSize: 20,
    fontFamily: FontFamily.bold,
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
  metaEmoji: {
    fontSize: 12,
    fontFamily: FontFamily.bold,
    marginRight: 3,
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

  /* ── Compact Card ── */
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

  /* Compact Info */
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
    fontFamily: FontFamily.bold,
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

  /* Cuisine badge */
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

  /* Compact Meta */
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

  /* Ingredient bar */
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
});
