import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _merge from 'lodash/merge'
import View from './../../native/View'
import Text from './../../native/Text'
import { CustomComponentProvider } from '../../../core/withCustomComponent'

const defaultProps = {
  containerProps: {
    className: 'w-100 bg-white'
  },
  textProps: {
    className: 'text-color-dark text-align-center font-size-1 py-2 font-weight-bold'
  }
}

const DefaultTitle = (props) => {
  const { containerProps, textProps } = _merge({}, defaultProps, props)
  return (
    <View {...containerProps}>
      <Text {...textProps}/>
    </View>
  )
}

DefaultTitle.propTypes = {
  containerProps: PropTypes.object,
  textProps: PropTypes.object
}

class TitleGridExplorer extends Component {
  render () {
    const { TitleComponent, ...props } = this.props
    const component = { TitleComponent }
    return (
      <CustomComponentProvider { ...component } components={['TitleComponent']}>
        {
          ({ TitleComponent }) => {
            return (
              TitleComponent
                ? (<TitleComponent {...props}/>)
                : (<DefaultTitle {...props}/>)
            )
          }
        }
      </CustomComponentProvider>
    )
  }
}

TitleGridExplorer.propTypes = {
  TitleComponent: PropTypes.string
}

export default TitleGridExplorer
