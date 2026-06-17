import { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/Colors';
import { FontFamily } from '../constants/Typography';

export default function SplashScreen() {
  const router = useRouter();
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
    animate(dot1, 0).start();
    animate(dot2, 200).start();
    animate(dot3, 400).start();

    const timer = setTimeout(() => {
      router.replace('/onboarding');
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient
      colors={[Colors.splashGradientStart, Colors.splashGradientEnd]}
      style={styles.container}
    >
      <View style={styles.logo}>
        {/* Logo Icon */}
        <LinearGradient
          colors={[Colors.primary, Colors.primaryDark]}
          style={styles.logoIcon}
        >
          <View style={styles.logoFridge} />
          <View style={styles.logoShelf} />
          <View style={styles.logoHandle1} />
          <View style={styles.logoHandle2} />
          <Text style={styles.logoSparkle}>✨</Text>
        </LinearGradient>

        <Text style={styles.title}>FridgeChef</Text>
        <Text style={styles.subtitle}>Snap your fridge. Get dinner.</Text>
      </View>

      {/* Loading dots */}
      <View style={styles.dots}>
        <Animated.View style={[styles.dot, { opacity: dot1 }]} />
        <Animated.View style={[styles.dot, { opacity: dot2 }]} />
        <Animated.View style={[styles.dot, { opacity: dot3 }]} />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 32,
  },
  logo: {
    alignItems: 'center',
    gap: 18,
  },
  logoIcon: {
    width: 120,
    height: 120,
    borderRadius: 28,
    position: 'relative',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 28,
    elevation: 12,
  },
  logoFridge: {
    position: 'absolute',
    left: 32,
    top: 20,
    width: 56,
    height: 80,
    borderRadius: 10,
    backgroundColor: Colors.white,
  },
  logoShelf: {
    position: 'absolute',
    left: 32,
    top: 50,
    width: 56,
    height: 2,
    backgroundColor: Colors.primary,
  },
  logoHandle1: {
    position: 'absolute',
    left: 78,
    top: 32,
    width: 4,
    height: 12,
    borderRadius: 2,
    backgroundColor: Colors.primary,
  },
  logoHandle2: {
    position: 'absolute',
    left: 78,
    top: 60,
    width: 4,
    height: 16,
    borderRadius: 2,
    backgroundColor: Colors.primary,
  },
  logoSparkle: {
    position: 'absolute',
    left: 70,
    top: 8,
    fontSize: 32,
  },
  title: {
    fontFamily: FontFamily.bold,
    fontSize: 36,
    color: Colors.textPrimary,
    letterSpacing: -1.8,
  },
  subtitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: 13,
    color: Colors.textMuted,
    letterSpacing: 0.26,
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
});
