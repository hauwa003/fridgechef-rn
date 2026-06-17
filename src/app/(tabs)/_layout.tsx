import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors';
import { FontFamily } from '../../constants/Typography';
import MingCuteIcon from '../../components/MingCuteIcon';

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
            <MingCuteIcon
              name={focused ? 'home_4_fill' : 'home_4_line'}
              size={22}
              color={focused ? Colors.primary : Colors.textMuted}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="recipes"
        options={{
          title: 'RECIPES',
          tabBarIcon: ({ focused }) => (
            <MingCuteIcon
              name={focused ? 'book_2_fill' : 'book_2_line'}
              size={22}
              color={focused ? Colors.primary : Colors.textMuted}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'SETTINGS',
          tabBarIcon: ({ focused }) => (
            <MingCuteIcon
              name={focused ? 'settings_3_fill' : 'settings_3_line'}
              size={22}
              color={focused ? Colors.primary : Colors.textMuted}
            />
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
});
