import { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/Colors';
import { FontFamily } from '../constants/Typography';
import MingCuteIcon from '../components/MingCuteIcon';
import { MingCuteIconName } from '../constants/MingCuteGlyphMap';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type PaywallVariant =
  | 'default'
  | 'daily_limit'
  | 'plan_comparison'
  | 'trial_confirmed'
  | 'already_subscribed'
  | 'cancellation';

type Feature = {
  icon: MingCuteIconName;
  iconColor: string;
  iconBg: string;
  title: string;
  description: string;
};

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const FEATURES: Feature[] = [
  {
    icon: 'camera_2_fill',
    iconColor: Colors.primary,
    iconBg: Colors.greenLightBg,
    title: 'Unlimited scans',
    description: 'Scan your fridge as often as you want — no daily caps',
  },
  {
    icon: 'save_fill',
    iconColor: Colors.blue,
    iconBg: Colors.blueLightBg,
    title: 'Save everything',
    description: 'Keep unlimited recipes in your cookbook forever',
  },
  {
    icon: 'play_fill',
    iconColor: Colors.saffron,
    iconBg: Colors.saffronLightBg,
    title: 'Video guides',
    description: 'Watch step-by-step videos for tricky techniques',
  },
  {
    icon: 'shopping_cart_1_line',
    iconColor: Colors.accent,
    iconBg: '#FFF0ED',
    title: 'Smart shopping lists',
    description: "Auto-generate lists for ingredients you don't have",
  },
  {
    icon: 'calendar_line',
    iconColor: Colors.primary,
    iconBg: Colors.greenLightBg,
    title: 'Meal planning',
    description: "Plan a full week of meals based on what's in your fridge",
  },
];

const COMPARISON_ROWS: { label: string; free: string; plus: string }[] = [
  { label: 'Daily scans', free: '3', plus: 'Unlimited' },
  { label: 'Recipe saves', free: '10', plus: 'Unlimited' },
  { label: 'History', free: '7 days', plus: 'Forever' },
  { label: 'Video guides', free: '—', plus: '✓' },
  { label: 'Shopping lists', free: '—', plus: '✓' },
  { label: 'Meal planning', free: '—', plus: '✓' },
];

const CANCEL_REASONS = ['Too expensive', 'Not cooking enough', 'Missing features', 'Other'];

const CANCEL_LOSE_ITEMS = [
  'Unlimited scans',
  'Unlimited recipe saves',
  'Video cooking guides',
  'Shopping lists & meal planning',
];

// ---------------------------------------------------------------------------
// Shared Sub-components
// ---------------------------------------------------------------------------

function TopBar({ onClose }: { onClose: () => void }) {
  return (
    <View style={styles.topBar}>
      <Pressable style={styles.closeButton} onPress={onClose}>
        <MingCuteIcon name="close_line" size={18} color={Colors.textDark} />
      </Pressable>
    </View>
  );
}

function HeroSection({
  iconName,
  iconGradient,
  iconShadowColor,
  badgeText,
  badgeStyle,
  badgeTextStyle,
  badgeIcon,
  badgeIconColor,
  title,
  subtitle,
  heroGradient = ['#FFFCEB', '#FFF0C7'] as const,
}: {
  iconName: MingCuteIconName;
  iconGradient: readonly [string, string];
  iconShadowColor: string;
  badgeText: string;
  badgeStyle?: object;
  badgeTextStyle?: object;
  badgeIcon?: MingCuteIconName;
  badgeIconColor?: string;
  title: string;
  subtitle: string;
  heroGradient?: readonly [string, string];
}) {
  return (
    <LinearGradient colors={[...heroGradient]} style={styles.heroSection}>
      <LinearGradient
        colors={[...iconGradient]}
        style={[styles.crownCircle, { shadowColor: iconShadowColor }]}
      >
        <MingCuteIcon name={iconName} size={44} color={Colors.white} />
      </LinearGradient>

      <View style={[styles.plusBadge, badgeStyle]}>
        {badgeIcon && (
          <MingCuteIcon name={badgeIcon} size={11} color={badgeIconColor ?? Colors.saffron} />
        )}
        <Text style={[styles.plusBadgeText, badgeTextStyle]}> {badgeText}</Text>
      </View>

      <Text style={styles.heroTitle}>{title}</Text>
      <Text style={styles.heroSubtitle}>{subtitle}</Text>
    </LinearGradient>
  );
}

function FeatureList({ label, features }: { label: string; features: Feature[] }) {
  return (
    <View style={styles.featuresSection}>
      <Text style={styles.sectionLabel}>{label}</Text>
      {features.map((feature, index) => (
        <View key={index} style={styles.featureCard}>
          <View style={[styles.featureIconCircle, { backgroundColor: feature.iconBg }]}>
            <MingCuteIcon name={feature.icon} size={20} color={feature.iconColor} />
          </View>
          <View style={styles.featureTextColumn}>
            <Text style={styles.featureTitle}>{feature.title}</Text>
            <Text style={styles.featureDescription}>{feature.description}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

function PricingCard() {
  return (
    <LinearGradient
      colors={[Colors.promoGradientStart, Colors.promoGradientEnd]}
      start={{ x: 0, y: 0.5 }}
      end={{ x: 1, y: 0.5 }}
      style={styles.priceCard}
    >
      <View style={styles.bestValueBadge}>
        <Text style={styles.bestValueText}>BEST VALUE · SAVE 50%</Text>
      </View>
      <View style={styles.priceRow}>
        <Text style={styles.priceDollar}>$</Text>
        <Text style={styles.priceAmount}>29.99</Text>
        <Text style={styles.pricePeriod}>/ year</Text>
      </View>
      <Text style={styles.monthlyBreakdown}>Just $2.50/month · 7-day free trial</Text>
      <View style={styles.monthlySwitchRow}>
        <Text style={styles.monthlySwitchText}>Prefer monthly? $4.99/mo </Text>
        <Text style={styles.monthlySwitchLink}>Switch</Text>
      </View>
    </LinearGradient>
  );
}

function TrustBadges() {
  return (
    <View style={styles.trustBadgesRow}>
      <View style={styles.trustBadge}>
        <MingCuteIcon name="check_line" size={10} color={Colors.textMuted} />
        <Text style={styles.trustBadgeText}>Cancel anytime</Text>
      </View>
      <View style={styles.trustBadge}>
        <MingCuteIcon name="lock_line" size={10} color={Colors.textMuted} />
        <Text style={styles.trustBadgeText}>Secure</Text>
      </View>
      <View style={styles.trustBadge}>
        <MingCuteIcon name="check_line" size={10} color={Colors.textMuted} />
        <Text style={styles.trustBadgeText}>No hidden fees</Text>
      </View>
    </View>
  );
}

function CtaButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable style={styles.ctaButton} onPress={onPress}>
      <Text style={styles.ctaButtonText}>{label}</Text>
      <MingCuteIcon name="arrow_right_line" size={18} color={Colors.white} />
    </Pressable>
  );
}

// ---------------------------------------------------------------------------
// State 1: Default (soft sell)
// ---------------------------------------------------------------------------

function DefaultState({ onClose }: { onClose: () => void }) {
  return (
    <>
      <HeroSection
        iconName="trophy_fill"
        iconGradient={['#FCD94D', '#F5A300']}
        iconShadowColor="rgba(245,163,0,1)"
        badgeIcon="sparkles_fill"
        badgeIconColor={Colors.saffron}
        badgeText="FRIDGECHEF PLUS"
        title={'Unlimited cooking,\nzero compromises'}
        subtitle="Cook without limits. Save without worry."
      />
      <FeatureList label="WHAT YOU GET" features={FEATURES} />
      <View style={styles.pricingSection}>
        <PricingCard />
        <CtaButton label="Start 7-day free trial" onPress={onClose} />
        <TrustBadges />
      </View>
    </>
  );
}

// ---------------------------------------------------------------------------
// State 2: Hit Daily Limit
// ---------------------------------------------------------------------------

function DailyLimitState({ onClose }: { onClose: () => void }) {
  return (
    <>
      <HeroSection
        iconName="lock_fill"
        iconGradient={['#FCD94D', '#F5A300']}
        iconShadowColor="rgba(245,163,0,1)"
        badgeText="DAILY LIMIT REACHED"
        badgeIcon="time_fill"
        badgeIconColor={Colors.saffron}
        title="You've used all 3 scans today"
        subtitle="Come back tomorrow, or upgrade to Plus for unlimited scans starting now."
      />
      <FeatureList label="UPGRADE TO UNLOCK" features={FEATURES} />
      <View style={styles.pricingSection}>
        <PricingCard />
        <CtaButton label="Upgrade for unlimited scans" onPress={onClose} />
        <TrustBadges />
      </View>
    </>
  );
}

// ---------------------------------------------------------------------------
// State 3: Plan Comparison
// ---------------------------------------------------------------------------

function PlanComparisonState({ onClose }: { onClose: () => void }) {
  return (
    <>
      {/* Title */}
      <View style={styles.comparisonHeader}>
        <Text style={styles.comparisonTitle}>Choose your plan</Text>
        <Text style={styles.comparisonSubtitle}>Both come with a 7-day free trial</Text>
      </View>

      {/* Plan Cards */}
      <View style={styles.planCardsRow}>
        {/* Monthly */}
        <View style={styles.planCard}>
          <Text style={styles.planCardLabel}>Monthly</Text>
          <View style={styles.planPriceRow}>
            <Text style={styles.planPriceDollar}>$</Text>
            <Text style={styles.planPriceAmount}>4.99</Text>
            <Text style={styles.planPricePeriod}>/mo</Text>
          </View>
          <Text style={styles.planCardDetail}>Billed monthly</Text>
          <Text style={styles.planCardTrial}>7-day free trial</Text>
          <Pressable style={styles.planButtonOutline} onPress={onClose}>
            <Text style={styles.planButtonOutlineText}>Choose Monthly</Text>
          </Pressable>
        </View>

        {/* Annual */}
        <View style={[styles.planCard, styles.planCardAnnual]}>
          <View style={styles.planBestValueBadge}>
            <Text style={styles.planBestValueText}>BEST VALUE</Text>
          </View>
          <Text style={styles.planCardLabel}>Annual</Text>
          <View style={styles.planPriceRow}>
            <Text style={styles.planPriceDollar}>$</Text>
            <Text style={styles.planPriceAmount}>29.99</Text>
            <Text style={styles.planPricePeriod}>/yr</Text>
          </View>
          <Text style={styles.planCardDetail}>Just $2.50/mo · Save 50%</Text>
          <Text style={styles.planCardTrial}>7-day free trial</Text>
          <Pressable style={styles.planButtonFilled} onPress={onClose}>
            <Text style={styles.planButtonFilledText}>Choose Annual</Text>
          </Pressable>
        </View>
      </View>

      {/* Comparison Table */}
      <View style={styles.comparisonTable}>
        {/* Header */}
        <View style={styles.comparisonHeaderRow}>
          <Text style={[styles.comparisonCellLabel, styles.comparisonHeaderCell]}>Feature</Text>
          <Text style={[styles.comparisonCellValue, styles.comparisonHeaderCell]}>FREE</Text>
          <Text style={[styles.comparisonCellValue, styles.comparisonHeaderCell]}>PLUS</Text>
        </View>
        {/* Rows */}
        {COMPARISON_ROWS.map((row, i) => (
          <View
            key={i}
            style={[styles.comparisonRow, i % 2 === 0 && styles.comparisonRowAlt]}
          >
            <Text style={styles.comparisonCellLabel}>{row.label}</Text>
            <Text style={styles.comparisonCellValue}>{row.free}</Text>
            <Text
              style={[
                styles.comparisonCellValue,
                row.plus === '✓' || row.plus === 'Unlimited' || row.plus === 'Forever'
                  ? styles.comparisonCellPlus
                  : undefined,
              ]}
            >
              {row.plus}
            </Text>
          </View>
        ))}
      </View>

      {/* Trust Badges */}
      <View style={styles.pricingSection}>
        <TrustBadges />
      </View>
    </>
  );
}

// ---------------------------------------------------------------------------
// State 4: Trial Confirmed
// ---------------------------------------------------------------------------

function TrialConfirmedState({ onClose }: { onClose: () => void }) {
  return (
    <>
      <HeroSection
        iconName="celebrate_fill"
        iconGradient={['#33C74D', '#009A1A']}
        iconShadowColor="rgba(0,153,26,0.6)"
        badgeText="TRIAL STARTED · 7 DAYS"
        badgeStyle={{ backgroundColor: Colors.primary }}
        badgeIcon="check_circle_fill"
        badgeIconColor={Colors.white}
        heroGradient={['#F0FAF0', '#D1F5C7']}
        title="You're all set! Welcome to Plus"
        subtitle="Enjoy unlimited cooking. Your trial ends Aug 25 — cancel anytime in Settings."
      />
      <FeatureList label="UNLOCKED NOW" features={FEATURES} />
      <View style={styles.pricingSection}>
        <CtaButton label="Start cooking" onPress={onClose} />
        <Text style={styles.cancelNote}>
          Cancel anytime · You won't be charged for 7 days
        </Text>
      </View>
    </>
  );
}

// ---------------------------------------------------------------------------
// State 5: Already Subscribed
// ---------------------------------------------------------------------------

type ManageRow = {
  icon: MingCuteIconName;
  iconColor: string;
  iconBg: string;
  label: string;
  value: string;
  hasChange?: boolean;
};

const MANAGE_ROWS: ManageRow[] = [
  {
    icon: 'bank_card_fill',
    iconColor: Colors.blue,
    iconBg: Colors.blueLightBg,
    label: 'Billing',
    value: 'Visa •••• 4242',
    hasChange: true,
  },
  {
    icon: 'calendar_line',
    iconColor: Colors.saffron,
    iconBg: Colors.saffronLightBg,
    label: 'Next renewal',
    value: 'Mar 18, 2026 · $29.99',
  },
  {
    icon: 'chart_bar_fill',
    iconColor: Colors.primary,
    iconBg: Colors.greenLightBg,
    label: 'Usage this month',
    value: '47 scans · 23 saves',
  },
  {
    icon: 'settings_1_fill',
    iconColor: Colors.textDark,
    iconBg: Colors.surfaceMuted,
    label: 'Plan',
    value: 'Annual ($29.99/yr)',
    hasChange: true,
  },
];

function AlreadySubscribedState({ onClose, onCancel }: { onClose: () => void; onCancel: () => void }) {
  return (
    <>
      <HeroSection
        iconName="trophy_fill"
        iconGradient={['#33C74D', '#009A1A']}
        iconShadowColor="rgba(0,153,26,0.6)"
        badgeText="ACTIVE · ANNUAL PLAN"
        badgeStyle={{ backgroundColor: Colors.primary }}
        badgeIcon="check_circle_fill"
        badgeIconColor={Colors.white}
        heroGradient={['#F0FAF0', '#D1F5C7']}
        title="You're already a Plus member"
        subtitle="Renewing Mar 18, 2026 · $29.99/year"
      />

      {/* Manage Rows */}
      <View style={styles.featuresSection}>
        <Text style={styles.sectionLabel}>YOUR PLAN</Text>
        {MANAGE_ROWS.map((row, i) => (
          <View key={i} style={styles.featureCard}>
            <View style={[styles.featureIconCircle, { backgroundColor: row.iconBg }]}>
              <MingCuteIcon name={row.icon} size={20} color={row.iconColor} />
            </View>
            <View style={styles.manageTextColumn}>
              <Text style={styles.manageLabel}>{row.label}</Text>
              <Text style={styles.manageValue}>{row.value}</Text>
            </View>
            {row.hasChange && <Text style={styles.manageChangeLink}>Change</Text>}
          </View>
        ))}
      </View>

      {/* Footer */}
      <View style={styles.pricingSection}>
        <Pressable style={styles.outlineButton} onPress={onClose}>
          <Text style={styles.outlineButtonText}>Back to cooking</Text>
        </Pressable>
        <Pressable onPress={onCancel}>
          <Text style={styles.cancelLink}>Cancel subscription</Text>
        </Pressable>
      </View>
    </>
  );
}

// ---------------------------------------------------------------------------
// State 6: Cancellation Flow
// ---------------------------------------------------------------------------

function CancellationState({ onClose }: { onClose: () => void }) {
  const [selectedReason, setSelectedReason] = useState<string | null>(null);

  return (
    <>
      {/* Sad Emoji Circle */}
      <View style={styles.cancelHeroSection}>
        <View style={styles.sadEmojiCircle}>
          <MingCuteIcon name="sad_fill" size={44} color={Colors.textMuted} />
        </View>

        <Text style={styles.cancelHeading}>Cancel your subscription?</Text>
        <Text style={styles.cancelDescription}>
          You'll keep access to Plus features until your current billing period ends on Mar 18, 2026.
        </Text>
      </View>

      {/* Warning Card */}
      <View style={styles.cancelWarningSection}>
        <View style={styles.warningCard}>
          <View style={styles.warningLabelRow}>
            <MingCuteIcon name="warning_fill" size={14} color={PaywallColors.warningLabel} />
            <Text style={styles.warningLabelText}>YOU'LL LOSE ACCESS TO</Text>
          </View>
          {CANCEL_LOSE_ITEMS.map((item, i) => (
            <View key={i} style={styles.warningBulletRow}>
              <Text style={styles.warningBullet}>•</Text>
              <Text style={styles.warningBulletText}>{item}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Reason Chips */}
      <View style={styles.reasonSection}>
        <Text style={styles.reasonLabel}>Mind sharing why? (optional)</Text>
        <View style={styles.reasonChipsRow}>
          {CANCEL_REASONS.map((reason) => (
            <Pressable
              key={reason}
              style={[
                styles.reasonChip,
                selectedReason === reason && styles.reasonChipSelected,
              ]}
              onPress={() => setSelectedReason(selectedReason === reason ? null : reason)}
            >
              <Text
                style={[
                  styles.reasonChipText,
                  selectedReason === reason && styles.reasonChipTextSelected,
                ]}
              >
                {reason}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* CTAs */}
      <View style={styles.pricingSection}>
        <CtaButton label="Keep my subscription" onPress={onClose} />
        <Pressable style={styles.cancelAnywayButton} onPress={onClose}>
          <Text style={styles.cancelAnywayText}>Cancel anyway</Text>
        </Pressable>
      </View>
    </>
  );
}

// ---------------------------------------------------------------------------
// Extra colors for paywall-specific states
// ---------------------------------------------------------------------------

const PaywallColors = {
  warningBg: '#FFF5EB',
  warningBorder: '#F5D9A8',
  warningLabel: '#CC7A00',
  cancelOutlineBorder: '#E0E0D9',
} as const;

// ---------------------------------------------------------------------------
// Main Screen
// ---------------------------------------------------------------------------

export default function PaywallScreen() {
  const router = useRouter();
  const { variant } = useLocalSearchParams<{ variant?: PaywallVariant }>();
  const state: PaywallVariant = variant ?? 'default';
  const onClose = () => router.back();

  const renderContent = () => {
    switch (state) {
      case 'daily_limit':
        return <DailyLimitState onClose={onClose} />;
      case 'plan_comparison':
        return <PlanComparisonState onClose={onClose} />;
      case 'trial_confirmed':
        return <TrialConfirmedState onClose={onClose} />;
      case 'already_subscribed':
        return <AlreadySubscribedState onClose={onClose} onCancel={() => router.replace('/paywall?variant=cancellation')} />;
      case 'cancellation':
        return <CancellationState onClose={onClose} />;
      default:
        return <DefaultState onClose={onClose} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <TopBar onClose={onClose} />
        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },

  // Top Bar
  topBar: {
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 4,
    paddingBottom: 8,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Hero Section
  heroSection: {
    paddingTop: 24,
    paddingBottom: 32,
    paddingHorizontal: 32,
    gap: 12,
    alignItems: 'center',
  },
  crownCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 12,
  },
  plusBadge: {
    backgroundColor: Colors.textPrimary,
    borderRadius: 16,
    paddingLeft: 12,
    paddingRight: 14,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  plusBadgeText: {
    fontSize: 11,
    fontFamily: FontFamily.bold,
    color: Colors.white,
    letterSpacing: 0.88,
  },
  heroTitle: {
    fontSize: 28,
    fontFamily: FontFamily.heading,
    color: Colors.textPrimary,
    letterSpacing: -1.12,
    lineHeight: 34,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 14,
    fontFamily: FontFamily.medium,
    color: '#666666',
    lineHeight: 20,
    textAlign: 'center',
  },

  // Features Section
  featuresSection: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    gap: 12,
  },
  sectionLabel: {
    fontSize: 11,
    fontFamily: FontFamily.bold,
    color: Colors.textMuted,
    letterSpacing: 0.66,
  },
  featureCard: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    borderRadius: 14,
    padding: 14,
    gap: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTextColumn: {
    flex: 1,
    gap: 2,
  },
  featureTitle: {
    fontSize: 15,
    fontFamily: FontFamily.heading,
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  featureDescription: {
    fontSize: 12,
    fontFamily: FontFamily.medium,
    color: Colors.textMuted,
    lineHeight: 17,
  },

  // Pricing Section
  pricingSection: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 24,
    gap: 12,
  },
  priceCard: {
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 4,
    alignItems: 'center',
    overflow: 'hidden',
  },
  bestValueBadge: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingLeft: 10,
    paddingRight: 12,
    paddingVertical: 4,
    marginBottom: 4,
  },
  bestValueText: {
    fontSize: 10,
    fontFamily: FontFamily.bold,
    color: Colors.white,
    letterSpacing: 0.4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  priceDollar: {
    fontSize: 22,
    fontFamily: FontFamily.bold,
    color: Colors.textPrimary,
    letterSpacing: -0.88,
  },
  priceAmount: {
    fontSize: 44,
    fontFamily: FontFamily.bold,
    color: Colors.textPrimary,
    letterSpacing: -2.2,
  },
  pricePeriod: {
    fontSize: 14,
    fontFamily: FontFamily.semiBold,
    color: '#666666',
    marginLeft: 4,
  },
  monthlyBreakdown: {
    fontSize: 13,
    fontFamily: FontFamily.semiBold,
    color: Colors.primary,
  },
  monthlySwitchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  monthlySwitchText: {
    fontSize: 12,
    fontFamily: FontFamily.medium,
    color: '#666666',
  },
  monthlySwitchLink: {
    fontSize: 12,
    fontFamily: FontFamily.bold,
    color: Colors.blue,
  },

  // CTA Button
  ctaButton: {
    backgroundColor: Colors.primary,
    borderRadius: 28,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: 'rgba(0,153,26,1)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 12,
  },
  ctaButtonText: {
    fontSize: 17,
    fontFamily: FontFamily.bold,
    color: Colors.white,
    letterSpacing: -0.34,
  },

  // Trust Badges
  trustBadgesRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trustBadgeText: {
    fontSize: 11,
    fontFamily: FontFamily.semiBold,
    color: Colors.textMuted,
  },

  // ---------- State 3: Plan Comparison ----------
  comparisonHeader: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 20,
    alignItems: 'center',
    gap: 6,
  },
  comparisonTitle: {
    fontSize: 28,
    fontFamily: FontFamily.heading,
    color: Colors.textPrimary,
    letterSpacing: -1.12,
  },
  comparisonSubtitle: {
    fontSize: 14,
    fontFamily: FontFamily.medium,
    color: '#666666',
  },
  planCardsRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
  },
  planCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 4,
  },
  planCardAnnual: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  planBestValueBadge: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 4,
  },
  planBestValueText: {
    fontSize: 9,
    fontFamily: FontFamily.bold,
    color: Colors.white,
    letterSpacing: 0.36,
  },
  planCardLabel: {
    fontSize: 13,
    fontFamily: FontFamily.bold,
    color: Colors.textMuted,
    letterSpacing: 0.26,
  },
  planPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  planPriceDollar: {
    fontSize: 16,
    fontFamily: FontFamily.bold,
    color: Colors.textPrimary,
  },
  planPriceAmount: {
    fontSize: 32,
    fontFamily: FontFamily.bold,
    color: Colors.textPrimary,
    letterSpacing: -1.6,
  },
  planPricePeriod: {
    fontSize: 13,
    fontFamily: FontFamily.semiBold,
    color: '#666666',
    marginLeft: 2,
  },
  planCardDetail: {
    fontSize: 11,
    fontFamily: FontFamily.semiBold,
    color: Colors.primary,
    textAlign: 'center',
  },
  planCardTrial: {
    fontSize: 11,
    fontFamily: FontFamily.medium,
    color: Colors.textMuted,
    marginBottom: 8,
  },
  planButtonOutline: {
    borderWidth: 1.5,
    borderColor: Colors.borderDark,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  planButtonOutlineText: {
    fontSize: 13,
    fontFamily: FontFamily.bold,
    color: Colors.textPrimary,
  },
  planButtonFilled: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  planButtonFilledText: {
    fontSize: 13,
    fontFamily: FontFamily.bold,
    color: Colors.white,
  },

  // Comparison Table
  comparisonTable: {
    marginHorizontal: 24,
    marginTop: 20,
    marginBottom: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    overflow: 'hidden',
  },
  comparisonHeaderRow: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceMuted,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  comparisonRow: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  comparisonRowAlt: {
    backgroundColor: Colors.surfaceSubtle,
  },
  comparisonHeaderCell: {
    fontFamily: FontFamily.bold,
    fontSize: 11,
    color: Colors.textMuted,
    letterSpacing: 0.44,
  },
  comparisonCellLabel: {
    flex: 2,
    fontSize: 13,
    fontFamily: FontFamily.medium,
    color: Colors.textPrimary,
  },
  comparisonCellValue: {
    flex: 1,
    fontSize: 13,
    fontFamily: FontFamily.medium,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  comparisonCellPlus: {
    color: Colors.primary,
    fontFamily: FontFamily.bold,
  },

  // ---------- State 4: Trial Confirmed footer ----------
  cancelNote: {
    fontSize: 12,
    fontFamily: FontFamily.medium,
    color: Colors.textMuted,
    textAlign: 'center',
  },

  // ---------- State 5: Already Subscribed ----------
  manageTextColumn: {
    flex: 1,
    gap: 1,
  },
  manageLabel: {
    fontSize: 12,
    fontFamily: FontFamily.semiBold,
    color: Colors.textMuted,
  },
  manageValue: {
    fontSize: 14,
    fontFamily: FontFamily.medium,
    color: Colors.textPrimary,
  },
  manageChangeLink: {
    fontSize: 13,
    fontFamily: FontFamily.bold,
    color: Colors.blue,
  },
  outlineButton: {
    borderWidth: 1.5,
    borderColor: Colors.borderDark,
    borderRadius: 28,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineButtonText: {
    fontSize: 17,
    fontFamily: FontFamily.bold,
    color: Colors.textPrimary,
    letterSpacing: -0.34,
  },
  cancelLink: {
    fontSize: 14,
    fontFamily: FontFamily.semiBold,
    color: Colors.accent,
    textAlign: 'center',
  },

  // ---------- State 6: Cancellation ----------
  cancelHeroSection: {
    paddingTop: 16,
    paddingBottom: 24,
    paddingHorizontal: 32,
    alignItems: 'center',
    gap: 12,
  },
  sadEmojiCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.emptyCircleBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelHeading: {
    fontSize: 28,
    fontFamily: FontFamily.heading,
    color: Colors.textPrimary,
    letterSpacing: -1.12,
    textAlign: 'center',
  },
  cancelDescription: {
    fontSize: 14,
    fontFamily: FontFamily.medium,
    color: '#666666',
    lineHeight: 20,
    textAlign: 'center',
  },
  cancelWarningSection: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  warningCard: {
    backgroundColor: PaywallColors.warningBg,
    borderWidth: 1,
    borderColor: PaywallColors.warningBorder,
    borderRadius: 14,
    padding: 16,
    gap: 8,
  },
  warningLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  warningLabelText: {
    fontSize: 11,
    fontFamily: FontFamily.bold,
    color: PaywallColors.warningLabel,
    letterSpacing: 0.44,
  },
  warningBulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingLeft: 4,
  },
  warningBullet: {
    fontSize: 14,
    fontFamily: FontFamily.medium,
    color: PaywallColors.warningLabel,
    lineHeight: 20,
  },
  warningBulletText: {
    fontSize: 14,
    fontFamily: FontFamily.medium,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  reasonSection: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    gap: 10,
  },
  reasonLabel: {
    fontSize: 13,
    fontFamily: FontFamily.semiBold,
    color: Colors.textMuted,
  },
  reasonChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  reasonChip: {
    borderWidth: 1,
    borderColor: Colors.borderDark,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: Colors.white,
  },
  reasonChipSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryBg,
  },
  reasonChipText: {
    fontSize: 13,
    fontFamily: FontFamily.medium,
    color: Colors.textPrimary,
  },
  reasonChipTextSelected: {
    color: Colors.primary,
    fontFamily: FontFamily.semiBold,
  },
  cancelAnywayButton: {
    borderWidth: 1.5,
    borderColor: PaywallColors.cancelOutlineBorder,
    borderRadius: 28,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelAnywayText: {
    fontSize: 17,
    fontFamily: FontFamily.bold,
    color: Colors.textPrimary,
    letterSpacing: -0.34,
  },
});
