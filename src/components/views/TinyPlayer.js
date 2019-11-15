import React, { Component } from 'react'
import memoizeOne from 'memoize-one'
import PropTypes from 'prop-types'
import _isEqual from 'lodash/isEqual'
import View from '../native/View'
import Loading from '../native/Loading'
import Text from '../native/Text'
import Image from '../native/CachedImage'
import Button from '../native/Button'
import IconTheme from '../native/IconTheme'
import withStyle from '../../core/withStyle'

class TinyPlayer extends Component {
  pad =(n, width, z = 0) => {
    n = n + ''
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n
  }
  minutesAndSeconds = (position) => ([
    this.pad(Math.floor(position / 60), 2),
    this.pad(position % 60, 2)
  ])

  minutesAndSecondsMemoize = memoizeOne(this.minutesAndSeconds);

  shouldComponentUpdate (nextProps) {
    const {
      data: oldData,
      loading: oldLoading,
      isPlaying: oldisPlaying,
      adsIsPlaying: oldAdsIsPlaying = false } = this.props
    const { data,
      loading,
      isPlaying,
      adsIsPlaying = false } = nextProps
    const _ads = !_isEqual(oldAdsIsPlaying, adsIsPlaying)
    return !_isEqual(oldData, data) || !_isEqual(oldLoading, loading) || !_isEqual(oldisPlaying, isPlaying) || _ads
  }

  render () {
    // common props between large player
    const {tinyPlayerProps, onPlay, isPlaying, toggleModal, data, loading, loadingClassName, adsIsPlaying} = this.props
    // media object
    const {title, duration} = data
    // specific tiny player props
    const {topIcon, controlIcons, episodeClass, durationClass, containerStyle, image, textProps} = tinyPlayerProps
    const {source, resizeMode, className, style} = image
    const remaining = this.minutesAndSecondsMemoize(+duration)
    return (
      <View className={containerStyle}>
        <Image
          source={source}
          resizeMode={resizeMode}
          className={className}
          style={style}
        />
        <Button onPress={toggleModal} className="buttonContainer">
          <View className={'align-items-center'}>
            <IconTheme {...topIcon}/>
            <Text className={episodeClass} text={adsIsPlaying ? '%ads_label%' : title} {...textProps}/>
            <Text className={durationClass} text={+duration > 1 && `${remaining[0]}:${remaining[1]} min`}/>
          </View>
        </Button>
        {loading
          ? <Loading
            size={'large'}
            color={'white'}
            className={loadingClassName}
          />
          : (
            <Button onPress={onPlay} disabled={adsIsPlaying}>
              {!isPlaying ? <IconTheme
                {
                ...Object.assign({},
                  controlIcons[1],
                  adsIsPlaying && ({
                    style: {
                      color: 'gray'
                    }
                  }))} /> : <IconTheme
                {
                ...Object.assign({},
                  controlIcons[0],
                  adsIsPlaying && ({
                    style: {
                      color: 'gray'
                    }
                  }))} />}
            </Button>
          )
        }
      </View>
    )
  }
}

TinyPlayer.propTypes = {
  containerStyle: PropTypes.any,
  image: PropTypes.any,
  data: PropTypes.object,
  tinyPlayerProps: PropTypes.any,
  isPlaying: PropTypes.bool,
  loading: PropTypes.bool,
  adsIsPlaying: PropTypes.bool,
  onPlay: PropTypes.func,
  toggleModal: PropTypes.func,
  loadingClassName: PropTypes.string
}

TinyPlayer.defaultProps = {
  loadingClassName: 'mt-2'
}

export default withStyle(TinyPlayer)
