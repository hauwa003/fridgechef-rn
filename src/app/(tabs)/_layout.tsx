import { Tabs } from 'expo-router';
import { Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors';
import { FontFamily } from '../../constants/Typography';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'HOME',
          tabBarIcon: ({ focused }) => (
            <Text style={[styles.icon, !focused && styles.iconInactive]}>🏠</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="recipes"
        options={{
          title: 'RECIPES',
          tabBarIcon: ({ focused }) => (
            <Text style={[styles.icon, !focused && styles.iconInactive]}>📖</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'SETTINGS',
          tabBarIcon: ({ focused }) => (
            <Text style={[styles.icon, !focused && styles.iconInactive]}>⚙️</Text>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.white,
    borderTopColor: Colors.borderDark,
    height: 88,
    paddingTop: 12,
    paddingHorizontal: 16,
  },
  tabLabel: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    letterSpacing: 0.2,
  },
  icon: {
    fontSize: 22,
  },
  iconInactive: {
    opacity: 0.5,
  },
});
