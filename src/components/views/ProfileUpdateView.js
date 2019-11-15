import React from 'react'
import PropTypes from 'prop-types'
import {each, merge, setWith} from 'lodash'
import withMutation from '../../core/withMutation'
import * as COMPONENTS from '../../components'
import {getProfileId} from '../../core/Auth'
import withToast from '../../core/withToast'
import withTimeLimit from '../../core/withTimeLimit'
class Component extends React.Component {
  constructor (props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
  }

  static getMutation (props) {
    return {
      mutation: `mutation updateProfile($_id: String!, $name: String, $photo: String, $custom: String ) {
        profile {
          update (_id: $_id, input: { name: $name, photo: $photo, custom: $custom }) {
            _id
            name
            photo
            birthday
            custom
          }
        }
      }`
    }
  }

  parseData (values) {
    let data = {}
    each(values, (value, key) => {
      data = merge(data, setWith({}, key, value, Object))
    })
    return data
  }
  async onSubmit (values) {
    const input = this.parseData(values)
    if (this.props.mutation && (typeof this.props.mutation.action === 'function')) {
      const profileId = await getProfileId()
      const {custom = {}, ...data} = input
      const payload = { _id: profileId, ...data, custom: JSON.stringify(custom) }
      this.props.mutation.action({
        variables: payload
      })
        .then((resp) => {
          this.props.toast.info('%general_profile_update_success%')
          if (this.props.enableTimeLimit) {
            this.props.timeLimitSettings.start(custom)
          }
        })
        .catch(() => this.props.toast.info('%general_profile_update_failed%'))
    }
  }

  render () {
    const {mutation, ...props} = this.props
    return (
      <COMPONENTS.ProfileView>
        <COMPONENTS.FormView {...props} onSubmit={this.onSubmit} loading={mutation.loading} />
      </COMPONENTS.ProfileView>
    )
  }
}

Component.propTypes = {
  className: PropTypes.string,
  imageProps: PropTypes.object,
  isFavorite: PropTypes.bool,
  titleProps: PropTypes.object,
  children: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array
  ]),
  enableTimeLimit: PropTypes.bool,
  media: PropTypes.string,
  mutation: PropTypes.shape({
    action: PropTypes.func,
    loading: PropTypes.object
  }),
  timeLimitSettings: PropTypes.object,
  type: PropTypes.string,
  toast: PropTypes.shape({
    info: PropTypes.func
  }),
  variables: PropTypes.object
}

export default withTimeLimit(withToast(withMutation(Component)))
