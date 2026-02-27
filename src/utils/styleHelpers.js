import { C } from './theme.js'

export const STALE_STYLE = {
  fresh:    { bg: C.greenLight,  border: C.greenBorder,  text: C.green  },
  aging:    { bg: C.amberLight,  border: C.amberBorder,  text: C.amber  },
  stale:    { bg: C.redLight,    border: C.redBorder,    text: C.red    },
  archived: { bg: '#F9FAFB',     border: C.border,       text: C.inkTertiary },
}

export const IMPACT_STYLE = {
  critical: { bg: C.redLight,    border: C.redBorder,    text: C.red    },
  high:     { bg: C.amberLight,  border: C.amberBorder,  text: C.amber  },
  medium:   { bg: C.brandLight,  border: C.brandBorder,  text: C.brand  },
  low:      { bg: '#F9FAFB',     border: C.border,       text: C.inkTertiary },
}
