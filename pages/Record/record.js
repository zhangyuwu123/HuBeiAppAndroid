/**
 * Created by wangdi on 4/11/16.
 */
import React, { Component } from "react";
import {
  Text,
  View,
  ScrollView,
  Dimensions,
  StyleSheet,
  AsyncStorage,
  ToastAndroid,
  TouchableOpacity,
  Image,
  Platform,
  AlertIOS
} from "react-native";

export default class Record extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: "",
      loading: false,
      bridgeList: null,
      params: {}
    };
  }

  componentDidMount() {
    this._getToken();
  }
  _storeData = async bridgeList => {
    try {
      const storeBridgeList = await AsyncStorage.getItem("BridgeList");
      // 提取新增的记录
      let qlbm = [];
      console.log(storeBridgeList, storeBridgeList instanceof Array);
      if (storeBridgeList instanceof Array) {
        storeBridgeList = JSON.parse(storeBridgeList);
        bridgeList.map(item => {
          storeBridgeList.map((item1, index) => {
            console.log("storeBridgeList", item.QLBM, item1.QLBM);
            if (item.QLBM == item1.QLBM) {
              item1.SGDW = item.SGDW;
              item1.JLDW = item.JLDW;
              item1.JHKGSJ = item.JHKGSJ;
              item1.YJJGSJ = item.YJJGSJ;
            }
            qlbm.push(item.QlxxId);
          });
        });
        let str = qlbm.join(",");
        bridgeList.map(item => {
          if (str.indexOf(item.QlxxId) < 0) {
            storeBridgeList.push(item);
          }
        });
        await AsyncStorage.removeItem("BridgeList");
        await AsyncStorage.setItem(
          "BridgeList",
          JSON.stringify(storeBridgeList)
        );
      } else {
        await AsyncStorage.setItem("BridgeList", JSON.stringify(bridgeList));
      }
    } catch (error) {
      console.log("error:", error);
    }
  };
  _getToken = async () => {
    try {
      var value = await AsyncStorage.getItem("token");
      if (value !== null) {
        this.setState({ token: value });
        console.log("maps:" + this.state.token);
      } else {
        this.props.navigation.navigate("Login");
      }
    } catch (error) {
      console.log("AsyncStorage error: " + error.message);
    }
  };
  _DangerousBridge() {
    this.props.navigation.navigate("BridgeList");
  }
  rediretPageDxgc() {
    this.props.navigation.navigate("DzxgcList", {
      dzxType: 1
    });
  }
  rediretPageZxgc() {
    this.props.navigation.navigate("DzxgcList", {
      dzxType: 2
    });
  }
  rediretPageSmaqgc() {
    this.props.navigation.navigate("SmaqgcList");
  }
  rediretPageZhfzgc() {
    this.props.navigation.navigate("ZhfzgcList");
  }
  rediretPageShxfgc() {
    this.props.navigation.navigate("ShxfgcList");
  }
  downLoad(type) {
    let params = {
      Keyword: null,
      PageIndex: 1,
      PageSize: 10000
    };
    if (type == "dxgc") {
      params = {
        Keyword: null,
        Type: 1,
        PageIndex: 1,
        PageSize: 10000
      };
      this.updateBridgeList("dxgc", "getdzxxflist", params);
    } else if (type == "zxgc") {
      params = {
        Keyword: null,
        Type: 2,
        PageIndex: 1,
        PageSize: 10000
      };
      this.updateBridgeList("zxgc", "getdzxxflist", params);
    } else if (type == "smaqgc") {
      this.updateBridgeList("smaqgc", "getsmaqxflist", params);
    } else if (type == "zhfzgc") {
      this.updateBridgeList("zhfzgc", "getzhfzxflist", params);
    } else if (type == "shxf") {
      // this.updateBridgeList('shxf', 'getdzxxflist')
    } else {
    }
  }
  storeData = async (type, bridgeList) => {
    try {
      let temp = type + "BridgeList";
      await AsyncStorage.removeItem(temp);
      await AsyncStorage.setItem(temp, JSON.stringify(bridgeList));
    } catch (error) {
      console.log("error:", error);
    }
  };
  _UpdateBridgeList() {
    this.setState({ loading: true });
    fetch("http://demo.d9tec.com/api/app/getxfqlxxs", {
      method: "POST",
      headers: {
        Authorization: "Bearer  " + this.state.token,
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log("_UpdateBridgeList:" + JSON.stringify(responseJson));
        if (!responseJson) {
          this.props.navigation.navigate("Login");
        } else {
          this._storeData(responseJson.Result);
          this.setState({ loading: false });
          if (Platform.OS == "ios") {
            AlertIOS.alert("提示", "更新完成", [
              { text: "确定", onPress: () => console.log("Foo Pressed!") }
            ]);
          } else {
            ToastAndroid.show(
              "更新完成",
              ToastAndroid.CENTER,
              ToastAndroid.CENTER
            );
          }
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  updateBridgeList(type, url, params) {
    fetch("http://demo.d9tec.com/api/app/" + url, {
      method: "POST",
      headers: {
        Authorization: "Bearer  " + this.state.token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(params)
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log("_UpdateBridgeList:" + JSON.stringify(responseJson));
        if (!responseJson.Result) {
          this.customAlert(responseJson.Message);
          setTimeout(() => {
            this.props.navigation.navigate("Login");
          }, 2000);
        } else {
          this.storeData(type, responseJson.Result);
          this.customAlert("更新完成");
        }
      })
      .catch(error => {
        console.error(error);
      });
  }
  customAlert(tips) {
    if (Platform.OS == "ios") {
      AlertIOS.alert("提示", tips, [
        { text: "确定", onPress: () => console.log("Foo Pressed!") }
      ]);
    } else {
      ToastAndroid.show(tips, ToastAndroid.CENTER, ToastAndroid.CENTER);
    }
  }

  render() {
    return (
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.container}
      >
        <View style={styles.item}>
          <TouchableOpacity onPress={() => this.rediretPageDxgc()}>
            <View style={styles.btn1}>
              <Image style={styles.cj5} source={require("../images/cj1.jpg")} />
              <Text style={styles.text}>公路大修工程进度</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.btn2}>
            <TouchableOpacity
              style={styles.btnmargin}
              onPress={() => this.downLoad("dxgc")}
            >
              <Image
                style={styles.cj5Down}
                source={require("../images/icon-download.png")}
              />
              <Text style={styles.textDown}>下载更新</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.item}>
          <TouchableOpacity
            style={styles.btn1}
            onPress={() => this.rediretPageZxgc()}
          >
            <Image style={styles.cj5} source={require("../images/cj1.jpg")} />
            <Text style={styles.text}>公路中修工程进度</Text>
          </TouchableOpacity>
          <View style={styles.btn2}>
            <TouchableOpacity
              style={styles.btnmargin}
              onPress={() => this.downLoad("zxgc")}
            >
              <Image
                style={styles.cj5Down}
                source={require("../images/icon-download.png")}
              />
              <Text style={styles.textDown}>下载更新</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.item}>
          <TouchableOpacity onPress={() => this.rediretPageSmaqgc()}>
            <View style={styles.btn1}>
              <Image style={styles.cj5} source={require("../images/cj2.jpg")} />
              <Text style={styles.text}>生命安全防护工程进度</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.btn2}>
            <TouchableOpacity
              style={styles.btnmargin}
              onPress={() => this.downLoad("smaqgc")}
            >
              <Image
                style={styles.cj5Down}
                source={require("../images/icon-download.png")}
              />
              <Text style={styles.textDown}>下载更新</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.item}>
          <TouchableOpacity
            style={styles.btn1}
            onPress={() => this._DangerousBridge()}
          >
            <Image style={styles.cj5} source={require("../images/cj3.jpg")} />
            <Text style={styles.text}>危桥改造工程进度</Text>
          </TouchableOpacity>
          <View style={styles.btn2}>
            <TouchableOpacity
              style={styles.btnmargin}
              onPress={() => this._UpdateBridgeList()}
            >
              <Image
                style={styles.cj5Down}
                source={require("../images/icon-download.png")}
              />
              <Text style={styles.textDown}>下载更新</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.item}>
          <TouchableOpacity
            style={styles.btn1}
            onPress={() => this.rediretPageZhfzgc()}
          >
            <Image style={styles.cj5} source={require("../images/cj4.jpg")} />
            <Text style={styles.text}>灾害防治工程进度</Text>
          </TouchableOpacity>
          <View style={styles.btn2}>
            <TouchableOpacity
              style={styles.btnmargin}
              onPress={() => this.downLoad("zhfzgc")}
            >
              <Image
                style={styles.cj5Down}
                source={require("../images/icon-download.png")}
              />
              <Text style={styles.textDown}>下载更新</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    ...Platform.select({
      android: {
        backgroundColor: "#f5f5f5"
      }
    })
  },
  container: {
    paddingBottom: 5
  },
  btn1: {
    position: "relative",
    width: 200,
    height: 75
  },
  btn2: {
    width: 100,
    marginLeft: 10
  },
  item: {
    flex: 1,
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  btnmargin: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E5E5E5",
    width: 110,
    height: 40
  },
  cj5: {
    width: 200,
    height: 75,
    borderRadius: 5,
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  text: {
    color: "white",
    fontSize: 17,
    position: "absolute",
    alignSelf: "center",
    justifyContent: "center",
    top: 50 * 0.5
  },
  cj5Down: {
    width: 12,
    height: 12
  },
  textDown: {
    color: "#656565",
    fontSize: 16
  }
});
