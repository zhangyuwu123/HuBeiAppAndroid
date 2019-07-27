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
  FlatList,
  Modal,
  AsyncStorage,
  DeviceEventEmitter,
  TouchableHighlight,
  TouchableOpacity
} from "react-native";
import { Dropdown } from "react-native-material-dropdown";
// import TreeSelect from "../components/treeSelect";

export default class ResultManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: "",
      lxbmTxt: "",
      qlbmTxt: "",
      gydwPlh: "管养单位",
      bridgeList: [],
      checked: [],
      url: "",
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
        Type: null,
        PageSize: 10,
        PageIndex: 1
      }
    };
  }

  componentDidMount() {
    let type = { type: this.props.navigation.state.params.type };
    let dzxType = this.props.navigation.state.params.dzxType;
    this.state.params.Type = dzxType;
    this.subscription = DeviceEventEmitter.addListener(
      "openSearchPanel",
      userName => {
        this.setState({ modalVisible: true });
      }
    );
    let defaultXmnf = 2015;
    for (let i = 1; i <= 4; i++) {
      this.state.Xmnf.push({ value: (defaultXmnf + i).toString() });
    }
    this.state.type = type.type;
    if (type.type == "dzxgc") {
      this.state.url = "http://hb.jgy-tec.com/api/app/dzxsearchwithpagination";
    } else if (type.type == "smaqgc") {
      this.state.url = "http://hb.jgy-tec.com/api/app/smaqsearchwithpagination";
    } else if (type.type == "zhfzgc") {
      this.state.url = "http://hb.jgy-tec.com/api/app/zhfzsearchwithpagination";
    } else if (type.type == "wqgzgc") {
      this.state.url = "http://hb.jgy-tec.com/api/app/wqgzsearchwithpagination";
    } else if (type.type == "shxfgc") {
      this.state.url = "http://hb.jgy-tec.com/api/app/shxfsearchwithpagination";
    } else {
    }
    this._getToken();
  }

  componentWillUnmount() {
    // backHandler.removeEventListener('hardwareBackPress', this.handleBack);
  }
  setModalVisible() {
    this.setState({ modalVisible: false });
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
  filterList() {
    this.setModalVisible();
    this.setState({ bridgeList: [] });
    this.state.params.PageIndex = 1;
    this._GetBridgeList();
  }
  _GetBridgeList() {
    let curPageIndex = this.state.params.PageIndex;
    if (!this.state.url) {
      return;
    }
    console.log(JSON.stringify(this.state.params));
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
  getCjsj(arr) {
    if (arr instanceof Array && arr.length >= 1) {
      return this.formatDate(arr[arr.length - 1].CJSJ);
    }
    return "";
  }

  qlbmFocus() {
    this.setState({ qlbmTxt: "" });
  }
  qlbmBlur() {
    if (!this.state.qlbmTxt) {
      this.setState({ qlbmTxt: "桥梁编码或桥梁名称" });
    }
  }
  onGYDWClick() {
    console.log(this.state.gydwTreeVisbile);
    if (!this.state.gydwTreeVisbile) {
      this.setState({ gydwTreeVisbile: true });
    }
  }
  onSelectedItem(item) {
    this.setState({
      gydwTreeVisbile: false,
      params: { gydw: item.name },
      gydwPlh: item.name
    });
  }
  selectedJsxz(item) {
    console.log(item);
    this.setState({
      params: {
        jsxz: item
      }
    });
  }
  _renderItem = ({ item }) => (
    <TouchableOpacity
      key={item.GYDWBM}
      onPress={() => {
        if (this.state.type == "shxfgc") {
          this.props.navigation.navigate("ShxfResultDetail", {
            bridgeInfo: item
          });
        } else {
          this.props.navigation.navigate("ResultDetailManage", {
            bridgeInfo: item
          });
        }
      }}
    >
      <View style={styles.itemContainer}>
        {this.getListAvatar(item)}
        <View style={styles.item}>
          <View style={styles.item1}>
            <Text style={styles.itemText1}>{item.LXBM}</Text>
            <Text style={styles.itemText2}>{item.LXMC}</Text>
          </View>
          <Text style={styles.itemText3}>
            {item.QDZH} - {item.ZDZH}
          </Text>
          <Text style={styles.CJSJ}>{this.getCjsj(item.Gcjd)}</Text>
        </View>
        <View style={styles.zt}>
          <Text>未竣工</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
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
          source={{ uri: "http://hb.jgy-tec.com" + path }}
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
        </View>
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
                    placeholder="路线编码或路线名称"
                    onChangeText={item => {
                      this.state.params.Keyword = item;
                    }}
                  />
                </View>
                <Dropdown
                  containerStyle={{ marginLeft: 30, marginRight: 30 }}
                  animationDuration={0}
                  onChangeText={item => {
                    this.state.params.Type = item;
                  }}
                  label="项目类型"
                  data={this.state.Type}
                />
                {/* <View style={styles.searchBar}>
                  <TextInput
                    style={styles.TextInput}
                    underlineColorAndroid="transparent"
                    onFocus={() => this.qlbmFocus()}
                    onBlur={() => this.qlbmBlur()}
                    onChangeQlbm={text => (this.state.qlbmTxt = text)}
                    value={this.state.qlbmTxt}
                  />
                </View> */}

                <View>
                  {/* https://www.npmjs.com/package/react-native-material-dropdown */}
                </View>
                {/* <View style={styles.treeCon}>
                  <TouchableHighlight
                    onPress={() => {
                      this.onGYDWClick();
                    }}
                  >
                    <View style={[styles.searchBar, styles.showTree]}>
                      <Text>{this.state.gydwPlh}</Text>
                    </View>
                  </TouchableHighlight>
                  <View
                    style={[
                      this.state.gydwTreeVisbile
                        ? styles.showTree1
                        : styles.hideTree
                    ]}
                  >
                    <TreeSelect
                      onSelectedItem={item => this.onSelectedItem(item)}
                    />
                  </View>
                </View> */}
                {/* <View style={styles.searchBar}>
                  <TextInput
                    style={styles.TextInput}
                    underlineColorAndroid="transparent"
                    onFocus={() => this.qlbmFocus()}
                    onBlur={() => this.qlbmBlur()}
                    onChangeQlbm={text => (this.state.qlbmTxt = text)}
                    value={this.state.qlbmTxt}
                  />
                </View>
                <Dropdown
                  animationDuration={0}
                  selectedItem={item => this.selectedJsxz(item)}
                  label="建设性质"
                  data={this.state.jsxz}
                /> */}
              </View>
            </View>
          </Modal>
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
  showTree: {
    display: "flex"
  },
  showTree1: {
    display: "flex",
    flex: 1
  },
  hideTree: {
    display: "none"
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
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    paddingLeft: 10
  },
  itemText1: {
    color: "black",
    fontSize: 17
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
    paddingLeft: 10
  },
  CJSJ: {
    color: "#7F7F7F",
    fontSize: 16,
    marginTop: 5,
    paddingLeft: 10
  },
  zt: {
    color: "#7F7F7F",
    fontSize: 16,
    width: 50,
    alignItems: "center"
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
  treeCon: {
    position: "relative"
  },
  treeContainer: {
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
