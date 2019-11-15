import React from 'react'
import PropTypes from 'prop-types'
import _get from 'lodash/get'
import NotificationMatch from './components/NotificationMatch'
import NotificationShow from './components/NotificationShow'

const ListItemNotification = ({
  data,
  itemComponentProps
}) => {
  // Checking if the notification is match or program
  const extraData = _get(data, 'extraData', {})
  return (
    extraData.renderType === 'sports'
      ? <NotificationMatch
        data={data}
        itemComponentProps={itemComponentProps} />
      : <NotificationShow
        data={data}
        itemComponentProps={itemComponentProps} />
  )
}

ListItemNotification.propTypes = {
  data: PropTypes.object,
  itemComponentProps: PropTypes.object
}

export default ListItemNotification
