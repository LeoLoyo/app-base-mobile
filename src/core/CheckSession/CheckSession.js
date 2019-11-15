import React, { useEffect, useReducer } from 'react'
import PropsTypes from 'prop-types'
import _isFunction from 'lodash/isFunction'
import firebase from 'react-native-firebase'

import { getFromStorage } from '../Auth'
import reducer from './reducer'
import * as ACTIONS from './actions'
import { logout } from '../utils/auth'

export const CheckSessionContext = React.createContext({ })

export function subcribeSession (context) {
  if (!context) return
  const { sessionUserDispatch } = context
  return _isFunction(sessionUserDispatch) && sessionUserDispatch({ type: ACTIONS.LOGIN })
}

export async function unSubcribeSession (context) {
  if (!context) return
  const { sessionUserDispatch } = context
  const sessionId = await getFromStorage('session_id')
  return _isFunction(sessionUserDispatch) && sessionUserDispatch({ type: ACTIONS.LOGOUT, payload: sessionId })
}

function CheckSession ({ action, children }) {
  const [sessionState, sessionUserDispatch] = useReducer(reducer, {})

  async function getSessionId () {
    const sessionId = await getFromStorage('session_id')
    return sessionId
  }

  useEffect(() => {
    getSessionId()
      .then((sessionId) => {
        const { sessionActived = false } = sessionState
        if (!sessionId && !sessionActived) return

        if (sessionId) {
          firebase.database().ref(`sessions/${sessionId}`).on('value', async (snapshot) => {
            if (!snapshot.val() && (snapshot.key === sessionId)) {
              await logout()
              action && action()
            }
          })
        }
      })
      .catch(err => err)
  }, [sessionState])

  return (
    <CheckSessionContext.Provider value={{ sessionUserDispatch }}>
      {children}
    </CheckSessionContext.Provider>
  )
}

CheckSession.propTypes = {
  action: PropsTypes.func,
  apollo: PropsTypes.object,
  children: PropsTypes.any
}

export default CheckSession
