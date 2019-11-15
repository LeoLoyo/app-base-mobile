import React from 'react'
import PropTypes from 'prop-types'
import _merge from 'lodash/merge'

import List from '../List'
import ListItemNotification from './ListItemNotification'
import { CustomComponentProvider } from '../../../core/withCustomComponent'

class NotificationComponent extends React.PureComponent {
  renderItem = ({ index, item = {} }) => {
    const { listProps: { itemProps = {}, itemComponentProps = {}, ...otherProps } } = this.props
    return (<CustomComponentProvider {...otherProps} components={['ItemComponent']} >
      {
        ({ ItemComponent }) => {
          if (ItemComponent) {
            return <ItemComponent
              index={index}
              data={item}
              {...item}
              {...itemProps} />
          }
          return <ListItemNotification
            index={++index}
            data={item}
            {...itemProps}
            itemComponentProps={itemComponentProps} />
        }
      }
    </CustomComponentProvider>)
  }

  _buildProps = () => _merge({},
    defaultPropsList,
    this.props.listProps, {
      optionalProps: {
        renderItem: this.renderItem
      }
    })

  render () {
    const { data } = this.props
    return <List {...this._buildProps()} data={data} />
  }
}
const defaultPropsList = {
  optionalProps: {
    removeClippedSubviews: false,
    showsVerticalScrollIndicator: false
  }
}

NotificationComponent.propTypes = {
  listProps: PropTypes.shape({
    ItemComponent: PropTypes.string,
    SeparatorComponent: PropTypes.string,
    separatorProps: PropTypes.object,
    optionalProps: PropTypes.shape({
      removeClippedSubviews: PropTypes.bool,
      showsVerticalScrollIndicator: PropTypes.bool
    }),
    itemProps: PropTypes.object,
    itemComponentProps: PropTypes.object
  }),
  data: PropTypes.any
}
NotificationComponent.defaultProps = {
  listProps: defaultPropsList
}

export default NotificationComponent
