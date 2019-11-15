import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import _isArray from 'lodash/isArray'
import _isFunction from 'lodash/isFunction'
import withCustomComponent from '../../core/withCustomComponent'
import * as COMPONENTS from '..'

class StepTutorial extends React.Component {
  state = {
    loading: false,
    step: 0,
    goLast: false
  }
  _swiperRef = null

  handlerStepChange = (step) => {
    this.setState({ step })
  }

  setSetSwiper = (ref) => {
    this._swiperRef = ref
    return this._swiperRef
  }

  renderBody = () => {
    const { bodyComponentProps } = this.props
    return (
      <COMPONENTS.Swiper {...bodyComponentProps}
        onIndexChanged={ this.handlerStepChange }
        refSwiper={this.setSetSwiper}/>
    )
  }
  _goLast = () => {
    const { bodyComponentProps: { data = [] } } = this.props
    if (_isFunction(this._swiperRef.scrollBy) && _isArray(data)) {
      this._swiperRef.scrollBy(data.length - 1)
    }
  }

  render () {
    const { HeaderComponent, FooterComponent, headerProps } = this.props
    return (
      <Fragment>
        { HeaderComponent && <HeaderComponent {...headerProps}
          activeStep={this.state.step}
          goLast={ this._goLast }/>}
        { this.renderBody()}
        { FooterComponent && <FooterComponent />}
      </Fragment>
    )
  }
}

StepTutorial.propTypes = {
  HeaderComponent: PropTypes.any,
  bodyComponentProps: PropTypes.object,
  headerProps: PropTypes.object,
  FooterComponent: PropTypes.any
}
StepTutorial.defaultProps = {
  HeaderComponent: false,
  headerProps: {},
  bodyComponentProps: {},
  FooterComponent: false
}

export default withCustomComponent(StepTutorial, ['HeaderComponent', 'FooterComponent'])
