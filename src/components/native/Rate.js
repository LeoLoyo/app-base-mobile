import React from 'react'
import PropTypes from 'prop-types'
import range from 'lodash/range'
import gql from 'graphql-tag'
import View from './View'
import IconThemeButton from './IconThemeButton'
import withMutation from '../../core/withMutation'
import withToast from '../../core/withToast'
import { isAuthenticated } from '../../core/Auth'

class Rate extends React.Component {
  static propTypes = {
    toast: PropTypes.object,
    fetching: PropTypes.bool,
    style: PropTypes.object,
    iconStyle: PropTypes.object,
    ratedColor: PropTypes.string,
    unratedColor: PropTypes.string,
    icon: PropTypes.string.isRequired,
    rate: PropTypes.number,
    disabled: PropTypes.bool,
    count: PropTypes.number,
    media: PropTypes.string.isRequired,
    mutation: PropTypes.shape({
      action: PropTypes.func
    })
  }
  static defaultProps = {
    onRateChange: () => {},
    count: 5,
    ratedColor: 'blue',
    unratedColor: 'gray',
    disabled: false,
    rate: 0,
    fetching: false,
    onPress: () => {}
  }

  state = {
    count: 5,
    rateArray: [1, 2, 3, 4, 5],
    rate: 0
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    if (nextProps.count === prevState.count && nextProps.rate === prevState.rate) return null
    return {
      count: nextProps.count,
      rateArray: range(1, nextProps.count + 1),
      rate: nextProps.rate
    }
  }

  static getMutation (props) {
    return {
      mutation: `mutation rateMedia ($media: String! $score: Int!) { 
        profile { rate (media:$media score:$score) { _id rate } } 
      }`
    }
  }

  _onRate = async (rate) => {
    const isAuth = await isAuthenticated()
    if (!isAuth) return this.props.toast.info('%toast_favorite_info%', 2000, 'toast-top toast-info')
    if (!this.props.disabled && !this.props.fetching) {
      this.setState({
        fetching: true,
        disabled: true
      })
      this.props.mutation.action({
        variables: {
          media: this.props.media,
          score: rate
        },
        refetchQueries: [{
          variables: {
            media: this.props.media
          },
          query: gql`query($media: String!)  { getMedia (_id: $media) { _id rate } }`
        }]
      })
        .then(resp => {
          this.setState({
            fetching: false,
            disabled: false
          }, () => {
            this.props.toast.success('%toast_media_rated%', 2000, 'toast-top')
          })
        })
        .catch((err) => {
          this.props.toast.error('%toast_media_already_rated%', 2000, 'toast-bottom', err)
        })
    }
  }

  render () {
    const {rate} = this.state
    const {style, iconStyle, ratedColor, unratedColor, icon} = this.props
    return (
      <View className='flex-row justify-content-space-between align-items-center' style={style}>
        {this.state.rateArray.map(item => {
          const color = item <= rate ? {color: ratedColor} : {color: unratedColor}
          return (
            <IconThemeButton
              key={item}
              iconStyle={{...iconStyle, ...color}}
              onPress={() => this._onRate(item)}
              icon={icon} />
          )
        })}
      </View>
    )
  }
}

export default withToast(withMutation(Rate, ['Component']))
