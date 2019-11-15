import React from 'react'
import {FlatList, View} from 'react-native'
import PropTypes from 'prop-types'
import {CustomComponentProvider} from '../../core/withCustomComponent'
class Component extends React.Component {
  keyExtractor = (item, index) => String(item._id || item.id || index)

  _lookupComponents = [
    'ItemComponent',
    'HeaderComponent',
    'FooterComponent',
    'SeparatorComponent',
    'EmptyListComponent'
  ]

  renderItem = ({item, index}) => {
    const { prevContextElement, itemProps } = this.props
    const props = {
      ...item,
      ...itemProps,
      index,
      prevContextElement
    }
    return (
      <CustomComponentProvider {...this.props} components={['ItemComponent']} >
        {({ItemComponent}) => (<ItemComponent readableIndex={index + 1}
          key={item.id || item._id || index} {...props} />)}
      </CustomComponentProvider>
    )
  }

  renderFooter = () => {
    const {refreshing} = this.props
    if (this.isInfiniteScroll() && !refreshing) return null
    return (
      <CustomComponentProvider {...this.props} components={['FooterComponent']} >
        {({FooterComponent = View}) => {
          return <FooterComponent {...this.props}/>
        }}
      </CustomComponentProvider>
    )
  }

  renderSeparator = () => {
    const {separatorProps, ...props} = this.props
    return (
      <CustomComponentProvider {...props} components={['SeparatorComponent']} >
        {({SeparatorComponent = View}) => {
          return <SeparatorComponent {...props} {...separatorProps}/>
        }}
      </CustomComponentProvider>
    )
  }

  renderHeader = () => {
    const { headerData, headerProps } = this.props
    return (
      <CustomComponentProvider {...this.props} components={['HeaderComponent']} >
        {({HeaderComponent = View}) => {
          return <HeaderComponent text={this.props.title} data={headerData} {...headerProps}/>
        }}
      </CustomComponentProvider>
    )
  }

  renderEmptyComponent = () => {
    const {EmptyListComponent, prevContextElement} = this.props
    if (!EmptyListComponent) return null
    return <EmptyListComponent {...this.props} prevContextElement={prevContextElement} />
  }

  isInfiniteScroll = () => this.props.scrollType === 'infinite'

  _onRefresh = () => {
    if (!this.props.refreshing) this.props.onRefresh()
  }

  getRefreshProps = () => {
    if (this.isInfiniteScroll()) {
      return {
        onEndReached: this._onRefresh,
        refreshing: this.props.refreshing
      }
    }
    return {
      refreshing: this.props.refreshing,
      onRefresh: this._onRefresh
    }
  }

  getAutoScrollProps = () => {
    const {ITEM_HEIGHT = 200, autoScroll = false} = this.props

    const getItemLayout = (data, index) => (
      {length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index}
    )
    const autoScrollProps = {
      getItemLayout
    }

    return autoScroll ? autoScrollProps : {autoScroll}
  }

  _getComparableProps = ({loading, refreshing}) => {
    return {
      loading,
      refreshing
    }
  }

  render () {
    if (!Array.isArray(this.props.data)) return this.renderEmptyComponent()
    return (
      <FlatList
        horizontal={this.props.horizontal}
        inverted={this.props.inverted}
        data={this.props.data}
        keyExtractor={this.keyExtractor}
        renderItem={this.renderItem}
        ListHeaderComponent={this.renderHeader}
        ItemSeparatorComponent={this.renderSeparator}
        onEndReachedThreshold={this.props.onEndReachedThreshold}
        ListFooterComponent={this.renderFooter}
        ref={this.props.innerRef}
        {...this.props.optionalProps}
        {...this.getRefreshProps()}
        {...this.getAutoScrollProps()}
      />
    )
  }
}

Component.propTypes = {
  className: PropTypes.string,
  contentContainerStyle: PropTypes.object,
  responseName: PropTypes.string,
  data: PropTypes.any,
  error: PropTypes.object,
  loading: PropTypes.bool,
  horizontal: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string
  ]),
  inverted: PropTypes.bool,
  refreshing: PropTypes.any,
  onRefresh: PropTypes.any,
  text: PropTypes.string,
  includeTitle: PropTypes.bool,
  title: PropTypes.string,
  scrollEnabled: PropTypes.bool,
  ItemComponent: PropTypes.string,
  FooterComponent: PropTypes.string,
  SeparatorComponent: PropTypes.string,
  headerProps: PropTypes.object,
  HeaderComponent: PropTypes.string,
  EmptyListComponent: PropTypes.func,
  emptyListProps: PropTypes.object,
  scrollType: PropTypes.string,
  onEndReachedThreshold: PropTypes.number,
  optionalProps: PropTypes.any,
  prevContextElement: PropTypes.any,
  headerData: PropTypes.any,
  separatorProps: PropTypes.any,
  style: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array
  ]),
  itemProps: PropTypes.any,
  ITEM_HEIGHT: PropTypes.number,
  autoScroll: PropTypes.bool,
  innerRef: PropTypes.any
}

Component.defaultProps = {
  includeTitle: false,
  loading: false,
  onRefresh: () => null,
  refreshing: false,
  containerStyle: {},
  scrollEnabled: false,
  itemProps: {},
  emptyListProps: {},
  optionalProps: {},
  innerRef: () => null,
  isActive: () => null
}

export default Component
