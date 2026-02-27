import { api } from './client.js'

export const memoriesApi = {
  getAll(params = {}) {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v != null && v !== '')
    ).toString()
    return api.get(`/memories${qs ? `?${qs}` : ''}`)
  },

  getById(id) {
    return api.get(`/memories/${id}`)
  },

  /**
   * POST /api/memories
   * @param {{ entity, title, content, type, category?, impact?,
   *           staleness?, weight?, tags?, relatedIds?, emotionalFlag? }} data
   */
  create(data) {
    return api.post('/memories', data)
  },

  update(id, data) {
    return api.put(`/memories/${id}`, data)
  },

  remove(id) {
    return api.delete(`/memories/${id}`)
  },
}
