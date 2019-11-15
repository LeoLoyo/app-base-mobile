import { useState, useEffect, useContext } from 'react'
import PropTypes from 'prop-types'
import _isObject from 'lodash/isObject'
import { FirebaseScheduleContext } from '../FirebaseSchedule'

function FirebaseMarkersPlayerLive ({ isLive, children }) {
  const [markers, setMarkers] = useState({})
  const context = useContext(FirebaseScheduleContext)

  useEffect(() => {
    try {
      if (context && isLive) {
        context.on('value', snapshot => {
          const _response = snapshot.toJSON()
          if (_isObject(_response)) {
            const { opta: { match_data: matchData } = {}, ...otherData } = _response
            if (_isObject(matchData)) {
              const _markers = { ...matchData, ...otherData }
              setMarkers(_markers)
            }
          }
        })
      }
    } catch (error) {
      context && context.off('value')
    }
    return () => {
      return context && isLive && context.off('value')
    }
  }, [])
  return children({ markers })
}

FirebaseMarkersPlayerLive.propTypes = {
  children: PropTypes.any
}

export default FirebaseMarkersPlayerLive
