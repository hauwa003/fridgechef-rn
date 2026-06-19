import { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable, ScrollView, Modal, Linking, Animated, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/Colors';
import { FontFamily } from '../../constants/Typography';
import MingCuteIcon from '../../components/MingCuteIcon';
import { MingCuteIconName } from '../../constants/MingCuteGlyphMap';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type SettingsRowProps = {
  icon: MingCuteIconName;
  iconColor: string;
  iconBg: string;
  label: string;
  value?: string;
  showChevron?: boolean;
  toggle?: boolean;
  toggleOn?: boolean;
  onPress?: () => void;
};

type SheetType = 'dietary' | 'servings' | 'retention' | 'privacy' | 'help' | null;

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DIETARY_OPTIONS = ['Vegetarian', 'Vegan', 'Gluten-free', 'Dairy-free', 'Nut-free', 'None'];
const RETENTION_OPTIONS = ['Delete immediately', 'Delete after 24h', 'Delete after 7 days', 'Keep forever'];

// ---------------------------------------------------------------------------
// Settings Row
// ---------------------------------------------------------------------------

function SettingsRow({
  icon, iconColor, iconBg, label, value,
  showChevron = true, toggle = false, toggleOn = false, onPress,
}: SettingsRowProps) {
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <View style={[styles.iconSquare, { backgroundColor: iconBg }]}>
        <MingCuteIcon name={icon} size={16} color={iconColor} />
      </View>
      <Text style={styles.rowLabel}>{label}</Text>
      {toggle ? (
        <View style={[styles.toggleTrack, !toggleOn && styles.toggleTrackOff]}>
          <View style={[styles.toggleThumb, !toggleOn && styles.toggleThumbOff]} />
        </View>
      ) : (
        <>
          {value && <Text style={styles.rowValue}>{value}</Text>}
          {showChevron && <MingCuteIcon name="right_line" size={14} color="#808080" />}
        </>
      )}
    </Pressable>
  );
}

// ---------------------------------------------------------------------------
// Bottom Sheet
// ---------------------------------------------------------------------------

function SettingsSheet({
  visible,
  title,
  onClose,
  children,
}: {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const slideAnim = useRef(new Animated.Value(400)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
        Animated.spring(slideAnim, { toValue: 0, damping: 20, stiffness: 200, useNativeDriver: true }),
      ]).start();
    } else {
      slideAnim.setValue(400);
      fadeAnim.setValue(0);
    }
  }, [visible, slideAnim, fadeAnim]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 400, damping: 20, stiffness: 200, useNativeDriver: true }),
    ]).start(() => onClose());
  };

  return (
    <Modal visible={visible} transparent statusBarTranslucent>
      <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
        <Pressable style={styles.modalOverlayTouch} onPress={handleClose} />
        <Animated.View style={[styles.sheetContainer, { transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.sheetHandle} />
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>{title}</Text>
            <Pressable style={styles.sheetCloseBtn} onPress={handleClose}>
              <MingCuteIcon name="close_line" size={16} color="#1A1A1A" />
            </Pressable>
          </View>
          {children}
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

// ---------------------------------------------------------------------------
// Main Screen
// ---------------------------------------------------------------------------

export default function SettingsScreen() {
  const router = useRouter();

  // Settings state
  const [dietary, setDietary] = useState<string[]>(['Vegetarian']);
  const [servings, setServings] = useState(2);
  const [notifications, setNotifications] = useState(true);
  const [retention, setRetention] = useState('Delete after 24h');
  const [activeSheet, setActiveSheet] = useState<SheetType>(null);

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
                <MingCuteIcon name="sparkles_fill" size={9} color={Colors.saffron} />
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
              <SettingsRow icon="trophy_fill" iconColor={Colors.saffron} iconBg={Colors.saffronLightBg} label="Manage Plus" value="Annual" onPress={() => router.push('/paywall?variant=already_subscribed')} />
              <View style={styles.separator} />
              <SettingsRow icon="bank_card_line" iconColor={Colors.blue} iconBg={Colors.blueLightBg} label="Billing" value="Visa •• 4242" onPress={() => router.push('/paywall?variant=already_subscribed')} />
            </View>
          </View>

          {/* PREFERENCES */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>PREFERENCES</Text>
            <View style={styles.card}>
              <SettingsRow icon="fork_knife_line" iconColor={Colors.primary} iconBg={Colors.greenLightBg} label="Dietary preferences" value={dietary.includes('None') ? 'None' : dietary.length <= 2 ? dietary.join(', ') : `${dietary.slice(0, 2).join(', ')} +${dietary.length - 2}`} onPress={() => setActiveSheet('dietary')} />
              <View style={styles.separator} />
              <SettingsRow icon="group_line" iconColor={Colors.blue} iconBg={Colors.blueLightBg} label="Default servings" value={String(servings)} onPress={() => setActiveSheet('servings')} />
              <View style={styles.separator} />
              <SettingsRow icon="notification_line" iconColor={Colors.saffron} iconBg={Colors.saffronLightBg} label="Notifications" toggle toggleOn={notifications} onPress={() => setNotifications((n) => !n)} />
            </View>
          </View>

          {/* PRIVACY */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>PRIVACY</Text>
            <View style={styles.card}>
              <SettingsRow icon="camera_2_line" iconColor={Colors.saffron} iconBg={Colors.saffronLightBg} label="Photo retention" value={retention} onPress={() => setActiveSheet('retention')} />
              <View style={styles.separator} />
              <SettingsRow icon="lock_line" iconColor={Colors.blue} iconBg={Colors.blueLightBg} label="Data & privacy" onPress={() => setActiveSheet('privacy')} />
            </View>
          </View>

          {/* ABOUT */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>ABOUT</Text>
            <View style={styles.card}>
              <SettingsRow icon="question_line" iconColor={Colors.blue} iconBg={Colors.blueLightBg} label="Help & support" onPress={() => setActiveSheet('help')} />
              <View style={styles.separator} />
              <SettingsRow icon="information_line" iconColor={Colors.textMuted} iconBg={Colors.surfaceMuted} label="Version" value="1.0.0" showChevron={false} />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* ── Dietary Sheet ── */}
      <SettingsSheet visible={activeSheet === 'dietary'} title="Dietary preferences" onClose={() => setActiveSheet(null)}>
        <View style={styles.sheetChipWrap}>
          {DIETARY_OPTIONS.map((opt) => {
            const isNone = opt === 'None';
            const selected = isNone ? dietary.includes('None') : dietary.includes(opt);
            return (
              <Pressable
                key={opt}
                style={[styles.sheetChip, selected && styles.sheetChipSelected]}
                onPress={() => {
                  if (isNone) {
                    setDietary(['None']);
                  } else {
                    setDietary((prev) => {
                      const without = prev.filter((d) => d !== 'None');
                      return without.includes(opt)
                        ? without.filter((d) => d !== opt)
                        : [...without, opt];
                    });
                  }
                }}
              >
                {selected && <MingCuteIcon name="check_fill" size={14} color={Colors.white} />}
                <Text style={[styles.sheetChipText, selected && styles.sheetChipTextSelected]}>{opt}</Text>
              </Pressable>
            );
          })}
        </View>
        <Pressable style={styles.sheetCta} onPress={() => setActiveSheet(null)}>
          <Text style={styles.sheetCtaText}>Done</Text>
        </Pressable>
      </SettingsSheet>

      {/* ── Servings Sheet ── */}
      <SettingsSheet visible={activeSheet === 'servings'} title="Default servings" onClose={() => setActiveSheet(null)}>
        <View style={styles.servingsRow}>
          <Pressable style={styles.servingsBtn} onPress={() => setServings((s) => Math.max(1, s - 1))}>
            <Text style={styles.servingsBtnText}>−</Text>
          </Pressable>
          <Text style={styles.servingsValue}>{servings}</Text>
          <Pressable style={styles.servingsBtn} onPress={() => setServings((s) => Math.min(12, s + 1))}>
            <Text style={[styles.servingsBtnText, { color: Colors.primary }]}>+</Text>
          </Pressable>
        </View>
        <Text style={styles.servingsHint}>Recipes will default to {servings} serving{servings !== 1 ? 's' : ''}</Text>
        <Pressable style={styles.sheetCta} onPress={() => setActiveSheet(null)}>
          <Text style={styles.sheetCtaText}>Done</Text>
        </Pressable>
      </SettingsSheet>

      {/* ── Photo Retention Sheet ── */}
      <SettingsSheet visible={activeSheet === 'retention'} title="Photo retention" onClose={() => setActiveSheet(null)}>
        {RETENTION_OPTIONS.map((opt) => {
          const selected = retention === opt;
          return (
            <Pressable
              key={opt}
              style={[styles.sheetOptionRow, selected && styles.sheetOptionRowSelected]}
              onPress={() => { setRetention(opt); setActiveSheet(null); }}
            >
              <Text style={[styles.sheetOptionText, selected && styles.sheetOptionTextSelected]}>{opt}</Text>
              {selected && <MingCuteIcon name="check_fill" size={18} color={Colors.primary} />}
            </Pressable>
          );
        })}
        <Text style={styles.sheetFootnote}>Fridge photos are stored locally and never uploaded to our servers.</Text>
      </SettingsSheet>

      {/* ── Data & Privacy Sheet ── */}
      <SettingsSheet visible={activeSheet === 'privacy'} title="Data & privacy" onClose={() => setActiveSheet(null)}>
        <View style={styles.sheetInfoSection}>
          <View style={styles.sheetInfoRow}>
            <MingCuteIcon name="check_circle_fill" size={18} color={Colors.primary} />
            <Text style={styles.sheetInfoText}>Photos are processed on-device and never uploaded</Text>
          </View>
          <View style={styles.sheetInfoRow}>
            <MingCuteIcon name="check_circle_fill" size={18} color={Colors.primary} />
            <Text style={styles.sheetInfoText}>Recipes and preferences stored securely in your account</Text>
          </View>
          <View style={styles.sheetInfoRow}>
            <MingCuteIcon name="check_circle_fill" size={18} color={Colors.primary} />
            <Text style={styles.sheetInfoText}>We never sell your data to third parties</Text>
          </View>
        </View>
        <Pressable style={styles.sheetLinkRow} onPress={() => Linking.openURL('https://fridgechef.app/privacy')}>
          <Text style={styles.sheetLinkText}>Read our Privacy Policy</Text>
          <MingCuteIcon name="arrow_right_line" size={14} color={Colors.blue} />
        </Pressable>
        <Pressable style={styles.sheetLinkRow} onPress={() => Linking.openURL('https://fridgechef.app/terms')}>
          <Text style={styles.sheetLinkText}>Terms of Service</Text>
          <MingCuteIcon name="arrow_right_line" size={14} color={Colors.blue} />
        </Pressable>
      </SettingsSheet>

      {/* ── Help & Support Sheet ── */}
      <SettingsSheet visible={activeSheet === 'help'} title="Help & support" onClose={() => setActiveSheet(null)}>
        <Pressable style={styles.sheetLinkRow} onPress={() => Linking.openURL('mailto:support@fridgechef.app')}>
          <View style={styles.sheetLinkLeft}>
            <MingCuteIcon name="mail_line" size={18} color={Colors.blue} />
            <Text style={styles.sheetLinkText}>Email support</Text>
          </View>
          <MingCuteIcon name="arrow_right_line" size={14} color={Colors.blue} />
        </Pressable>
        <Pressable style={styles.sheetLinkRow} onPress={() => Linking.openURL('https://fridgechef.app/faq')}>
          <View style={styles.sheetLinkLeft}>
            <MingCuteIcon name="question_line" size={18} color={Colors.blue} />
            <Text style={styles.sheetLinkText}>FAQs</Text>
          </View>
          <MingCuteIcon name="arrow_right_line" size={14} color={Colors.blue} />
        </Pressable>
        <Text style={styles.sheetFootnote}>We typically respond within 24 hours.</Text>
      </SettingsSheet>
    </SafeAreaView>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  title: {
    fontSize: 22, fontFamily: FontFamily.heading, color: '#1A1A1A',
    textAlign: 'center', letterSpacing: -0.66, paddingHorizontal: 16, paddingTop: 4, paddingBottom: 16,
  },
  scrollView: { flex: 1 },
  profileCard: { marginHorizontal: 20, borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatar: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  avatarLetter: { fontSize: 22, fontFamily: FontFamily.bold, color: '#FFFFFF' },
  profileInfo: { flex: 1, gap: 3 },
  profileName: { fontSize: 16, fontFamily: FontFamily.heading, color: '#1A1A1A' },
  profileBadgeRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  plusBadge: { backgroundColor: '#1A1A1A', borderRadius: 8, paddingLeft: 7, paddingRight: 8, paddingVertical: 3, flexDirection: 'row', alignItems: 'center', gap: 3 },
  plusBadgeText: { fontSize: 9, fontFamily: FontFamily.bold, color: '#FFFFFF', letterSpacing: 0.36 },
  subscriptionInfo: { fontSize: 12, fontFamily: FontFamily.semiBold, color: '#808080' },
  sections: { paddingHorizontal: 20, flex: 1, gap: 20, paddingTop: 20, paddingBottom: 40 },
  section: {},
  sectionLabel: { fontSize: 11, fontFamily: FontFamily.bold, color: '#808080', letterSpacing: 0.66, marginBottom: 6 },
  card: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#EBEBE5', borderRadius: 12 },
  separator: { height: 1, backgroundColor: '#EBEBE5' },
  row: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  iconSquare: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  rowLabel: { flex: 1, fontSize: 14, fontFamily: FontFamily.semiBold, color: '#1A1A1A' },
  rowValue: { fontSize: 12, fontFamily: FontFamily.medium, color: '#808080' },
  toggleTrack: { width: 44, height: 26, borderRadius: 13, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'flex-end', paddingHorizontal: 3 },
  toggleTrackOff: { backgroundColor: '#D9D9D1', alignItems: 'flex-start' },
  toggleThumb: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#FFFFFF' },
  toggleThumbOff: {},

  // ── Modal / Sheet ──
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'flex-end' },
  modalOverlayTouch: { flex: 1 },
  sheetContainer: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 20, paddingBottom: 36 },
  sheetHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#D9D9D1', alignSelf: 'center', marginTop: 12, marginBottom: 16 },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  sheetTitle: { fontSize: 20, fontFamily: FontFamily.heading, color: '#1A1A1A', letterSpacing: -0.4 },
  sheetCloseBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F2F2ED', alignItems: 'center', justifyContent: 'center' },

  // Dietary chips
  sheetChipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  sheetChip: { borderWidth: 1.5, borderColor: '#EBEBE5', borderRadius: 20, paddingVertical: 10, paddingHorizontal: 16, backgroundColor: '#FFFFFF', flexDirection: 'row', alignItems: 'center', gap: 6 },
  sheetChipSelected: { borderColor: Colors.primary, backgroundColor: Colors.primary },
  sheetChipText: { fontSize: 14, fontFamily: FontFamily.semiBold, color: '#1A1A1A' },
  sheetChipTextSelected: { color: '#FFFFFF' },

  // Servings stepper
  servingsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 24, marginBottom: 8 },
  servingsBtn: { width: 48, height: 48, borderRadius: 24, borderWidth: 1.5, borderColor: '#EBEBE5', alignItems: 'center', justifyContent: 'center' } as const,
  servingsBtnText: { fontSize: 22, fontFamily: FontFamily.bold, color: '#1A1A1A' },
  servingsValue: { fontSize: 40, fontFamily: FontFamily.bold, color: '#1A1A1A', letterSpacing: -2, minWidth: 60, textAlign: 'center' },
  servingsHint: { fontSize: 13, fontFamily: FontFamily.medium, color: '#808080', textAlign: 'center', marginBottom: 16 },
  sheetCta: { backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  sheetCtaText: { fontSize: 15, fontFamily: FontFamily.bold, color: '#FFFFFF' },

  // Radio-style options (retention)
  sheetOptionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, paddingHorizontal: 4, borderBottomWidth: 1, borderBottomColor: '#F2F2ED' },
  sheetOptionRowSelected: {},
  sheetOptionText: { fontSize: 15, fontFamily: FontFamily.medium, color: '#1A1A1A' },
  sheetOptionTextSelected: { fontFamily: FontFamily.bold, color: Colors.primary },
  sheetFootnote: { fontSize: 12, fontFamily: FontFamily.medium, color: '#808080', marginTop: 12, lineHeight: 17 },

  // Info rows (privacy)
  sheetInfoSection: { gap: 14, marginBottom: 20 },
  sheetInfoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  sheetInfoText: { flex: 1, fontSize: 14, fontFamily: FontFamily.medium, color: '#1A1A1A', lineHeight: 20 },

  // Link rows (privacy + help)
  sheetLinkRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F2F2ED' },
  sheetLinkLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  sheetLinkText: { fontSize: 15, fontFamily: FontFamily.semiBold, color: Colors.blue },
});
