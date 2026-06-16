import { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { FontFamily } from '../../constants/Typography';
import { mockRecipes } from '../../data/mock';

export default function CookModeScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const recipe = mockRecipes.find((r) => r.id === id) ?? mockRecipes[0];
  const [currentStep, setCurrentStep] = useState(0);
  const step = recipe.steps[currentStep];
  const isLastStep = currentStep === recipe.steps.length - 1;
  const isFirstStep = currentStep === 0;
  const stepLabels = ['FIRST STEP', 'WHILE WATER HEATS', 'COOKING', 'COOKING', 'FINAL STEP', 'PLATING'];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <View style={styles.nav}>
          <Pressable style={styles.navButton} onPress={() => router.back()}>
            <Text style={styles.navButtonText}>✕</Text>
          </Pressable>
          <View style={styles.stepPill}>
            <Text style={styles.stepPillText}>Step {currentStep + 1} of {recipe.steps.length}</Text>
          </View>
          <Pressable style={styles.navButton}>
            <Text style={styles.navButtonEmoji}>🔊</Text>
          </Pressable>
        </View>

        {/* Progress bar segments */}
        <View style={styles.progressRow}>
          {recipe.steps.map((_, i) => (
            <View
              key={i}
              style={[
                styles.progressSegment,
                i <= currentStep && styles.progressActive,
              ]}
            />
          ))}
        </View>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.stepLabel}>
          <Text style={styles.stepLabelText}>
            {isFirstStep ? 'FIRST STEP' : isLastStep ? 'FINAL STEP' : 'COOKING'}
          </Text>
          <Text style={styles.stepNumber}>{step.number}</Text>
        </View>

        <Text style={styles.stepTitle}>{step.description}</Text>

        {/* Tip card */}
        <View style={styles.tipCard}>
          <Text style={styles.tipEmoji}>💡</Text>
          <Text style={styles.tipText}>
            {step.duration ? `This step takes about ${step.duration}.` : 'Follow the recipe closely for best results.'}
          </Text>
        </View>

        {/* Step photo placeholder */}
        <View style={styles.photoPlaceholder}>
          <Text style={styles.photoLabel}>STEP PHOTO</Text>
          <Text style={styles.photoEmoji}>🍳</Text>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerActions}>
          <View style={styles.footerAction}>
            <Text style={styles.actionEmoji}>📋</Text>
            <Text style={styles.actionText}>Show ingredients</Text>
          </View>
          <View style={styles.footerAction}>
            <Text style={styles.actionEmoji}>✨</Text>
            <Text style={styles.actionTextGold}>What's this?</Text>
          </View>
        </View>

        <View style={styles.footerButtons}>
          <Pressable
            style={[styles.prevButton, isFirstStep && styles.prevButtonDisabled]}
            onPress={() => !isFirstStep && setCurrentStep((s) => s - 1)}
          >
            <Text style={styles.prevButtonText}>←</Text>
          </Pressable>
          <Pressable
            style={styles.nextStepButton}
            onPress={() => {
              if (isLastStep) {
                router.replace('/completion');
              } else {
                setCurrentStep((s) => s + 1);
              }
            }}
          >
            <Text style={styles.nextStepText}>
              {isLastStep ? 'Finish cooking' : 'Next step'}
            </Text>
            <Text style={styles.nextStepArrow}>→</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  topBar: {
    backgroundColor: Colors.white,
    paddingBottom: 16,
  },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonText: {
    fontSize: 16,
    color: Colors.textDark,
  },
  navButtonEmoji: {
    fontSize: 16,
  },
  stepPill: {
    backgroundColor: Colors.primaryLight,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  stepPillText: {
    fontFamily: FontFamily.bold,
    fontSize: 13,
    color: Colors.primary,
    letterSpacing: -0.26,
  },
  progressRow: {
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  progressSegment: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.progressInactive,
  },
  progressActive: {
    backgroundColor: Colors.primary,
  },
  content: {
    flex: 1,
    padding: 24,
    gap: 20,
    paddingBottom: 24,
  },
  stepLabel: {},
  stepLabelText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 11,
    color: Colors.saffronDark,
    letterSpacing: 0.88,
    marginBottom: -8,
  },
  stepNumber: {
    fontFamily: FontFamily.bold,
    fontSize: 80,
    color: Colors.primary,
    letterSpacing: -4.8,
    lineHeight: 84,
  },
  stepTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 24,
    color: Colors.textPrimary,
    letterSpacing: -0.72,
    lineHeight: 32,
  },
  tipCard: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: Colors.blueBg,
    borderWidth: 1,
    borderColor: Colors.blueBorder,
    borderRadius: 12,
    padding: 14,
  },
  tipEmoji: {
    fontSize: 14,
  },
  tipText: {
    flex: 1,
    fontFamily: FontFamily.medium,
    fontSize: 13,
    color: Colors.blueText,
    lineHeight: 18,
  },
  photoPlaceholder: {
    height: 220,
    borderRadius: 16,
    backgroundColor: '#FAF0D1',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  photoLabel: {
    position: 'absolute',
    top: 14,
    left: 14,
    fontFamily: FontFamily.semiBold,
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 0.6,
  },
  photoEmoji: {
    fontSize: 64,
  },
  footer: {
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.borderDark,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 12,
  },
  footerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionEmoji: {
    fontSize: 14,
  },
  actionText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 13,
    color: Colors.textDark,
  },
  actionTextGold: {
    fontFamily: FontFamily.semiBold,
    fontSize: 13,
    color: Colors.saffronDark,
  },
  footerButtons: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  prevButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.surfacePressed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  prevButtonDisabled: {
    opacity: 0.4,
  },
  prevButtonText: {
    fontSize: 22,
    color: Colors.textMuted,
  },
  nextStepButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    borderRadius: 28,
    paddingVertical: 18,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  nextStepText: {
    fontFamily: FontFamily.bold,
    fontSize: 17,
    color: Colors.white,
    letterSpacing: -0.34,
  },
  nextStepArrow: {
    fontSize: 18,
    color: Colors.white,
  },
});
