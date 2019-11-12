import React from 'react';
import { View, Text } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Orientation from 'react-native-orientation-locker'
import { MediastreamPlayer, MediastreamPlayerModules } from 'react-native-mediastream-player'

class HomeScreen extends React.Component {
  componentDidMount(){
    setTimeout(()=>{
      
      // this.props.navigation.navigate('Home2')
    // Orientation.lockToLandscape()
    }, 5000)
  }
  componentWillUnmount(){
    MediastreamPlayerModules.dismissMediastreamPlayer()
  }
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <MediastreamPlayer
          style={{ width: '100%', height:'100%'}}
          showControls
          autoPlay
          type="VOD"
          environment="DEV"
          live={false}
          id="5db9ed49d9ca435ebc25c283"
        />
      </View>
    );
  }
}
class HomeScreen2 extends React.Component {
  
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Home Screen2</Text>
      </View>
    );
  }
}

const AppNavigator = createStackNavigator({
  Home: {
    screen: HomeScreen,
  },
  Home2: {
    screen: HomeScreen2,
  },
});

export default createAppContainer(AppNavigator);