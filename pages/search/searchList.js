/**
 * Created by wangdi on 4/11/16.
 */
import React, { Component } from 'react';
import { Text, Platform, View, ScrollView, StyleSheet, AsyncStorage, ToastAndroid, TouchableOpacity, Image } from 'react-native';

export default class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      loading: false,
      bridgeList: null
    }
  }

  componentDidMount() {
    // this._getToken()
  }
  _storeData = async (bridgeList) => {
    try {
      await AsyncStorage.setItem('BridgeList', JSON.stringify(bridgeList));
    } catch (error) {
      // Error saving data
    }
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
    }
  }
  _searchResult(type) {
    this.props.navigation.navigate('ResultManage', { type: type })
  }
  _searchWqResult() {
    this.props.navigation.navigate('WqResultList')
  }
  _searchSmaqResult() {
    this.props.navigation.navigate('SmaqResultList')
  }
  _redirectStatistics(type) {
    this.props.navigation.navigate('StatisticsManage', { type: type })
  }

  render() {
    return (
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.container}>
        <View style={styles.item} >
          <TouchableOpacity onPress={() => { this._searchResult('dzxgc') }}>
            <View style={styles.btn1} >
              <Image style={styles.cj5} source={require('../images/cj1.jpg')}></Image>
              <Text style={styles.text} >公路大中修工程进度</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.btn2}>
            <TouchableOpacity style={styles.btnmargin} onPress={() => { this._redirectStatistics('dzxgc') }}>
              <Image style={styles.cj5Down} source={require('../images/icon-chart.png')} />
              <Text style={styles.textDown} >图表</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.item}>
          <TouchableOpacity style={styles.btn1} onPress={() => { this._searchSmaqResult() }}>
            <View style={styles.btn1} >
              <Image style={styles.cj5} source={require('../images/cj2.jpg')}></Image>
              <Text style={styles.text} >生命安全防护工程进度</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.btn2}>
            <TouchableOpacity style={styles.btnmargin} onPress={() => { this._redirectStatistics('smaqgc') }}>
              <Image style={styles.cj5Down} source={require('../images/icon-chart.png')} />
              <Text style={styles.textDown} >图表</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.item}>
          <TouchableOpacity style={styles.btn1} onPress={() => { this._searchWqResult() }}>
            <Image style={styles.cj5} source={require('../images/cj3.jpg')}></Image>
            <Text style={styles.text} >危桥改造工程进度</Text>
          </TouchableOpacity>
          <View style={styles.btn2}>
            <TouchableOpacity style={styles.btnmargin} onPress={() => this._redirectStatistics('wqgzgc')}>
              <Image style={styles.cj5Down} source={require('../images/icon-chart.png')} />
              <Text style={styles.textDown} >图表</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.item}>
          <TouchableOpacity style={styles.btn1} onPress={() => this._searchResult('zhfzgc')}>
            <Image style={styles.cj5} source={require('../images/cj4.jpg')}></Image>
            <Text style={styles.text} >灾害防治工程进度</Text>
          </TouchableOpacity>
          <View style={styles.btn2}>
            <TouchableOpacity style={styles.btnmargin} onPress={() => this._redirectStatistics('zhfzgc')}>
              <Image style={styles.cj5Down} source={require('../images/icon-chart.png')} />
              <Text style={styles.textDown} >图表</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.item}>
          <TouchableOpacity style={styles.btn1} onPress={() => this._searchResult('shxfgc')}>
            <Image style={styles.cj5} source={require('../images/cj5.jpg')}></Image>
            <Text style={styles.text} >水毁修复工程进度</Text>
          </TouchableOpacity>
          <View style={styles.btn2}>
            <TouchableOpacity style={styles.btnmargin} onPress={() => this._redirectStatistics('shxfgc')}>
              <Image style={styles.cj5Down} source={require('../images/icon-chart.png')} />
              <Text style={styles.textDown} >图表</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView >
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    ...Platform.select({
      android: {
        backgroundColor: '#f5f5f5',
      },
    }),
  },
  container: {
    paddingBottom: 5,
  },
  btn1: {
    position: "relative",
    width: 200,
    height: 75,
  },
  btn2: {
    width: 100,
    marginLeft: 10
  },
  item: {
    flex: 1,
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnmargin: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E5E5E5',
    width: 110,
    height: 40,
  },
  cj5: {
    width: 200,
    height: 75,
    borderRadius: 5,
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

  },
  text: {
    color: 'white',
    fontSize: 17,
    position: 'absolute',
    alignSelf: 'center',
    justifyContent: 'center',
    top: 50 * 0.5,
  },
  cj5Down: {
    width: 12,
    height: 12,
  },
  textDown: {
    color: '#656565',
    fontSize: 16,
  },
});