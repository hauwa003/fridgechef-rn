import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/onboarding/welcome');
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient
      colors={[Colors.splashGradientStart, Colors.splashGradientEnd]}
      style={styles.container}
    >
      <Text style={styles.logo}>🥗</Text>
      <Text style={styles.title}>FridgeChef</Text>
      <Text style={styles.subtitle}>Cook with what you have</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  logo: {
    fontSize: 64,
    marginBottom: 8,
  },
  title: {
    ...Typography.h1,
    color: Colors.primary,
    fontSize: 36,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
});
