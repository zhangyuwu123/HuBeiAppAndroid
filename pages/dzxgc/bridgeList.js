/**
 * Created by wangdi on 4/11/16.
 */
import React, { Component } from "react";
import {
  Text,
  Button,
  View,
  FlatList,
  StyleSheet,
  AsyncStorage,
  Platform,
  TouchableOpacity,
  DeviceEventEmitter,
  TouchableHighlight
} from "react-native";
import { Dropdown } from "react-native-material-dropdown";

export default class dzxgcBridgeList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bridgeList: null,
      dzxType: "",
      modalVisible: false,
      gydwTreeVisbile: false,
      curPageIndex: 1,
      pageCount: 1,
      lx: null,
      ql: null,
      Type: [
        {
          value: "全部"
        },
        {
          value: "大修"
        },
        {
          value: "中修"
        }
      ],
      params: {
        Keyword: null,
        Type: null,
        PageSize: 10,
        PageIndex: 1
      }
    };
  }

  componentDidMount() {
    this.state.dzxType = this.props.navigation.state.params.dzxType;
    // this.subscription = DeviceEventEmitter.addListener(
    //   "openSearchPanel",
    //   userName => {
    //     this.setState({ modalVisible: true });
    //   }
    // );
    this._GetAsyncStorageBridgeList();
  }

  componentWillUnmount() {}
  _GetAsyncStorageBridgeList = async () => {
    try {
      const value = await AsyncStorage.getItem(
        this.state.dzxType == 1 ? "dxgcBridgeList" : "zxgcBridgeList"
      );
      if (value) {
        this.setState({ bridgeList: JSON.parse(value) });
      }
    } catch (error) {
      console.log(error);
    }
  };
  _keyExtractor = (item, index) => index.toString();

  _onPressItem = ({ item }) => {
    console.log("item:" + item);
    this.props.navigation.navigate("DzxgcManage", { bridgeInfo: item });
  };
  _separator = () => {
    return <View style={{ height: 2, flex: 1, backgroundColor: "yellow" }} />;
  };
  getRowStyle(index) {
    if (index % 2 == 0) {
      return {
        flex: 1,
        flexDirection: "row",
        height: 60,
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: "white",
        paddingLeft: 10,
        paddingRight: 10
      };
    } else {
      return {
        flex: 1,
        flexDirection: "row",
        height: 60,
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: "#F8F8F8",
        paddingLeft: 10,
        paddingRight: 10
      };
    }
  }
  _renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        key={item.GYDWBM}
        onPress={() => {
          this.props.navigation.navigate("DzxgcManage", { bridgeInfo: item });
        }}
      >
        <View style={this.getRowStyle(index)}>
          <Text style={styles.text1}>{item.LXMC}</Text>
          <Text style={styles.text2}>{item.LXBM}</Text>
          <Text style={styles.text3}>
            {item.QDZH}-{item.ZDZH}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  render() {
    return (
      <FlatList
        data={this.state.bridgeList}
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
    flexDirection: "row",
    height: 60,
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "white"
  },
  text1: {
    color: "gray",
    fontSize: 16,
    flex: 1
  },
  text2: {
    color: "gray",
    fontSize: 16,
    width: 80
  },
  text3: {
    color: "gray",
    fontSize: 16,
    width: 160
  }
});
