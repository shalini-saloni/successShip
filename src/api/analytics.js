import { api } from './client.js'

export const analyticsApi = {
  get() {
    return api.get('/analytics')
  },
}
