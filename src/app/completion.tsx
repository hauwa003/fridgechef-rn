import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/Colors';
import { FontFamily } from '../constants/Typography';

export default function CompletionScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Close button */}
      <View style={styles.topRight}>
        <Pressable style={styles.closeButton} onPress={() => router.replace('/(tabs)')}>
          <Text style={styles.closeText}>✕</Text>
        </Pressable>
      </View>

      <View style={styles.content}>
        {/* Celebration */}
        <Text style={styles.sparkles}>🎉 ✨ 🌟</Text>
        <Text style={styles.title}>Bon appétit!</Text>
        <Text style={styles.subtitle}>Tomato Basil Pasta. You made this. Enjoy.</Text>

        {/* Plate illustration */}
        <View style={styles.plate}>
          <Text style={styles.plateEmoji}>🍝</Text>
        </View>

        {/* Rating */}
        <Text style={styles.ratingLabel}>How did it turn out?</Text>
        <View style={styles.stars}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Pressable key={i}>
              <Text style={styles.star}>☆</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <Pressable style={styles.saveButton}>
          <Text style={styles.saveIcon}>❤️</Text>
          <Text style={styles.saveText}>Save to your recipes</Text>
        </Pressable>
        <View style={styles.footerLinks}>
          <Pressable style={styles.footerLink}>
            <Text style={styles.footerLinkText}>📤 Share</Text>
          </Pressable>
          <Pressable style={styles.footerLink} onPress={() => router.replace('/(tabs)')}>
            <Text style={styles.footerLinkText}>✓ Done</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  topRight: {
    alignItems: 'flex-end',
    paddingRight: 20,
    paddingTop: 8,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontFamily: FontFamily.bold,
    fontSize: 16,
    color: Colors.textDark,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 12,
  },
  sparkles: {
    fontSize: 28,
    marginBottom: 4,
  },
  title: {
    fontFamily: FontFamily.bold,
    fontSize: 32,
    color: Colors.textPrimary,
    letterSpacing: -1.2,
  },
  subtitle: {
    fontFamily: FontFamily.medium,
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  plate: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: Colors.splashGradientEnd,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    borderWidth: 4,
    borderColor: Colors.saffron,
  },
  plateEmoji: {
    fontSize: 72,
  },
  ratingLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 8,
  },
  stars: {
    flexDirection: 'row',
    gap: 8,
  },
  star: {
    fontSize: 32,
    color: Colors.saffron,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    gap: 16,
    alignItems: 'center',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    borderRadius: 28,
    paddingVertical: 16,
    width: '100%',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
  },
  saveIcon: { fontSize: 16 },
  saveText: {
    fontFamily: FontFamily.bold,
    fontSize: 16,
    color: Colors.white,
  },
  footerLinks: {
    flexDirection: 'row',
    gap: 32,
  },
  footerLink: {
    padding: 8,
  },
  footerLinkText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 14,
    color: Colors.textSecondary,
  },
});
