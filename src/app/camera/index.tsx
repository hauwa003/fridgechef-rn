import { useState } from 'react';
import { View, Text, Pressable, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { Colors } from '../../constants/Colors';
import { FontFamily } from '../../constants/Typography';

export default function CameraScreen() {
  const router = useRouter();
  const [flashOn, setFlashOn] = useState(false);
  const [frontCamera, setFrontCamera] = useState(false);

  const handleGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });
    if (!result.canceled) {
      // Photo selected — proceed to scanning
      router.push('/camera/scanning');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Pressable style={styles.topButton} onPress={() => router.back()}>
          <Text style={styles.topButtonText}>✕</Text>
        </Pressable>
        <Pressable
          style={[styles.topButton, flashOn && styles.topButtonActive]}
          onPress={() => setFlashOn((f) => !f)}
        >
          <Text style={styles.topButtonEmoji}>{flashOn ? '⚡' : '⚡'}</Text>
        </Pressable>
      </View>

      {/* Viewfinder Area */}
      <View style={styles.viewfinderArea}>
        {/* Hint Pill */}
        <View style={styles.hintPill}>
          <Text style={styles.hintEmoji}>✨</Text>
          <Text style={styles.hintText}>
            {frontCamera
              ? 'Hold items up to the camera'
              : 'Open your fridge and frame the contents'}
          </Text>
        </View>

        {/* Spacer */}
        <View style={styles.spacer} />

        {/* Viewfinder Frame */}
        <View style={styles.viewfinderFrame}>
          {/* Top-Left Corner */}
          <View style={styles.cornerTopLeft}>
            <View style={[styles.cornerBarH, { top: 0, left: 0 }]} />
            <View style={[styles.cornerBarV, { top: 0, left: 0 }]} />
          </View>

          {/* Top-Right Corner */}
          <View style={styles.cornerTopRight}>
            <View style={[styles.cornerBarH, { top: 0, left: 0 }]} />
            <View style={[styles.cornerBarV, { top: 0, left: 25 }]} />
          </View>

          {/* Bottom-Left Corner */}
          <View style={styles.cornerBottomLeft}>
            <View style={[styles.cornerBarH, { top: 25, left: 0 }]} />
            <View style={[styles.cornerBarV, { top: 0, left: 0 }]} />
          </View>

          {/* Bottom-Right Corner */}
          <View style={styles.cornerBottomRight}>
            <View style={[styles.cornerBarH, { top: 25, left: 0 }]} />
            <View style={[styles.cornerBarV, { top: 0, left: 25 }]} />
          </View>
        </View>
      </View>

      {/* Bottom Controls */}
      <View style={styles.bottomControls}>
        {/* Gallery Button */}
        <Pressable style={styles.sideButton} onPress={handleGallery}>
          <Text style={styles.sideButtonEmoji}>🖼</Text>
        </Pressable>

        {/* Shutter Button */}
        <Pressable style={styles.shutterOuter} onPress={() => router.push('/camera/scanning')}>
          <LinearGradient
            colors={['#33C74D', '#009A1A']}
            style={styles.shutterInner}
          >
            <Text style={styles.shutterSparkle}>✨</Text>
          </LinearGradient>
        </Pressable>

        {/* Flip Camera Button */}
        <Pressable style={styles.sideButton} onPress={() => setFrontCamera((f) => !f)}>
          <Text style={styles.sideButtonEmoji}>🔄</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },

  // Top Bar
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  topButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topButtonActive: {
    backgroundColor: 'rgba(245,163,0,0.35)',
  },
  topButtonText: {
    fontSize: 16,
    fontFamily: FontFamily.bold,
    color: '#FFFFFF',
  },
  topButtonEmoji: {
    fontSize: 16,
  },

  // Viewfinder Area
  viewfinderArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Hint Pill
  hintPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(26,26,26,0.7)',
    borderRadius: 18,
    paddingLeft: 14,
    paddingRight: 16,
    paddingVertical: 8,
    gap: 6,
  },
  hintEmoji: {
    fontSize: 12,
  },
  hintText: {
    fontSize: 12,
    fontFamily: FontFamily.semiBold,
    color: '#FFFFFF',
  },

  // Spacer
  spacer: {
    height: 24,
  },

  // Viewfinder Frame
  viewfinderFrame: {
    width: 290,
    height: 320,
    position: 'relative',
  },

  // Corner positions
  cornerTopLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 28,
    height: 28,
  },
  cornerTopRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 28,
    height: 28,
  },
  cornerBottomLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 28,
    height: 28,
  },
  cornerBottomRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
  },

  // Corner bars
  cornerBarH: {
    position: 'absolute',
    width: 28,
    height: 3,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  cornerBarV: {
    position: 'absolute',
    width: 3,
    height: 28,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },

  // Bottom Controls
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingBottom: 40,
    paddingTop: 20,
  },

  // Side Buttons (Gallery / Flip)
  sideButton: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sideButtonEmoji: {
    fontSize: 22,
  },

  // Shutter Button
  shutterOuter: {
    width: 82,
    height: 82,
    borderRadius: 41,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterInner: {
    width: 66,
    height: 66,
    borderRadius: 33,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterSparkle: {
    fontSize: 28,
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
