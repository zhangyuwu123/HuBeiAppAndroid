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
  CheckBox
} from 'react-native';

export default class MessageManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      searchTxt: '',
      data: [
        {
          "name": "推送消息一",
        },
        {
          "name": "推送消息一",
        }, {
          "name": "推送消息一",
        }, {
          "name": "推送消息一",
        }, {
          "name": "推送消息一",
        },
      ],
      checked: []
    }
  }

  componentDidMount() {
  }

  componentWillUnmount() {
    // backHandler.removeEventListener('hardwareBackPress', this.handleBack);
  }
  render() {
    let { data, checked } = this.state;
    return (
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.container}>
        <View style={styles.content}>
          <FlatList
            data={data}
            renderItem={({ item, index }) =>
              <View style={{ flexDirection: 'row', alignItems: 'center', height: 60 }}>
                <Text style={{ width: 100 }}>{item.name}</Text>
              </View>
            }
          />
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
    height: 60,
    width: Dimensions.get('window').width - 50,
    marginLeft: (Dimensions.get('window').width - (Dimensions.get('window').width - 50)) / 2,
    marginTop: 40,
    paddingLeft: 5,
  },
  avatar: {
    width: 40,
    height: 40,
  },
  TextInput: {
    height: 40,
    width: Dimensions.get('window').width - 105,
    marginLeft: 10,
    borderWidth: 1,
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
