import { useState, useCallback, useRef } from 'react'
import { ENGINE_STEPS } from '../data/constants.js'

export function useDecisionEngine() {
  const [phase, setPhase] = useState('idle') 
  const [step, setStep] = useState(0)
  const timerRef = useRef(null)

  const run = useCallback(() => {
    setPhase('loading')
    setStep(0)
    let i = 0
    timerRef.current = setInterval(() => {
      i += 1
      setStep(i)
      if (i >= ENGINE_STEPS.length) {
        clearInterval(timerRef.current)
        setTimeout(() => setPhase('done'), 400)
      }
    }, 480)
  }, [])

  const reset = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    setPhase('idle')
    setStep(0)
  }, [])

  return { phase, step, run, reset, steps: ENGINE_STEPS }
}
