import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/Colors';
import { FontFamily } from '../constants/Typography';

const FEATURES = [
  {
    icon: '∞',
    iconBg: Colors.greenLightBg,
    title: 'Unlimited scans',
    description: 'Scan your fridge as often as you want — no daily caps',
  },
  {
    icon: '💾',
    iconBg: Colors.blueLightBg,
    title: 'Save everything',
    description: 'Keep unlimited recipes in your cookbook forever',
  },
  {
    icon: '▶',
    iconBg: Colors.saffronLightBg,
    title: 'Video guides',
    description: 'Watch step-by-step videos for tricky techniques',
  },
  {
    icon: '🛒',
    iconBg: '#FFF0ED',
    title: 'Smart shopping lists',
    description: "Auto-generate lists for ingredients you don't have",
  },
  {
    icon: '📅',
    iconBg: Colors.greenLightBg,
    title: 'Meal planning',
    description: "Plan a full week of meals based on what's in your fridge",
  },
];

export default function PaywallScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Bar */}
        <View style={styles.topBar}>
          <Pressable style={styles.closeButton} onPress={() => router.back()}>
            <Text style={styles.closeButtonText}>✕</Text>
          </Pressable>
        </View>

        {/* Hero Section */}
        <LinearGradient
          colors={['#FFFCEB', '#FFF0C7']}
          style={styles.heroSection}
        >
          {/* Crown Circle */}
          <LinearGradient
            colors={['#FCD94D', '#F5A300']}
            style={styles.crownCircle}
          >
            <Text style={styles.crownEmoji}>👑</Text>
          </LinearGradient>

          {/* PLUS Badge */}
          <View style={styles.plusBadge}>
            <Text style={styles.plusBadgeText}>
              <Text style={styles.plusBadgeSparkle}>✨ </Text>
              FRIDGECHEF PLUS
            </Text>
          </View>

          {/* Hero Title */}
          <Text style={styles.heroTitle}>
            {'Unlimited cooking,\nzero compromises'}
          </Text>

          {/* Hero Subtitle */}
          <Text style={styles.heroSubtitle}>
            Cook without limits. Save without worry.
          </Text>
        </LinearGradient>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionLabel}>WHAT YOU GET</Text>

          {FEATURES.map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <View
                style={[styles.featureIconCircle, { backgroundColor: feature.iconBg }]}
              >
                <Text style={styles.featureIcon}>{feature.icon}</Text>
              </View>
              <View style={styles.featureTextColumn}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>
                  {feature.description}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Pricing Section */}
        <View style={styles.pricingSection}>
          {/* Price Card */}
          <LinearGradient
            colors={[Colors.promoGradientStart, Colors.promoGradientEnd]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.priceCard}
          >
            {/* Best Value Badge */}
            <View style={styles.bestValueBadge}>
              <Text style={styles.bestValueText}>
                BEST VALUE · SAVE 50%
              </Text>
            </View>

            {/* Price Row */}
            <View style={styles.priceRow}>
              <Text style={styles.priceDollar}>$</Text>
              <Text style={styles.priceAmount}>29.99</Text>
              <Text style={styles.pricePeriod}>/ year</Text>
            </View>

            {/* Monthly Breakdown */}
            <Text style={styles.monthlyBreakdown}>
              Just $2.50/month · 7-day free trial
            </Text>

            {/* Monthly Switch */}
            <View style={styles.monthlySwitchRow}>
              <Text style={styles.monthlySwitchText}>
                Prefer monthly? $4.99/mo{' '}
              </Text>
              <Text style={styles.monthlySwitchLink}>Switch</Text>
            </View>
          </LinearGradient>

          {/* CTA Button */}
          <Pressable style={styles.ctaButton} onPress={() => router.back()}>
            <Text style={styles.ctaButtonText}>Start 7-day free trial</Text>
            <Text style={styles.ctaArrow}>→</Text>
          </Pressable>

          {/* Trust Badges */}
          <View style={styles.trustBadgesRow}>
            <Text style={styles.trustBadgeText}>
              <Text style={styles.trustBadgeIcon}>✓ </Text>
              Cancel anytime
            </Text>
            <Text style={styles.trustBadgeText}>
              <Text style={styles.trustBadgeIcon}>🔒 </Text>
              Secure
            </Text>
            <Text style={styles.trustBadgeText}>
              <Text style={styles.trustBadgeIcon}>✓ </Text>
              No hidden fees
            </Text>
          </View>
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
  closeButtonText: {
    fontSize: 16,
    fontFamily: FontFamily.bold,
    color: Colors.textDark,
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
    shadowColor: 'rgba(245,163,0,1)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 12,
  },
  crownEmoji: {
    fontSize: 44,
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
  plusBadgeSparkle: {
    fontSize: 11,
  },
  plusBadgeText: {
    fontSize: 11,
    fontFamily: FontFamily.bold,
    color: Colors.white,
    letterSpacing: 0.88,
  },
  heroTitle: {
    fontSize: 28,
    fontFamily: FontFamily.bold,
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
  featureIcon: {
    fontSize: 18,
  },
  featureTextColumn: {
    flex: 1,
    gap: 2,
  },
  featureTitle: {
    fontSize: 15,
    fontFamily: FontFamily.bold,
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
  ctaArrow: {
    fontSize: 18,
    color: Colors.white,
    fontFamily: FontFamily.bold,
  },

  // Trust Badges
  trustBadgesRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  trustBadgeIcon: {
    fontSize: 10,
    fontFamily: FontFamily.bold,
    color: Colors.textMuted,
  },
  trustBadgeText: {
    fontSize: 11,
    fontFamily: FontFamily.semiBold,
    color: Colors.textMuted,
  },
});
