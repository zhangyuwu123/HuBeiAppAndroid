/**
 * Created by wangdi on 4/11/16.
 */
import React, { Component } from 'react';
import { Text, Button, View, StyleSheet, AsyncStorage, ToastAndroid, TouchableOpacity, Image } from 'react-native';

export default class Record extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      loading: false,
      bridgeList: null
    }
  }

  componentDidMount() {
    this._getToken()
  }
  _storeData = async (bridgeList) => {
    try {
      const storeBridgeList = await AsyncStorage.getItem('BridgeList');
      // 提取新增的记录
      let qlbm = []
      console.log(storeBridgeList, storeBridgeList instanceof Array)
      if (storeBridgeList instanceof Array) {
        storeBridgeList = JSON.parse(storeBridgeList)
        bridgeList.map(item => {
          storeBridgeList.map((item1, index) => {
            console.log("storeBridgeList", item.QLBM, item1.QLBM)
            if (item.QLBM == item1.QLBM) {
              item1.SGDW = item.SGDW
              item1.JLDW = item.JLDW
              item1.JHKGSJ = item.JHKGSJ
              item1.YJJGSJ = item.YJJGSJ
            }
            qlbm.push(item.QlxxId)
          })
        })
        let str = qlbm.join(',')
        bridgeList.map((item) => {
          if (str.indexOf(item.QlxxId) < 0) {
            storeBridgeList.push(item)
          }
        })
        await AsyncStorage.removeItem('BridgeList')
        await AsyncStorage.setItem('BridgeList', JSON.stringify(storeBridgeList))
      } else {
        await AsyncStorage.setItem('BridgeList', JSON.stringify(bridgeList))
      }

    } catch (error) {
      console.log('error:', error)
    }
  }
  _getToken = async () => {
    try {
      var value = await AsyncStorage.getItem("token");
      if (value !== null) {
        this.setState({ token: value });
        console.log('maps:' + this.state.token)
      } else {
        this.props.navigation.navigate('Login')
      }
    } catch (error) {
      console.log('AsyncStorage error: ' + error.message);
    }
  }
  _DangerousBridge() {
    this.props.navigation.navigate('BridgeList')
  }
  _GetUserInfo = async () => {
    return
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
  _UpdateBridgeList() {
    this.setState({ loading: true })
    fetch("http://hb.jgy-tec.com/api/app/getxfqlxxs", {
      method: "POST",
      headers: {
        Authorization: "Bearer  " + this.state.token,
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log('_UpdateBridgeList:' + JSON.stringify(responseJson))
        if (!responseJson) {
          this.props.navigation.navigate('Login')
        } else {
          this._storeData(responseJson.Result)
          this.setState({ loading: false })
          ToastAndroid.show('更新完成', ToastAndroid.CENTER, ToastAndroid.CENTER)
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.item} >
          <TouchableOpacity style={styles.btn1} onPress={this._GetUserInfo}>
            <Image style={styles.cj5} source={require('../images/cj1.jpg')}>
              <Text style={styles.text} >公路大中修工程进度</Text>
            </Image>
          </TouchableOpacity>
          <View style={styles.btn2}>
            <TouchableOpacity style={styles.btnmargin} onPress={this._GetUserInfo}>
              <Image style={styles.cj5Down} source={require('../images/icon-download.png')} />
              <Text style={styles.textDown} >下载更新</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.item}>
          <TouchableOpacity style={styles.btn1} onPress={this._GetUserInfo}>
            <Image style={styles.cj5} source={require('../images/cj2.jpg')}>
              <Text style={styles.text} >生命安全防护工程进度</Text>
            </Image>
          </TouchableOpacity>
          <View style={styles.btn2}>
            <TouchableOpacity style={styles.btnmargin} onPress={this._GetUserInfo}>
              <Image style={styles.cj5Down} source={require('../images/icon-download.png')} />
              <Text style={styles.textDown} >下载更新</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.item}>
          <TouchableOpacity style={styles.btn1} onPress={() => this._DangerousBridge()}>
            <Image style={styles.cj5} source={require('../images/cj3.jpg')}>
              <Text style={styles.text} >危桥改造工程进度</Text>
            </Image>
          </TouchableOpacity>
          <View style={styles.btn2}>
            <TouchableOpacity style={styles.btnmargin} onPress={() => this._UpdateBridgeList()}>
              <Image style={styles.cj5Down} source={require('../images/icon-download.png')} />
              <Text style={styles.textDown} >下载更新</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.item}>
          <TouchableOpacity style={styles.btn1} onPress={this._DangerousBridge}>
            <Image style={styles.cj5} source={require('../images/cj4.jpg')}>
              <Text style={styles.text} >灾害防治工程进度</Text>
            </Image>
          </TouchableOpacity>
          <View style={styles.btn2}>
            <TouchableOpacity style={styles.btnmargin} onPress={this._GetUserInfo}>
              <Image style={styles.cj5Down} source={require('../images/icon-download.png')} />
              <Text style={styles.textDown} >下载更新</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.item}>
          <TouchableOpacity style={styles.btn1} onPress={this._DangerousBridge}>
            <Image style={styles.cj5} source={require('../images/cj5.jpg')}>
              <Text style={styles.text} >水毁修复工程进度</Text>
            </Image>
          </TouchableOpacity>
          <View style={styles.btn2}>
            <TouchableOpacity style={styles.btnmargin} onPress={this._GetUserInfo}>
              <Image style={styles.cj5Down} source={require('../images/icon-download.png')} />
              <Text style={styles.textDown} >下载更新</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn1: {
    width: 200
  },
  btn2: {
    width: 100,
    marginLeft: 10
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnmargin: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'gray',
    width: 110,
    height: 40,
  },
  cj5: {
    width: 200,
    height: 60,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

  },
  text: {
    color: 'white',
    fontSize: 17,
  },
  cj5Down: {
    width: 20,
    height: 20,
  },
  textDown: {
    color: '#E5E5E5',
    fontSize: 16,
  },
});