import React from 'react'
import { Spinner } from 'native-base'
import PropTypes from 'prop-types'
import withMutation from '../../core/withMutation'
import withToast from '../../core/withToast'
import { Switch } from 'react-native-switch'

class SwitchNotificationItem extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: props.mutation.loading,
      value: props.value || false
    }
  }

  _ValueChange = async () => {
    // isTopicConfig: this prop will add the "active" variable to the variables object
    const {mutation, variables, refetchQueries} = this.props
    if (mutation) {
      try {
        this.setState({loading: true})
        const _response = await mutation.action({
          refetchQueries,
          variables: {
            ...variables,
            active: !this.state.value
          }
        })
        _response && this.setState({loading: false, value: !this.state.value})
      } catch (e) {
        this.setState({loading: false})
      }
    }
  }

  render () {
    const {loading, value} = this.state
    const {loadingProps, switchProps} = this.props
    return loading ? <Spinner { ...loadingProps }/> : (
      <Switch
        onValueChange={ this._ValueChange }
        value={ value }
        {...switchProps}
      />
    )
  }
}

SwitchNotificationItem.propTypes = {
  mutation: PropTypes.shape({
    action: PropTypes.func,
    loading: PropTypes.bool
  }),
  toast: PropTypes.object,
  variables: PropTypes.object,
  refetchQueries: PropTypes.array,
  loadingProps: PropTypes.shape({
    size: PropTypes.string,
    color: PropTypes.string
  }),
  switchProps: PropTypes.any,
  value: PropTypes.bool // initial value of the switch if its provided then false
}

SwitchNotificationItem.defaultProps = {
  loadingProps: {
    size: 'small',
    color: 'black'
  }
}
export default withToast(withMutation(SwitchNotificationItem))
