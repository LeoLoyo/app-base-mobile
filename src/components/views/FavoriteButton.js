import React from 'react'
import PropTypes from 'prop-types'
import withMutation from '../../core/withMutation'
import withToast from '../../core/withToast'
import { IconThemeButton } from '../../components'
import { isAuthenticated } from '../../core/Auth'

class FavoriteButton extends React.Component {
  static getMutation (props) {
    const { refetchQueries = [] } = props
    return {
      mutation: `mutation toggleFavorites ($_id: String!, $type: String = "Media") { 
        profile { favorite (_id: $_id, type: $type) { ... on Media { _id favorite } 
        ... on Playlist { _id favorite } 
        ... on Show { _id favorite } } 
      } }`,
      refetchQueries
    }
  }

  state = {
    fetching: false
  }

  onPress = async () => {
    const isAuth = await isAuthenticated()
    if (isAuth) {
      this.setState({ fetching: true }, () => {
        this.props.mutation.action({
          variables: { _id: this.props._id || this.props.media, type: this.props.type || 'Media' },
          refetchQueries: this.props.refetchQueries
        })
          .then(resp => {
            this.setState({
              fetching: false
            }, () => {
              if (this.props.favorite) {
                this.props.toast.success('%toast_added_to_favorites%', 2000, 'toast-top pt-2')
              } else {
                this.props.toast.error('%toast_removed_from_favorites%', 2000, 'toast-top pt-2')
              }
            })
          })
          .catch((e) => {
            this.setState({ fetching: false }, () =>
              this.props.toast.info('%toast_favorite_limit%', 2000, 'toast-top pt-2')
            )
          })
      })
    } else {
      this.props.toast.info('%toast_favorite_info%', 2000, 'toast-top toast-info pt-2')
    }
  }

  render () {
    const {
      activeClassName,
      name,
      className,
      disabled,
      activeIconClassName,
      iconClassName,
      iconActive,
      icon,
      imageProps,
      Component,
      titleProps,
      text,
      activeText,
      loadText,
      ...props
    } = this.props

    return (
      <IconThemeButton
        {...props}
        fetching={this.state.fetching}
        loading={this.state.fetching}
        onPress={this.onPress}
        text={this.state.fetching ? loadText : this.props.isFavorite ? activeText : text}
        icon={this.props.favorite ? iconActive : icon}
        className={this.props.favorite && activeClassName ? activeClassName : className}
        iconClassName={this.props.favorite && activeIconClassName ? activeIconClassName : iconClassName}
        disabled={this.state.fetching}
      />
    )
  }
}

FavoriteButton.propTypes = {
  activeClassName: PropTypes.string,
  className: PropTypes.string,
  imageProps: PropTypes.object,
  _id: PropTypes.string,
  type: PropTypes.string,
  isFavorite: PropTypes.bool,
  favorite: PropTypes.bool,
  titleProps: PropTypes.object,
  activeText: PropTypes.string,
  text: PropTypes.string,
  loadText: PropTypes.string,
  Component: PropTypes.func,
  name: PropTypes.string,
  disabled: PropTypes.object,
  activeIconClassName: PropTypes.string,
  iconClassName: PropTypes.string,
  iconActive: PropTypes.string,
  icon: PropTypes.string,
  media: PropTypes.string,
  mutation: PropTypes.shape({
    action: PropTypes.func
  }),
  toast: PropTypes.object,
  refetchQueries: PropTypes.array
}

export default withToast(withMutation(FavoriteButton))
