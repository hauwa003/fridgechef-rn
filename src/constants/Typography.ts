import { TextStyle } from 'react-native';

export const FontFamily = {
  bold: 'NunitoSans_700Bold',
  semiBold: 'NunitoSans_600SemiBold',
  medium: 'NunitoSans_500Medium',
  regular: 'NunitoSans_400Regular',
} as const;

export const Typography: Record<string, TextStyle> = {
  h1: {
    fontFamily: FontFamily.bold,
    fontSize: 28,
    lineHeight: 36,
  },
  h2: {
    fontFamily: FontFamily.bold,
    fontSize: 24,
    lineHeight: 32,
  },
  h3: {
    fontFamily: FontFamily.semiBold,
    fontSize: 20,
    lineHeight: 28,
  },
  subtitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: 17,
    lineHeight: 24,
  },
  body: {
    fontFamily: FontFamily.medium,
    fontSize: 15,
    lineHeight: 22,
  },
  bodySmall: {
    fontFamily: FontFamily.medium,
    fontSize: 13,
    lineHeight: 18,
  },
  caption: {
    fontFamily: FontFamily.semiBold,
    fontSize: 12,
    lineHeight: 16,
  },
  button: {
    fontFamily: FontFamily.bold,
    fontSize: 17,
    lineHeight: 24,
  },
  tabLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: 11,
    lineHeight: 14,
  },
};
