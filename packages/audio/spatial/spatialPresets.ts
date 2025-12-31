import type { SpatialStrength } from './spatialTypes'

export const SpatialStrengthPreset: Record<
  SpatialStrength,
  { radius: number; elevation: number }
> = {
  weak: {
    radius: 0.6,
    elevation: 0.1
  },
  medium: {
    radius: 1.5,
    elevation: 0.3
  },
  strong: {
    radius: 3,
    elevation: 0.6
  }
}