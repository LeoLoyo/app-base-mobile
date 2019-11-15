import React from 'react'
import PropTypes from 'prop-types'
import withCustomComponent from '../../core/withCustomComponent'
import View from './View'
import SafeAreaView from './SafeAreaView'
import List from '../views/List'
import ModalInput from '../views/ModalInput'

class Selector extends React.Component {
  static propTypes = {
    HeaderComponent: PropTypes.func,
    headerProps: PropTypes.object,
    listProps: PropTypes.object,
    contentProps: PropTypes.object
  }

  static defaultProps = {
    contentProps: {}
  }

  _contentComponent = (props) => {
    const {contentProps = {}, HeaderComponent} = this.props
    const {headerProps, listProps, containerProps} = contentProps
    return (
      <SafeAreaView>
        <View {...containerProps}>
          {HeaderComponent && <HeaderComponent {...headerProps} {...props} />}
          <List {...listProps} {...props}/>
        </View>
      </SafeAreaView>
    )
  }

  render () {
    const {HeaderComponent, contentProps, ...props} = this.props
    return <ModalInput {...props} ContentComponent={this._contentComponent} />
  }
}

export default withCustomComponent(
  Selector,
  ['HeaderComponent']
)
