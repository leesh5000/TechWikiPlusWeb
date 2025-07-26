import { spacing, typography, animation, borderRadius, shadows, zIndex } from './design-tokens'

// Spacing utility functions
export const getSpacing = (size: keyof typeof spacing) => spacing[size]

// Typography utility functions
export const getFontSize = (size: keyof typeof typography.fontSize) => typography.fontSize[size]
export const getFontWeight = (weight: keyof typeof typography.fontWeight) => typography.fontWeight[weight]
export const getLineHeight = (height: keyof typeof typography.lineHeight) => typography.lineHeight[height]
export const getLetterSpacing = (spacing: keyof typeof typography.letterSpacing) => typography.letterSpacing[spacing]

// Animation utility functions
export const getDuration = (duration: keyof typeof animation.duration) => animation.duration[duration]
export const getEasing = (easing: keyof typeof animation.easing) => animation.easing[easing]

// Border radius utility functions
export const getBorderRadius = (radius: keyof typeof borderRadius) => borderRadius[radius]

// Shadow utility functions
export const getShadow = (shadow: keyof typeof shadows) => shadows[shadow]

// Z-index utility functions
export const getZIndex = (level: keyof typeof zIndex) => zIndex[level]

// CSS variable generators
export const generateCSSVariables = () => {
  const variables: Record<string, string> = {}

  // Spacing variables
  Object.entries(spacing).forEach(([key, value]) => {
    variables[`--spacing-${key}`] = value
  })

  // Typography variables
  Object.entries(typography.fontSize).forEach(([key, value]) => {
    variables[`--font-size-${key}`] = value
  })
  Object.entries(typography.fontWeight).forEach(([key, value]) => {
    variables[`--font-weight-${key}`] = value.toString()
  })
  Object.entries(typography.lineHeight).forEach(([key, value]) => {
    variables[`--line-height-${key}`] = value.toString()
  })
  Object.entries(typography.letterSpacing).forEach(([key, value]) => {
    variables[`--letter-spacing-${key}`] = value
  })

  // Animation variables
  Object.entries(animation.duration).forEach(([key, value]) => {
    variables[`--duration-${key}`] = value
  })

  // Border radius variables
  Object.entries(borderRadius).forEach(([key, value]) => {
    variables[`--radius-${key}`] = value
  })

  // Z-index variables
  Object.entries(zIndex).forEach(([key, value]) => {
    variables[`--z-${key}`] = value.toString()
  })

  return variables
}

// Responsive utility function
export const responsive = (
  mobile: string,
  tablet?: string,
  desktop?: string,
  largeDesktop?: string
) => {
  let classes = mobile
  if (tablet) classes += ` md:${tablet}`
  if (desktop) classes += ` lg:${desktop}`
  if (largeDesktop) classes += ` xl:${largeDesktop}`
  return classes
}

// Animation class generator
export const getAnimationClass = (
  animation: string,
  duration: keyof typeof animation.duration = 'normal',
  easing: keyof typeof animation.easing = 'easeInOut'
) => {
  return `${animation} duration-${duration} ${easing}`
}