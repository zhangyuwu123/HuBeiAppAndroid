/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
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
  Modal,
  DeviceEventEmitter,
  TouchableOpacity,
  TouchableHighlight
} from "react-native";
import { Dropdown } from "react-native-material-dropdown";

export default class WqResultManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: "",
      modalVisible: false,
      searchTxt: "检索",
      bridgeList: [],
      checked: [],
      url: "",
      curPageIndex: 1,
      pageCount: 1,
      lx: null,
      ql: null,
      Jsxz: [
        {
          value: "拆除重建"
        },
        {
          value: "加固改造"
        }
      ],
      Xmnf: [],
      Pddj: [
        {
          value: "一类"
        },
        {
          value: "二类"
        },
        {
          value: "三类"
        },
        {
          value: "四类"
        },
        {
          value: "五类"
        }
      ],
      params: {
        Keyword: null,
        Jsxz: null,
        Lx: null,
        Xmnf: null,
        Pddj: null,
        PageSize: 10,
        PageIndex: 1
      }
    };
  }

  componentDidMount() {
    this.state.url = "http://demo.d9tec.com/api/app/wqgzsearchwithpagination";

    let defaultXmnf = 2015;
    for (let i = 1; i <= 4; i++) {
      this.state.Xmnf.push({ value: (defaultXmnf + i).toString() });
    }
    // this.setState({ Xmnf: this.state.Xmnf });
    this.subscription = DeviceEventEmitter.addListener(
      "openSearchPanel",
      userName => {
        this.setState({ modalVisible: true });
      }
    );
    this._getToken();
  }

  componentWillUnmount() {
    // backHandler.removeEventListener('hardwareBackPress', this.handleBack);
  }
  setModalVisible() {
    this.setState({ modalVisible: false });
  }
  filterList() {
    this.setModalVisible();
    this.setState({ bridgeList: [] });
    this.state.params.PageIndex = 1;
    this._GetBridgeList();
  }
  _getToken = async () => {
    try {
      var value = await AsyncStorage.getItem("token");
      if (value !== null) {
        this.setState({ token: value });
      } else {
        this.props.navigation.navigate("Login");
      }
    } catch (error) {
      throw new Error(error);
    }
    this._GetBridgeList();
  };
  _GetBridgeList() {
    let curPageIndex = this.state.params.PageIndex;
    console.log("params:", this.state.params);
    fetch(this.state.url, {
      method: "POST",
      headers: {
        Authorization: "Bearer  " + this.state.token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(this.state.params)
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        if (!responseJson.Result) {
          this.props.navigation.navigate("Login");
        } else {
          this.state.curPageIndex = curPageIndex;
          this.setState({
            bridgeList: this.state.bridgeList.concat(
              responseJson.Result.Records
            ),
            pageCount: responseJson.Result.PageCount
          });
        }
      })
      .catch(error => {
        console.error(error);
      });
  }
  _ItemLoadMore() {
    if (
      this.state.params.PageIndex >= this.state.curPageIndex &&
      this.state.params.PageIndex < this.state.pageCount
    ) {
      this.state.params.PageIndex = this.state.params.PageIndex + 1;
      this._GetBridgeList();
    }
  }
  handleChange = index => {
    let checked = [...this.state.checked];
    checked[index] = !checked[index];
    this.setState({ checked });
  };
  searchFocus() {
    this.setState({ searchTxt: "" });
  }
  searchBlur() {
    if (!this.state.searchTxt) {
      this.setState({ searchTxt: "检索" });
    }
  }
  getListAvatar(item) {
    if (
      item.Gcjd &&
      item.Gcjd.length > 0 &&
      item.Gcjd[item.Gcjd.length - 1].Files &&
      item.Gcjd[item.Gcjd.length - 1].Files.length > 0
    ) {
      let path = item.Gcjd[item.Gcjd.length - 1].Files[0].FilePath;
      return (
        <Image
          style={styles.columnimg}
          source={{ uri: "http://demo.d9tec.com" + path }}
        />
      );
    } else {
      return (
        <Image
          style={styles.columnimg}
          source={require("../images/noimage.png")}
        />
      );
    }
  }
  formatDate(time) {
    if (!time) {
      return;
    }
    var date = new Date(time);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    return [year, month, day].map(this.formatNumber).join("-");
  }
  formatNumber(n) {
    n = n.toString();
    return n[1] ? n : "0" + n;
  }
  _renderItem = ({ item }) => (
    <TouchableOpacity
      key={item.QLBM}
      onPress={() => {
        this.props.navigation.navigate("ResultDetailWithQLManage", {
          bridgeInfo: item
        });
      }}
    >
      <View style={styles.itemContainer}>
        {this.getListAvatar(item)}
        <View style={styles.item}>
          <View style={styles.item1}>
            <Text style={styles.itemText1}>
              {item.QLMC} {item.QLBM}
            </Text>
          </View>
          <View style={styles.item1}>
            <Text style={styles.itemText1}>
              {item.LXBM} {item.LXMC}
            </Text>
          </View>
          <Text style={styles.itemText3}>{item.ZXZH}</Text>
          <Text style={styles.CJSJ}>{this.formatDate(item.CJSJ)}</Text>
        </View>
        <View style={styles.zt}>
          <Text style={styles.ztTxt}>未竣工</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
  render() {
    return (
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.container}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.text}>完成时间</Text>
            <Text style={styles.text}>桩号</Text>
            <Text style={styles.text}>路线</Text>
            <Text style={styles.text}>类型</Text>
          </View>
          <FlatList
            style={styles.flatList}
            data={this.state.bridgeList}
            ItemSeparatorComponent={() => (
              <View
                style={{
                  height: 1,
                  backgroundColor: "#D6D6D6"
                }}
              />
            )}
            extraData={this.state}
            renderItem={this._renderItem}
            onEndReachedThreshold={1}
            onEndReached={({ distanceFromEnd }) => {
              this._ItemLoadMore();
            }}
          />
          <View>
            <Modal
              animationType="slide"
              transparent={false}
              visible={this.state.modalVisible}
            >
              <View style={{ flex: 1 }}>
                <View style={styles.modalHeader}>
                  <TouchableHighlight
                    onPress={() => {
                      this.setModalVisible();
                    }}
                  >
                    <Text style={styles.headertext}>关闭</Text>
                  </TouchableHighlight>
                  <TouchableHighlight
                    onPress={() => {
                      this.filterList();
                    }}
                  >
                    <Text style={styles.headertext}>完成</Text>
                  </TouchableHighlight>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.searchBar}>
                    <TextInput
                      style={styles.TextInput}
                      underlineColorAndroid="transparent"
                      placeholder="桥梁编码或桥梁名称"
                      onChangeText={item => {
                        this.state.params.Keyword = item;
                        console.log(this.state.params.Keyword, item);
                      }}
                    />
                  </View>
                  <View style={styles.searchBar}>
                    <TextInput
                      style={styles.TextInput}
                      underlineColorAndroid="transparent"
                      placeholder="路线编码或路线名称"
                      onChangeText={text => {
                        console.log(text);
                        this.state.params.Lx = text;
                      }}
                    />
                  </View>
                  <Dropdown
                    containerStyle={{ marginLeft: 30, marginRight: 30 }}
                    animationDuration={0}
                    onChangeText={item => {
                      this.state.params.Jsxz = item;
                    }}
                    label="建设性质"
                    data={this.state.Jsxz}
                  />
                  <Dropdown
                    containerStyle={{ marginLeft: 30, marginRight: 30 }}
                    animationDuration={0}
                    onChangeText={item => (this.state.params.Xmnf = item)}
                    label="项目年份"
                    data={this.state.Xmnf}
                  />
                  <Dropdown
                    containerStyle={{ marginLeft: 30, marginRight: 30 }}
                    animationDuration={0}
                    onChangeText={item => (this.state.params.Pddj = item)}
                    label="技术等级"
                    data={this.state.Pddj}
                  />
                </View>
              </View>
            </Modal>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "green"
  },
  dropDownCom: {
    marginLeft: 30,
    paddingLeft: 20
  },
  header: {
    height: 40,
    width: Dimensions.get("window").width - 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 20,
    paddingRight: 20,
    display: "none"
  },
  columnimg: {
    width: 80,
    height: 80
  },
  item: {
    flex: 1
  },
  item1: {
    flexDirection: "row",
    paddingLeft: 10
  },
  itemText1: {
    color: "black",
    fontSize: 17,
    flex: 1,
    flexWrap: "wrap"
  },
  itemText2: {
    color: "#7F7F7F",
    fontSize: 16,
    marginLeft: 10,
    marginRight: 5
  },
  itemText3: {
    color: "#7F7F7F",
    fontSize: 16,
    marginLeft: 10
  },
  bz: {
    color: "#7F7F7F",
    fontSize: 17,
    marginTop: 5,
    paddingLeft: 10
  },
  CJSJ: {
    color: "#7F7F7F",
    fontSize: 16,
    marginTop: 5,
    paddingLeft: 10
  },
  zt: {
    width: 50,
    alignItems: "center"
  },
  ztTxt: {
    color: "#7F7F7F",
    fontSize: 16
  },
  text: {
    color: "black",
    fontSize: 18
  },
  itemContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 10,
    paddingTop: 10
  },
  content: {
    backgroundColor: "#FFFFFF",
    flex: 1,
    width: "100%",
    flexDirection: "column"
  },
  flatList: {
    flex: 1
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    height: 50,
    width: Dimensions.get("window").width - 50,
    marginLeft:
      (Dimensions.get("window").width - (Dimensions.get("window").width - 50)) /
      2,
    marginTop: 10,
    paddingLeft: 10
  },
  avatar: {
    width: 20,
    height: 20
  },
  TextInput: {
    height: 40,
    width: Dimensions.get("window").width - 105,
    marginLeft: 10,
    color: "#B2B2B2"
  },
  btnsFilter: {
    flexDirection: "row",
    marginTop: 30
  },
  btnFilter1: {
    backgroundColor: "#D9D9D9",
    width: Dimensions.get("window").width / 2
  },
  btnFilter2: {
    width: Dimensions.get("window").width / 2
  },
  btnActions: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30
  },
  btnActions1: {
    width: 150
  },
  btnActions2: {
    marginLeft: 10,
    width: 150
  },
  modalHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 20,
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    borderBottomWidth: 1,
    borderBottomColor: "gray"
  },
  headertext: {
    fontSize: 20,
    color: "black"
  }
});
