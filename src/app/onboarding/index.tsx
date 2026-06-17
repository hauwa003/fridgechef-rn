import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontFamily } from '../../constants/Typography';
import { Colors } from '../../constants/Colors';

const videoSource = require('../../../assets/onboarding.mp4');

export default function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = true;
    player.muted = true;
    player.play();
  });

  return (
    <View style={styles.container}>
      <VideoView
        player={player}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        nativeControls={false}
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.75)']}
        style={styles.gradient}
      />
      <View style={[styles.content, { paddingBottom: insets.bottom + 48 }]}>
        <Text style={styles.heading}>Stop wondering{'\n'}what to cook</Text>
        <Text style={styles.subtitle}>
          Snap your fridge, we'll find recipes that work.{'\n'}Fresh, quick, doable.
        </Text>
        <Pressable
          onPress={() => router.replace('/(tabs)')}
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  gradient: {
    ...StyleSheet.absoluteFill,
    top: '50%',
  },
  content: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingTop: 24,
    gap: 14,
  },
  heading: {
    fontFamily: FontFamily.bold,
    fontSize: 34,
    color: Colors.white,
    letterSpacing: -0.68,
    lineHeight: 40,
  },
  subtitle: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
    color: '#E6E6E6',
    lineHeight: 24,
    maxWidth: 327,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 28,
    paddingVertical: 18,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowColor: 'rgba(0,153,26,0.25)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 8,
  },
  buttonPressed: {
    opacity: 0.9,
  },
  buttonText: {
    fontFamily: FontFamily.bold,
    fontSize: 17,
    color: Colors.white,
  },
});
