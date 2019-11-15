import React from 'react'
import PropTypes from 'prop-types'
import {TouchableHighlight, View} from 'react-native'
import Touchable from './Touchable'
import withStyle from '../../core/withStyle'
import withFocus from '../../core/withFocus'
import withCustomComponent from '../../core/withCustomComponent'
import LoadingComponent from './Loading'

class Component extends React.Component {
  render () {
    const {
      LoadingComponent: Component = LoadingComponent,
      loading,
      containerStyle,
      ...restOfProps
    } = this.props
    return (
      <Touchable {...restOfProps} render={
        ({pressedIn, pressedOut, ...touchableProps}) => {
          return (
            <TouchableHighlight {...touchableProps} {...restOfProps} >
              <View contentContainerStyle={containerStyle}>
                {loading ? <Component size="small" /> : this.props.children}
              </View>
            </TouchableHighlight>
          )
        }
      }/>
    )
  }
}

Component.propTypes = {
  activeClassName: PropTypes.string,
  containerStyle: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object
  ]),
  handlePress: PropTypes.func,
  isActive: PropTypes.bool,
  isToggler: PropTypes.bool,
  isDisabled: PropTypes.func,
  onPress: PropTypes.func,
  onPressIn: PropTypes.func,
  onPressOut: PropTypes.func,
  onToggle: PropTypes.func,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  toggleFocus: PropTypes.func,
  onSubmit: PropTypes.func,
  LoadingComponent: PropTypes.string,
  setContext: PropTypes.object,
  _setContext: PropTypes.func,
  params: PropTypes.object
}

Component.defaultProps = {
  disabled: false,
  loading: false,
  params: {}
}

export default withCustomComponent(withFocus(withStyle(Component,
  ['style', 'contentContainerStyle'])),
['LoadingComponent'])
