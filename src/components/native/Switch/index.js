import React from 'react'
import PropTypes from 'prop-types'
import _merge from 'lodash/merge'
import { View, TouchableWithoutFeedback } from 'react-native'
import withAnimation from '../../../core/withAnimation'
import withControl from '../../../core/withControl'

class Switch extends React.Component {
  static propTypes = {
    switchProps: PropTypes.shape({
      checkedValue: PropTypes.bool,
      onPress: PropTypes.func
    }),
    styles: PropTypes.object
  };

  static defaultProps = {
    onPress: () => {},
    switchProps: {},
    styles: {}
  };
  _onPressButton () {
    this.setState({ enabled: !this.state.enabled })
  }
  render () {
    const {
      section,
      touchable,
      IsToggled,
      IsUntoggled,
      container,
      active,
      inactive
    } = _merge({}, styles, this.props.styles)
    const { checkedValue, onPress } = this.props.switchProps
    const isChecked = checkedValue()
    return (
      <TouchableWithoutFeedback onPress={onPress}>
        <View style={[container]}>
          <View style={[section, isChecked ? active : inactive]} />
          <View style={[touchable, isChecked ? IsToggled : IsUntoggled]} />
        </View>
      </TouchableWithoutFeedback>

    )
  }
}

const styles = {
  container: {
    maxWidth: 60,
    height: 75,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    overflow: 'visible'
  },
  section: {
    width: 50,
    height: 20,
    borderRadius: 50,
    alignSelf: 'center',
    position: 'absolute',
    elevation: 2
  },
  touchable: {
    width: 30,
    height: 30,
    borderRadius: 100,
    alignSelf: 'center',
    position: 'absolute',
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3
  },
  IsToggled: {
    alignSelf: 'flex-end',
    backgroundColor: 'red'
  },
  IsUntoggled: {
    alignSelf: 'flex-start',
    backgroundColor: 'red'
  },
  active: {
    backgroundColor: 'blue'
  },
  inactive: {
    backgroundColor: 'black'
  }
}

export default withControl(withAnimation(Switch))
