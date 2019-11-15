import React from 'react'
import PropTypes from 'prop-types'
import merge from 'lodash/merge'
import eq from 'lodash/eq'
import withStyle from '../../core/withStyle'
import withCustomComponent from '../../core/withCustomComponent'
import Button from './Button'
import View from './View'
import IconTheme from './IconTheme'
import Text from './Text'
import AnimatedView from './AnimatedView'

class CollapsableItem extends React.Component {
  static propTypes = {
    containerStyle: PropTypes.object,
    containerStyleOpened: PropTypes.object,
    icon: PropTypes.string,
    iconStyle: PropTypes.object,
    iconStyleOpened: PropTypes.object,
    iconContainerStyle: PropTypes.object,
    iconRight: PropTypes.string,
    iconRightStyle: PropTypes.object,
    iconRightContainerStyle: PropTypes.object,
    text: PropTypes.string,
    textStyle: PropTypes.object,
    textStyleOpened: PropTypes.object,
    onPress: PropTypes.func,
    data: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
    CollectionComponent: PropTypes.func,
    collectionContainerStyle: PropTypes.object,
    collectionItemProps: PropTypes.object,
    isCollectionItem: PropTypes.bool,
    textParams: PropTypes.object,
    isOpened: PropTypes.bool,
    containerText: PropTypes.string
  }

  static defaultProps = {
    containerStyle: {},
    containerStyleOpened: {},
    iconStyle: {},
    iconStyleOpened: {},
    textStyle: {},
    textStyleOpened: {},
    collectionItemProps: {},
    onPress: () => {},
    textParams: {},
    isOpened: false
  }

  state = {
    opened: false
  }

  _onPress = (...props) => {
    this.setState((prevState) => ({opened: !prevState.opened}))
    this.props.onPress(...props)
  }

  render () {
    let {
      containerStyle,
      containerStyleOpened,
      icon,
      iconStyle,
      iconStyleOpened,
      iconContainerStyle,
      iconRight,
      iconRightStyle,
      iconRightContainerStyle,
      text,
      textStyle,
      textStyleOpened,
      textParams,
      collectionContainerStyle,
      collectionItemProps,
      isCollectionItem,
      data,
      containerText,
      CollectionComponent = CollapsableItem,
      ...props} = this.props

    const containerStyles = merge({},
      styles.container,
      this.state.opened ? containerStyleOpened : containerStyle)

    const {backgroundColor} = containerStyles

    // const shouldClear = isCollectionItem && !this.state.opened
    const iconContainerStyles = merge({}, styles.iconContainer, iconContainerStyle)
    const iconStyles = merge({}, styles.icon, iconStyle, this.state.opened && iconStyleOpened)
    const iconRightContainerStyles = merge({}, styles.iconRightContainer, iconRightContainerStyle)
    const iconRightStyles = merge({}, styles.iconRight, iconRightStyle, this.state.opened && iconStyleOpened)
    if (!!data && !this.state.opened) {
      collectionItemProps = merge({}, collectionItemProps, {
        textStyle: {
          ...collectionItemProps.textStyle,
          color: backgroundColor
        }
      })
    }

    const collectionContainerOpened = this.state.opened
      ? merge({}, styles.collectionContainerOpened, collectionContainerStyle) : {}
    const collectionContainerStyles = merge({},
      styles.collectionContainer, {backgroundColor}, collectionContainerOpened)

    return [
      <Button {...props} onPress={this._onPress} key={1} style={{zIndex: 99999}} >
        <View style={containerStyles}>
          {!!icon && (
            <View style={iconContainerStyles}>
              <IconTheme icon={icon} style={iconStyles} className='text-color-white' />
            </View>
          )}
          {!!text && <Text style={this.state.opened && eq(text, containerText)
            ? textStyleOpened : textStyle} text={text} textParams={textParams}/>}
          {!!iconRight && (
            <View style={iconRightContainerStyles}>
              <IconTheme icon={iconRight} style={iconRightStyles} className='text-color-white' />
            </View>
          )}
        </View>
      </Button>,
      Array.isArray(data) && data.length > 0 && (
        <AnimatedView style={collectionContainerStyles} key={2}>
          {data.map(elem => <CollectionComponent
            key={elem._id || elem.id} {...collectionItemProps} {...elem} isCollectionItem />)}
        </AnimatedView>
      )
    ]
  }
}

const styles = {
  container: {
    width: '100%',
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
    justifyContent: 'flex-start',
    zIndex: 999
  },
  iconContainer: {
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10
  },
  icon: {
    fontSize: 20
  },
  iconRightContainer: {
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10
  },
  iconRight: {
    fontSize: 20
  },
  collectionContainer: {
    height: 0,
    borderWidth: 0,
    zIndex: 0,
    overflow: 'hidden'
  },
  collectionContainerOpened: {
    height: 'auto'
  }
}

export default withCustomComponent(
  withStyle(CollapsableItem),
  ['CollectionComponent']
)
