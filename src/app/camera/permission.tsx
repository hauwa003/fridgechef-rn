import { View, Text, Pressable, Linking, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Colors } from '../../constants/Colors';
import { FontFamily } from '../../constants/Typography';
import MingCuteIcon from '../../components/MingCuteIcon';

export default function PermissionDeniedScreen() {
  const router = useRouter();

  const handleGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });
    if (!result.canceled) {
      router.push('/camera/scanning');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Close button */}
      <View style={styles.topRight}>
        <Pressable style={styles.closeButton} onPress={() => router.back()}>
          <MingCuteIcon name="close_line" size={18} color={Colors.textDark} />
        </Pressable>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Camera icon */}
        <View style={styles.iconCircle}>
          <MingCuteIcon name="camera_2_fill" size={44} color={Colors.textPrimary} />
        </View>

        <Text style={styles.title}>Camera access needed</Text>
        <Text style={styles.description}>
          FridgeChef needs camera access to scan your fridge. You can enable it in Settings.
        </Text>

        {/* Buttons */}
        <View style={styles.buttons}>
          <Pressable
            style={styles.primaryButton}
            onPress={() => Linking.openSettings()}
          >
            <Text style={styles.primaryButtonText}>Open Settings</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={handleGallery}>
            <MingCuteIcon name="pic_line" size={16} color="#333333" />
            <Text style={styles.secondaryText}>Upload from gallery</Text>
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
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingBottom: 40,
    paddingTop: 60,
    gap: 20,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#F2F0EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: FontFamily.heading,
    fontSize: 24,
    color: Colors.textPrimary,
    textAlign: 'center',
    letterSpacing: -0.96,
  },
  description: {
    fontFamily: FontFamily.medium,
    fontSize: 15,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 22,
  },
  buttons: {
    width: '100%',
    paddingTop: 16,
    gap: 10,
  },
  primaryButton: {
    width: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 28,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  primaryButtonText: {
    fontFamily: FontFamily.bold,
    fontSize: 17,
    color: Colors.white,
  },
  secondaryButton: {
    width: '100%',
    borderWidth: 1.5,
    borderColor: '#C7C7C7',
    borderRadius: 24,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  secondaryText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 15,
    color: '#333333',
  },
});
