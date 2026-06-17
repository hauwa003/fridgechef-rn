import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/Colors';
import { FontFamily } from '../../constants/Typography';
import { mockRecipes } from '../../data/mock';
import MingCuteIcon from '../../components/MingCuteIcon';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.dateText}>Tuesday · 7:14 PM</Text>
            <Text style={styles.greeting}>Hey Maya 👋</Text>
          </View>
          <LinearGradient
            colors={[Colors.saffron, Colors.saffronGradientEnd]}
            style={styles.avatar}
          >
            <Text style={styles.avatarText}>M</Text>
          </LinearGradient>
        </View>

        {/* Scan CTA */}
        <LinearGradient
          colors={[Colors.promoGradientStart, Colors.promoGradientEnd]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.promoBg}
        >
          <Pressable style={styles.promoCard} onPress={() => router.push('/camera')}>
            <View style={styles.promoIcon}>
              <MingCuteIcon name="camera_2_fill" size={24} color={Colors.white} />
            </View>
            <View style={styles.promoText}>
              <Text style={styles.promoTitle}>What's for dinner tonight?</Text>
              <Text style={styles.promoSub}>Scan your fridge in 2 seconds</Text>
            </View>
            <MingCuteIcon name="arrow_right_line" size={22} color={Colors.primary} />
          </Pressable>
        </LinearGradient>

        {/* Recently cooked */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recently cooked</Text>
          <Text style={styles.seeAll}>See all</Text>
        </View>

        {mockRecipes.slice(0, 2).map((recipe) => (
          <Pressable
            key={recipe.id}
            style={styles.recipeRow}
            onPress={() => router.push(`/recipes/${recipe.id}`)}
          >
            <View style={styles.recipeThumbnail}>
              <MingCuteIcon name="fork_knife_fill" size={28} color={Colors.textMuted} />
            </View>
            <View style={styles.recipeInfo}>
              <Text style={styles.recipeName}>{recipe.title}</Text>
              <View style={styles.recipeMeta}>
                <Text style={styles.recipeTime}>2 days ago</Text>
                <Text style={styles.recipeDot}>·</Text>
                <View style={styles.starsRow}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <MingCuteIcon key={i} name="star_fill" size={11} color={Colors.saffron} />
                  ))}
                </View>
              </View>
            </View>
            <View style={styles.cookAgainBadge}>
              <Text style={styles.cookAgainText}>Cook again</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      {/* Floating scan button */}
      <Pressable
        style={styles.fab}
        onPress={() => router.push('/camera')}
      >
        <MingCuteIcon name="camera_2_fill" size={18} color={Colors.white} />
        <Text style={styles.fabText}>Scan again</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    paddingBottom: 16,
  },
  headerLeft: {
    gap: 1,
  },
  dateText: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    color: Colors.textMuted,
  },
  greeting: {
    fontFamily: FontFamily.bold,
    fontSize: 22,
    color: Colors.textPrimary,
    letterSpacing: -0.66,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: FontFamily.bold,
    fontSize: 16,
    color: Colors.white,
  },
  promoBg: {
    borderRadius: 16,
    marginBottom: 16,
  },
  promoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    gap: 16,
  },
  promoIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  promoText: {
    flex: 1,
    gap: 2,
  },
  promoTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 15,
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  promoSub: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    color: Colors.promoText,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 12,
  },
  sectionTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 18,
    color: Colors.textPrimary,
    letterSpacing: -0.54,
  },
  seeAll: {
    fontFamily: FontFamily.bold,
    fontSize: 13,
    color: Colors.primary,
  },
  recipeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 14,
    paddingLeft: 10,
    paddingRight: 14,
    paddingVertical: 10,
    gap: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  recipeThumbnail: {
    width: 72,
    height: 72,
    borderRadius: 10,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recipeInfo: {
    flex: 1,
    gap: 4,
  },
  recipeName: {
    fontFamily: FontFamily.bold,
    fontSize: 15,
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  recipeMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  recipeTime: {
    fontFamily: FontFamily.medium,
    fontSize: 11,
    color: Colors.textMuted,
  },
  recipeDot: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    color: '#999',
  },
  starsRow: {
    flexDirection: 'row',
    gap: 1,
  },
  cookAgainBadge: {
    backgroundColor: '#F5FCF0',
    borderWidth: 1,
    borderColor: '#D9F2D1',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  cookAgainText: {
    fontFamily: FontFamily.bold,
    fontSize: 11,
    color: Colors.primary,
  },
  fab: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    borderRadius: 32,
    paddingLeft: 18,
    paddingRight: 20,
    paddingVertical: 14,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  fabText: {
    fontFamily: FontFamily.bold,
    fontSize: 14,
    color: Colors.white,
  },
});
