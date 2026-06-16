import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { FontFamily } from '../../constants/Typography';

const STEPS = [
  {
    emoji: '📸',
    label: 'STEP 1',
    title: 'Snap your fridge',
    description: 'Open the door and take one quick photo of what you have.',
    circleBg: Colors.saffronLightBg3,
  },
  {
    emoji: '✨',
    label: 'STEP 2',
    title: 'AI finds recipes',
    description: 'We identify your ingredients and match recipes that use them.',
    circleBg: Colors.greenLightBg,
  },
  {
    emoji: '🍳',
    label: 'STEP 3',
    title: 'Cook with us',
    description: 'Follow step-by-step instructions with timers and tips.',
    circleBg: Colors.blueBg,
  },
];

export default function HowItWorksScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Skip button */}
      <View style={styles.skipContainer}>
        <Pressable onPress={() => router.replace('/(tabs)')}>
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
      </View>

      {/* Cards section */}
      <View style={styles.cardsSection}>
        {STEPS.map((step, index) => (
          <View key={index} style={styles.card}>
            <View style={[styles.emojiCircle, { backgroundColor: step.circleBg }]}>
              <Text style={styles.emoji}>{step.emoji}</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.stepLabel}>{step.label}</Text>
              <Text style={styles.cardTitle}>{step.title}</Text>
              <Text style={styles.cardDescription}>{step.description}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Content section */}
      <View style={styles.contentSection}>
        <Text style={styles.label}>
          <Text style={styles.labelEmoji}>✨ </Text>
          <Text style={styles.labelText}>HOW IT WORKS</Text>
        </Text>
        <Text style={styles.heading}>{'Three steps from\nfridge to fork'}</Text>
        <Text style={styles.body}>
          Photo to plate in minutes. Here's how FridgeChef works.
        </Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.dots}>
          <View style={styles.dot} />
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
        </View>
        <Pressable
          style={styles.nextButton}
          onPress={() => router.push('/onboarding/ready')}
        >
          <Text style={styles.nextButtonText}>Next</Text>
          <Text style={styles.nextButtonArrow}>→</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  skipContainer: {
    alignItems: 'flex-end',
    paddingRight: 24,
    paddingTop: 4,
  },
  skipText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 14,
    color: Colors.textMuted,
  },
  cardsSection: {
    paddingHorizontal: 32,
    paddingVertical: 24,
    gap: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 16,
    alignItems: 'center',
  },
  emojiCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 28,
  },
  cardContent: {
    flex: 1,
    gap: 3,
  },
  stepLabel: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    color: Colors.textMuted,
    letterSpacing: 0.6,
  },
  cardTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 16,
    color: Colors.textPrimary,
    letterSpacing: -0.32,
  },
  cardDescription: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    color: Colors.textMuted,
    lineHeight: 17,
  },
  contentSection: {
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
    gap: 12,
  },
  label: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelEmoji: {
    fontSize: 11,
  },
  labelText: {
    fontFamily: FontFamily.bold,
    fontSize: 11,
    color: Colors.primary,
    letterSpacing: 0.88,
  },
  heading: {
    fontFamily: FontFamily.bold,
    fontSize: 30,
    color: Colors.textPrimary,
    textAlign: 'center',
    letterSpacing: -1.2,
    lineHeight: 36,
  },
  body: {
    fontFamily: FontFamily.medium,
    fontSize: 15,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 22,
  },
  footer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 16,
    gap: 20,
  },
  dots: {
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.border,
  },
  dotActive: {
    backgroundColor: Colors.primary,
    width: 20,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    borderRadius: 28,
    paddingVertical: 18,
    width: '100%',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  nextButtonText: {
    fontFamily: FontFamily.bold,
    fontSize: 17,
    color: Colors.white,
  },
  nextButtonArrow: {
    fontSize: 18,
    color: Colors.white,
  },
});
