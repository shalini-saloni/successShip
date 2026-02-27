import { useState, useCallback, useEffect } from 'react'
import { SEED_MEMORIES } from '../data/memories.js'
import { STALENESS } from '../data/constants.js'
import { memoriesApi } from '../api/memories.js'

export function useMemories() {
  const [memories, setMemories]   = useState(SEED_MEMORIES) 
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState(null)
  const [apiMode, setApiMode]     = useState(false) 

  const fetchAll = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await memoriesApi.getAll()
      setMemories(res.data)
      setApiMode(true)
    } catch (e) {
      console.warn('[useMemories] API unavailable, using seed data.', e.message)
      setApiMode(false)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  const addMemory = useCallback(async (formData) => {
    const payload = {
      entity:   formData.entity,
      type:     formData.type     || 'episodic',
      category: formData.category || '',
      title:    formData.title,
      content:  formData.content,
      impact:   formData.impact   || 'medium',
      staleness:'fresh',
      weight:   parseFloat(formData.weight) || 0.8,
      daysAgo:  0,
      date:     new Date().toISOString().split('T')[0],
      tags:     formData.tags
        ? formData.tags.split(',').map(t => t.trim()).filter(Boolean)
        : [],
      relatedIds:   [],
      emotionalFlag: false,
    }

    if (apiMode) {
      try {
        const res = await memoriesApi.create(payload)
        setMemories(prev => [res.data, ...prev])
        return res.data
      } catch (e) {
        setError(e.message)
        throw e
      }
    } else {
      const local = { ...payload, id: `m${Date.now()}`, staleness: STALENESS.FRESH }
      setMemories(prev => [local, ...prev])
      return local
    }
  }, [apiMode])

  const deleteMemory = useCallback(async (id) => {
    setMemories(prev => prev.filter(m => m.id !== id))

    if (apiMode) {
      try {
        await memoriesApi.remove(id)
      } catch (e) {
        await fetchAll()
        setError(e.message)
      }
    }
  }, [apiMode, fetchAll])

  const getByIds = useCallback(
    (ids) => memories.filter(m => ids.includes(m.id)),
    [memories]
  )

  const entities = [...new Set(memories.map(m => m.entity))]

  return {
    memories,
    loading,
    error,
    apiMode,
    addMemory,
    deleteMemory,
    getByIds,
    refresh: fetchAll,
    entities,
  }
}
