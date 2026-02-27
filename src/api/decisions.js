import { api } from './client.js'

export const decisionsApi = {
  getLog() {
    return api.get('/decisions')
  },

  /**
   * POST /api/decisions/run
   * @param {'invoice' | 'support'} scenarioId
   */
  run(scenarioId) {
    return api.post('/decisions/run', { scenarioId })
  },
}
