import React from 'react'
import PropTypes from 'prop-types'
import Storage from '../../core/Storage'
import {fromPairs} from 'lodash'

class StorageHelper extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  async componentDidMount () {
    const {getKeys} = this.props
    if (getKeys) {
      const values = await this._getKeysFromStorage(getKeys)
      this.setState({
        ...fromPairs(values)
      })
    }
  }

  _getKeysFromStorage = async (keys = []) => {
    const response = await new Promise((resolve, reject) => {
      Storage.multiGet(keys, (err, results) => {
        if (err) return reject(err)
        resolve(results)
      })
    })
    return response
  }

  _getAllKeysFromStorage = async (keys = []) => {
    const response = await new Promise((resolve, reject) => {
      Storage.getAllKeys((err, results) => {
        if (err) return reject(err)
        resolve(results)
      })
    })
    return response
  }

  render () {
    const {children, ...props} = this.props
    return React.Children.map(children, (child) => {
      if (!React.isValidElement(child)) return child
      return React.cloneElement(child, {...props, storage: this.state})
    })
  }
}

StorageHelper.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object
  ]),
  getKeys: PropTypes.array
}
export default StorageHelper
