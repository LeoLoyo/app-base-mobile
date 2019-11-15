import React, { Component, Fragment } from 'react'
import withStyle from '../../core/withStyle'
import FBLogin from './FBLogin'
import CheckBoxTerms from '../native/CheckBoxTerms'

class FBLoginRestric extends Component {
  constructor (props) {
    super(props)
    this.state = {
      value: false
    }
  }

  checkValue = () => this.setState({ value: !this.state.value })

  render () {
    return (
      <Fragment>
        <FBLogin
          termsAgree={this.state.value}
          withTermsAndConditions={true}
          {...this.props} />
        <CheckBoxTerms
          value={this.state.value}
          onClick={this.checkValue}
          {...this.props} />
      </Fragment>
    )
  }
}

export default withStyle(FBLoginRestric)
