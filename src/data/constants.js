export const MEMORY_TYPES = {
  EPISODIC:   'episodic',
  SEMANTIC:   'semantic',
  PROCEDURAL: 'procedural',
  WORKING:    'working',
}

export const STALENESS = {
  FRESH:    'fresh',
  AGING:    'aging',
  STALE:    'stale',
  ARCHIVED: 'archived',
}

export const IMPACT_LEVELS = ['critical', 'high', 'medium', 'low']

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'memories',  label: 'Memory Store' },
  { id: 'decision',  label: 'Decision Engine' },
  { id: 'inspector', label: 'Inspector' },
  { id: 'add',       label: 'Add Memory' },
  { id: 'analytics', label: 'Analytics' },
]

export const ENGINE_STEPS = [
  'Scanning entity memory index',
  'Applying temporal decay weights',
  'Computing relational proximity',
  'Resolving conflicting signals',
  'Synthesizing decision context',
  'Generating recommendation',
]
