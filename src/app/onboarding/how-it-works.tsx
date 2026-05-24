import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/Colors';
import { FontFamily } from '../../constants/Typography';

export default function HowItWorksScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.skipRow}>
        <Pressable onPress={() => router.replace('/(tabs)')}>
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
      </View>

      {/* Hero Illustration */}
      <View style={styles.heroWrap}>
        <LinearGradient
          colors={[Colors.illustrationGradientStart, Colors.illustrationGradientEnd]}
          style={styles.heroCircle}
        >
          <Text style={styles.heroEmoji}>📸</Text>
          <Text style={styles.arrowEmoji}>→</Text>
          <Text style={styles.heroEmoji2}>🍝</Text>
        </LinearGradient>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.labelRow}>
          <Text style={styles.labelEmoji}>✨</Text>
          <Text style={styles.labelText}>HOW IT WORKS</Text>
        </View>
        <Text style={styles.heading}>Three steps from{'\n'}fridge to fork</Text>
        <View style={styles.steps}>
          <View style={styles.step}>
            <View style={styles.stepDot}><Text style={styles.stepNum}>1</Text></View>
            <Text style={styles.stepText}>Snap a photo of your fridge</Text>
          </View>
          <View style={styles.step}>
            <View style={styles.stepDot}><Text style={styles.stepNum}>2</Text></View>
            <Text style={styles.stepText}>AI finds recipes you can make</Text>
          </View>
          <View style={styles.step}>
            <View style={styles.stepDot}><Text style={styles.stepNum}>3</Text></View>
            <Text style={styles.stepText}>Follow step-by-step cook mode</Text>
          </View>
        </View>
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
  skipRow: {
    alignItems: 'flex-end',
    paddingRight: 24,
    paddingTop: 4,
  },
  skipText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 14,
    color: Colors.textMuted,
  },
  heroWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  heroCircle: {
    width: 280,
    height: 280,
    borderRadius: 140,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 16,
  },
  heroEmoji: { fontSize: 48 },
  arrowEmoji: { fontSize: 24, color: Colors.primary },
  heroEmoji2: { fontSize: 48 },
  content: {
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
    gap: 12,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  labelEmoji: { fontSize: 11 },
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
  steps: {
    gap: 16,
    alignSelf: 'stretch',
    paddingTop: 8,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNum: {
    fontFamily: FontFamily.bold,
    fontSize: 14,
    color: Colors.white,
  },
  stepText: {
    fontFamily: FontFamily.medium,
    fontSize: 15,
    color: Colors.textSecondary,
  },
  footer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 32,
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
    fontFamily: FontFamily.bold,
    fontSize: 18,
    color: Colors.white,
  },
});
