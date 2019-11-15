
import React from 'react'
import PropTypes from 'prop-types'
import {get, map, defaultsDeep, size} from 'lodash'
import {withNavigation} from 'react-navigation'

import * as COMPONENTS from '../../components'

class Component extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      current: null,
      isFirstElement: true,
      isLastElement: true,
      data: []
    }
    this.loadData = this.loadData.bind(this)

    this.masterActions = {
      loadData: this.loadData
    }
  }

  componentDidMount () {
    const { navigation: router } = this.props
    this.setState({
      current: get(router, 'state.params._id')
    })
  }

  renderSection (component, inheritedProps) {
    const renderComponent = get(this.props, component)
    if (renderComponent) {
      const Component = get(COMPONENTS, renderComponent.name)
      if (typeof Component === 'function') {
        const props = defaultsDeep({}, renderComponent.props, inheritedProps)
        return (
          <Component {...props} />
        )
      }
    }
    return null
  }

  onSlaveClick (params, callback) {
    this.setState({ current: params._id })

    if (typeof callback === 'function') {
      callback(params)
    }
  }

  isSlaveActive (itemId) {
    return this.state.current === itemId
  }

  loadData (data) {
    const mediasById = map(data, '_id')
    const currentIndex = mediasById.findIndex((i) => i === this.state.current)
    this.setState({
      data,
      isFirstElement: currentIndex === 0,
      isLastElement: currentIndex === size(mediasById)
    })
  }

  handleArrows (direction) {
    const mediasById = map(this.state.data, '_id')
    const currentIndex = mediasById.findIndex((i) => i === this.state.current)
    if (currentIndex >= 0 && currentIndex <= size(mediasById)) {
      const nextIndex = (direction === 'left') ? currentIndex - 1 : currentIndex + 1
      const nextMedia = mediasById[nextIndex]
      this.setState({
        current: nextMedia,
        isFirstElement: nextIndex === 0,
        isLastElement: nextIndex === (size(mediasById) - 1)
      })
    }
  }

  onNextClick () {
    return !this.state.isLastElement && this.handleArrows('right')
  }

  onBackClick () {
    return !this.state.isFirstElement && this.handleArrows('left')
  }

  render () {
    const {current, isFirstElement, isLastElement} = this.state
    return current && (
      <COMPONENTS.Screen
        className={this.props.className}
        backButton={this.props.backButton}
        closeButton={this.props.closeButton}>
        {this.renderSection('MasterComponent', {
          current: current,
          onNextClick: () => this.onNextClick(),
          onBackClick: () => this.onBackClick(),
          isFirstElement,
          isLastElement,
          showControls: true
        })
        }
        {this.renderSection('SlaveComponent', {
          parentProps: {
            onPress: (params, cb) => this.onSlaveClick(params, cb),
            isActive: (itemId) => this.isSlaveActive(itemId),
            loadData: this.loadData
          }
        })}
      </COMPONENTS.Screen>
    )
  }
}

Component.propTypes = {
  backButton: PropTypes.object,
  className: PropTypes.string,
  closeButton: PropTypes.object,
  children: PropTypes.array,
  client: PropTypes.object,
  navigation: PropTypes.object,
  link: PropTypes.string,
  TitleComponent: PropTypes.object,
  config: PropTypes.object
}

export default withNavigation(Component)
