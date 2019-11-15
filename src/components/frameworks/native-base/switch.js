import React from 'react'
import { Spinner, Switch } from 'native-base'
import PropTypes from 'prop-types'
import withMutation from '../../../core/withMutation'
import withToast from '../../../core/withToast'

class NativeBaseSwitch extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: props.mutation.loading
    }
  }

  _ValueChange = async (value) => {
    if (this.props.mutation) {
      try {
        this.setState({loading: true})
        const _response = await this.props.mutation.action({
          variables: this.props.variables,
          refetchQueries: this.props.refetchQueries
        })
        _response && this.setState({loading: false})
      } catch (e) {
        this.setState({loading: false})
      }
    }
  }

  render () {
    const {loading} = this.state
    return loading ? <Spinner {...this.props.loadingProps}/> : (
      <Switch {...this.props} onValueChange={this._ValueChange}/>
    )
  }
}

NativeBaseSwitch.propTypes = {
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
  })
}

NativeBaseSwitch.defaultProps = {
  loadingProps: {
    size: 'small',
    color: 'black'
  }
}
export default withToast(withMutation(NativeBaseSwitch))
