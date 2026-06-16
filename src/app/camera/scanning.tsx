import { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/Colors';
import { FontFamily } from '../../constants/Typography';

export default function ScanningScreen() {
  const router = useRouter();
  const dot1 = useRef(new Animated.Value(1)).current;
  const dot2 = useRef(new Animated.Value(0.4)).current;
  const dot3 = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const animate = (dot: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0.4, duration: 400, useNativeDriver: true }),
        ]),
      );
    animate(dot1, 0).start();
    animate(dot2, 200).start();
    animate(dot3, 400).start();

    const timer = setTimeout(() => {
      router.replace('/review');
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* AI icon */}
        <LinearGradient
          colors={[Colors.greenLightBg, Colors.primary]}
          style={styles.aiCircle}
        >
          <Text style={styles.aiEmoji}>✨</Text>
        </LinearGradient>

        {/* Label */}
        <View style={styles.labelRow}>
          <Text style={styles.labelEmoji}>✨</Text>
          <Text style={styles.labelText}> AI WORKING</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>Analyzing your fridge...</Text>
        <Text style={styles.subtitle}>Identifying ingredients from your photo</Text>

        {/* Dots */}
        <View style={styles.dots}>
          <Animated.View style={[styles.dot, { opacity: dot1 }]} />
          <Animated.View style={[styles.dot, { opacity: dot2 }]} />
          <Animated.View style={[styles.dot, { opacity: dot3 }]} />
        </View>

        {/* Progress card */}
        <View style={styles.progressCard}>
          <View style={styles.progressRow}>
            <Text style={styles.progressEmoji}>⏳</Text>
            <Text style={styles.progressText}>Processing photo...</Text>
          </View>
          <View style={styles.progressRow}>
            <Text style={styles.progressCircle}>○</Text>
            <Text style={styles.progressText}>Identifying ingredients</Text>
          </View>
          <View style={styles.progressRow}>
            <Text style={styles.progressCircle}>○</Text>
            <Text style={styles.progressText}>Estimating quantities</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 60,
    gap: 24,
  },
  aiCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiEmoji: {
    fontSize: 64,
  },
  labelRow: {
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
  title: {
    fontFamily: FontFamily.bold,
    fontSize: 24,
    color: Colors.textPrimary,
    textAlign: 'center',
    letterSpacing: -0.96,
    lineHeight: 30,
  },
  subtitle: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  dots: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  progressCard: {
    width: '100%',
    backgroundColor: Colors.blueBg,
    borderWidth: 1,
    borderColor: Colors.blueBorder,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  progressEmoji: {
    fontSize: 14,
  },
  progressCircle: {
    fontFamily: FontFamily.bold,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  progressText: {
    flex: 1,
    fontFamily: FontFamily.semiBold,
    fontSize: 13,
    color: Colors.blueText,
  },
});
