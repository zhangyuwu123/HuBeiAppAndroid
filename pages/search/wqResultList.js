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
  CheckBox, TouchableOpacity
} from 'react-native';

export default class WqResultManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      searchTxt: '检索',
      bridgeList: [],
      checked: [],
      url: ''
    }
  }

  componentDidMount() {
    this.state.url = "http://demo.d9tec.com/api/app/wqgzsearchwithpagination"
    this._getToken()
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
      throw new Error(error)
    }
    this._GetBridgeList()
  }
  _GetBridgeList() {
    console.log('url:', this.state.url);
    var obj = {
      Keyword: '',
      PageIndex: 1,
      PageSize: 100
    }
    fetch(this.state.url, {
      method: "POST",
      headers: {
        Authorization: "Bearer  " + this.state.token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(obj)
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log('_UpdateBridgeList:' + JSON.stringify(responseJson.Result))
        if (!responseJson) {
          this.props.navigation.navigate('Login')
        } else {
          this.setState({ bridgeList: responseJson.Result.Records })
        }
      })
      .catch(error => {
        console.error(error);
      });
  }
  handleChange = (index) => {
    let checked = [...this.state.checked];
    checked[index] = !checked[index];
    this.setState({ checked });
  }
  searchFocus() {
    this.setState({ searchTxt: '' })
  }
  searchBlur() {
    if (!this.state.searchTxt) {
      this.setState({ searchTxt: '检索' })
    }
  }
  getListAvatar(item) {
    if (item.Gcjd && item.Gcjd.length > 0 && item.Gcjd[item.Gcjd.length - 1].Files && item.Gcjd[item.Gcjd.length - 1].Files.length > 0) {
      let path = item.Gcjd[item.Gcjd.length - 1].Files[0].FilePath
      return < Image style={styles.columnimg} source={{ uri: 'http://demo.d9tec.com' + path }} />
    } else {
      return <Image style={styles.columnimg} source={require('../images/noimage.png')} />
    }
  }
  formatDate(time) {
    if (!time) {
      return
    }
    var date = new Date(time);
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
    return [year, month, day].map(this.formatNumber).join('-')
  }
  formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  }
  _renderItem = ({ item }) => (
    <TouchableOpacity key={item.GYDWBM} onPress={() => {
      this.props.navigation.navigate('ResultDetailManage', { bridgeInfo: item })
    }} >
      <View style={styles.itemContainer}>
        {this.getListAvatar(item)}
        <View style={styles.item}>
          <View style={styles.item1}>
            <Text style={styles.itemText1}>
              {item.QLMC}  {item.QLBM}
            </Text>
          </View>
          <View style={styles.item1}>
            <Text style={styles.itemText1}>
              {item.LXBM} {item.LXMC}
            </Text>
          </View>
          <Text style={styles.itemText3}>
            {item.ZXZH}
          </Text>
          <Text style={styles.CJSJ}>
            {this.formatDate(item.CJSJ)}
          </Text>
        </View>
        <View style={styles.zt}>
          <Text style={styles.ztTxt} >
            未竣工
        </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
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
              onBlur={() => this.searchBlur()}
              onChangeText={(text) => this.state.searchTxt = text}
              value={this.state.searchTxt}
            />
          </View>
          <View style={styles.header}>
            <Text style={styles.text}>完成时间</Text>
            <Text style={styles.text}>桩号</Text>
            <Text style={styles.text}>路线</Text>
            <Text style={styles.text}>类型</Text>
          </View>
          <FlatList
            style={styles.flatList}
            data={this.state.bridgeList}
            ItemSeparatorComponent={() => <View style={{
              height: 1,
              backgroundColor: '#D6D6D6'
            }} />}
            extraData={this.state}
            renderItem={this._renderItem}
          />
        </View>
      </ScrollView>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'green',
  },
  header: {
    height: 40,
    width: Dimensions.get('window').width - 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 20,
    paddingRight: 20,
    display: 'none'
  },
  columnimg: {
    width: 80,
    height: 80,
  },
  item: {
    flex: 1,
  },
  item1: {
    flexDirection: 'row',
    paddingLeft: 10,
  },
  itemText1: {
    color: 'black',
    fontSize: 17,
    flex: 1, flexWrap: 'wrap'
  },
  itemText2: {
    color: '#7F7F7F',
    fontSize: 16,
    marginLeft: 10,
    marginRight: 5,
  },
  itemText3: {
    color: '#7F7F7F',
    fontSize: 16,
    marginLeft: 10,
  },
  bz: {
    color: '#7F7F7F',
    fontSize: 17,
    marginTop: 5,
    paddingLeft: 10,
  },
  CJSJ: {
    color: '#7F7F7F',
    fontSize: 16,
    marginTop: 5,
    paddingLeft: 10,
  },
  zt: {
    width: 50,
    alignItems: 'center'
  },
  ztTxt: {
    color: '#7F7F7F',
    fontSize: 16,
  },
  text: {
    color: 'black',
    fontSize: 18
  },
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 10,
    paddingTop: 10,
  },
  content: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    width: '100%',
    flexDirection: 'column'
  },
  flatList: {
    flex: 1,
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
    display: 'none'
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
    marginTop: 30,

  },
  btnFilter1: {
    backgroundColor: '#D9D9D9',
    width: Dimensions.get('window').width / 2
  },
  btnFilter2: {
    width: Dimensions.get('window').width / 2
  },
  btnActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  btnActions1: {
    width: 150,
  },
  btnActions2: {
    marginLeft: 10,
    width: 150,
  }
});
