/**
 * Created by wangdi on 4/11/16.
 */
import React, { Component } from 'react';
import { Dimensions, View, StyleSheet, AsyncStorage, TouchableOpacity, Image, Text, ToastAndroid } from 'react-native';

export default class MySettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      loading: false,
      bridgeList: null,
      userInfo: {
        nickName: '',
        avatar: ''
      }
    }
  }
  // 配置页面导航选项
  static navigationOptions = ({ navigation }) => ({
    title: 'HOME',
    titleStyle: { color: '#ff00ff' },
    headerStyle: { backgroundColor: 'red' }
  })
  componentDidMount() {
    this._GetUserInfo()
  }
  _messageManage() {
    this.props.navigation.navigate('MessageManage')
  }
  _uploadManage() {
    this.props.navigation.navigate('UploadManage')
  }
  _logOut = async () => {
    await AsyncStorage.removeItem('token')
    this.props.navigation.navigate('Login')
  }
  clearCache() {
    this._storeData()
    ToastAndroid.show("清除本地缓存成功！", ToastAndroid.CENTER, ToastAndroid.CENTER)
  }
  _storeData = async (bridgeList) => {
    try {
      AsyncStorage.removeItem('BridgeList')
      AsyncStorage.removeItem('StorageBridgeList')
    } catch (error) {
      // Error saving data
    }
  }
  _GetUserInfo = async () => {
    try {
      var value = await AsyncStorage.getItem("token");
      if (value) {
        this.setState({ token: value });
        console.log('maps:' + this.state.token)
      }
    } catch (error) {
      this._appendMessage('AsyncStorage error: ' + error.message);
    }
    fetch("http://demo.d9tec.com/api/app/GetUserInfo", {
      method: "POST",
      headers: {
        Authorization: "Bearer  " + this.state.token,
        "Content-Type": "application/json"
      }
    })
      .then(response => {
        if (response.status == 401) {
          this.props.navigation.navigate('Login')
        } else {
          let userInfo = JSON.parse(response._bodyInit).Result
          this.state.userInfo.nickName = userInfo.NickName
          this.state.userInfo.avatar = 'http://demo.d9tec.com/Resources/master/' + userInfo.Face
          this.setState({ userInfo: this.state.userInfo })
        }
      })
      .catch(error => {
        console.error(error);
      });
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.item1}>
          <Image style={styles.avatar} source={{ uri: this.state.userInfo.avatar }} />
          <Text>{this.state.userInfo.nickName}</Text>
        </View>
        <View style={styles.item2}>
          <TouchableOpacity onPress={() => {
            this.props.navigation.navigate('MessageManage')
          }} >
            <Text style={styles.itemTxt}>消息推送</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.item3}>
          <TouchableOpacity onPress={() => {
            this.props.navigation.navigate('UploadManage')
          }} >
            <Text style={styles.itemTxt}>上传管理</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.item3}>
          <TouchableOpacity onPress={() => this.clearCache()} >
            <Text style={styles.itemTxt}>清除缓存</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.item4}>
          <TouchableOpacity onPress={() => this._logOut()} >
            <Text style={{ color: '#EECB73', fontSize: 20 }}>退出登录</Text>
          </TouchableOpacity>
        </View>
      </View >
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#F8F6F7',
  },
  item1: {
    width: Dimensions.get('window').width,
    height: 160,
    backgroundColor: '#2B82EC',
    justifyContent: 'center',
    alignItems: 'center'
  },
  itemTxt: {
    fontSize: 17,
  },
  item2: {
    width: Dimensions.get('window').width,
    height: 60,
    justifyContent: 'center',
    borderBottomColor: '#d6d7da',
    borderBottomWidth: 0.5,
    backgroundColor: '#FFFFFF',
    paddingLeft: 30,

  },
  item3: {
    width: Dimensions.get('window').width,
    height: 60,
    justifyContent: 'center',
    borderBottomColor: '#d6d7da',
    borderBottomWidth: 0.5,
    backgroundColor: '#FFFFFF',
    paddingLeft: 30,

  },
  item4: {
    width: Dimensions.get('window').width,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF'

  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnmargin: {

  }
});