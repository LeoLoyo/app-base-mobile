import React from 'react'
import PropTypes from 'prop-types'

export default (WrappedComponent) => class CollectionStateHandler extends React.Component {
  static propTypes = {
    defaultSelected: PropTypes.any,
    data: PropTypes.any,
    noScroll: PropTypes.any
  }
  static defaultProps = {
    selectionType: 'toggle',
    data: []
  }

  constructor (props) {
    super(props)
    const listState = {}
    props.defaultSelected && (listState[props.defaultSelected] = true)
    this.state = {listState}
  }

  listRef = null

  componentDidMount () {
    this.setDefaultPosition()
  }

  // this is the lord of the workaounds
  setDefaultPosition = () => {
    if (this.props.defaultSelected) {
      this.timeout = setTimeout(() => {
        try {
          this._scrollToCurrent()
          this.timeout = null
        } catch (e) {
          this.setDefaultPosition()
        }
      }, 200)
    }
  }

  componentWillUnmount () {
    if (this.timeout) {
      clearTimeout(this.timeout)
    }
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillMount () {
    this._setListState()
  }
  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps (nextProps) {
    const {data: newData} = nextProps
    const {data} = this.props
    data !== newData && this._setListState(nextProps)
  }

  componentDidUpdate (prevProps, prevState) {
    const {noScroll} = this.props
    const prevOpened = this.getOpenedId(prevState)
    const opened = this.getOpenedId()
    const shouldScroll = (prevOpened !== opened) && !noScroll
    shouldScroll && this._scrollToCurrent()
  }

  setListRef = (ref) => (this.listRef = ref)

  scrollToNext = (props = this.props, state = this.state) => {
    const {data, keyExtractor} = props
    let index = this.getOpenedIndex(props, state)
    index = this._nextIndex(data, index)
    if (index !== -1) {
      const key = keyExtractor(data[index])
      this.changeListItemState(key)
    }
  }

  scrollToPrevious = (props = this.props, state = this.state) => {
    const {data, keyExtractor} = props
    let index = this.getOpenedIndex(props, state)
    index = this._previousIndex(data, index)
    if (index !== -1) {
      const key = keyExtractor(data[index])
      this.changeListItemState(key)
    }
  }

  getOpenedId = (state = this.state) => {
    const {listState} = state
    let opened
    Object.keys(listState).forEach(key => listState[key] && (opened = key))
    return String(opened)
  }

  getOpenedIndex = (props = this.props, state = this.state) => {
    const {data, keyExtractor} = props
    const opened = this.getOpenedId(state)
    const index = data.findIndex((item) => String(keyExtractor(item)) === opened)
    return index
  }

  _setListState = (props = this.props, state = this.state) => {
    const {data, keyExtractor} = props
    let listState = {}
    data.forEach((item) => (listState[keyExtractor(item)] = state.listState[keyExtractor(item)] || false))
    this.setState(() => ({listState}))
  }

  changeListItemState = (id) => this.setState((prevState, props) => {
    const {selectionType} = props
    let listState = {}
    Object.keys(prevState.listState).forEach((key) => (listState[key] = false))
    selectionType === 'toggle' && (listState[id] = !prevState.listState[id])
    selectionType === 'set' && (listState[id] = true)
    return {listState}
  })

  render () {
    const {state, changeListItemState, setListRef, scrollToNext, scrollToPrevious} = this
    const {listState} = state

    const collectionProps = {
      listState,
      changeListItemState,
      setListRef,
      selectNext: scrollToNext,
      selectPrevious: scrollToPrevious
    }

    return <WrappedComponent {...this.props} collectionProps={collectionProps} />
  }

  _scrollToCurrent = (props = this.props, state = this.state) => {
    const {listRef} = this
    const {scrollToIndexParams = {}} = props

    if (!listRef) {
      return
    }

    let index = this.getOpenedIndex(props, state)
    const isScrollable = listRef && index !== -1
    isScrollable && listRef.scrollToIndex({index, ...scrollToIndexParams})
  }

  _nextIndex = (data, index) => {
    if (data.length > 0) {
      if (index === -1 || index === (data.length - 1)) {
        index = 0
      } else if (index >= 0) {
        index++
      }
    }

    return index
  }

  _previousIndex = (data, index) => {
    if (data.length > 0) {
      if (index === -1 || index === 0) {
        index = data.length - 1
      } else if (index > 0) {
        index--
      }
    }

    return index
  }
}
