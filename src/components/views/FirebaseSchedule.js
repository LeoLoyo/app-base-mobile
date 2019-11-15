import React, { createContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import firebase from 'react-native-firebase'
import { withApollo } from 'react-apollo'

export const FirebaseScheduleContext = createContext()

function FirebaseSchedule ({ children, refetch, scheduleId, client }) {
  const [scheduleCurrentRef] = useState(firebase.database().ref(`schedules/${scheduleId}`))
  const refetchCurry = (snapshot) => {
    try {
      if (['date_end', 'date_start'].includes(snapshot.key)) {
        refetch({})
        return client.reFetchObservableQueries()
      }
      return false
    } catch (err) {
      return err
    }
  }

  useEffect(() => {
    if (scheduleCurrentRef && refetch) {
      scheduleCurrentRef.once('value', (snapshot) => {
        if (!snapshot) return
        const scheduleValid = snapshot.hasChild('date_end') && snapshot.hasChild('date_start')
        if (scheduleValid) {
          scheduleCurrentRef.on('child_removed', refetchCurry)
        } else {
          scheduleCurrentRef.off('value')
          scheduleCurrentRef.off('child_added')
          scheduleCurrentRef.off('child_removed')
          scheduleCurrentRef.off('child_changed')
          scheduleCurrentRef.off('child_moved')
        }
      })
    }
    return () => {
      return scheduleCurrentRef && scheduleCurrentRef.off('child_removed')
    }
  }, [])
  return (
    <FirebaseScheduleContext.Provider value={scheduleCurrentRef}>
      {children}
    </FirebaseScheduleContext.Provider>
  )
}

FirebaseSchedule.propTypes = {
  children: PropTypes.any,
  refetch: PropTypes.func.isRequired,
  scheduleId: PropTypes.string.isRequired,
  client: PropTypes.object
}

export default withApollo(FirebaseSchedule)
