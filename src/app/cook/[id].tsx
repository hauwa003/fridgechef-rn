import { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Spacing, Radii } from '../../constants/Spacing';
import { Button } from '../../components/ui/Button';
import { TopBar } from '../../components/ui/TopBar';
import { mockRecipes } from '../../data/mock';

export default function CookModeScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const recipe = mockRecipes.find((r) => r.id === id) ?? mockRecipes[0];
  const [currentStep, setCurrentStep] = useState(0);
  const step = recipe.steps[currentStep];
  const isLastStep = currentStep === recipe.steps.length - 1;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <TopBar title="Cook Mode" />

      <View style={styles.content}>
        {/* Progress */}
        <View style={styles.progress}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${((currentStep + 1) / recipe.steps.length) * 100}%` },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            Step {currentStep + 1} of {recipe.steps.length}
          </Text>
        </View>

        {/* Step card */}
        <View style={styles.stepCard}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>{step.number}</Text>
          </View>
          <Text style={styles.stepTitle}>{step.title}</Text>
          <Text style={styles.stepDescription}>{step.description}</Text>
          {step.duration && (
            <View style={styles.duration}>
              <Text style={styles.durationText}>⏱️ {step.duration}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Navigation */}
      <View style={styles.footer}>
        <View style={styles.footerButtons}>
          {currentStep > 0 && (
            <Button
              title="Previous"
              variant="secondary"
              onPress={() => setCurrentStep((s) => s - 1)}
              style={styles.halfButton}
            />
          )}
          <Button
            title={isLastStep ? 'Finish' : 'Next Step'}
            onPress={() => {
              if (isLastStep) {
                router.replace('/completion');
              } else {
                setCurrentStep((s) => s + 1);
              }
            }}
            style={currentStep > 0 ? styles.halfButton : undefined}
          />
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
  content: {
    flex: 1,
    padding: Spacing.xl,
    gap: Spacing.xxl,
  },
  progress: {
    gap: Spacing.sm,
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  progressText: {
    ...Typography.caption,
    color: Colors.textTertiary,
    textAlign: 'center',
  },
  stepCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.xxl,
    gap: Spacing.lg,
    alignItems: 'center',
  },
  stepNumber: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    ...Typography.h3,
    color: Colors.white,
  },
  stepTitle: {
    ...Typography.h2,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  stepDescription: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  duration: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.background,
    borderRadius: Radii.full,
  },
  durationText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  footerButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  halfButton: {
    flex: 1,
  },
});
