import React from 'react'
import { Alert, Dimensions, Linking, Platform, Share, StyleSheet } from 'react-native'
import { Buffer } from 'buffer'
import RNFetchBlob from 'rn-fetch-blob'
import RNStoryShare from 'react-native-legit-story-share'
import PropTypes from 'prop-types'
import ShareNative from 'react-native-share'
import _get from 'lodash/get'
import _merge from 'lodash/merge'
import withCustomComponent from '../../../core/withCustomComponent'
import withTranslation from '../../../core/withTranslation'
import { $postSafe } from '../../handlers/form/success/util'
import withConfig from '../../../core/withConfig'
import Modal from '../Modal'
import View from '../View'
import Text from '../Text'
import Image from '../CachedImage'
import Button from '../Button'
import IconTheme from '../IconTheme'
import LinearGradientView from '../LinearGradientView'

const { height } = Dimensions.get('window')

class ShareHelper extends React.Component {
  state = {
    loading: false,
    modalVisible: false
  }

  _normalizeMessage = (str, values) => {
    const regexs = [/{title}/gi, /{description}/gi, /{url}/gi]
    return regexs.reduce((str, curr, index) => {
      str = String(str).replace(regexs[index], values[index] || '')
      return str
    }, str)
  }

  _showModal = () => {
    this.setState({ loading: true, modalVisible: true })
  }

  isInstalled = async packageName => {
    try {
      if (Platform.OS === 'android') {
        const { isInstalled } = await ShareNative.isPackageInstalled(packageName)
        return isInstalled
      }
      return await Linking.canOpenURL(packageName)
    } catch (e) {
      return false
    }
  }

  _share = async socialName => {
    try {
      const { message, url, dialogTitle, errorNetwork = 'Error ', whatsappProps, facebookProps } = this.props
      const isAndroid = (Platform.OS === 'android')
      // onPress(...props)
      this.setState({ modalVisible: false })
      const configData = {
        slugOrId: _get(this.props, '_id'),
        title: _get(this.props, 'title'),
        description: _get(this.props, 'description'),
        image: _get(this.props, 'image'),
        siteName: _get(this.props, 'siteName'),
        message: 'shareMessage',
        path: _get(this.props, 'path', 'player')
      }
      const { data, error } = await $postSafe(_get(this.props, 'config'),
        `${_get(this.props, 'config.share.getShareUrl')}`, configData)
      if (error) {
        this.setState({ loading: false })
        // Alert.alert(error.includes(403) ? errorUnauthorized : errorNetwork)
        Alert.alert(errorNetwork)
        return false
      }
      const shareUrl = _get(data, 'data.shareUrl', url)
      const shareMessage = this._normalizeMessage(
        message, [_get(this.props, 'title'), _get(this.props, 'description'), shareUrl]
      )

      switch (socialName) {
        case 'whatsapp':
          const isInstalled = await this.isInstalled(isAndroid ? 'com.whatsapp' : 'whatsapp://app')
          if (!isInstalled) {
            Alert.alert('', whatsappProps.needAppInstalled, [{ text: 'OK', style: 'OK' }])
            return this.setState({ loading: false })
          }
          this.setState({ loading: false })
          return ShareNative.shareSingle({
            title: _get(this.props, 'title'),
            message: shareMessage,
            url: shareUrl,
            social: ShareNative.Social.WHATSAPP
          })
        case 'facebook':
          const isInstalledFb = await this.isInstalled(isAndroid ? 'com.facebook.katana' : 'fb://app')
          if (!isInstalledFb) {
            Alert.alert('', facebookProps.needAppInstalled, [{ text: 'OK', style: 'OK' }])
            return this.setState({ loading: false })
          }
          this.setState({ loading: false })
          return ShareNative.shareSingle({
            title: _get(this.props, 'title'),
            message: shareMessage,
            social: ShareNative.Social.FACEBOOK,
            quote: shareMessage,
            url: shareUrl,
            contentDescription: 'Facebook sharing is easy!'
          })
        default:
          return Share.share({
            message: shareMessage,
            url: shareUrl,
            title: _get(this.props, 'title')
          }, { dialogTitle }).then(() => {
            this.setState({ loading: false })
          })
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('Error on Sharing without network connection: ', error)
      this.setState({ loading: false })
    }
  }

  _shareStoryInstagram = (url, image, colors, msg, title, propsStory) => {
    const styleElements = _get(propsStory, 'styleElements', '')
    const styleText = _get(propsStory, 'styleText', '')
    const urlBG = _get(propsStory, 'urlBG', null)
    const urlText = _get(propsStory, 'urlText', null)

    const textBase64 = Buffer.from(`${urlText}${title}${styleText}`).toString('base64')
    const urlFinal = `${urlBG}${styleElements}&mark64=${textBase64}&blend=${image}`
    try {
      this.setState({ modalVisible: false })
      RNFetchBlob
        .config({ fileCache: true })
        .fetch('GET', urlFinal)
        .then(async (resp) => {
          return resp.readFile('base64')
        })
        .then(base64Data => {
          return RNStoryShare.isInstagramAvailable()
            .then(isAvailable => {
              if (isAvailable) {
                RNStoryShare.shareToInstagram({
                  type: RNStoryShare.BASE64, // or RNStoryShare.FILE
                  attributionLink: url,
                  // backgroundAsset: `data:image/png;base64,${base64Data}`,
                  stickerAsset: `data:image/png;base64,${base64Data}`,
                  backgroundTopColor: _get(colors, 'topColor', '#000'),
                  backgroundBottomColor: _get(colors, 'bottomColor', '#000')
                })
                this.setState({ loading: false })
              } else {
                Alert.alert('', msg, [{ text: 'OK', style: 'OK' }])
                this.setState({ loading: false })
              }
            })
            // eslint-disable-next-line no-console
            .catch(e => console.log(e))
        })
        .catch((errorMessage, statusCode) => {
          // eslint-disable-next-line no-console
          console.log(errorMessage)
          Alert.alert('', this.props.errorNetwork, [{ text: 'OK', style: 'OK' }])
          this.setState({ loading: false })
        })
    } catch (error) {
      console.error('Error on Sharing Instagram: ', error)
      this.setState({ loading: false })
    }
  }

  _shareWhastapp = () => this._share('whatsapp')
  _shareFacebook = () => this._share('facebook')

  _renderModal = () => {
    const {
      title = ' ',
      totals,
      imageDefaultInstagram,
      url,
      colorsInstagram,
      textInstagram,
      textMore,
      titleShare,
      msgWithOutInstagram,
      propsStory,
      classNames: {
        classNameTitleShare,
        classNameTitle,
        classNameSubTitle,
        classNameButtons
      },
      styleShare,
      facebookProps,
      whatsappProps
    } = this.props
    const image = _get(this.props, 'image', imageDefaultInstagram)
    const seasons = _get(totals, 'seasons', '')
    const episodes = _get(totals, 'episodes', '')
    const subTitle = totals ? `${seasons} ${seasons > 1 ? 'Temporadas' : 'Temporada'} / ${episodes} Episodios` : ' '
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.modalVisible}>
        <View style={stylesDefault.containerModal}>
          <View style={stylesDefault.containerClose}>
            <Button onPress={() => this.setState({ modalVisible: false, loading: false })}>
              <IconTheme
                icon={'close'}
                style={_merge({}, stylesDefault.iconClose, _get(styleShare, 'iconClose', {}))}
                config={{ useIconSet: 'materialIcons' }}
              />
            </Button>
          </View>
          <View
            style={_merge({}, stylesDefault.container, _get(styleShare, 'container', {}))}>
            <Text
              text={titleShare}
              className={classNameTitleShare}
              style={_merge({}, stylesDefault.title, _get(styleShare, 'titleShare', {}))} />
            <Image
              source={{ uri: image }}
              style={_merge({}, stylesDefault.image, _get(styleShare, 'image', {}))}
              borderRadius={10} />
            <Text
              text={title}
              className={classNameTitle}
              numberOfLines={1}
              style={_merge({}, stylesDefault.title, _get(styleShare, 'title', {}))} />
            <Text
              text={subTitle}
              className={classNameSubTitle}
              style={_merge({}, stylesDefault.subTitle, _get(styleShare, 'subTitle', {}))} />
            <Button
              style={stylesDefault.containerInsta}
              onPress={this._shareWhastapp}>
              <View
                style={whatsappProps.styles.container}>
                <IconTheme
                  icon={'whatsapp'}
                  style={stylesDefault.iconInsta}
                  config={{
                    useIconSet: 'fontAwesomeIcons'
                  }}
                />
                <Text
                  text={whatsappProps.btnTitle}
                  numberOfLines={1}
                  style={_merge({}, stylesDefault.textInsta, _get(styleShare, 'textInsta', {}))}
                  className={classNameButtons} />
              </View>
            </Button>
            <Button
              style={stylesDefault.containerInsta}
              onPress={() =>
                this._shareStoryInstagram(url, image, colorsInstagram, msgWithOutInstagram, title, propsStory)}>
              <LinearGradientView
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                colors={['#fa7e1e', '#d62976', '#962fbf']}
                style={stylesDefault.gradientInsta}>
                <IconTheme
                  icon={'instagram'}
                  style={stylesDefault.iconInsta}
                />
                <Text
                  text={textInstagram}
                  numberOfLines={1}
                  style={_merge({}, stylesDefault.textInsta, _get(styleShare, 'textInsta', {}))}
                  className={classNameButtons} />
              </LinearGradientView>
            </Button>
            <Button
              style={stylesDefault.containerInsta}
              onPress={this._shareFacebook}>
              <View
                style={facebookProps.styles.container}>
                <IconTheme
                  icon={'facebook'}
                  style={stylesDefault.iconInsta}
                />
                <Text
                  text={facebookProps.btnTitle}
                  numberOfLines={1}
                  style={_merge({}, stylesDefault.textInsta, _get(styleShare, 'textInsta', {}))}
                  className={classNameButtons} />
              </View>
            </Button>
            <Button
              style={_merge({}, stylesDefault.containerMore, _get(styleShare, 'containerMore', {}))}
              onPress={this._share}>
              <IconTheme
                icon={'more-horiz'}
                style={_merge({}, stylesDefault.iconMore, _get(styleShare, 'iconMore', {}))}
                config={{ useIconSet: 'materialIcons' }}
              />
              <Text
                text={textMore}
                style={_merge({}, stylesDefault.textMore, _get(styleShare, 'textMore', {}))}
                className={classNameButtons} />
            </Button>
          </View>
        </View>
      </Modal>
    )
  }

  render () {
    const { isRouteActive, validateFocus, Component, isLogout, ...props } = this.props
    const { loading } = this.state
    if (!Component) return null
    return (
      <View>
        {this._renderModal()}
        <Component {...props} onPress={this._showModal} loading={loading} />
      </View>
    )
  }
}

ShareHelper.propTypes = {
  Component: PropTypes.func,
  onPress: PropTypes.func,
  message: PropTypes.string,
  url: PropTypes.string,
  title: PropTypes.string,
  dialogTitle: PropTypes.string,
  errorNetwork: PropTypes.string,
  validateFocus: PropTypes.bool,
  isLogout: PropTypes.bool,
  isRouteActive: PropTypes.bool,
  totals: PropTypes.object,
  classNames: PropTypes.object,
  styleShare: PropTypes.object,
  imageDefaultInstagram: PropTypes.string,
  colorsInstagram: PropTypes.object,
  textInstagram: PropTypes.string,
  textMore: PropTypes.string,
  titleShare: PropTypes.string,
  msgWithOutInstagram: PropTypes.string,
  propsStory: PropTypes.object,
  facebookProps: PropTypes.object,
  whatsappProps: PropTypes.object
}
ShareHelper.defaultProps = {
  onPress: () => {
  },
  textInstagram: 'Historias de Instagram',
  textMore: 'Más opciones',
  titleShare: 'Compartir',
  msgWithOutInstagram: 'Debes tener Instagram instalado',
  facebookProps: {
    styles: {
      container: {
        backgroundColor: '#2E5CB9',
        borderRadius: 30,
        flexDirection: 'row',
        width: '100%',
        height: '100%',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingStart: 20
      }
    },
    btnTitle: 'Facebook',
    needAppInstalled: 'Debes tener instalado Facebook'
  },
  whatsappProps: {
    styles: {
      container: {
        backgroundColor: '#04D857',
        borderRadius: 30,
        flexDirection: 'row',
        width: '100%',
        height: '100%',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingStart: 20
      }
    },
    btnTitle: 'WhatsApp',
    needAppInstalled: 'Debes tener instalado WhatsApp'
  }
}

const stylesDefault = StyleSheet.create({
  containerModal: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingBottom: height * 0.15,
    justifyContent: 'center'
  },
  containerClose: {
    flexDirection: 'row',
    width: '80%',
    justifyContent: 'flex-end'
  },
  iconClose: {
    color: 'white',
    fontSize: 30,
    marginVertical: 5
  },
  container: {
    borderRadius: 10,
    width: '80%',
    backgroundColor: 'white',
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 20
  },
  image: {
    height: 150,
    width: 150
  },
  subTitle: {
    fontSize: 15
  },
  textInsta: {
    fontSize: 15,
    width: '70%'
  },
  containerInsta: {
    width: '95%',
    height: '8%',
    marginBottom: 10
  },
  gradientInsta: {
    borderRadius: 30,
    flexDirection: 'row',
    width: '100%',
    height: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingStart: 20
  },
  iconInsta: {
    color: 'white',
    fontSize: 25,
    marginEnd: 20
  },
  containerMore: {
    flexDirection: 'row',
    width: '95%',
    height: '10%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingStart: 20
  },
  iconMore: {
    color: 'black',
    fontSize: 25,
    marginEnd: 20
  },
  textMore: {
    fontSize: 15,
    color: 'black'
  }
})

export default withTranslation(
  withCustomComponent(withConfig(ShareHelper), ['Component']),
  [
    'message',
    'title',
    'description',
    'dialogTitle',
    'url',
    'errorNetwork',
    'errorUnauthorized',
    'textInstagram',
    'textMore',
    'textShare',
    'msgWithOutInstagram',
    'needAppInstalled'
  ]
)
