import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';
import { Spacing, Radii } from '../constants/Spacing';
import { Button } from '../components/ui/Button';

export default function PaywallScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.closeButton} onPress={() => router.back()}>✕</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.emoji}>✨</Text>
        <Text style={styles.title}>Unlock FridgeChef Pro</Text>
        <Text style={styles.subtitle}>Get unlimited recipes and advanced features</Text>

        {/* Features */}
        <View style={styles.features}>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>♾️</Text>
            <Text style={styles.featureText}>Unlimited recipe generation</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🧑‍🍳</Text>
            <Text style={styles.featureText}>Advanced dietary filters</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>📱</Text>
            <Text style={styles.featureText}>Offline cook mode</Text>
          </View>
        </View>

        {/* Pricing */}
        <View style={styles.priceCard}>
          <Text style={styles.price}>$4.99/month</Text>
          <Text style={styles.priceNote}>7-day free trial</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Button title="Start Free Trial" onPress={() => router.back()} />
        <Text style={styles.restoreText}>Restore Purchases</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    alignItems: 'flex-end',
    padding: Spacing.lg,
  },
  closeButton: {
    fontSize: 20,
    color: Colors.textTertiary,
    padding: Spacing.sm,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxl,
    gap: Spacing.xl,
  },
  emoji: {
    fontSize: 64,
  },
  title: {
    ...Typography.h1,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  features: {
    gap: Spacing.lg,
    alignSelf: 'stretch',
    paddingHorizontal: Spacing.lg,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  featureIcon: {
    fontSize: 24,
  },
  featureText: {
    ...Typography.body,
    color: Colors.textPrimary,
  },
  priceCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.lg,
    borderWidth: 2,
    borderColor: Colors.primary,
    padding: Spacing.xl,
    alignItems: 'center',
    alignSelf: 'stretch',
    gap: Spacing.xs,
  },
  price: {
    ...Typography.h2,
    color: Colors.primary,
  },
  priceNote: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  footer: {
    paddingHorizontal: Spacing.xxl,
    paddingBottom: Spacing.xxxl,
    gap: Spacing.lg,
    alignItems: 'center',
  },
  restoreText: {
    ...Typography.bodySmall,
    color: Colors.textTertiary,
  },
});
