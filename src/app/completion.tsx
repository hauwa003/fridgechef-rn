import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/Colors';
import { FontFamily } from '../constants/Typography';

export default function CompletionScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Status Bar row */}
      <View style={styles.topBar}>
        <View style={{ flex: 1 }} />
        <Pressable style={styles.closeButton} onPress={() => router.replace('/(tabs)')}>
          <Text style={styles.closeText}>✕</Text>
        </Pressable>
      </View>

      {/* Celebration Content */}
      <View style={styles.content}>
        {/* Emoji row */}
        <View style={styles.emojiRow}>
          <Text style={styles.celebrationEmoji}>🎉</Text>
          <Text style={styles.celebrationEmoji}>✨</Text>
          <Text style={styles.celebrationEmoji}>🌿</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>Bon appétit!</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Tomato Basil Pasta. You made this. Enjoy.
        </Text>

        {/* Dish Photo Placeholder */}
        <View style={styles.dishPhoto}>
          <Text style={styles.dishEmoji}>🍝</Text>
        </View>

        {/* Timer Pill */}
        <View style={styles.timerPill}>
          <Text style={styles.timerIcon}>⏱</Text>
          <Text style={styles.timerText}>Finished in 28 min</Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.ratingLabel}>How did it turn out?</Text>

        {/* Stars */}
        <View style={styles.starsRow}>
          <Pressable><Text style={styles.starFilled}>★</Text></Pressable>
          <Pressable><Text style={styles.starFilled}>★</Text></Pressable>
          <Pressable><Text style={styles.starFilled}>★</Text></Pressable>
          <Pressable><Text style={styles.starEmpty}>☆</Text></Pressable>
          <Pressable><Text style={styles.starEmpty}>☆</Text></Pressable>
        </View>

        {/* Buttons */}
        <View style={styles.buttonsSection}>
          <Pressable style={styles.saveButton}>
            <Text style={styles.saveHeart}>♥</Text>
            <Text style={styles.saveText}>Save to your recipes</Text>
          </Pressable>

          <View style={styles.secondaryRow}>
            <Pressable style={styles.secondaryButton}>
              <Text style={styles.secondaryIcon}>↗</Text>
              <Text style={styles.secondaryLabel}>Share</Text>
            </Pressable>
            <Pressable style={styles.secondaryButton} onPress={() => router.replace('/(tabs)')}>
              <Text style={styles.secondaryIcon}>✓</Text>
              <Text style={styles.secondaryLabel}>Done</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  closeButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F2F2ED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 14,
    fontFamily: FontFamily.bold,
    color: '#666666',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 24,
  },
  emojiRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  celebrationEmoji: {
    fontSize: 36,
  },
  title: {
    fontFamily: FontFamily.bold,
    fontSize: 48,
    color: '#1A1A1A',
    textAlign: 'center',
    letterSpacing: -2.4,
    lineHeight: 52,
  },
  subtitle: {
    fontFamily: FontFamily.medium,
    fontSize: 17,
    color: '#595959',
    textAlign: 'center',
  },
  dishPhoto: {
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: Colors.splashGradientEnd,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 8,
    borderColor: Colors.saffron,
  },
  dishEmoji: {
    fontSize: 100,
  },
  timerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F5FCF0',
    borderWidth: 1.5,
    borderColor: '#009A1A',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  timerIcon: {
    fontSize: 13,
  },
  timerText: {
    fontFamily: FontFamily.bold,
    fontSize: 13,
    color: '#009A1A',
    letterSpacing: -0.26,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#EBEBE5',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
    gap: 16,
  },
  ratingLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: 14,
    color: '#595959',
    textAlign: 'center',
    width: '100%',
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  starFilled: {
    fontSize: 32,
    color: '#F5A300',
  },
  starEmpty: {
    fontSize: 32,
    color: '#D9D9D1',
  },
  buttonsSection: {
    gap: 12,
    paddingTop: 8,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#009A1A',
    borderRadius: 28,
    paddingVertical: 16,
    paddingHorizontal: 24,
    shadowColor: 'rgba(0,153,26,1)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  saveHeart: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  saveText: {
    fontFamily: FontFamily.bold,
    fontSize: 17,
    color: '#FFFFFF',
    letterSpacing: -0.34,
  },
  secondaryRow: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F5F5F0',
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  secondaryIcon: {
    fontFamily: FontFamily.bold,
    fontSize: 14,
    color: '#000000',
  },
  secondaryLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: 14,
    color: '#333333',
  },
});
