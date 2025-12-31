import type { SpatialMode } from './spatialTypes'

export function getPositionByTime(
  mode: SpatialMode,
  t: number,
  period: number,
  radius: number,
  elevation: number
) {
  const progress = (t % period) / period
  const angle = progress * Math.PI * 2

  switch (mode) {
    case 'left-to-right':
      return {
        x: Math.cos(angle) * radius,
        y: 0,
        z: 0
      }

    case 'right-to-left':
      return {
        x: -Math.cos(angle) * radius,
        y: 0,
        z: 0
      }

    case 'circle':
      return {
        x: Math.cos(angle) * radius,
        y: elevation,
        z: Math.sin(angle) * radius
      }

    case 'front-back':
      return {
        x: 0,
        y: 0,
        z: Math.cos(angle) * radius
      }
  }
}