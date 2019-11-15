import React from 'react'
import PropTypes from 'prop-types'
import * as COMPONENTS from '..'
import {withNavigation} from 'react-navigation'
import withMutation from '../../core/withMutation'
import ComponentBuilder from '../../core/Wrapper'

class Component extends React.Component {
  static getMutation (props) {
    return {
      mutation: props.mutation
    }
  }

  constructor (props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit (values) {
    if (this.props.mutation && (typeof this.props.mutation.action === 'function')) {
      this.props.mutation.action({
        variables: values
      })
        .then((resp) => {
          if (typeof this.props.onSuccess === 'function') {
            this.props.onSuccess(resp)
          }
        })
        .catch((err) => {
          if (typeof this.props.onError === 'function') {
            this.props.onError(err)
          }
        })
    }
  }
  render () {
    const {className, formClassName, ...props} = this.props
    return (
      <COMPONENTS.KeyboardAwareView>
        <COMPONENTS.View className={className}>
          { this.props.TitleComponent && <ComponentBuilder {...this.props.TitleComponent} /> }
          <COMPONENTS.Form
            className={formClassName}
            onSubmit={this.onSubmit}
            loading={this.props.mutation.loading}
            {...props}
          />
        </COMPONENTS.View>
      </COMPONENTS.KeyboardAwareView>
    )
  }
}

Component.propTypes = {
  className: PropTypes.string,
  formClassName: PropTypes.string,
  imageProps: PropTypes.object,
  navigation: PropTypes.object,
  TitleComponent: PropTypes.object,
  config: PropTypes.object,
  mutation: PropTypes.object,
  loading: PropTypes.string,
  onSuccess: PropTypes.func,
  onError: PropTypes.func
}

export default withNavigation(withMutation(Component))
