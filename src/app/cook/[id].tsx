import { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Modal,
  Share,
  StyleSheet,
  AppState,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/Colors';
import { FontFamily } from '../../constants/Typography';
import { mockRecipes } from '../../data/mock';
import MingCuteIcon from '../../components/MingCuteIcon';

// ── Cook mode step data ────────────────────────────────────────
type CookModeStep = {
  number: number;
  label: string;
  title: string;
  tip: string;
  hasTimer: boolean;
  timerSeconds: number;
  timerLabel: string;
};

const STEPS: CookModeStep[] = [
  {
    number: 1,
    label: 'FIRST STEP',
    title: 'Boil a large pot of salted water',
    tip: 'Use about 4 quarts of water per pound of pasta. The water should taste like the sea.',
    hasTimer: false,
    timerSeconds: 0,
    timerLabel: '',
  },
  {
    number: 2,
    label: 'WHILE WATER HEATS',
    title: 'Dice the onion finely and slice the basil into ribbons',
    tip: 'Use a sharp knife. Cut basil last so it stays bright green.',
    hasTimer: false,
    timerSeconds: 0,
    timerLabel: '',
  },
  {
    number: 3,
    label: 'COOKING',
    title: 'Add the spaghetti, stir gently, and set a timer for 8 minutes',
    tip: "Don't break the spaghetti — let it soften naturally as it sinks.",
    hasTimer: true,
    timerSeconds: 480,
    timerLabel: 'Pasta cooking',
  },
  {
    number: 4,
    label: 'COOKING',
    title: 'Sauté garlic in olive oil until golden',
    tip: 'Watch carefully — garlic burns fast. Remove from heat if it starts browning too quickly.',
    hasTimer: true,
    timerSeconds: 120,
    timerLabel: 'Garlic sauté',
  },
  {
    number: 5,
    label: 'COOKING',
    title: 'Combine pasta with the sauce',
    tip: 'Pasta water is liquid gold — save at least a cup before draining.',
    hasTimer: false,
    timerSeconds: 0,
    timerLabel: '',
  },
  {
    number: 6,
    label: 'FINAL STEP',
    title: 'Plate and garnish with fresh basil',
    tip: 'Warm your bowls first for a restaurant-quality touch.',
    hasTimer: false,
    timerSeconds: 0,
    timerLabel: '',
  },
];

// ── Ingredient data for drawer ─────────────────────────────────
type CookIngredient = {
  name: string;
  amount: string;
  isSubstitute: boolean;
};

const INGREDIENTS: CookIngredient[] = [
  { name: 'Spaghetti', amount: '400g', isSubstitute: false },
  { name: 'Linguine', amount: '400g', isSubstitute: true },
  { name: 'Garlic', amount: '4 cloves', isSubstitute: false },
  { name: 'Olive oil', amount: '3 tbsp', isSubstitute: false },
  { name: 'Fresh basil', amount: '1 bunch', isSubstitute: false },
  { name: 'Onion', amount: '1 medium', isSubstitute: false },
  { name: 'Pecorino cheese', amount: '60g', isSubstitute: true },
  { name: 'Salt', amount: 'to taste', isSubstitute: false },
  { name: 'Black pepper', amount: 'to taste', isSubstitute: false },
];

// ── Glossary data ──────────────────────────────────────────────
type GlossaryTerm = {
  term: string;
  pronunciation: string;
  definition: string;
  howToTest: string;
};

const GLOSSARY: Record<number, GlossaryTerm> = {
  3: {
    term: 'Al dente',
    pronunciation: '/al-DEN-teh/',
    definition:
      'Italian for "to the tooth." Pasta cooked al dente is firm to the bite — not crunchy, not mushy. It should have a slight resistance when you chew.',
    howToTest:
      "Cut a piece of pasta in half. You should see a tiny white dot in the center — that means it's perfectly al dente.",
  },
  4: {
    term: 'Golden',
    pronunciation: '/GOHL-den/',
    definition:
      'When garlic turns a light amber color with a nutty aroma. This happens quickly over medium heat and is the sweet spot between raw and burned.',
    howToTest:
      "The garlic should be light gold, not brown. If you smell a sharp, acrid odor, it's gone too far.",
  },
};

// ── Helpers ────────────────────────────────────────────────────
function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// ── Component ──────────────────────────────────────────────────
export default function CookModeScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const recipe = mockRecipes.find((r) => r.id === id) ?? mockRecipes[0];

  const totalSteps = STEPS.length;

  // Navigation
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  // Modals
  const [showGlossary, setShowGlossary] = useState(false);
  const [showIngredients, setShowIngredients] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);

  // Timer
  const [timerRemaining, setTimerRemaining] = useState<number | null>(null);
  const [timerTotal, setTimerTotal] = useState(0);
  const [timerStepIndex, setTimerStepIndex] = useState(-1);
  const [timerRunning, setTimerRunning] = useState(false);
  const startedTimers = useRef(new Set<number>());

  // Completion
  const [rating, setRating] = useState(0);
  const [saved, setSaved] = useState(false);

  // Ingredients check
  const [checkedIngredients, setCheckedIngredients] = useState(new Set<number>());

  // AppState
  const appStateRef = useRef(AppState.currentState);

  const step = STEPS[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;
  const glossaryTerm = GLOSSARY[step.number];

  // ── Timer countdown ─────────────────────────────────
  useEffect(() => {
    if (!timerRunning) return;
    const interval = setInterval(() => {
      setTimerRemaining((prev) => {
        if (prev === null || prev <= 0) return prev;
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerRunning]);

  useEffect(() => {
    if (timerRemaining === 0) setTimerRunning(false);
  }, [timerRemaining]);

  // Auto-start timer on timer steps
  useEffect(() => {
    if (step.hasTimer && !startedTimers.current.has(currentStep)) {
      startedTimers.current.add(currentStep);
      setTimerStepIndex(currentStep);
      setTimerTotal(step.timerSeconds);
      setTimerRemaining(step.timerSeconds);
      setTimerRunning(true);
    }
  }, [currentStep, step.hasTimer, step.timerSeconds]);

  // ── AppState listener ───────────────────────────────
  useEffect(() => {
    const sub = AppState.addEventListener('change', (nextState) => {
      if (
        appStateRef.current.match(/inactive|background/) &&
        nextState === 'active' &&
        !isCompleted
      ) {
        setShowResumeModal(true);
        setTimerRunning(false);
      }
      appStateRef.current = nextState;
    });
    return () => sub.remove();
  }, [isCompleted]);

  // ── Handlers ────────────────────────────────────────
  const handleNext = useCallback(() => {
    if (isLastStep) {
      setIsCompleted(true);
    } else {
      setCurrentStep((s) => s + 1);
    }
  }, [isLastStep]);

  const handlePrev = useCallback(() => {
    if (!isFirstStep) setCurrentStep((s) => s - 1);
  }, [isFirstStep]);

  const handleTimerToggle = useCallback(() => {
    if (timerRemaining !== null && timerRemaining > 0) {
      setTimerRunning((r) => !r);
    }
  }, [timerRemaining]);

  const handleTimerReset = useCallback(() => {
    setTimerRemaining(timerTotal);
    setTimerRunning(true);
  }, [timerTotal]);

  const handleResume = useCallback(() => {
    setShowResumeModal(false);
    if (timerRemaining !== null && timerRemaining > 0) setTimerRunning(true);
  }, [timerRemaining]);

  const handleStartOver = useCallback(() => {
    setShowResumeModal(false);
    setCurrentStep(0);
    setTimerRemaining(null);
    setTimerRunning(false);
    setTimerStepIndex(-1);
    startedTimers.current.clear();
  }, []);

  const toggleIngredient = useCallback((index: number) => {
    setCheckedIngredients((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }, []);

  // ── Derived ─────────────────────────────────────────
  const showTimerCard = step.hasTimer && timerStepIndex === currentStep;
  const hasBackgroundTimer =
    timerRemaining !== null &&
    timerRemaining > 0 &&
    timerStepIndex !== currentStep &&
    timerStepIndex >= 0;

  // ════════════════════════════════════════════════════
  // COMPLETION VIEW
  // ════════════════════════════════════════════════════
  if (isCompleted) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.completionTopBar}>
          <Pressable style={styles.closeBtn} onPress={() => router.back()}>
            <MingCuteIcon name="close_line" size={16} color={Colors.textDark} />
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={styles.completionContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.emojiRow}>
            <Text style={styles.emoji}>🎉</Text>
            <Text style={styles.emoji}>👨‍🍳</Text>
            <Text style={styles.emoji}>🍝</Text>
          </View>

          <Text style={styles.completionTitle}>Bon appetit!</Text>
          <Text style={styles.completionSubtitle}>
            {recipe.title}. You made this. Enjoy.
          </Text>

          <View style={styles.dishPlaceholder}>
            <MingCuteIcon name="fork_knife_fill" size={64} color={Colors.saffron} />
          </View>

          <View style={styles.timeBadge}>
            <MingCuteIcon name="time_line" size={14} color={Colors.primary} />
            <Text style={styles.timeBadgeText}>Finished in {recipe.cookTime}</Text>
          </View>
        </ScrollView>

        <View style={[styles.completionFooter, { paddingBottom: insets.bottom + 24 }]}>
          <Text style={styles.ratingPrompt}>How did it turn out?</Text>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Pressable key={star} onPress={() => setRating(star)}>
                <MingCuteIcon
                  name="star_fill"
                  size={32}
                  color={star <= rating ? Colors.saffron : '#D9D9D1'}
                />
              </Pressable>
            ))}
          </View>

          <Pressable
            style={[styles.saveCta, saved && styles.saveCtaSaved]}
            onPress={() => setSaved(!saved)}
          >
            <MingCuteIcon
              name={saved ? 'heart_fill' : 'heart_line'}
              size={18}
              color={Colors.white}
            />
            <Text style={styles.saveCtaText}>
              {saved ? 'Saved to recipes' : 'Save to your recipes'}
            </Text>
          </Pressable>

          <View style={styles.secondaryRow}>
            <Pressable style={styles.secondaryBtn} onPress={() => Share.share({ message: `Just cooked ${recipe.title} with FridgeChef! 🍝✨` })}>
              <MingCuteIcon name="share_forward_line" size={16} color={Colors.textPrimary} />
              <Text style={styles.secondaryBtnText}>Share</Text>
            </Pressable>
            <Pressable style={styles.secondaryBtn} onPress={() => router.back()}>
              <MingCuteIcon name="check_line" size={16} color={Colors.textPrimary} />
              <Text style={styles.secondaryBtnText}>Done</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // ════════════════════════════════════════════════════
  // COOKING VIEW
  // ════════════════════════════════════════════════════
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <View style={styles.nav}>
          <Pressable style={styles.closeBtn} onPress={() => router.back()}>
            <MingCuteIcon name="close_line" size={16} color={Colors.textDark} />
          </Pressable>
          <View style={styles.stepPill}>
            <Text style={styles.stepPillText}>
              Step {currentStep + 1} of {totalSteps}
            </Text>
          </View>
          <Pressable style={styles.closeBtn}>
            <MingCuteIcon name="volume_fill" size={16} color={Colors.textDark} />
          </Pressable>
        </View>

        <View style={styles.progressRow}>
          {STEPS.map((_, i) => (
            <View
              key={i}
              style={[
                styles.progressSegment,
                i <= currentStep && styles.progressActive,
              ]}
            />
          ))}
        </View>
      </View>

      {/* Content */}
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <Text style={styles.stepLabelText}>{step.label}</Text>
          <Text style={styles.stepNumber}>{step.number}</Text>
        </View>

        <Text style={styles.stepTitle}>{step.title}</Text>

        <View style={styles.tipCard}>
          <MingCuteIcon name="bulb_fill" size={14} color={Colors.blueText} />
          <Text style={styles.tipText}>{step.tip}</Text>
        </View>

        {showTimerCard ? (
          <LinearGradient
            colors={['#FCEBB8', Colors.saffron]}
            style={styles.timerCard}
          >
            <Text style={styles.timerLabel}>TIMER</Text>
            <Text style={styles.timerDigits}>
              {formatTime(timerRemaining ?? 0)}
            </Text>
            <View style={styles.timerTrack}>
              <View
                style={[
                  styles.timerFill,
                  {
                    width:
                      timerTotal > 0
                        ? `${((timerTotal - (timerRemaining ?? 0)) / timerTotal) * 100}%`
                        : '0%',
                  },
                ]}
              />
            </View>
            <View style={styles.timerControls}>
              <Pressable onPress={handleTimerToggle}>
                <Text style={styles.timerPauseText}>
                  {timerRunning ? 'PAUSE' : 'RESUME'}
                </Text>
              </Pressable>
              <Pressable onPress={handleTimerReset}>
                <Text style={styles.timerResetText}>RESET</Text>
              </Pressable>
            </View>
          </LinearGradient>
        ) : (
          <View style={styles.photoPlaceholder}>
            {hasBackgroundTimer && (
              <View style={styles.floatingTimerBadge}>
                <View style={styles.timerDot} />
                <Text style={styles.floatingTimerText}>
                  {STEPS[timerStepIndex]?.timerLabel} – {formatTime(timerRemaining ?? 0)} left
                </Text>
              </View>
            )}
            <MingCuteIcon
              name="fork_knife_fill"
              size={48}
              color="rgba(200,160,80,0.4)"
            />
          </View>
        )}
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 24 }]}>
        <View style={styles.footerActions}>
          <Pressable
            style={styles.footerAction}
            onPress={() => setShowIngredients(true)}
          >
            <MingCuteIcon name="clipboard_line" size={14} color={Colors.textDark} />
            <Text style={styles.actionText}>Show ingredients</Text>
          </Pressable>
          {glossaryTerm ? (
            <Pressable
              style={styles.footerAction}
              onPress={() => setShowGlossary(true)}
            >
              <MingCuteIcon name="sparkles_fill" size={14} color={Colors.saffronDark} />
              <Text style={styles.actionTextGold}>What's this?</Text>
            </Pressable>
          ) : (
            <View style={styles.footerAction}>
              <MingCuteIcon name="sparkles_fill" size={14} color={Colors.textMuted} />
              <Text style={styles.actionTextMuted}>Glossary</Text>
            </View>
          )}
        </View>

        <View style={styles.footerButtons}>
          <Pressable
            style={[styles.prevButton, isFirstStep && styles.prevButtonDisabled]}
            onPress={handlePrev}
            disabled={isFirstStep}
          >
            <MingCuteIcon name="arrow_left_line" size={22} color={Colors.textMuted} />
          </Pressable>
          <Pressable style={styles.nextStepButton} onPress={handleNext}>
            <Text style={styles.nextStepText}>
              {isLastStep ? 'Finish cooking' : 'Next step'}
            </Text>
            <MingCuteIcon name="arrow_right_line" size={18} color={Colors.white} />
          </Pressable>
        </View>
      </View>

      {/* ── Glossary Modal ──────────────────────────────── */}
      <Modal
        visible={showGlossary}
        animationType="slide"
        transparent
        onRequestClose={() => setShowGlossary(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowGlossary(false)}
        >
          <Pressable style={styles.glossarySheet} onPress={() => {}}>
            <View style={styles.sheetHandle} />

            <View style={styles.glossaryLabelRow}>
              <MingCuteIcon name="sparkles_fill" size={11} color={Colors.saffron} />
              <Text style={styles.glossaryLabelText}> AI GLOSSARY</Text>
            </View>

            <Text style={styles.glossaryTerm}>
              {glossaryTerm?.term ?? 'Term'}
            </Text>
            <Text style={styles.glossaryPronunciation}>
              {glossaryTerm?.pronunciation ?? ''}
            </Text>
            <Text style={styles.glossaryDefinition}>
              {glossaryTerm?.definition ?? ''}
            </Text>

            {glossaryTerm?.howToTest && (
              <View style={styles.howToTestCard}>
                <Text style={styles.howToTestLabel}>How to test</Text>
                <Text style={styles.howToTestText}>
                  {glossaryTerm.howToTest}
                </Text>
              </View>
            )}

            <Pressable
              style={styles.glossaryCta}
              onPress={() => setShowGlossary(false)}
            >
              <Text style={styles.glossaryCtaText}>Got it, keep cooking</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>

      {/* ── Ingredients Drawer ──────────────────────────── */}
      <Modal
        visible={showIngredients}
        animationType="slide"
        transparent
        onRequestClose={() => setShowIngredients(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowIngredients(false)}
        >
          <Pressable style={styles.ingredientsSheet} onPress={() => {}}>
            <View style={styles.sheetHandle} />

            <View style={styles.ingredientsHeader}>
              <MingCuteIcon name="clipboard_line" size={18} color={Colors.textPrimary} />
              <Text style={styles.ingredientsTitle}>Ingredients</Text>
            </View>
            <Text style={styles.ingredientsSubtitle}>
              For {recipe.servings} servings · Amounts as you set them
            </Text>

            <ScrollView style={styles.ingredientsList}>
              {INGREDIENTS.map((item, i) => (
                <Pressable
                  key={i}
                  style={styles.ingredientRow}
                  onPress={() => toggleIngredient(i)}
                >
                  <MingCuteIcon
                    name={
                      checkedIngredients.has(i)
                        ? 'check_circle_fill'
                        : 'check_circle_line'
                    }
                    size={22}
                    color={
                      checkedIngredients.has(i)
                        ? Colors.primary
                        : Colors.progressInactive
                    }
                  />
                  <View style={styles.ingredientInfo}>
                    <Text
                      style={[
                        styles.ingredientName,
                        checkedIngredients.has(i) && styles.ingredientChecked,
                      ]}
                    >
                      {item.name}
                    </Text>
                    <Text style={styles.ingredientAmount}>{item.amount}</Text>
                  </View>
                  {item.isSubstitute && (
                    <View style={styles.subBadge}>
                      <Text style={styles.subBadgeText}>SUB</Text>
                    </View>
                  )}
                </Pressable>
              ))}
            </ScrollView>

            <Pressable
              style={styles.ingredientsClose}
              onPress={() => setShowIngredients(false)}
            >
              <Text style={styles.ingredientsCloseText}>Close</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>

      {/* ── Paused / Resume Modal ──────────────────────── */}
      <Modal
        visible={showResumeModal}
        animationType="fade"
        transparent
        onRequestClose={handleResume}
      >
        <View style={styles.resumeOverlay}>
          <View style={styles.resumeCard}>
            <View style={styles.pauseCircle}>
              <MingCuteIcon name="pause_fill" size={32} color={Colors.blue} />
            </View>

            <Text style={styles.resumeTitle}>Welcome back</Text>
            <Text style={styles.resumeSubtitle}>
              You were on Step {currentStep + 1} of {totalSteps}.{'\n'}
              Resume right where you left off.
            </Text>

            <Pressable style={styles.resumeCta} onPress={handleResume}>
              <Text style={styles.resumeCtaText}>Resume cooking</Text>
            </Pressable>

            <Pressable onPress={handleStartOver}>
              <Text style={styles.startOverText}>Start over from step 1</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ════════════════════════════════════════════════════════════════
// STYLES
// ════════════════════════════════════════════════════════════════
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },

  // ── Top Bar ──────────────────────────────────────────
  topBar: {
    backgroundColor: Colors.white,
    paddingBottom: 16,
  },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepPill: {
    backgroundColor: Colors.primaryLight,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  stepPillText: {
    fontFamily: FontFamily.bold,
    fontSize: 13,
    color: Colors.primary,
    letterSpacing: -0.26,
  },
  progressRow: {
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  progressSegment: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.progressInactive,
  },
  progressActive: {
    backgroundColor: Colors.primary,
  },

  // ── Content ──────────────────────────────────────────
  content: {
    padding: 24,
    paddingTop: 16,
    gap: 20,
    paddingBottom: 24,
  },
  stepLabelText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 11,
    color: Colors.saffronDark,
    letterSpacing: 0.88,
    marginBottom: -8,
  },
  stepNumber: {
    fontFamily: FontFamily.heading,
    fontSize: 80,
    color: Colors.primary,
    letterSpacing: -4.8,
    lineHeight: 84,
  },
  stepTitle: {
    fontFamily: FontFamily.heading,
    fontSize: 24,
    color: Colors.textPrimary,
    letterSpacing: -0.72,
    lineHeight: 32,
  },
  tipCard: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: Colors.blueBg,
    borderWidth: 1,
    borderColor: Colors.blueBorder,
    borderRadius: 12,
    padding: 14,
  },
  tipText: {
    flex: 1,
    fontFamily: FontFamily.medium,
    fontSize: 13,
    color: Colors.blueText,
    lineHeight: 18,
  },

  // ── Photo Placeholder ────────────────────────────────
  photoPlaceholder: {
    height: 220,
    borderRadius: 16,
    backgroundColor: '#FAF0D1',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  floatingTimerBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.saffron,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: 'rgba(153,102,0,1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
    zIndex: 1,
  },
  timerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4ADE80',
  },
  floatingTimerText: {
    fontFamily: FontFamily.bold,
    fontSize: 12,
    color: Colors.white,
    letterSpacing: -0.24,
  },

  // ── Timer Card ───────────────────────────────────────
  timerCard: {
    height: 220,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 20,
  },
  timerLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    letterSpacing: 0.96,
  },
  timerDigits: {
    fontFamily: FontFamily.bold,
    fontSize: 84,
    color: Colors.white,
    letterSpacing: -5.04,
    lineHeight: 88,
  },
  timerTrack: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginTop: 4,
  },
  timerFill: {
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.white,
  },
  timerControls: {
    flexDirection: 'row',
    gap: 24,
    marginTop: 8,
  },
  timerPauseText: {
    fontFamily: FontFamily.bold,
    fontSize: 14,
    color: Colors.white,
    letterSpacing: 0.56,
  },
  timerResetText: {
    fontFamily: FontFamily.bold,
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 0.56,
  },

  // ── Footer ───────────────────────────────────────────
  footer: {
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.borderDark,
    paddingHorizontal: 24,
    paddingTop: 16,
    gap: 12,
  },
  footerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 13,
    color: Colors.textDark,
  },
  actionTextGold: {
    fontFamily: FontFamily.semiBold,
    fontSize: 13,
    color: Colors.saffronDark,
  },
  actionTextMuted: {
    fontFamily: FontFamily.semiBold,
    fontSize: 13,
    color: Colors.textMuted,
  },
  footerButtons: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  prevButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.surfacePressed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  prevButtonDisabled: {
    opacity: 0.4,
  },
  nextStepButton: {
    flex: 1,
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
  nextStepText: {
    fontFamily: FontFamily.bold,
    fontSize: 17,
    color: Colors.white,
    letterSpacing: -0.34,
  },

  // ── Modal Shared ─────────────────────────────────────
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
    marginBottom: 16,
  },

  // ── Glossary Sheet ───────────────────────────────────
  glossarySheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingTop: 16,
    gap: 12,
  },
  glossaryLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  glossaryLabelText: {
    fontFamily: FontFamily.bold,
    fontSize: 11,
    color: Colors.saffron,
    letterSpacing: 0.88,
  },
  glossaryTerm: {
    fontFamily: FontFamily.heading,
    fontSize: 32,
    color: Colors.textPrimary,
    letterSpacing: -1.28,
    lineHeight: 38,
  },
  glossaryPronunciation: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: -4,
  },
  glossaryDefinition: {
    fontFamily: FontFamily.medium,
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  howToTestCard: {
    backgroundColor: Colors.greenLightBg,
    borderWidth: 1,
    borderColor: Colors.primaryBorder,
    borderRadius: 12,
    padding: 14,
    gap: 4,
  },
  howToTestLabel: {
    fontFamily: FontFamily.bold,
    fontSize: 13,
    color: Colors.primary,
  },
  howToTestText: {
    fontFamily: FontFamily.medium,
    fontSize: 13,
    color: Colors.primaryDark,
    lineHeight: 18,
  },
  glossaryCta: {
    backgroundColor: Colors.primary,
    borderRadius: 28,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 4,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  glossaryCtaText: {
    fontFamily: FontFamily.bold,
    fontSize: 17,
    color: Colors.white,
    letterSpacing: -0.34,
  },

  // ── Ingredients Sheet ────────────────────────────────
  ingredientsSheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingTop: 16,
    maxHeight: '80%',
    gap: 8,
  },
  ingredientsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ingredientsTitle: {
    fontFamily: FontFamily.heading,
    fontSize: 22,
    color: Colors.textPrimary,
    letterSpacing: -0.66,
  },
  ingredientsSubtitle: {
    fontFamily: FontFamily.medium,
    fontSize: 13,
    color: Colors.textMuted,
    marginBottom: 8,
  },
  ingredientsList: {
    maxHeight: 400,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
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
  ingredientChecked: {
    textDecorationLine: 'line-through',
    color: Colors.textMuted,
  },
  ingredientAmount: {
    fontFamily: FontFamily.medium,
    fontSize: 13,
    color: Colors.textMuted,
  },
  subBadge: {
    backgroundColor: Colors.saffronLightBg,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  subBadgeText: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    color: Colors.saffronDark,
    letterSpacing: 0.4,
  },
  ingredientsClose: {
    backgroundColor: Colors.surfacePressed,
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  ingredientsCloseText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 14,
    color: Colors.textPrimary,
  },

  // ── Resume Modal ─────────────────────────────────────
  resumeOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  resumeCard: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    gap: 16,
    width: '100%',
  },
  pauseCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.blueLightBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  resumeTitle: {
    fontFamily: FontFamily.heading,
    fontSize: 26,
    color: Colors.textPrimary,
    letterSpacing: -1.04,
  },
  resumeSubtitle: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  resumeCta: {
    backgroundColor: Colors.primary,
    borderRadius: 28,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    width: '100%',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  resumeCtaText: {
    fontFamily: FontFamily.bold,
    fontSize: 17,
    color: Colors.white,
    letterSpacing: -0.34,
  },
  startOverText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 14,
    color: Colors.textMuted,
    textDecorationLine: 'underline',
  },

  // ── Completion ───────────────────────────────────────
  completionTopBar: {
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  completionContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 16,
  },
  emojiRow: {
    flexDirection: 'row',
    gap: 8,
  },
  emoji: {
    fontSize: 36,
  },
  completionTitle: {
    fontFamily: FontFamily.heading,
    fontSize: 48,
    color: Colors.textPrimary,
    letterSpacing: -2.4,
    lineHeight: 52,
    textAlign: 'center',
  },
  completionSubtitle: {
    fontFamily: FontFamily.medium,
    fontSize: 17,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  dishPlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#FAF0D1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.greenLightBg2,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  timeBadgeText: {
    fontFamily: FontFamily.bold,
    fontSize: 13,
    color: Colors.primary,
    letterSpacing: -0.26,
  },
  completionFooter: {
    borderTopWidth: 1,
    borderTopColor: Colors.borderDark,
    backgroundColor: Colors.white,
    paddingHorizontal: 24,
    paddingTop: 20,
    gap: 16,
    alignItems: 'center',
  },
  ratingPrompt: {
    fontFamily: FontFamily.semiBold,
    fontSize: 14,
    color: Colors.textSecondary,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  saveCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    borderRadius: 28,
    paddingVertical: 16,
    paddingHorizontal: 24,
    width: '100%',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  saveCtaSaved: {
    backgroundColor: Colors.primaryDark,
  },
  saveCtaText: {
    fontFamily: FontFamily.bold,
    fontSize: 17,
    color: Colors.white,
    letterSpacing: -0.34,
  },
  secondaryRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  secondaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.surfacePressed,
    borderRadius: 24,
    paddingVertical: 14,
  },
  secondaryBtnText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 14,
    color: Colors.textPrimary,
  },
});
