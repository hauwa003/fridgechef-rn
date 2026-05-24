import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Spacing, Radii } from '../../constants/Spacing';

export default function CameraScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Camera viewfinder placeholder */}
      <View style={styles.viewfinder}>
        <Text style={styles.viewfinderText}>📷 Camera Viewfinder</Text>
        <Text style={styles.hint}>Point at your fridge or ingredients</Text>
      </View>

      {/* Overlay controls */}
      <SafeAreaView style={styles.overlay}>
        <View style={styles.topControls}>
          <Pressable onPress={() => router.back()} style={styles.closeButton}>
            <Text style={styles.closeIcon}>✕</Text>
          </Pressable>
        </View>

        <View style={styles.bottomControls}>
          <Pressable
            style={styles.captureButton}
            onPress={() => router.push('/camera/scanning')}
          >
            <View style={styles.captureInner} />
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  viewfinder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A1A2E',
    gap: Spacing.md,
  },
  viewfinderText: {
    ...Typography.h2,
    color: Colors.white,
  },
  hint: {
    ...Typography.body,
    color: Colors.textTertiary,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: Spacing.lg,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '700',
  },
  bottomControls: {
    alignItems: 'center',
    paddingBottom: Spacing.huge,
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: Colors.white,
  },
});
