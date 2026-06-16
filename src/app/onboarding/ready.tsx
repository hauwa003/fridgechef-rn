import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/Colors';
import { FontFamily } from '../../constants/Typography';

export default function ReadyScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Skip button */}
      <View style={styles.skipContainer}>
        <Pressable onPress={() => router.replace('/(tabs)')}>
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
      </View>

      {/* Hero section */}
      <View style={styles.heroSection}>
        {/* Green gradient circle */}
        <LinearGradient
          colors={['#009A1A', '#007314']}
          style={styles.heroCircle}
        >
          <Text style={styles.heroEmoji}>📸</Text>
        </LinearGradient>

        {/* Label */}
        <Text style={styles.label}>
          <Text style={styles.labelEmoji}>✨ </Text>
          <Text style={styles.labelText}>ALMOST READY</Text>
        </Text>

        {/* Heading */}
        <Text style={styles.heading}>{"Let's see what's\nin your fridge"}</Text>

        {/* Body */}
        <Text style={styles.body}>
          We need a couple of permissions to make this work.
        </Text>

        {/* Permissions card */}
        <View style={styles.permissionsCard}>
          {/* Camera row */}
          <View style={styles.permissionRow}>
            <View style={styles.permissionIconCircleGreen}>
              <Text style={styles.permissionEmoji}>📷</Text>
            </View>
            <View style={styles.permissionTextColumn}>
              <Text style={styles.permissionTitle}>Camera</Text>
              <Text style={styles.permissionDescription}>
                Take a photo of your fridge contents
              </Text>
            </View>
          </View>

          {/* Notifications row */}
          <View style={styles.permissionRow}>
            <View style={styles.permissionIconCircleBlue}>
              <Text style={styles.permissionEmoji}>🔔</Text>
            </View>
            <View style={styles.permissionTextColumn}>
              <Text style={styles.permissionTitle}>Notifications</Text>
              <Text style={styles.permissionDescription}>
                Optional · timer alerts and reminders
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.dots}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={[styles.dot, styles.dotActive]} />
        </View>
        <Pressable
          style={styles.nextButton}
          onPress={() => router.replace('/(tabs)')}
        >
          <Text style={styles.nextButtonText}>Get started</Text>
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
  heroSection: {
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 20,
    paddingBottom: 16,
    gap: 24,
  },
  heroCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(0,153,26,1)',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.35,
    shadowRadius: 30,
    elevation: 16,
  },
  heroEmoji: {
    fontSize: 64,
  },
  label: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelEmoji: {
    fontSize: 11,
    color: Colors.textPrimary,
  },
  labelText: {
    fontFamily: FontFamily.bold,
    fontSize: 11,
    color: Colors.primary,
    letterSpacing: 0.88,
  },
  heading: {
    fontFamily: FontFamily.bold,
    fontSize: 28,
    color: Colors.textPrimary,
    textAlign: 'center',
    letterSpacing: -1.12,
    lineHeight: 34,
  },
  body: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
  },
  permissionsCard: {
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    borderRadius: 12,
    padding: 16,
    gap: 12,
    width: '100%',
  },
  permissionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  permissionIconCircleGreen: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.greenLightBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionIconCircleBlue: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.blueBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionEmoji: {
    fontSize: 16,
  },
  permissionTextColumn: {
    flex: 1,
    gap: 2,
  },
  permissionTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 13,
    color: Colors.textPrimary,
  },
  permissionDescription: {
    fontFamily: FontFamily.medium,
    fontSize: 11,
    color: Colors.textMuted,
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
