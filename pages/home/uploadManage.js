/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  ScrollView,
  StyleSheet,
  Image,
  Text,
  View,
  TextInput,
  Dimensions,
  Button,
  FlatList,
  AsyncStorage,
  CheckBox,
  TouchableOpacity,
  ToastAndroid
} from 'react-native';

export default class UploadManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      searchTxt: '检索',
      initBridgeList: null,
      originBridgeList: null,
      bridgeList: null,
      uploadList: [],
      unUploadList: [],
      checkedList: [],
      checkedAll: false,
      tabName: 'uploaded'
    }
  }

  componentDidMount() {
    this._getToken()
    this._GetAsyncStorageBridgeList()
  }

  componentWillUnmount() {
    // backHandler.removeEventListener('hardwareBackPress', this.handleBack);
  }
  _getToken = async () => {
    try {
      var value = await AsyncStorage.getItem("token");
      if (value !== null) {
        this.setState({ token: value });
      } else {
        this.props.navigation.navigate('Login')
      }
    } catch (error) {
      this._appendMessage('AsyncStorage error: ' + error.message);
    }
  }
  _GetAsyncStorageBridgeList = async () => {
    try {
      const value = await AsyncStorage.getItem('StorageBridgeList');
      const originBridgeList = await AsyncStorage.getItem('BridgeList');
      if (originBridgeList) {
        this.state.originBridgeList = originBridgeList
      }
      if (value !== []) {
        // We have data!!
        this.setState({ initBridgeList: JSON.parse(value) })
        this.state.initBridgeList.forEach(item => {
          if (item.uploadStatus == "uploaded") {
            this.state.uploadList.push(item)
          } else {
            this.state.unUploadList.push(item)
          }
        })
        this.state.uploadList.forEach(item => {
          this.state.checkedList.push({ QLBM: item.QLBM, checked: false })
        })
        this.setState({ bridgeList: this.state.uploadList, checkedList: this.state.checkedList })
      }
    } catch (error) {
      // Error retrieving data
    }
  }
  _storeData = async (bridgeList) => {
    try {
      await AsyncStorage.removeItem('StorageBridgeList')
      await AsyncStorage.setItem('StorageBridgeList', JSON.stringify(bridgeList))
    } catch (error) {
      // Error saving data
    }
  }
  handleChange(obj) {
    let checkedAll = true
    this.state.checkedList.map(item => {
      if (item.QLBM == obj.QLBM) {
        item.checked = !item.checked
        console.log(item)
      }
      if (!item.checked) {
        checkedAll = false
      }
    })
    console.log(obj.QLBM)
    this.setState({ checkedList: this.state.checkedList, checkedAll: checkedAll })
  }
  _btnUploaded() {
    this.state.tabName = 'uploaded'
    this.state.checkedList = []
    this.state.uploadList.map(item => {
      this.state.checkedList.push({ QLBM: item.QLBM, checked: false })
    })
    this.setState({ bridgeList: this.state.uploadList, checkedList: this.state.checkedList, checkedAll: false })
  }
  _btnUnUpload() {
    this.state.tabName = 'unUploaded'
    this.state.checkedList = []
    this.state.unUploadList.map(item => {
      this.state.checkedList.push({ QLBM: item.QLBM, checked: false })
    })
    this.setState({ bridgeList: this.state.unUploadList, checkedList: this.state.checkedList, checkedAll: false })
  }
  _checkedAll() {
    this.state.checkedAll = !this.state.checkedAll
    this.state.checkedList.map((item, index) => {
      this.state.checkedList[index].checked = this.state.checkedAll
    })
    this.setState({ checkedList: this.state.checkedList, checkedAll: this.state.checkedAll })
  }
  _btnDelList() {
    let del = []
    if (this.state.checkedList.length > 0) {
      this.state.checkedList.map(item => {
        if (item.checked) {
          del.push(item.QLBM)
        }
      })
    }
    del = del.join(',')
    let newArr = []
    if (this.state.tabName == "uploaded") {
      this.state.uploadList.map((item1, index) => {
        if (del.indexOf(item1.QLBM) < 0) {
          newArr.push(item1)
        }
      })
      this.state.uploadList = newArr
    } else {
      this.state.unUploadList.map((item1, index) => {
        if (del.indexOf(item1.QLBM) < 0) {
          newArr.push(item1)
        }
      })
      this.state.unUploadList = newArr
    }
    this.state.checkedList.map((item, index) => {
      if (item.checked) {
        this.state.checkedList.splice(index, 1)
      }
    })
    this.setState({ bridgeList: newArr, checkedList: this.state.checkedList })
    this._storeData(this.state.uploadList.concat(this.state.unUploadList))
  }
  _btnUpload() {
    this._btnUpload()
  }
  _btnUpload = async () => {
    for (const [index, item] of this.state.checkedList.entries()) {
      if (item.checked) {
        await this.uploadBridgeInfo(this.state.bridgeList[index])
      }
    }
    this._storeData(this.state.bridgeList)

    ToastAndroid.show("上传成功", ToastAndroid.CENTER, ToastAndroid.CENTER)
  }
  refreshBridgeList() {
    let newArr = this.state.uploadList.concat(this.state.unUploadList)
    this.state.uploadList = this.state.unUploadList = []
    newArr.forEach(item => {
      if (item.uploadStatus == "uploaded") {
        this.state.uploadList.push(item)
      } else {
        this.state.unUploadList.push(item)
      }
    })
    let arr = []

    this.state.uploadList.forEach(item => {
      arr.push(item.QLBM)
      this.state.checkedList.push({ QLBM: item.QLBM, checked: false })
    })
    let temp = arr.join(',')
    this.state.originBridgeList.map(item => {
      if (temp.indexOf(item.QLBM) >= 0) {
        item.uploadStatus = "uploaded"
      }
    })
    //更新原始数据状态
    this.setState({ bridgeList: this.state.uploadList, checkedList: this.state.checkedList })
  }
  uploadFiles = async (bridgeInfo) => {
    for (const item of bridgeInfo.Files) {
      if (item.FilePath) {
        let formData = new FormData();
        formData.append('qlxxId', bridgeInfo.ID)
        let file = { uri: item.FilePath, type: 'multipart/form-data', name: 'image.jpg' };
        formData.append("file", file);
        await fetch('http://demo.d9tec.com/api/app/UploadQlImage?qlxxId=123', {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data;charset=utf-8',
            Authorization: "Bearer  " + this.state.token
          },
          body: formData,
        }).then(res => {
          if (res.status == 200) {
            let path = JSON.parse(res._bodyText).Result[0]
            item.FilePath = path
            console.log('await', path)

          } else {
            console.log(res._bodyText, path)
            ToastAndroid.show("上传图片失败！", ToastAndroid.CENTER, ToastAndroid.CENTER)

          }

        })

      }
    }

  }
  uploadBridgeInfo = async (bridgeInfo) => {
    if (!bridgeInfo.Files || bridgeInfo.Files.length <= 0) {
      await this.addQlxx(bridgeInfo)
    } else {
      await this.uploadFiles(bridgeInfo).then(async (res) => {
        await this.addQlxx(bridgeInfo)
      })
    }
  }
  addQlxx = async (bridgeInfo) => {
    let parms = {
      id: '',
      CJSJ: '',
      WCZTZ: '',
      WCZYTZ: '',
      WCDFZC: '',
      JGSJ: '',
      WWCYY: '',
      BZ: '',
      Files: ''
    }
    parms.id = bridgeInfo.ID
    parms.CJSJ = bridgeInfo.CJSJ
    parms.WCZTZ = bridgeInfo.WCZTZ
    parms.WCZYTZ = bridgeInfo.WCZYTZ
    parms.WCDFZC = bridgeInfo.WCDFZC
    parms.JGSJ = null
    parms.WWCYY = bridgeInfo.WWCYY
    parms.JingDu = bridgeInfo.JingDu
    parms.WeiDu = bridgeInfo.WeiDu
    let files = []
    if (bridgeInfo.Files) {
      bridgeInfo.Files.forEach(item => {
        if (item.FilePath != '') {
          files.push({ FileName: '', FilePath: item.FilePath, FileInfo: '' })
        }
      })
    }
    parms.Files = files
    let formData = new FormData();
    for (var key in parms) {
      formData.append(key, parms[key]);
    }
    console.log(formData)
    await fetch('http://demo.d9tec.com/api/app/AddQljd', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: "Bearer  " + this.state.token
      },
      body: JSON.stringify(parms),
    }).then((response) => {
      console.log(response)
      if (response.status == 401) {
        this.props.navigation.navigate('Login')
      }
      if (response.status == 200) {
        res = JSON.parse(response._bodyText)
        if (res.IsSuccess) {
          bridgeInfo['uploadStatus'] = "uploaded"
          // this.updateStroageList(bridgeInfo)
          // ToastAndroid.show('上传成功', ToastAndroid.CENTER, ToastAndroid.CENTER)
        }
      }

    })
  }
  updateStroageList(bridgeInfo) {

  }
  _keyExtractor = (item, index) => index.toString();
  render() {
    return (
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.container}>
        <View style={styles.content}>
          <View style={styles.searchBar}>
            <Image style={styles.avatar} source={require('../images/search.png')} />
            <TextInput
              style={styles.TextInput}
              underlineColorAndroid="transparent"
              onFocus={() => this.searchFocus()}
              onBlur={() => this.searchFocus()}
              onChangeText={(text) => this.state.searchTxt = text}
              value={this.state.searchTxt}
            />
          </View>
          <View style={styles.btnsFilter}>
            <TouchableOpacity onPress={() => this._btnUploaded()}>
              <View style={this.state.tabName == 'uploaded' ? styles.btnFilter1 : styles.btnFilter2}>
                <Text style={this.state.tabName == 'uploaded' ? styles.btntxt1 : styles.btntxt2}>
                  已上传
              </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this._btnUnUpload()}>
              <View style={this.state.tabName == 'unUploaded' ? styles.btnFilter1 : styles.btnFilter2}>
                <Text style={this.state.tabName == 'unUploaded' ? styles.btntxt1 : styles.btntxt2}>
                  未上传
              </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.btncheck}>
            <TouchableOpacity style={styles.btncheck1}>
              <View style={styles.header0}>
                <CheckBox
                  value={this.state.checkedAll}
                  onValueChange={() => this._checkedAll()}
                ></CheckBox>
              </View>
            </TouchableOpacity>
            <View style={styles.header1}>
              <Text>项目名称</Text>
            </View>
            <View style={styles.header2}>
              <Text>项目状态</Text>
            </View>
            <View style={styles.header3}>
              <Text>上传时间</Text>
            </View>
          </View>
          <FlatList
            style={styles.flatlist}
            data={this.state.bridgeList}
            extraData={this.state}
            keyExtractor={this._keyExtractor}
            renderItem={({ item, index }) =>
              <TouchableOpacity key={item.QLBM} >
                <View style={styles.itemBorderBtm}>
                  <View style={styles.cell0}>
                    <CheckBox
                      value={this.state.checkedList[index].checked}
                      onValueChange={() => this.handleChange(this.state.checkedList[index])}
                    ></CheckBox>
                  </View>
                  <View style={styles.cell1}>
                    <Text>{item.QLMC}</Text>
                  </View>
                  <View style={styles.cell2}>
                    <Text >{item.uploadStatus == "uploaded" ? '已上传' : '未上传'}</Text>
                  </View>
                  <View style={styles.cell3}>
                    <Text>{item.CJSJ}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            }
          />
          <View style={styles.btnActions}>
            <TouchableOpacity onPress={() => this._btnUpload()}>
              <View style={styles.btnActions1}>
                <Text style={styles.btntxt1}>
                  上传
              </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this._btnDelList()}>
              <View style={styles.btnActions2}>
                <Text style={styles.btntxt1}>
                  删除
              </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'green',
  },
  itemBorderBtm: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 50,
    borderBottomColor: '#cecfd0',
    borderBottomWidth: 1,
  },
  cell0: {
    width: 40,
    height: '100%',
    borderRightColor: '#cecfd0',
    borderRightWidth: 1,
    borderLeftColor: '#cecfd0',
    borderLeftWidth: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  cell1: {
    flex: 1,
    height: '100%',
    borderRightColor: '#cecfd0',
    borderRightWidth: 1,
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  cell2: {
    width: 70,
    height: '100%',
    borderRightColor: '#cecfd0',
    borderRightWidth: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  cell3: {
    width: 100,
    height: '100%',
    borderRightColor: '#cecfd0',
    borderRightWidth: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  header0: {
    width: 40,
    height: 50,
    borderRightColor: '#cecfd0',
    borderRightWidth: 1,
    borderLeftColor: '#cecfd0',
    borderLeftWidth: 1,
    borderTopColor: '#cecfd0',
    borderTopWidth: 1,
    borderBottomColor: '#cecfd0',
    borderBottomWidth: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  header1: {
    flex: 1,
    height: 50,
    borderRightColor: '#cecfd0',
    borderRightWidth: 1,
    borderTopColor: '#cecfd0',
    borderTopWidth: 1,
    borderBottomColor: '#cecfd0',
    borderBottomWidth: 1,
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  header2: {
    width: 70,
    height: 50,
    borderRightColor: '#cecfd0',
    borderRightWidth: 1,
    borderTopColor: '#cecfd0',
    borderTopWidth: 1,
    borderBottomColor: '#cecfd0',
    borderBottomWidth: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  header3: {
    width: 100,
    height: 50,
    borderRightColor: '#cecfd0',
    borderRightWidth: 1,
    borderTopColor: '#cecfd0',
    borderTopWidth: 1,
    borderBottomColor: '#cecfd0',
    borderBottomWidth: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  btncheck: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginLeft: 15,
    marginRight: 15,
    marginTop: 10,
  },
  btncheck1: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatlist: {
    marginLeft: 15,
    marginRight: 15,
  },
  content: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    width: '100%',
    flexDirection: 'column'
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    height: 50,
    width: Dimensions.get('window').width - 50,
    marginLeft: (Dimensions.get('window').width - (Dimensions.get('window').width - 50)) / 2,
    marginTop: 10,
    paddingLeft: 10,
  },
  avatar: {
    width: 20,
    height: 20,
  },
  TextInput: {
    height: 40,
    width: Dimensions.get('window').width - 105,
    marginLeft: 10,
    color: '#B2B2B2'
  },
  btnsFilter: {
    flexDirection: 'row',
    marginTop: 20,

  },
  btnFilter1: {
    width: Dimensions.get('window').width / 2,
    height: 40,
    backgroundColor: '#2B82EC',
    alignItems: 'center',
    justifyContent: 'center'
  },
  btntxt1: {
    color: 'white'
  },
  btntxt2: {
    color: '#767677'
  },
  btnFilter2: {
    width: Dimensions.get('window').width / 2,
    height: 40,
    backgroundColor: 'rgb(216,217,218)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  btnActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  btnActions1: {
    width: 150,
    height: 45,
    backgroundColor: '#2B82EC',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

  },
  btnActions2: {
    marginLeft: 10,
    width: 150,
    height: 45,
    backgroundColor: '#2B82EC',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }
});
