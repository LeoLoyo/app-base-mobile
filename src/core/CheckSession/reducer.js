import firebase from 'react-native-firebase'
import * as ACTIONS from './actions'

export default function reducer (state = {}, action) {
  switch (action.type) {
    case ACTIONS.LOGIN:
      return { sessionActived: true }
    case ACTIONS.LOGOUT:
      firebase.database().ref(`sessions/${action.payload}`).off('value')
      return { sessionActived: false }
    default:
      return state
  }
}
