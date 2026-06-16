import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/Colors';
import { FontFamily } from '../../constants/Typography';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Skip */}
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
          {/* Fridge icon */}
          <View style={styles.fridgeOutline}>
            <View style={styles.fridgeShelf} />
          </View>
          {/* Food emojis */}
          <Text style={[styles.emoji, { left: 30, top: 90, fontSize: 36 }]}>🍅</Text>
          <Text style={[styles.emoji, { left: 220, top: 80, fontSize: 32 }]}>🧅</Text>
          <Text style={[styles.emoji, { left: 40, top: 170, fontSize: 32 }]}>🥬</Text>
          <Text style={[styles.emoji, { left: 215, top: 180, fontSize: 34 }]}>🧀</Text>
          <Text style={[styles.emoji, { left: 130, top: 30, fontSize: 30 }]}>🌿</Text>
          <Text style={[styles.emoji, { left: 130, top: 220, fontSize: 36 }]}>🍝</Text>
        </LinearGradient>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.labelRow}>
          <Text style={styles.labelEmoji}>✨</Text>
          <Text style={styles.labelText}>WELCOME TO FRIDGECHEF</Text>
        </View>
        <Text style={styles.heading}>Cook with what's{'\n'}already in your fridge</Text>
        <Text style={styles.body}>
          Stop staring into your fridge wondering what to cook. We turn your ingredients into recipes you can make tonight.
        </Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.dots}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
        <Pressable
          style={styles.nextButton}
          onPress={() => router.push('/onboarding/how-it-works')}
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
    position: 'relative',
    overflow: 'hidden',
  },
  fridgeOutline: {
    position: 'absolute',
    left: 100,
    top: 95,
    width: 80,
    height: 110,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.primary,
    backgroundColor: Colors.white,
  },
  fridgeShelf: {
    position: 'absolute',
    left: 0,
    top: 40,
    width: 76,
    height: 2,
    backgroundColor: Colors.primary,
  },
  emoji: {
    position: 'absolute',
  },
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
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
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
    fontSize: 18,
    color: Colors.white,
  },
});
