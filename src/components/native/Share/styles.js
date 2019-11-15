import {StyleSheet, Dimensions} from 'react-native'
const {height} = Dimensions.get('window')

StyleSheet.create({
  containerModal: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingBottom: height * 0.15,
    justifyContent: 'center'
  },
  containerClose: {
    flexDirection: 'row',
    width: '80%',
    justifyContent: 'flex-end'
  },
  iconClose: {
    color: 'white',
    fontSize: 30,
    marginVertical: 5
  },
  container: {
    borderRadius: 10,
    width: '80%',
    backgroundColor: 'white',
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 20
  },
  image: {
    height: 150,
    width: 150
  },
  subTitle: {
    fontSize: 15
  },
  textInsta: {
    fontSize: 15,
    width: '70%'
  },
  containerInsta: {
    width: '95%',
    height: '10%',
    marginBottom: 10
  },
  gradientInsta: {
    borderRadius: 30,
    flexDirection: 'row',
    width: '100%',
    height: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingStart: 20
  },
  iconInsta: {
    color: 'white',
    fontSize: 25,
    marginEnd: 20
  },
  containerMore: {
    flexDirection: 'row',
    width: '95%',
    height: '10%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingStart: 20
  },
  iconMore: {
    color: 'black',
    fontSize: 25,
    marginEnd: 20
  },
  textMore: {
    fontSize: 15,
    color: 'black'
  }
})
