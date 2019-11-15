import React from 'react'
import PropTypes from 'prop-types'
import {nth, eq, merge, defaultsDeep, size} from 'lodash'
import {View, ButtonGroup, ScrollView} from '../../components'
import withCustomComponent from '../../core/withCustomComponent'

class TabContainer extends React.PureComponent {
  state = { selected: 0 }

  renderCurrentTab = () => {
    const {TabItemComponent, data} = this.props
    const {selected} = this.state
    return (
      <TabItemComponent data={nth(data, selected)} />
    )
  }

  _onPressTabItem = ({currentTab}) => {
    this.setState({selected: currentTab})
  }

  renderTabManager = () => {
    const {data, styles} = this.props
    const {selected} = this.state
    const {
      containerStyle,
      btnStyle,
      btnStyleActive,
      textStyle,
      textStyleActive
    } = defaultsDeep(styles, defaultStyles)
    const options = (data || []).map(({live}, index) => ({
      name: live || index,
      style: eq(selected, index) ? merge({}, btnStyle, btnStyleActive) : btnStyle,
      textProps: { text: live || `live-event-${index}`,
        style: eq(selected, index)
          ? merge({}, textStyle, textStyleActive) : textStyle }
    }))

    return (
      <View style={containerStyle}>
        <ScrollView horizontal>
          <ButtonGroup
            extraClassName='flex-1 flex-row'
            name='currentTab'
            options={options}
            onChange={this._onPressTabItem}/>
        </ScrollView>
      </View>
    )
  }

  render () {
    const {data} = this.props
    return size(data) ? (
      <View {...this.props}>
        {this.renderTabManager()}
        {this.renderCurrentTab()}
      </View>
    ) : null
  }
}

const defaultStyles = {
  containerStyle: {
    flex: 1
  },
  btnStyle: {
    height: '20rem',
    flex: 1,
    width: '100rem',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)'
  },
  btnStyleActive: {
    backgroundColor: 'green'
  },
  textStyle: {
    color: 'black'
  },
  textStyleActive: {
    color: 'white'
  }
}

TabContainer.propTypes = {
  button: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.any,
  data: PropTypes.array,
  onChange: PropTypes.func,
  onToggle: PropTypes.func,
  options: PropTypes.array,
  text: PropTypes.string,
  styles: PropTypes.object,
  TabItemComponent: PropTypes.any,
  title: PropTypes.shape({
    className: PropTypes.string,
    text: PropTypes.string
  }),
  value: PropTypes.string
}

TabContainer.defaultProps = {}

export default withCustomComponent(TabContainer, ['TabItemComponent', 'SeparatorComponent'])
