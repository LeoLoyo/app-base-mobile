import { clearAccessToken, clearTimeLimit } from '../Auth'
export const logout = async () => Promise.all([clearAccessToken(), clearTimeLimit()])
