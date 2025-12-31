export type SpatialMode =
  | 'left-to-right'
  | 'right-to-left'
  | 'circle'
  | 'front-back'

export type SpatialStrength = 'weak' | 'medium' | 'strong'

export interface SpatialOptions {
  mode: SpatialMode
  strength: SpatialStrength
  period: number // 秒，>= 3
}
