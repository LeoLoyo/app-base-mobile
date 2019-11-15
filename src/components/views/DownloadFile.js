import React from 'react'
import PropTypes from 'prop-types'
import RNFetchBlob from 'rn-fetch-blob'
import * as Progress from 'react-native-progress'
import _isEmpty from 'lodash/isEmpty'
import _get from 'lodash/get'
import _has from 'lodash/has'
import _set from 'lodash/set'
import _last from 'lodash/last'

import { Alert, Platform } from 'react-native'
import { IconThemeButton, LoadingComponent, View } from '../../components'

import Storage from '../../core/Storage'
import { PortalContext } from '../../core/Portal'
import { isAuthenticated, getFromMultipleStorage } from '../../core/Auth'
import withToast from '../../core/withToast'

class DownloadButton extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      progress: 0,
      loading: false
    }
  }

  componentDidMount () {
    try {
      const { downloads } = this.context.portal
      if (!_has(this.props, 'data._id')) return null
      const dates = _get(downloads, this.props.data._id, false)
      if (dates) {
        this.setState({
          progress: _has(dates, 'pathMedia') ? 1 : dates.progress,
          loading: _has(dates, 'pathMedia') ? false : (dates.progress !== 1)
        })
      }
    } catch (error) {
      console.error('Error - componentDidMount: ', error)
    }
  }

  componentDidUpdate () {
    try {
      const { downloads } = this.context.portal
      if (!_has(this.props, 'data._id')) return null

      const dates = _get(downloads, this.props.data._id, false)
      if (dates) {
        if (dates.progress !== this.state.progress) {
          this.setState({ progress: dates.pathMedia ? 1 : dates.progress, loading: (dates.progress !== 1) })
        }
      }
    } catch (error) {
      console.error('Error - componentDidUpdate: ', error)
    }
  }

  _donwloadManager = async (portal) => {
    try {
      const { data, path, saveStorage, image, distributorId, appVersion, appName } = this.props
      const isAuth = await isAuthenticated()
      if (!isAuth) {
        portal.set({ modalPlayer: false })
        return this.props.toast.info('%toast_download_unsigned_info%', 2000, 'toast-top toast-info')
      }

      const { auth_customer_id: customerId } = await getFromMultipleStorage(['auth_customer_id'])

      const appType = Platform.OS === 'ios' ? 'ios-app' : 'android-app'

      if (_isEmpty(data) || !path || !appName || !appVersion || !customerId) {
        return Alert.alert('Ups!', 'No se puede descargar el episodio',
          [{ text: 'Aceptar' }])
      }

      // const ext = pathLib.extname(path)
      const pathSplit = path.split('.')
      const ext = _last(pathSplit)

      const configImage = {
        path: `${RNFetchBlob.fs.dirs.DocumentDir}/${data._id}.png`,
        fileCache: true
      }
      const configMedia = {
        path: `${RNFetchBlob.fs.dirs.DocumentDir}/${data._id}.${ext}`,
        fileCache: true
      }

      const pathMetadata = distributorId
        ? `${path}?an=${appName}&at=${appType}&av=${appVersion}&c=${customerId}&ds=${distributorId}&download=true`
        : `${path}?an=${appName}&at=${appType}&av=${appVersion}&c=${customerId}&download=true`

      this.setState({ loading: true, progress: 0 }, () => {
        this.addProgress({ ...data, progress: 0 })
        RNFetchBlob
          .config(configImage)
          .fetch('GET', image)
          .then((resp) => {
            RNFetchBlob
              .config(configMedia)
              .fetch('GET', pathMetadata)
              .progress({ count: 10, interval: 1000 }, (received, total) => {
                this.addProgress({
                  ...data,
                  progress: (received / total)
                })
              })
              .then(async (res) => {
                const viewed = _get(data, 'content.keep_watching.time', 0)
                const objectToSave = Object.assign({},
                  {
                    ...data,
                    viewed: (viewed > 0),
                    progress: 1,
                    pathMedia: Platform.select({
                      ios: `${data._id}.${ext}`,
                      android: `file://${res.path()}`
                    })
                  },
                  {
                    imageProgram: Platform.select({
                      ios: resp.path(),
                      android: `file://${resp.path()}`
                    })
                  }
                )
                return (saveStorage) && this.addStorage(objectToSave)
              }).catch(() => this.deleteItemStorage(portal))
          })
      })
    } catch (error) {
      console.error('method _donwloadManager: ', error)
    }
  }

  addProgress = async ({ _id, ...extra }) => {
    try {
      const { portal } = this.context
      const { downloads: currentDownload = {} } = portal.get()
      const downloads = _set(Object.assign({}, currentDownload), _id, { _id, ...extra })
      portal.set({ downloads })
    } catch (error) {
      console.error('method addProgress: ', error)
    }
  }

  addStorage = ({ _id, pathMedia, ...extra }) => {
    try {
      if (!pathMedia) return null
      const { portal } = this.context
      const { downloads: currentDownload = {} } = portal.get()
      const downloads = _set(Object.assign({}, currentDownload), _id, { _id, ...extra, pathMedia })
      Storage.setItem('DOWNLOADS', JSON.stringify(downloads), portal.set({ downloads }))
    } catch (error) {
      console.error('method addStorage: ', error)
    }
  }

  deleteItemStorage = (portal) => {
    const { data } = this.props
    try {
      const { downloads = {} } = portal.get()
      delete downloads[data._id]
      Storage.setItem('DOWNLOADS', JSON.stringify(downloads), () => portal.set({ downloads }))
    } catch (error) {
      console.error('method deleteItemStorage: ', error)
    }
  }

  _renderDownload = (portal) => {
    const {
      iconStyle,
      data: { _id },
      sizeProgress = 20,
      borderWidth = 0,
      colorProgress = 'skyblue',
      unfilledColor = 'lightgray',
      thicknessPorgress = 2,
      ...props
    } = this.props
    const { downloads } = portal.get()
    let inStorage = _has(downloads, _id)
    const DeleteComponent = <IconThemeButton {...props} onPress={() => this.deleteItemStorage(portal)}
      icon={'trash'} iconStyle={iconStyle} />
    const SaveComponent = <IconThemeButton {...props} onPress={() => this._donwloadManager(portal)}
      icon={'download-cloud'} iconStyle={iconStyle} />

    if (!this.state.loading) return inStorage ? DeleteComponent : SaveComponent

    return this.state.progress > 0 && this.state.progress <= 1
      ? <Progress.Circle
        size={sizeProgress}
        borderWidth={borderWidth}
        thickness={thicknessPorgress}
        color={colorProgress}
        unfilledColor={unfilledColor}
        progress={this.state.progress}
      />
      : <LoadingComponent
        color={colorProgress}
        size={'small'}
      />
  }

  render () {
    const { style } = this.props
    const { portal } = this.context
    return (
      <View style={style}>
        {this._renderDownload(portal)}
      </View>
    )
  }
}

DownloadButton.propTypes = {
  data: PropTypes.any,
  style: PropTypes.object,
  iconStyle: PropTypes.object,
  path: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  saveStorage: PropTypes.bool,
  toast: PropTypes.any,
  sizeProgress: PropTypes.number,
  borderWidth: PropTypes.number,
  colorProgress: PropTypes.string,
  unfilledColor: PropTypes.string,
  distributorId: PropTypes.string,
  appVersion: PropTypes.string.isRequired,
  appName: PropTypes.string.isRequired,
  thicknessPorgress: PropTypes.number
}

DownloadButton.defaultProps = {
  data: {},
  iconStyle: { fontSize: 25, alignSelf: 'center' },
  saveStorage: true
}

DownloadButton.contextType = PortalContext

export default withToast(DownloadButton)
