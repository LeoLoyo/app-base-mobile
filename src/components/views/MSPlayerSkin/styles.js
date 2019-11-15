import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  playerWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'black'
  },
  transparentPlayerWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent'
  },
  player: {
    flex: 1,
    backgroundColor: '#000000'
  },
  top: {
    zIndex: 99,
    width: '100%',
    flexDirection: 'row'
  },
  bottom: {
    zIndex: 99,
    bottom: 0,
    width: '100%'
  },
  bottomBar: {
    zIndex: 99,
    bottom: 65,
    width: '100%',
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  topLeft: {
    zIndex: 99,
    position: 'absolute',
    top: 8,
    left: 8
  },
  topRight: {
    zIndex: 99,
    position: 'absolute',
    top: 8,
    right: 8
  },
  playerHeader: {
    // flex: 1,
  },

  // common
  playerBaseControl: {
    backgroundColor: 'transparent'
  },

  // player button
  playerButtonImage: {
    width: 25,
    height: 25,
    marginRight: 10
  },

  // player controls
  playerControlsWrapper: {
    position: 'absolute',
    width: '100%',
    zIndex: 9999
  },
  playerControls: {
    width: '100%',
    padding: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  playerControlsButton: {
    opacity: 1,
    backgroundColor: 'transparent',
    padding: 0
  },
  playerControlsButtonContent: {
    padding: 4
  },
  playerControlsButtonGroup: {
    flexDirection: 'row',
    padding: 20,
    minWidth: 10,
    marginHorizontal: 5
  },
  playerControlsButtonGroupRight: {
    flex: 0.25,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  // player header
  playerHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  playerHeaderTitleStyle: {
    color: 'white',
    flex: 1,
    fontSize: 20
  },
  playerHeaderLiveBadge: {
    backgroundColor: '#BEEA57',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    marginRight: 10
  },
  playerHeaderLiveBadgeText: {
    color: 'white',
    paddingVertical: 6
  },
  playerTimeWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    zIndex: 99999
  },
  playerCurrentTime: {
    color: 'white'
  },
  playerDuration: {
    color: '#777777'
  },
  playerFullScreen: {
    height: '100%',
    width: '100%',
    marginBottom: 25
  },
  playerOutFullScreen: {
    width: '100%',
    aspectRatio: 16 / 9
  },
  loading: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  geoRestriction: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black'
  }
})
