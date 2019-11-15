import React from 'react'
import PropTypes from 'prop-types'
import firebase from 'react-native-firebase'
import _isArray from 'lodash/isArray'
import _isEmpty from 'lodash/isEmpty'
import _orderBy from 'lodash/orderBy'
import { isAuthenticated } from '../core/Auth'
import withMutation from '../core/withMutation'

class FirebaseComponent extends React.PureComponent {
  state = {
    data: [],
    loading: false,
    completed: false
  }
  componentDidMount () {
    isAuthenticated().then((isAuth) => {
      isAuth && this.readUserData()
    })
  }

  componentWillUnmount () {
    this.userRef = null
  }

  readUserData = () => {
    try {
      const { userId, withMutation, limit } = this.props
      this.setState(() => ({ loading: true }))
      if (userId) {
        this.userRef = firebase
          .database()
          .ref(`users/${userId}/`)
          .orderByChild('createDate')
          .limitToLast(limit)
        this.userRef.on('value', (snapshot) => {
          let data = []
          if (!this.userRef) return
          snapshot.forEach(child => {
            const snap = child.val()
            data.push({
              ...snap,
              creationDate: snap.creationTime || snap.creationDate
            })
          })
          data = _orderBy(data, ['creationDate'], ['desc'])
          this.setState({ loading: false, completed: true, data }, () => {
            return withMutation && this._setDataLikeViewed()
          })
        })
      }
    } catch (error) {
      this.setState({ loading: false, completed: true, error: true })
      console.warn('error: ', error)
    }
  }
  _setDataLikeViewed = async () => {
    try {
      const { mutation, refetchQueries, timeout } = this.props
      if (mutation && timeout) {
        setTimeout(async () => {
          if (mutation && !mutation.loading) {
            const { data } = this.state
            if (_isArray(data) && !_isEmpty(data)) {
              const notifications = data
                .filter(({ viewed = false }) => !viewed).reduce((prev, curr) => {
                  return [...prev, {_id: curr._id, topic: curr.topic}]
                }, [])
              !_isEmpty(notifications) && await mutation
                .action({ variables: { notifications }, refetchQueries: refetchQueries })
            }
          }
        }, timeout)
      }
    } catch (error) {
      console.error('error: ', error)
    }
  }

  setDataChild = child => {
    const { data = [] } = this.state
    if (!React.isValidElement(child)) return null
    return React.cloneElement(child, {
      dataUser: this.state.data,
      dataNotifications: {
        news: [...data].filter(({ viewed = false }) => !viewed)
      },
      dataUserCompleted: this.state.completed,
      loading: this.state.loading
    })
  }
  render () {
    return React
      .Children
      .map(this.props.children, this.setDataChild)
  }
}

FirebaseComponent.propTypes = {
  children: PropTypes.any,
  mutation: PropTypes.any,
  orderByChild: PropTypes.string, // Deprecated
  limit: PropTypes.number,
  refetchQueries: PropTypes.array,
  timeout: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
  userId: PropTypes.string,
  variables: PropTypes.object,
  withMutation: PropTypes.bool
}
FirebaseComponent.defaultProps = {
  orderByChild: 'creationTime', // Deprecated
  limit: 50,
  timeout: false,
  withMutation: false
}

export default withMutation(FirebaseComponent)
