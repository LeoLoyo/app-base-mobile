import React from 'react'
import PropTypes from 'prop-types'
import _merge from 'lodash/merge'

import List from '../List'
import ListItemSchedule from './ListItemSchedule'
import { CustomComponentProvider } from '../../../core/withCustomComponent'
import { MutationScheduleProfile } from '../../graph'

class ListSchedules extends React.PureComponent {
  renderItem = ({index, item = {}}) => {
    const { listProps: { horizontal, itemProps = {}, itemComponentProps = {}, ...otherProps } } = this.props
    return (<CustomComponentProvider {...otherProps} components={['ItemComponent']}>
      {
        ({ItemComponent}) => {
          if (ItemComponent) {
            return <ItemComponent
              index={index}
              data={item}
              {...item}
              {...itemProps}
              mutation={MutationScheduleProfile}
              onPress={this.props.onPress}/>
          }
          return <ListItemSchedule
            index={++index}
            data={item}
            horizontalList={horizontal}
            {...itemProps}
            mutation={MutationScheduleProfile}
            itemComponentProps={itemComponentProps}
            onPress={this.props.onPress}/>
        }
      }
    </CustomComponentProvider>)
  }

  _buildProps = () => _merge({},
    defaultPropsList,
    this.props.listProps, {
      optionalProps: {
        renderItem: this.renderItem
      }})

  render () {
    const { data } = this.props
    return <List {...this._buildProps()} data={data} />
  }
}
const defaultPropsList = {
  horizontal: true,
  optionalProps: {
    removeClippedSubviews: false,
    showsHorizontalScrollIndicator: false
  }
}

ListSchedules.propTypes = {
  listProps: PropTypes.shape({
    horizontal: PropTypes.bool,
    ItemComponent: PropTypes.string,
    SeparatorComponent: PropTypes.string,
    optionalProps: PropTypes.shape({
      removeClippedSubviews: PropTypes.bool,
      showsHorizontalScrollIndicator: PropTypes.bool
    }),
    itemProps: PropTypes.object,
    itemComponentProps: PropTypes.object
  }),
  onPress: PropTypes.func.isRequired,
  data: PropTypes.array
}
ListSchedules.defaultProps = {
  listProps: defaultPropsList
}

export default ListSchedules
