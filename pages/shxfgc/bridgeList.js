/**
 * Created by wangdi on 4/11/16.
 */
import React, { Component } from 'react';
import { Text, Button, View, FlatList, StyleSheet, AsyncStorage, Platform, TouchableOpacity, Image, TextInput, backHandler } from 'react-native';

export default class BshxfgcridgeList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      bridgeList: null
    }
  }

  componentDidMount() {
    this._GetAsyncStorageBridgeList()
  }

  componentWillUnmount() {
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
    this._GetBridgeList()
  }
  _handleBack() {
    // const navigator = this.props.navigator;
    // if (navigator && navigator.getCurrentRoutes().length > 1) {
    //   navigator.pop()
    //   return true;
    // }
    // return false;
  }
  _GetAsyncStorageBridgeList = async () => {
    try {
      const value = await AsyncStorage.getItem('shxfgcBridgeList');
      if (value !== null) {
        this.setState({ bridgeList: JSON.parse(value) })
      }
    } catch (error) {
    }
  }
  _GetBridgeList() {
    fetch("http://demo.d9tec.com/api/app/getxfqlxxs", {
      method: "POST",
      headers: {
        Authorization: "Bearer  " + this.state.token,
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log('_UpdateBridgeList:' + JSON.stringify(responseJson.Result))
        if (!responseJson) {
          this.props.navigation.navigate('Login')
        } else {
          this.setState({ bridgeList: responseJson.Result })
        }
      })
      .catch(error => {
        console.error(error);
      });
  }
  _keyExtractor = (item, index) => index.toString();

  _onPressItem = ({ item }) => {
    console.log('item:' + item)
    this.props.navigation.navigate('Bridge', { bridgeInfo: item })
  }
  _separator = () => {
    return <View style={{ height: 2, flex: 1, backgroundColor: 'yellow' }} />;
  }
  _renderItem = ({ item }) => (
    <TouchableOpacity key={item.GYDWBM} onPress={() => {
      this.props.navigation.navigate('Bridge', { bridgeInfo: item })
    }} >
      <View style={styles.itemContainer}>
        <Text style={styles.text1}>
          {item.LXBM}
        </Text>
        <Text style={styles.text1}>
          {item.LXBM}
        </Text>
        <Text style={styles.text2}>
          {item.LXMC}
        </Text>
        <Text style={styles.text2}>
          {item.QDZH}-{item.ZDZH}
        </Text>
      </View>
    </TouchableOpacity>
  );
  render() {
    return (
      <FlatList
        data={this.state.bridgeList}
        extraData={this.state}
        temSeparatorComponent={this._separator}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
      />
    );
  }
}

const styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    height: 60,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  text1: {
    color: 'gray',
    fontSize: 16,
  },
  text2: {
    color: 'gray',
    fontSize: 16,
  }
});