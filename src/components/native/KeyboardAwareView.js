import React from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {StyleSheet} from 'react-native'
import PropTypes from 'prop-types'
import withStyle from '../../core/withStyle'
const initialCoords = {x: 0, y: 0}

const containterStyle = {
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
}

const style = StyleSheet.create(containterStyle)

class Component extends React.Component {
  _scrollRef = null

  componentDidUpdate (prevProps) {
    // if (prevProps.scrollToTop !== this.props.scrollToTop && this.props.scrollToTop === true && this.scrollRef) {
    //   this.scrollRef.scrollTo({x: 0, y: 0, animated: true})
    // }
  }

  _setScrollRef = (ref) => (this.scrollRef = ref)

  _onKeyboardWillShow = () => {
    // this.scrollRef.scrollToPosition(0, -200)
  }

  render () {
    return (
      <KeyboardAwareScrollView
        ref={this._setScrollRef}
        onKeyboardWillShow={this._onKeyboardWillShow}
        resetScrollToCoords={initialCoords}
        scrollEventThrottle={500}
        enableOnAndroid
        {...this.props}
        style={[style.view, this.props.style]}
        contentContainerStyle={[style.content, this.props.contentContainerStyle]}>
        {this.props.children}

      </KeyboardAwareScrollView>
    )
  }
}

/**
   * Props
   */
Component.propTypes = {
  children: PropTypes.node,
  contentContainerStyle: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array
  ]),
  style: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array
  ]),
  scrollToTop: PropTypes.bool
}
export default withStyle(Component, ['style', 'contentContainerStyle'])
