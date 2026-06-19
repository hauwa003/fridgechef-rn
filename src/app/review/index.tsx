import { useState, useMemo } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Modal,
  TextInput,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/Colors';
import { FontFamily } from '../../constants/Typography';
import { Spacing, Radii } from '../../constants/Spacing';
import MingCuteIcon from '../../components/MingCuteIcon';
import { mockReviewIngredients, addIngredientSuggestions } from '../../data/mock';
import type { ReviewIngredient, IngredientConfidence } from '../../types';

// ── Category helpers ─────────────────────────────────────────
const CATEGORY_ORDER = ['PRODUCE', 'DAIRY', 'PANTRY'] as const;

const CATEGORY_DOT: Record<string, string> = {
  PRODUCE: Colors.categoryDotProduce,
  DAIRY: Colors.categoryDotDairy,
  PANTRY: Colors.categoryDotPantry,
};

// ── Summary gradient presets ─────────────────────────────────
const SUMMARY_GRADIENTS = {
  good: ['#F2FFEB', '#E0FAD1'] as [string, string],
  mixed: ['#FFFCEB', '#FFF5DB'] as [string, string],
  bad: ['#F7F5F0', '#EBE8E0'] as [string, string],
};

// ── Component ────────────────────────────────────────────────
export default function ReviewScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // State
  const [ingredients, setIngredients] = useState<ReviewIngredient[]>(
    () => [...mockReviewIngredients],
  );
  const [activeFilter, setActiveFilter] = useState<'all' | 'needs_review'>('all');
  const [hideConfident, setHideConfident] = useState(false);
  const [editingItem, setEditingItem] = useState<ReviewIngredient | null>(null);
  const [editName, setEditName] = useState('');
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [addSearchText, setAddSearchText] = useState('');

  // Derived counts
  const confirmedCount = ingredients.filter((i) => i.confidence === 'confirmed').length;
  const needsReviewCount = ingredients.filter((i) => i.confidence !== 'confirmed').length;
  const totalCount = ingredients.length;
  const isEmpty = totalCount === 0;

  // Grouped by category
  const grouped = useMemo(() => {
    let filtered = ingredients;
    if (activeFilter === 'needs_review') {
      filtered = ingredients.filter((i) => i.confidence !== 'confirmed');
    } else if (hideConfident) {
      filtered = ingredients.filter((i) => i.confidence !== 'confirmed');
    }

    const groups: Record<string, ReviewIngredient[]> = {};
    for (const cat of CATEGORY_ORDER) {
      const items = filtered.filter((i) => i.category === cat);
      if (items.length > 0) groups[cat] = items;
    }
    return groups;
  }, [ingredients, activeFilter, hideConfident]);

  // Summary state
  const summaryState = useMemo(() => {
    if (isEmpty) return null;
    if (confirmedCount === totalCount) return 'good' as const;
    if (needsReviewCount >= totalCount * 0.5) return 'bad' as const;
    return 'mixed' as const;
  }, [isEmpty, confirmedCount, needsReviewCount, totalCount]);

  // Add sheet filtered results
  const addResults = useMemo(() => {
    if (!addSearchText.trim()) return addIngredientSuggestions;
    const q = addSearchText.toLowerCase();
    return addIngredientSuggestions.filter(
      (i) =>
        i.name.toLowerCase().includes(q) &&
        !ingredients.some((existing) => existing.name.toLowerCase() === i.name.toLowerCase()),
    );
  }, [addSearchText, ingredients]);

  // ── Handlers ───────────────────────────────────────────
  const openEditSheet = (item: ReviewIngredient) => {
    setEditingItem(item);
    setEditName(item.name);
  };

  const closeEditSheet = () => {
    setEditingItem(null);
    setEditName('');
  };

  const handleSaveEdit = () => {
    if (!editingItem) return;
    setIngredients((prev) =>
      prev.map((i) =>
        i.id === editingItem.id
          ? { ...i, name: editName.trim() || i.name, confidence: 'confirmed' as IngredientConfidence, altName: undefined }
          : i,
      ),
    );
    closeEditSheet();
  };

  const handleRemoveItem = () => {
    if (!editingItem) return;
    setIngredients((prev) => prev.filter((i) => i.id !== editingItem.id));
    closeEditSheet();
  };

  const handleAddIngredient = (item: ReviewIngredient) => {
    const newItem: ReviewIngredient = {
      ...item,
      id: `added-${Date.now()}-${item.id}`,
      confidence: 'confirmed',
    };
    setIngredients((prev) => [...prev, newItem]);
  };

  const handleFindRecipes = () => {
    router.push('/recipes');
  };

  // ════════════════════════════════════════════════════════
  // EMPTY STATE
  // ════════════════════════════════════════════════════════
  if (isEmpty) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <MingCuteIcon name="arrow_left_line" size={20} color={Colors.textPrimary} />
          </Pressable>
          <Text style={styles.topBarTitle}>Review ingredients</Text>
          <View style={styles.backBtn} />
        </View>

        {/* Empty content */}
        <View style={styles.emptyContent}>
          <View style={styles.emptyCircle}>
            <Text style={styles.emptyEmoji}>📷</Text>
          </View>
          <Text style={styles.emptyTitle}>We couldn't see anything</Text>
          <Text style={styles.emptyDesc}>
            The photo was too dark or blurry for us to identify ingredients. Try again with better lighting.
          </Text>
          <Pressable style={styles.retakeBtn} onPress={() => router.back()}>
            <MingCuteIcon name="camera_line" size={18} color={Colors.white} />
            <Text style={styles.retakeBtnText}>Retake photo</Text>
          </Pressable>
          <Pressable
            style={styles.addManualBtn}
            onPress={() => setShowAddSheet(true)}
          >
            <Text style={styles.addManualBtnText}>Add ingredients manually</Text>
          </Pressable>
        </View>

        {/* Dimmed footer */}
        <View style={[styles.footerArea, { paddingBottom: insets.bottom + 16 }]}>
          <View style={[styles.findRecipesBtn, styles.findRecipesBtnDisabled]}>
            <Text style={[styles.findRecipesText, { opacity: 0.5 }]}>Find recipes</Text>
            <MingCuteIcon name="arrow_right_line" size={18} color={Colors.white} style={{ opacity: 0.5 }} />
          </View>
        </View>

        {renderAddSheet()}
      </SafeAreaView>
    );
  }

  // ════════════════════════════════════════════════════════
  // MAIN VIEW
  // ════════════════════════════════════════════════════════
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <MingCuteIcon name="arrow_left_line" size={20} color={Colors.textPrimary} />
        </Pressable>
        <Text style={styles.topBarTitle}>Review ingredients</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary Card */}
        {summaryState && (
          <LinearGradient
            colors={SUMMARY_GRADIENTS[summaryState]}
            style={styles.summaryCard}
          >
            <View style={styles.summaryEmojiCluster}>
              {ingredients.slice(0, 5).map((i) => (
                <Text key={i.id} style={styles.summaryEmoji}>{i.emoji}</Text>
              ))}
            </View>
            <Text style={styles.summaryTitle}>
              {summaryState === 'good'
                ? 'Looking good!'
                : summaryState === 'mixed'
                  ? `${needsReviewCount} need your help`
                  : `Review ${needsReviewCount} unclear items`}
            </Text>
            <Text style={styles.summarySubtitle}>
              {summaryState === 'good'
                ? `All ${totalCount} ingredients identified with high confidence`
                : `We found ${totalCount} ingredients — ${confirmedCount} confirmed, ${needsReviewCount} need review`}
            </Text>
          </LinearGradient>
        )}

        {/* Filter Pills */}
        <View style={styles.filterRow}>
          <Pressable
            style={[
              styles.filterPill,
              activeFilter === 'all' && styles.filterPillActive,
            ]}
            onPress={() => setActiveFilter('all')}
          >
            <Text
              style={[
                styles.filterPillText,
                activeFilter === 'all' && styles.filterPillTextActive,
              ]}
            >
              ALL {totalCount}
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.filterPill,
              activeFilter === 'needs_review' && styles.filterPillActive,
            ]}
            onPress={() => setActiveFilter('needs_review')}
          >
            <Text
              style={[
                styles.filterPillText,
                activeFilter === 'needs_review' && styles.filterPillTextActive,
              ]}
            >
              NEEDS REVIEW {needsReviewCount}
            </Text>
          </Pressable>
        </View>

        {/* Hide Confident Toggle */}
        {activeFilter === 'all' && needsReviewCount > 0 && (
          <Pressable
            style={styles.hideToggle}
            onPress={() => setHideConfident((h) => !h)}
          >
            <MingCuteIcon
              name={hideConfident ? 'eye_close_line' : 'eye_line'}
              size={16}
              color={Colors.textMuted}
            />
            <Text style={styles.hideToggleText}>
              {hideConfident ? 'Show confirmed items' : 'Hide confirmed items'}
            </Text>
          </Pressable>
        )}

        {/* Add Ingredient Row */}
        <Pressable
          style={styles.addIngredientRow}
          onPress={() => setShowAddSheet(true)}
        >
          <View style={styles.addIconCircle}>
            <MingCuteIcon name="add_line" size={16} color={Colors.addText} />
          </View>
          <Text style={styles.addIngredientText}>Add a missing ingredient</Text>
        </Pressable>

        {/* Categorized Ingredient Lists */}
        {CATEGORY_ORDER.map((cat) => {
          const items = grouped[cat];
          if (!items) return null;
          return (
            <View key={cat} style={styles.categorySection}>
              <View style={styles.categoryHeader}>
                <View style={[styles.categoryDot, { backgroundColor: CATEGORY_DOT[cat] }]} />
                <Text style={styles.categoryLabel}>{cat}</Text>
                <Text style={styles.categoryCount}>{items.length}</Text>
              </View>
              {items.map((item) => (
                <Pressable
                  key={item.id}
                  style={[
                    styles.ingredientRow,
                    item.confidence === 'fix' && styles.ingredientRowFix,
                    item.confidence === 'confirmed' && styles.ingredientRowConfirmed,
                  ]}
                  onPress={() => openEditSheet(item)}
                >
                  <Text style={styles.ingredientEmoji}>{item.emoji}</Text>
                  <View style={styles.ingredientInfo}>
                    <Text style={styles.ingredientName}>{item.name}</Text>
                    {item.altName && (
                      <Text style={styles.ingredientAlt}>{item.altName}</Text>
                    )}
                  </View>
                  {renderConfidenceBadge(item.confidence)}
                </Pressable>
              ))}
            </View>
          );
        })}
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footerArea, { paddingBottom: insets.bottom + 16 }]}>
        {needsReviewCount > 0 && (
          <Text style={styles.footerHint}>
            {needsReviewCount} item{needsReviewCount > 1 ? 's' : ''} still need review — tap to fix
          </Text>
        )}
        <Pressable style={styles.findRecipesBtn} onPress={handleFindRecipes}>
          <Text style={styles.findRecipesText}>Find recipes</Text>
          <MingCuteIcon name="arrow_right_line" size={18} color={Colors.white} />
        </Pressable>
      </View>

      {/* Edit Sheet Modal */}
      <Modal
        visible={editingItem !== null}
        animationType="slide"
        transparent
        onRequestClose={closeEditSheet}
      >
        <Pressable style={styles.modalOverlay} onPress={closeEditSheet}>
          <Pressable style={styles.editSheet} onPress={() => {}}>
            <View style={styles.sheetHandle} />

            <View style={styles.editSheetHeader}>
              <Text style={styles.editSheetTitle}>Edit ingredient</Text>
              <Pressable style={styles.sheetCloseBtn} onPress={closeEditSheet}>
                <MingCuteIcon name="close_line" size={16} color={Colors.textDark} />
              </Pressable>
            </View>

            {/* AI Hint (for fix/maybe items) */}
            {editingItem && editingItem.confidence !== 'confirmed' && editingItem.altName && (
              <View style={styles.aiHintCard}>
                <MingCuteIcon name="sparkles_fill" size={14} color={Colors.aiHintText} />
                <Text style={styles.aiHintText}>
                  AI thinks this might be wrong — {editingItem.altName}
                </Text>
              </View>
            )}

            {/* Name Input */}
            <View style={styles.editInputWrap}>
              <Text style={styles.editInputLabel}>Name</Text>
              <TextInput
                style={styles.editInput}
                value={editName}
                onChangeText={setEditName}
                placeholder="Ingredient name"
                placeholderTextColor={Colors.textTertiary}
                autoFocus
              />
            </View>

            {/* AI Suggestion Chips */}
            {editingItem?.suggestions && editingItem.suggestions.length > 0 && (
              <View style={styles.suggestionsWrap}>
                <Text style={styles.suggestionsLabel}>Suggestions</Text>
                <View style={styles.chipRow}>
                  {editingItem.suggestions.map((s) => (
                    <Pressable
                      key={s}
                      style={[
                        styles.chip,
                        editName === s && styles.chipActive,
                      ]}
                      onPress={() => setEditName(s)}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          editName === s && styles.chipTextActive,
                        ]}
                      >
                        {s}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}

            {/* Actions */}
            <View style={styles.editActions}>
              <Pressable style={styles.removeBtn} onPress={handleRemoveItem}>
                <MingCuteIcon name="delete_line" size={16} color={Colors.removeText} />
                <Text style={styles.removeBtnText}>Remove</Text>
              </Pressable>
              <Pressable style={styles.saveBtn} onPress={handleSaveEdit}>
                <Text style={styles.saveBtnText}>Save changes</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Add Sheet Modal */}
      {renderAddSheet()}
    </SafeAreaView>
  );

  // ── Sub-renders ────────────────────────────────────────
  function renderConfidenceBadge(confidence: IngredientConfidence) {
    switch (confidence) {
      case 'confirmed':
        return (
          <View style={styles.badgeConfirmed}>
            <MingCuteIcon name="check_fill" size={12} color={Colors.primary} />
          </View>
        );
      case 'maybe':
        return (
          <View style={styles.badgeMaybe}>
            <Text style={styles.badgeMaybeText}>MAYBE</Text>
          </View>
        );
      case 'fix':
        return (
          <View style={styles.badgeFix}>
            <MingCuteIcon name="warning_fill" size={10} color={Colors.error} />
            <Text style={styles.badgeFixText}>FIX</Text>
          </View>
        );
    }
  }

  function renderAddSheet() {
    return (
      <Modal
        visible={showAddSheet}
        animationType="slide"
        transparent
        onRequestClose={() => { setShowAddSheet(false); setAddSearchText(''); }}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => { setShowAddSheet(false); setAddSearchText(''); }}
        >
          <Pressable style={styles.addSheet} onPress={() => {}}>
            <View style={styles.sheetHandle} />

            <View style={styles.editSheetHeader}>
              <Text style={styles.editSheetTitle}>Add ingredient</Text>
              <Pressable
                style={styles.sheetCloseBtn}
                onPress={() => { setShowAddSheet(false); setAddSearchText(''); }}
              >
                <MingCuteIcon name="close_line" size={16} color={Colors.textDark} />
              </Pressable>
            </View>

            {/* Search Input */}
            <View style={styles.searchInputWrap}>
              <MingCuteIcon name="search_line" size={18} color={Colors.textTertiary} />
              <TextInput
                style={styles.searchInput}
                value={addSearchText}
                onChangeText={setAddSearchText}
                placeholder="Search ingredients..."
                placeholderTextColor={Colors.textTertiary}
                autoFocus
              />
            </View>

            {/* Results */}
            <ScrollView style={styles.addResultsList} showsVerticalScrollIndicator={false}>
              {addResults.map((item) => {
                const alreadyAdded = ingredients.some(
                  (existing) => existing.name.toLowerCase() === item.name.toLowerCase(),
                );
                return (
                  <View key={item.id} style={styles.addResultRow}>
                    <Text style={styles.addResultEmoji}>{item.emoji}</Text>
                    <View style={styles.addResultInfo}>
                      <Text style={styles.addResultName}>{item.name}</Text>
                      <Text style={styles.addResultCategory}>{item.category}</Text>
                    </View>
                    {alreadyAdded ? (
                      <View style={styles.addedBadge}>
                        <MingCuteIcon name="check_fill" size={12} color={Colors.primary} />
                        <Text style={styles.addedBadgeText}>Added</Text>
                      </View>
                    ) : (
                      <Pressable
                        style={styles.addItemBtn}
                        onPress={() => handleAddIngredient(item)}
                      >
                        <MingCuteIcon name="add_line" size={16} color={Colors.primary} />
                      </Pressable>
                    )}
                  </View>
                );
              })}
              {addResults.length === 0 && (
                <Text style={styles.noResults}>No matching ingredients found</Text>
              )}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    );
  }
}

// ════════════════════════════════════════════════════════════════
// STYLES
// ════════════════════════════════════════════════════════════════
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  // ── Top Bar ──────────────────────────────────────────────
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.background,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBarTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 17,
    color: Colors.textPrimary,
    letterSpacing: -0.34,
  },

  // ── Scroll ───────────────────────────────────────────────
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xxxl,
    gap: Spacing.lg,
  },

  // ── Summary Card ─────────────────────────────────────────
  summaryCard: {
    borderRadius: Radii.lg,
    padding: Spacing.xl,
    gap: Spacing.sm,
    alignItems: 'center',
  },
  summaryEmojiCluster: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 4,
  },
  summaryEmoji: {
    fontSize: 24,
  },
  summaryTitle: {
    fontFamily: FontFamily.heading,
    fontSize: 20,
    color: Colors.textPrimary,
    letterSpacing: -0.6,
    textAlign: 'center',
  },
  summarySubtitle: {
    fontFamily: FontFamily.medium,
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },

  // ── Filter Pills ─────────────────────────────────────────
  filterRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.surfaceMuted,
  },
  filterPillActive: {
    backgroundColor: Colors.textPrimary,
  },
  filterPillText: {
    fontFamily: FontFamily.bold,
    fontSize: 11,
    color: Colors.textSecondary,
    letterSpacing: 0.44,
  },
  filterPillTextActive: {
    color: Colors.white,
  },

  // ── Hide Toggle ──────────────────────────────────────────
  hideToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  hideToggleText: {
    fontFamily: FontFamily.medium,
    fontSize: 13,
    color: Colors.textMuted,
  },

  // ── Add Ingredient Row ───────────────────────────────────
  addIngredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.addBg,
    borderWidth: 1.5,
    borderColor: Colors.addBorder,
    borderStyle: 'dashed',
    borderRadius: Radii.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 14,
  },
  addIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.addBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addIngredientText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 15,
    color: Colors.addText,
  },

  // ── Category ─────────────────────────────────────────────
  categorySection: {
    gap: Spacing.sm,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  categoryLabel: {
    fontFamily: FontFamily.bold,
    fontSize: 11,
    color: Colors.textMuted,
    letterSpacing: 0.88,
  },
  categoryCount: {
    fontFamily: FontFamily.medium,
    fontSize: 11,
    color: Colors.textTertiary,
  },

  // ── Ingredient Row ───────────────────────────────────────
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radii.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 14,
  },
  ingredientRowConfirmed: {
    borderColor: Colors.confirmedBorder,
  },
  ingredientRowFix: {
    backgroundColor: Colors.fixBg,
    borderColor: Colors.fixBorder,
  },
  ingredientEmoji: {
    fontSize: 24,
  },
  ingredientInfo: {
    flex: 1,
    gap: 2,
  },
  ingredientName: {
    fontFamily: FontFamily.semiBold,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  ingredientAlt: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },

  // ── Confidence Badges ────────────────────────────────────
  badgeConfirmed: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primaryLight,
    borderWidth: 1,
    borderColor: Colors.confirmedBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeMaybe: {
    backgroundColor: Colors.saffronLightBg,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeMaybeText: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    color: Colors.saffronDark,
    letterSpacing: 0.4,
  },
  badgeFix: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: Colors.removeBg,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeFixText: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    color: Colors.error,
    letterSpacing: 0.4,
  },

  // ── Footer ───────────────────────────────────────────────
  footerArea: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: Spacing.sm,
  },
  footerHint: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  findRecipesBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    borderRadius: 28,
    paddingVertical: 18,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  findRecipesBtnDisabled: {
    backgroundColor: Colors.textTertiary,
    shadowOpacity: 0,
    elevation: 0,
  },
  findRecipesText: {
    fontFamily: FontFamily.bold,
    fontSize: 17,
    color: Colors.white,
    letterSpacing: -0.34,
  },

  // ── Modal Shared ─────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.progressInactive,
    alignSelf: 'center',
    marginBottom: Spacing.lg,
  },

  // ── Edit Sheet ───────────────────────────────────────────
  editSheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingTop: 16,
    gap: Spacing.lg,
  },
  editSheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  editSheetTitle: {
    fontFamily: FontFamily.heading,
    fontSize: 22,
    color: Colors.textPrimary,
    letterSpacing: -0.66,
  },
  sheetCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── AI Hint Card ─────────────────────────────────────────
  aiHintCard: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: Colors.aiHintBg,
    borderWidth: 1,
    borderColor: Colors.aiHintBorder,
    borderRadius: Radii.md,
    padding: 14,
  },
  aiHintText: {
    flex: 1,
    fontFamily: FontFamily.medium,
    fontSize: 13,
    color: Colors.aiHintText,
    lineHeight: 18,
  },

  // ── Edit Input ───────────────────────────────────────────
  editInputWrap: {
    gap: 6,
  },
  editInputLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: 13,
    color: Colors.textSecondary,
  },
  editInput: {
    fontFamily: FontFamily.medium,
    fontSize: 17,
    color: Colors.textPrimary,
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radii.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 14,
  },

  // ── Suggestion Chips ─────────────────────────────────────
  suggestionsWrap: {
    gap: 8,
  },
  suggestionsLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: 13,
    color: Colors.textSecondary,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.surfaceMuted,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipActive: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  chipText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 13,
    color: Colors.textSecondary,
  },
  chipTextActive: {
    color: Colors.primary,
  },

  // ── Edit Actions ─────────────────────────────────────────
  editActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  removeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.removeBg,
    borderWidth: 1,
    borderColor: Colors.removeBorder,
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  removeBtnText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 14,
    color: Colors.removeText,
  },
  saveBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 24,
    paddingVertical: 14,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  saveBtnText: {
    fontFamily: FontFamily.bold,
    fontSize: 15,
    color: Colors.white,
    letterSpacing: -0.3,
  },

  // ── Add Sheet ────────────────────────────────────────────
  addSheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingTop: 16,
    gap: Spacing.lg,
    maxHeight: '80%',
  },
  searchInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radii.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    fontFamily: FontFamily.medium,
    fontSize: 15,
    color: Colors.textPrimary,
    padding: 0,
  },
  addResultsList: {
    maxHeight: 400,
  },
  addResultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  addResultEmoji: {
    fontSize: 24,
  },
  addResultInfo: {
    flex: 1,
    gap: 2,
  },
  addResultName: {
    fontFamily: FontFamily.semiBold,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  addResultCategory: {
    fontFamily: FontFamily.medium,
    fontSize: 11,
    color: Colors.textTertiary,
    letterSpacing: 0.44,
  },
  addItemBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primaryLight,
    borderWidth: 1,
    borderColor: Colors.confirmedBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: Colors.primaryLight,
  },
  addedBadgeText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 12,
    color: Colors.primary,
  },
  noResults: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
    paddingVertical: 32,
  },

  // ── Empty State ──────────────────────────────────────────
  emptyContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: Spacing.lg,
  },
  emptyCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  emptyEmoji: {
    fontSize: 32,
  },
  emptyTitle: {
    fontFamily: FontFamily.heading,
    fontSize: 22,
    color: Colors.textPrimary,
    letterSpacing: -0.66,
    textAlign: 'center',
  },
  emptyDesc: {
    fontFamily: FontFamily.medium,
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  retakeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    borderRadius: 28,
    paddingVertical: 16,
    paddingHorizontal: 28,
    width: '100%',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  retakeBtnText: {
    fontFamily: FontFamily.bold,
    fontSize: 17,
    color: Colors.white,
    letterSpacing: -0.34,
  },
  addManualBtn: {
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 28,
    paddingVertical: 14,
    paddingHorizontal: 28,
    width: '100%',
    alignItems: 'center',
  },
  addManualBtnText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 15,
    color: Colors.textSecondary,
  },
});
