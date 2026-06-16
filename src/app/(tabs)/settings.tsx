import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/Colors';
import { FontFamily } from '../../constants/Typography';

type SettingsRowProps = {
  emoji: string;
  iconBg: string;
  label: string;
  value?: string;
  showChevron?: boolean;
  toggle?: boolean;
};

function SettingsRow({ emoji, iconBg, label, value, showChevron = true, toggle = false }: SettingsRowProps) {
  return (
    <Pressable style={styles.row}>
      <View style={[styles.iconSquare, { backgroundColor: iconBg }]}>
        <Text style={styles.iconEmoji}>{emoji}</Text>
      </View>
      <Text style={styles.rowLabel}>{label}</Text>
      {toggle ? (
        <View style={styles.toggleTrack}>
          <View style={styles.toggleThumb} />
        </View>
      ) : (
        <>
          {value && <Text style={styles.rowValue}>{value}</Text>}
          {showChevron && <Text style={styles.chevron}>›</Text>}
        </>
      )}
    </Pressable>
  );
}

export default function SettingsScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.title}>Settings</Text>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <LinearGradient
          colors={['#FFFCEB', '#FFF5DB']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.profileCard}
        >
          <LinearGradient
            colors={[Colors.saffron, Colors.saffronGradientEnd]}
            style={styles.avatar}
          >
            <Text style={styles.avatarLetter}>M</Text>
          </LinearGradient>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Maya</Text>
            <View style={styles.profileBadgeRow}>
              <View style={styles.plusBadge}>
                <Text style={styles.plusBadgeSparkle}>✨</Text>
                <Text style={styles.plusBadgeText}>PLUS</Text>
              </View>
              <Text style={styles.subscriptionInfo}>Annual · renews Mar 18</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Settings Sections */}
        <View style={styles.sections}>
          {/* SUBSCRIPTION */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>SUBSCRIPTION</Text>
            <View style={styles.card}>
              <SettingsRow emoji="👑" iconBg={Colors.saffronLightBg} label="Manage Plus" value="Annual" />
              <View style={styles.separator} />
              <SettingsRow emoji="💳" iconBg={Colors.blueLightBg} label="Billing" value="Visa •• 4242" />
            </View>
          </View>

          {/* PREFERENCES */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>PREFERENCES</Text>
            <View style={styles.card}>
              <SettingsRow emoji="🍽" iconBg={Colors.greenLightBg} label="Dietary preferences" value="Vegetarian" />
              <View style={styles.separator} />
              <SettingsRow emoji="👥" iconBg={Colors.blueLightBg} label="Default servings" value="2" />
              <View style={styles.separator} />
              <SettingsRow emoji="🔔" iconBg={Colors.saffronLightBg} label="Notifications" toggle />
            </View>
          </View>

          {/* PRIVACY */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>PRIVACY</Text>
            <View style={styles.card}>
              <SettingsRow emoji="📸" iconBg={Colors.saffronLightBg} label="Photo retention" value="Delete after 24h" />
              <View style={styles.separator} />
              <SettingsRow emoji="🔒" iconBg={Colors.blueLightBg} label="Data & privacy" />
            </View>
          </View>

          {/* ABOUT */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>ABOUT</Text>
            <View style={styles.card}>
              <SettingsRow emoji="❓" iconBg={Colors.blueLightBg} label="Help & support" />
              <View style={styles.separator} />
              <SettingsRow emoji="ℹ" iconBg={Colors.surfaceMuted} label="Version" value="1.0.0" showChevron={false} />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 22,
    fontFamily: FontFamily.bold,
    color: '#1A1A1A',
    textAlign: 'center',
    letterSpacing: -0.66,
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 16,
  },
  scrollView: {
    flex: 1,
  },
  profileCard: {
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    fontSize: 22,
    fontFamily: FontFamily.bold,
    color: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
    gap: 3,
  },
  profileName: {
    fontSize: 16,
    fontFamily: FontFamily.bold,
    color: '#1A1A1A',
  },
  profileBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  plusBadge: {
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    paddingLeft: 7,
    paddingRight: 8,
    paddingVertical: 3,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  plusBadgeSparkle: {
    fontSize: 9,
  },
  plusBadgeText: {
    fontSize: 9,
    fontFamily: FontFamily.bold,
    color: '#FFFFFF',
    letterSpacing: 0.36,
  },
  subscriptionInfo: {
    fontSize: 12,
    fontFamily: FontFamily.semiBold,
    color: '#808080',
  },
  sections: {
    paddingHorizontal: 20,
    flex: 1,
    gap: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  section: {},
  sectionLabel: {
    fontSize: 11,
    fontFamily: FontFamily.bold,
    color: '#808080',
    letterSpacing: 0.66,
    marginBottom: 6,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EBEBE5',
    borderRadius: 12,
  },
  separator: {
    height: 1,
    backgroundColor: '#EBEBE5',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  iconSquare: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconEmoji: {
    fontSize: 14,
  },
  rowLabel: {
    flex: 1,
    fontSize: 14,
    fontFamily: FontFamily.semiBold,
    color: '#1A1A1A',
  },
  rowValue: {
    fontSize: 12,
    fontFamily: FontFamily.medium,
    color: '#808080',
  },
  chevron: {
    fontSize: 14,
    fontFamily: FontFamily.bold,
    color: '#808080',
  },
  toggleTrack: {
    width: 44,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 3,
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
});
