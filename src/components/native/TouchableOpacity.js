import React from 'react'
import PropTypes from 'prop-types'
import {TouchableOpacity} from 'react-native'
import Touchable from './Touchable'
import withStyle from '../../core/withStyle'
import withFocus from '../../core/withFocus'
import {CustomComponentProvider} from '../../core/withCustomComponent'
import DefaultLoadingComponent from './Loading'
class Component extends React.Component {
  render () {
    const {loading, ...restOfProps} = this.props
    return (
      <CustomComponentProvider {...restOfProps} components={['LoadingComponent']}>
        {({LoadingComponent = DefaultLoadingComponent}) => {
          return (
            <Touchable {...restOfProps} render={
              (props) => {
                return (
                  <TouchableOpacity {...restOfProps} {...props}>
                    {loading ? <LoadingComponent size="small" /> : this.props.children}
                  </TouchableOpacity>
                )
              }
            }/>
          )
        }}
      </CustomComponentProvider>
    )
  }
}

Component.propTypes = {
  activeClassName: PropTypes.string,
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

Component.hasPropManager = true

export default withFocus(withStyle(Component))
