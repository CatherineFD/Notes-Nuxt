const isClient = () => typeof window !== 'undefined'

export function storageGet<T>(key: string, fallback: T): T {
  if (!isClient()) return fallback

  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function storageSet<T>(key: string, value: T): void {
  if (!isClient()) return

  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.warn(`[storage] Failed to set "${key}":`, error)
  }
}

export function storageRemove(key: string): void {
  if (!isClient()) return

  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.warn(`[storage] Failed to remove "${key}":`, error)
  }
}