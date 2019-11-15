import React from 'react'
import {FlatList} from 'react-native'
import {get, defaultsDeep} from 'lodash'
import PropTypes from 'prop-types'
import * as COMPONENTS from '../../components'

class Component extends React.Component {
  constructor (props) {
    super(props)
    this.renderItem = this.renderItem.bind(this)
    this.keyExtractor = this.keyExtractor.bind(this)
    this.renderSeparator = this.renderSeparator.bind(this)
  }

  keyExtractor (item, index) {
    return item._id || String(index)
  };

  renderItem ({item, index}) {
    const {name} = this.props
    const {source} = item
    return (
      <COMPONENTS.TouchableOpacity className='w-viewport-5 h-100'
        onPress={() => this.props.onChange({[name]: source.uri})}>
        <COMPONENTS.View className="h-100 w-100">
          <COMPONENTS.Image {...item} {...this.props.imageProps}/>
        </COMPONENTS.View>
      </COMPONENTS.TouchableOpacity>
    )
  }

  renderSeparator () {
    return this.renderSection({_id: 'separator'}, 'SeparatorComponent')
  }

  renderSection (item, component) {
    const renderComponent = get(this.props, component)
    const parentProps = get(this.props, 'parentProps', {})
    if (renderComponent) {
      const Component = get(COMPONENTS, renderComponent.name)
      if (typeof Component === 'function') {
        const props = defaultsDeep({}, renderComponent.props, parentProps, item)
        return (
          <Component {...props} />
        )
      }
    }
    return null
  }

  render () {
    return (
      <COMPONENTS.View className={this.props.className}>
        <FlatList
          horizontal
          containerStyle={this.props.containerStyle}
          data={this.props.data}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
          ItemSeparatorComponent={this.renderSeparator}
        />
      </COMPONENTS.View>
    )
  }
}

Component.propTypes = {
  className: PropTypes.string,
  containerStyle: PropTypes.object,
  responseName: PropTypes.string,
  data: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object
  ]),
  error: PropTypes.object,
  loading: PropTypes.bool,
  name: PropTypes.string,
  onRefresh: PropTypes.func,
  onChange: PropTypes.func,
  text: PropTypes.string,
  includeTitle: PropTypes.bool,
  imageProps: PropTypes.object,
  ItemComponent: PropTypes.shape({
    name: PropTypes.string,
    props: PropTypes.object
  }),
  LoadingComponent: PropTypes.shape({
    name: PropTypes.string,
    props: PropTypes.object
  }),
  FooterComponent: PropTypes.shape({
    name: PropTypes.string,
    props: PropTypes.object
  }),
  SeparatorComponent: PropTypes.shape({
    name: PropTypes.string,
    props: PropTypes.object
  }),
  title: PropTypes.string
}

Component.defaultProps = {
  includeTitle: false,
  loading: false,
  data: {},
  onRefresh: () => null,
  LoadingComponent: {
    name: 'LoadingComponent'
  },
  containerStyle: {}
}
export default Component
