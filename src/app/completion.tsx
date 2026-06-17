import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/Colors';
import { FontFamily } from '../constants/Typography';
import MingCuteIcon from '../components/MingCuteIcon';

export default function CompletionScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Status Bar row */}
      <View style={styles.topBar}>
        <View style={{ flex: 1 }} />
        <Pressable style={styles.closeButton} onPress={() => router.replace('/(tabs)')}>
          <MingCuteIcon name="close_line" size={16} color="#666666" />
        </Pressable>
      </View>

      {/* Celebration Content */}
      <View style={styles.content}>
        {/* Icon row */}
        <View style={styles.iconRow}>
          <MingCuteIcon name="sparkles_fill" size={36} color={Colors.saffron} />
          <MingCuteIcon name="heart_fill" size={36} color={Colors.accent} />
          <MingCuteIcon name="sparkles_fill" size={36} color={Colors.primary} />
        </View>

        {/* Title */}
        <Text style={styles.title}>Bon appétit!</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Tomato Basil Pasta. You made this. Enjoy.
        </Text>

        {/* Dish Photo Placeholder */}
        <View style={styles.dishPhoto}>
          <MingCuteIcon name="fork_knife_fill" size={80} color={Colors.saffron} />
        </View>

        {/* Timer Pill */}
        <View style={styles.timerPill}>
          <MingCuteIcon name="time_line" size={14} color="#009A1A" />
          <Text style={styles.timerText}>Finished in 28 min</Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.ratingLabel}>How did it turn out?</Text>

        {/* Stars */}
        <View style={styles.starsRow}>
          {[1, 2, 3].map((i) => (
            <Pressable key={i}>
              <MingCuteIcon name="star_fill" size={32} color="#F5A300" />
            </Pressable>
          ))}
          {[4, 5].map((i) => (
            <Pressable key={i}>
              <MingCuteIcon name="star_line" size={32} color="#D9D9D1" />
            </Pressable>
          ))}
        </View>

        {/* Buttons */}
        <View style={styles.buttonsSection}>
          <Pressable style={styles.saveButton}>
            <MingCuteIcon name="heart_fill" size={16} color="#FFFFFF" />
            <Text style={styles.saveText}>Save to your recipes</Text>
          </Pressable>

          <View style={styles.secondaryRow}>
            <Pressable style={styles.secondaryButton}>
              <MingCuteIcon name="share_forward_line" size={16} color="#000000" />
              <Text style={styles.secondaryLabel}>Share</Text>
            </Pressable>
            <Pressable style={styles.secondaryButton} onPress={() => router.replace('/(tabs)')}>
              <MingCuteIcon name="check_line" size={16} color="#000000" />
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
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 24,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  secondaryLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: 14,
    color: '#333333',
  },
});
