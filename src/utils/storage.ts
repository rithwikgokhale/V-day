const STORAGE_KEY = 'vday-selection'

export type StoredSelection = {
  orderedPickIds: string[]
  orderedPickLabels: string[]
  timestamp: number
}

export function readStoredSelection(): StoredSelection | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return null
    }

    const parsed = JSON.parse(raw) as Partial<StoredSelection>
    if (
      !Array.isArray(parsed.orderedPickIds) ||
      !Array.isArray(parsed.orderedPickLabels) ||
      typeof parsed.timestamp !== 'number'
    ) {
      return null
    }

    return {
      orderedPickIds: parsed.orderedPickIds.filter((value) => typeof value === 'string'),
      orderedPickLabels: parsed.orderedPickLabels.filter((value) => typeof value === 'string'),
      timestamp: parsed.timestamp,
    }
  } catch {
    return null
  }
}

export function saveStoredSelection(value: StoredSelection): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
}

export function clearStoredSelection(): void {
  window.localStorage.removeItem(STORAGE_KEY)
}
