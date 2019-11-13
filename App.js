import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import LinearGradient from 'react-native-linear-gradient';

class HomeScreen extends React.Component {
  componentDidMount() {
    setTimeout(() => {
      this.props.navigation.navigate('Home2')
    }, 500)
  }
  render() {
    return (
      <View>
        <Text>OTTMobileApp</Text>
      </View>
    );
  }
}
class HomeScreen2 extends React.Component {

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.linearGradient}>
          <TouchableOpacity>
          <Text style={styles.buttonText}>
            Sign in with Facebook
          </Text>
          </TouchableOpacity>
        </LinearGradient>
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


// Later on in your styles..
var styles = StyleSheet.create({
  linearGradient: {
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Gill Sans',
    textAlign: 'center',
    margin: 10,
    color: '#ffffff',
    backgroundColor: 'transparent',
  },
});