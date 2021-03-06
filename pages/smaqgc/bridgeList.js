/**
 * Created by wangdi on 4/11/16.
 */
import React, { Component } from 'react';
import { Text, Button, View, FlatList, StyleSheet, AsyncStorage, Platform, TouchableOpacity, Image, TextInput, backHandler } from 'react-native';

export default class smaqgcBridgeList extends Component {
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
  _GetAsyncStorageBridgeList = async () => {
    try {
      const value = await AsyncStorage.getItem('smaqgcBridgeList');
      if (value !== null) {
        this.setState({ bridgeList: JSON.parse(value) })
      }
    } catch (error) {
    }
  }
  _keyExtractor = (item, index) => index.toString();

  _onPressItem = ({ item }) => {
    console.log('item:' + item)
    this.props.navigation.navigate('SmaqgcManage', { bridgeInfo: item })
  }
  _separator = () => {
    return <View style={{ height: 2, flex: 1, backgroundColor: 'yellow' }} />;
  }
  _renderItem = ({ item, index }) => (
    <TouchableOpacity key={item.Id} onPress={() => {
      this.props.navigation.navigate('SmaqgcManage', { bridgeInfo: item })
    }} >
      <View style={this.getRowStyle(index)}>
        <Text style={styles.text1}>
          {item.GLBM}
        </Text>
        <Text style={styles.text2}>
          {item.QDZH}-{item.ZDZH}
        </Text>
      </View>
    </TouchableOpacity>
  );
  getRowStyle(index) {
    if (index % 2 == 0) {
      return {
        flex: 1,
        flexDirection: 'row',
        height: 60,
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingLeft: 10,
        paddingRight: 10,
      }
    } else {
      return {
        flex: 1,
        flexDirection: 'row',
        height: 60,
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#F8F8F8',
        paddingLeft: 10,
        paddingRight: 10,
      }
    }
  }
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
    flex: 1,
  },
  text2: {
    color: 'gray',
    fontSize: 16,
    width: 160,

  },
});