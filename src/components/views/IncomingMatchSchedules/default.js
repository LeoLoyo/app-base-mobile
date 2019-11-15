export default {
  boxProps: {
    className: 'bg-white justify-content-center align-items-center border-1 border-color-dark',
    style: {
      minWidth: 210
    }
  },
  imageWrapper: {
    style: {
      width: '100%',
      height: '100%'
    }
  },
  textShowProps: {
    className: 'text-color-white',
    style: {
      fontSize: 20,
      textAlign: 'center'
    }
  },
  wrapperOpponentsProps: {
    className: 'w-100 flex-row',
    style: {}
  },
  boxOpponentProps: {
    className: 'h-viewport-10 w-viewport-15 align-items-center justify-content-center'
  },
  opponentImageProps: {
    className: 'w-100',
    resizeMode: 'contain',
    style: {
      aspectRatio: 1
    }
  },
  boxScheduleInfoProps: {
    className: 'w-viewport-20 align-items-center justify-content-center bg-white'
  },
  scheduleInfoIconProps: {
    isScheduledProps: {
      className: 'text-color-dark',
      icon: 'today',
      style: {}
    },
    isNotScheduledProps: {
      className: 'text-color-dark',
      icon: 'time',
      style: {}
    }
  },
  scheduleInfoTimeProps: {
    className: 'text-color-black'
  },
  scheduleInfoDateProps: {
    className: 'text-color-black'
  },
  wrapperDescriptionProps: {
    className: 'w-100 flex-row'
  },
  descriptionSchedulesProps: {
    separator: {
      hasSeparator: true,
      separatorProps: {
        className: 'text-color-dark',
        text: 'v/s',
        style: {}
      }
    },
    textOpponentProps: {
      className: 'text-color-dark'
    }
  },
  linearGradientViewProps: {
    colors: ['transparent', '#000', '#000'],
    style: {
      flexDirection: 'row',
      opacity: 0.9,
      position: 'absolute',
      justifyContent: 'space-between',
      paddingHorizontal: 10,
      paddingTop: 10,
      alignItems: 'center',
      bottom: 0,
      height: 50,
      width: '100%'
    }
  }
}
