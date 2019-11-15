/* eslint-disable react/prop-types */
import React from 'react'
import PropTypes from 'prop-types'
import get from 'lodash/get'
import merge from 'lodash/merge'
import withStyle from '../../core/withStyle'
import withCustomComponent from '../../core/withCustomComponent'
import View from './View'
import IconTheme from './IconTheme'
import CheckBox from './CheckBox'
import Text from './Text'
import Button from './Button'
import AnimatedView from './AnimatedView'

const noop = () => null

const DefaultHeaderComponent = ({
  containerStyle,
  icon,
  iconStyle,
  iconContainerStyle,
  iconRight,
  activeIconRight,
  iconRightStyle,
  iconRightContainerStyle,
  showChecked,
  checkBoxStyle,
  contentContainerStyle = {},
  checkBoxProps = {},
  text,
  textStyle,
  textParams,
  collectionContainerStyle,
  collectionItemProps,
  isCollectionItem,
  data,
  TogglerComponent = Button,
  _onPress,
  onPressCheckbox = noop,
  isOpened,
  style,
  checkBox = false,
  ...props
}) => {
  const containerStyles = merge({}, styles.container, containerStyle)
  const {backgroundColor} = containerStyles

  const iconContainerStyles = merge({}, styles.iconContainer, iconContainerStyle)
  const iconStyles = merge({}, styles.icon, iconStyle)
  const iconRightContainerStyles = merge({}, styles.iconRightContainer, iconRightContainerStyle)
  const iconRightStyles = merge({}, styles.iconRight, iconRightStyle)
  const textStyles = get(collectionItemProps, 'textStyle', {})
  const defaultStyles = {zIndex: 99999}

  if (!!data && !isOpened) {
    collectionItemProps = merge({}, collectionItemProps, {
      textStyle: {
        ...textStyles,
        color: backgroundColor
      }
    })
  }

  const _contentComponent = () => {
    return (
      <View style={containerStyles}>
        {!!icon && (
          <View style={iconContainerStyles}>
            <IconTheme icon={icon} style={iconStyles} className='text-color-white' />
          </View>
        )}
        {checkBox && <CheckBox {...checkBoxProps}
          onClick={() => onPressCheckbox({toggle: false, ...props})} style={contentContainerStyle}/>}
        {!!text && !checkBox && <Text style={textStyle} text={text} textParams={textParams}/>}
        {!!iconRight && (
          <Button style={!text && !icon ? containerStyles : {}} onPress={() => _onPress({toggle: true})}>
            <View style={iconRightContainerStyles}>
              <IconTheme icon={isOpened ? activeIconRight || iconRight : iconRight}
                style={iconRightStyles} className='text-color-white' />
            </View>
          </Button>
        )}
      </View>
    )
  }

  return (
    <TogglerComponent {...props} style={{...style, ...defaultStyles}}>
      {_contentComponent()}
    </TogglerComponent>
  )
}

class CollapsableItem extends React.Component {
  static propTypes = {
    containerStyle: PropTypes.object,
    icon: PropTypes.string,
    iconStyle: PropTypes.object,
    iconContainerStyle: PropTypes.object,
    iconRight: PropTypes.string,
    iconRightStyle: PropTypes.object,
    iconRightContainerStyle: PropTypes.object,
    text: PropTypes.string,
    textStyle: PropTypes.object,
    onPress: PropTypes.func,
    data: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
    CollectionComponent: PropTypes.func,
    collectionContainerStyle: PropTypes.object,
    collectionItemProps: PropTypes.object,
    isCollectionItem: PropTypes.bool,
    HeaderComponent: PropTypes.func,
    textParams: PropTypes.object,
    isOpened: PropTypes.bool,
    togglable: PropTypes.bool
  }

  static defaultProps = {
    containerStyle: {},
    iconStyle: {},
    textStyle: {},
    collectionItemProps: {},
    onPress: () => {},
    textParams: {},
    isOpened: false
  }

  state = {
    opened: false,
    toggle: false
  }

  componentDidMount () {
    this.props.isOpened && this.setState({opened: true, toggle: true})
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevState.opened && this.props.togglable && (this.props.isOpened !== this.state.opened)) {
      this.setState({opened: false})
    }
  }
  _onPress = ({...props}, ...args) => {
    this.setState((prevState) => ({opened: !prevState.opened}))
    this.props.onPress({...props, ...args})
  }

  render () {
    let {
      containerStyle,
      collectionContainerStyle,
      collectionItemProps,
      isCollectionItem,
      data,
      CollectionComponent = CollapsableItem,
      HeaderComponent = DefaultHeaderComponent
    } = this.props
    const containerStyles = merge({}, styles.container, containerStyle)
    const {backgroundColor} = containerStyles
    const collectionContainerOpened = this.state.opened
      ? merge({}, styles.collectionContainerOpened, collectionContainerStyle) : {}
    const collectionContainerStyles = merge({},
      styles.collectionContainer, {backgroundColor}, collectionContainerOpened)
    return [ <HeaderComponent key={1} {...this.props}
      isOpened={this.state.opened} _onPress={this._onPress}/>,
    Array.isArray(data) && data.length > 0 && (
      <AnimatedView style={collectionContainerStyles} key={2}>
        {data.map(elem => <CollectionComponent isOpened={this.state.opened}
          key={elem._id || elem.id} {...elem} {...collectionItemProps}
          isCollectionItem={isCollectionItem} />)}
      </AnimatedView>
    )
    ]
  }
}

const styles = {
  container: {
    width: '100%',
    flexDirection: 'row',
    height: '20rem',
    alignItems: 'center',
    justifyContent: 'flex-start',
    zIndex: 999
  },
  iconContainer: {
    width: '25rem',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: '5rem'
  },
  icon: {
    fontSize: '10rem'
  },
  iconRightContainer: {
    width: '25rem',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: '5rem'
  },
  iconRight: {
    fontSize: '10rem'
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
  ['CollectionComponent', 'HeaderComponent', 'TogglerComponent']
)
