import React from 'react'
import PropTypes from 'prop-types'
import Button from '../native/Button'
import IconTheme from '../native/IconTheme'
import Loading from '../native/Loading'
import View from '../native/View'

const Controls = ({
  isPlaying,
  onPlay,
  onBackward,
  onNext,
  skipForward,
  skipBackward,
  textColor,
  containerStyle,
  loading,
  currentIndexItem,
  playlistSize,
  adsIsPlaying
}) => loading

  ? (
    <Loading color={'white'} size={'large'} className={'mb-5'} />
  )
  : (
    <View className={containerStyle}>
      <Button onPress={onBackward} disabled={playlistSize > 0 ? (currentIndexItem === 0) : true}>
        <IconTheme
          icon={'skip-back'}
          className={`font-size-3 ${textColor} ${(playlistSize > 0
            ? (currentIndexItem === 0)
            : true)
            ? 'btn-player-disabled'
            : 'btn-player-enabled'}
          `}
        />
      </Button>
      <Button onPress={skipBackward} disabled={adsIsPlaying} >
        <IconTheme
          icon={'replay-10'}
          className={`font-size-3 ${textColor} 'btn-player-enabled'}`}
          config={{ useIconSet: 'materialIcons' }}
          {...Object.assign({},
            adsIsPlaying && ({style: { color: 'gray' }})
          )}
        />
      </Button>

      {!isPlaying && !loading ? (
        <Button onPress={onPlay} disabled={adsIsPlaying}>
          <IconTheme
            icon={'play-circle'}
            className={`font-size-6 ${textColor}`}
            {...Object.assign({},
              adsIsPlaying && ({style: { color: 'gray' }})
            )}
          />
        </Button>)
        : (
          <Button onPress={onPlay} disabled={adsIsPlaying}>
            <IconTheme
              icon={'pause-circle'}
              className={`font-size-6 ${textColor}`}
              {...Object.assign({},
                adsIsPlaying && ({style: { color: 'gray' }})
              )}
            />
          </Button>
        )
      }
      <Button onPress={skipForward} disabled={adsIsPlaying}>
        <IconTheme
          icon={'forward-10'}
          className={`font-size-3 ${textColor} 'btn-player-enabled'`}
          config={{ useIconSet: 'materialIcons' }}
          {...Object.assign({},
            adsIsPlaying && ({style: { color: 'gray' }})
          )}
        />
      </Button>
      <Button onPress={onNext} disabled={playlistSize > 0 ? currentIndexItem === (playlistSize - 1) : true}>
        <IconTheme
          icon={'skip-forward'}
          className={`font-size-3 ${textColor} ${(playlistSize > 0
            ? currentIndexItem === (playlistSize - 1)
            : true)
            ? 'btn-player-disabled'
            : 'btn-player-enabled'}`}
        />
      </Button>
    </View>
  )

Controls.propTypes = {
  isPlaying: PropTypes.bool,
  adsIsPlaying: PropTypes.bool,
  onPlay: PropTypes.func,
  onBackward: PropTypes.func,
  onNext: PropTypes.func,
  skipForward: PropTypes.func,
  skipBackward: PropTypes.func,
  loading: PropTypes.bool,
  textColor: PropTypes.any,
  containerStyle: PropTypes.any,
  currentIndexItem: PropTypes.number,
  playlistSize: PropTypes.number
}

Controls.defaultProps = {
  onShare: () => {
  },
  containerStyle: 'flex-row align-items-center justify-content-space-between w-80 mb-3',
  textColor: 'text-color-white'
}

const ControlComponent = React.memo(Controls)
export default ControlComponent
