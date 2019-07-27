/**
 * Created by wangdi on 4/11/16.
 */
import React, { Component } from 'react';
import { Text, View, StyleSheet, AsyncStorage, Platform, TouchableOpacity, Image, TextInput, backHandler } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Button from '../../component/Button';
import px2dp from '../util/px2dp';

export default class Maps extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: ''
    }
  }

  componentDidMount() {

    // backHandler.addEventListener('hardwareBackPress', this.handleBack);
  }

  componentWillUnmount() {
    // backHandler.removeEventListener('hardwareBackPress', this.handleBack);
  }

  _handleBack() {
    const navigator = this.props.navigator;
    if (navigator && navigator.getCurrentRoutes().length > 1) {
      navigator.pop()
      return true;
    }
    return false;
  }
  _GetUserInfo = async () => {
    try {
      var value = await AsyncStorage.getItem("token");
      if (value !== null) {
        this.setState({ token: value });
        console.log('maps:' + this.state.token)
      } else {
        this.props.navigation.navigate('Login')
      }
    } catch (error) {
      this._appendMessage('AsyncStorage error: ' + error.message);
    }
    fetch("http://hb.jgy-tec.com/api/app/GetUserInfo", {
      method: "POST",
      headers: {
        Authorization: "Bearer  " + this.state.token,
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log('getUserInfo:' + JSON.stringify(responseJson))
        if (!responseJson) {
          this.props.navigation.navigate('Login')
        }

        return responseJson;
      })
      .catch(error => {
        console.error(error);
      });
  }


  render() {
    return (
      <View style={styles.view}>
        <Button
          onPress={() => this._GetUserInfo()}
          title={'打开详情页'}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: 'rgb(22,131,251)'
  },
  actionBar: {
    marginTop: (Platform.OS === 'ios') ? px2dp(10) : 0,
  },
  logo: {
    alignItems: 'center',
    marginTop: px2dp(40)
  },
  edit: {
    height: px2dp(40),
    fontSize: px2dp(13),
    backgroundColor: '#fff',
    paddingLeft: px2dp(15),
    paddingRight: px2dp(15)
  },
  editView1: {
    height: px2dp(48),
    backgroundColor: 'white',
    justifyContent: 'center',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3
  },
  editView2: {
    height: px2dp(48),
    backgroundColor: 'white',
    justifyContent: 'center',
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3
  },
  editGroup: {
    margin: px2dp(20)
  },
  textButtonLine: {
    marginTop: px2dp(12),
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  thirdPartyView: {
    flex: 1,
    marginTop: px2dp(10),
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-around'
  }

});