export interface LevelInfo {
  level: number
  points: number
  currentLevelPoints: number
  nextLevelPoints: number
  progress: number
}

const LEVEL_THRESHOLDS: number[] = []
for (let n = 1; n <= 10; n++) {
  LEVEL_THRESHOLDS.push(100 * n * (n - 1) / 2)
}

export function getLevelInfo(createdAt?: string): LevelInfo {
  if (!createdAt) {
    return { level: 1, points: 0, currentLevelPoints: 0, nextLevelPoints: 100, progress: 0 }
  }

  const created = new Date(createdAt).getTime()
  const now = Date.now()
  const elapsedMinutes = Math.floor((now - created) / 60000)
  const points = Math.floor(elapsedMinutes / 5)

  let level = 1
  for (let i = 1; i < LEVEL_THRESHOLDS.length; i++) {
    if (points >= LEVEL_THRESHOLDS[i]) level = i + 1
    else break
  }

  const currentLevelPoints = LEVEL_THRESHOLDS[level - 1]
  const nextLevelPoints = level >= 10 ? LEVEL_THRESHOLDS[9] : LEVEL_THRESHOLDS[level]
  const progress = level >= 10
    ? 100
    : ((points - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)) * 100

  return { level, points, currentLevelPoints, nextLevelPoints, progress: Math.min(100, Math.max(0, progress)) }
}
