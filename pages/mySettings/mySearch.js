/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { Text, Dimensions, ScrollView, Button, View, FlatList, StyleSheet, AsyncStorage, Platform, TouchableOpacity, Image, TextInput, backHandler } from 'react-native';


export default class MySearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      searchTxt: '检索',
      bridgeList: null,
      checked: []
    }
  }

  componentDidMount() {
    this._GetAsyncStorageBridgeList()
  }

  componentWillUnmount() {
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
  _GetAsyncStorageBridgeList = async () => {
    try {
      const value = await AsyncStorage.getItem('BridgeList');
      if (value !== null) {
        this.setState({ bridgeList: JSON.parse(value) })
      }
    } catch (error) {
    }
  }
  handleChange = (index) => {
    let checked = [...this.state.checked];
    checked[index] = !checked[index];
    this.setState({ checked });
  }
  _btnUpload() {

  }
  _keyExtractor = (item, index) => index.toString();

  _onPressItem = ({ item }) => {
    console.log('item:' + item)
    this.props.navigation.navigate('Bridge', { bridgeInfo: item })
  }
  searchFocus() {
    this.setState({ searchTxt: '' })
  }
  searchBlur() {
    if (!this.state.searchTxt) {
      this.setState({ searchTxt: '检索' })
    }
  }
  _renderItem = ({ item }) => (
    <TouchableOpacity key={item.GYDWBM} onPress={() => {
      this.props.navigation.navigate('ResultDetailManage', { bridgeInfo: item })
    }} >
      <View style={styles.itemContainer}>
        <Image style={styles.columnimg} source={require('../images/noimage.png')} />
        <View style={styles.item}>
          <View style={styles.item1}>
            <Text style={styles.itemText1}>
              {item.LXBM}
            </Text>
            <Text style={styles.itemText2}>
              {item.QLBM}
            </Text>
            <Text style={styles.itemText3}>
              +  {item.ZXZH}
            </Text>
          </View>
          <Text style={styles.bz}>
            {item.BZ}
          </Text>
          <Text style={styles.CJSJ}>
            {this.formatDate(item.CJSJ)}
          </Text>
        </View>
        <View style={styles.zt}>
          <Text >
            未竣工
        </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
  render() {
    let { data, checked } = this.state;
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
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingLeft: 10,
  },
  itemText1: {
    color: 'black',
    fontSize: 17,

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
    marginLeft: 5,
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
    color: '#7F7F7F',
    fontSize: 16,
    width: 50,
    alignItems: 'center'
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
