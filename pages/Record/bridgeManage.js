import React, { Component } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  AsyncStorage,
  TextInput,
  Button,
  ToastAndroid,
  Image,
  TouchableHighlight,
  TouchableNativeFeedback,
  DeviceEventEmitter,
  TouchableOpacity,
  View,
  Platform,
  AlertIOS
} from "react-native";
import DateTimePicker from "react-native-modal-datetime-picker";
import ImageManage from "../../component/ImagePicker";
import Slider from "react-native-slider";

let Touchable = TouchableHighlight;
if (Platform.OS === "android") {
  Touchable = TouchableNativeFeedback;
}

export default class BridgeManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: "",
      bridgeList: {},
      storageBridgeList: [],
      bridgeInfo: {},
      sliderVal: 1,
      images: [{ FilePath: "" }],
      isDateTimePickerVisible: false,
      JHSYBBZJE: 0,
      JHSYSBBZJE: 0,
      JHSYDFZCZJ: 0,
      PFZTZ: 0,
      parms: {
        id: "",
        CJSJ: "",
        WCZTZ: 0,
        WCZYTZ: "",
        WCDFZC: "",
        WCSBZ: "",
        JGSJ: "",
        WWCYY: "",
        XXJD: "",
        BZ: "",
        Files: ""
      }
    };
  }
  componentDidMount() {
    this._getToken();
    this._GetAsyncStorageBridgeList();
    let bridgeInfo = this.props.navigation.state.params;
    console.log(bridgeInfo);
    if (bridgeInfo) {
      this.state.wcztz = bridgeInfo.bridgeInfo.WCZTZ;
      this.state.JHSYBBZJE = bridgeInfo.bridgeInfo.JHSYBBZJE;
      this.state.JHSYSBBZJE = bridgeInfo.bridgeInfo.JHSYSBBZJE;
      this.state.JHSYDFZCZJ = bridgeInfo.bridgeInfo.JHSYDFZCZJ;
      this.state.PFZTZ = bridgeInfo.bridgeInfo.PFZTZ;
      bridgeInfo.bridgeInfo.CJSJ = this.formatTime(new Date());
    }
    if (bridgeInfo.bridgeInfo.uploadStatus == "uploaded") {
      bridgeInfo.bridgeInfo.uploadStatus = "unUpload";
      bridgeInfo.bridgeInfo.JHSYBBZJE = 0;
      bridgeInfo.bridgeInfo.JHSYSBBZJE = 0;
      bridgeInfo.bridgeInfo.JHSYDFZCZJ = 0;
      bridgeInfo.bridgeInfo.PFZTZ = 0;
      bridgeInfo.bridgeInfo.WCSBZ = "";
      bridgeInfo.bridgeInfo.WWCYY = "";
      bridgeInfo.bridgeInfo.BZ = "";
      bridgeInfo.bridgeInfo.JGSJ = "";
      bridgeInfo.bridgeInfo.Files = [];
    }
    if (bridgeInfo.bridgeInfo.Files && bridgeInfo.bridgeInfo.Files.length > 0) {
      bridgeInfo.bridgeInfo.Files.forEach(item => {
        this.state.images.push({ FilePath: item.FilePath });
      });
    } else {
      bridgeInfo.bridgeInfo.Files = [];
    }

    this.setState({
      images: this.state.images,
      bridgeInfo: bridgeInfo.bridgeInfo
    });
  }

  _GetAsyncStorageBridgeList = async () => {
    try {
      const value = await AsyncStorage.getItem("BridgeList");
      const storageBridgeList = await AsyncStorage.getItem("StorageBridgeList");
      if (value !== null) {
        this.setState({ bridgeList: JSON.parse(value) });
      }
      if (storageBridgeList !== null) {
        this.setState({ storageBridgeList: JSON.parse(storageBridgeList) });
      }
    } catch (error) {
      // Error retrieving data
    }
  };
  _getToken = async () => {
    try {
      var value = await AsyncStorage.getItem("token");
      if (value !== null) {
        this.setState({ token: value });
      } else {
        this.props.navigation.navigate("Login");
      }
    } catch (error) {
      this._appendMessage("AsyncStorage error: " + error.message);
    }
  };
  formatTime(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    // return [year, month, day].map(this.formatNumber).join('-')
    return (
      [year, month, day].map(this.formatNumber).join("/") +
      " " +
      [hour, minute, second].map(this.formatNumber).join(":")
    );
  }
  sliderChange(val) {
    this.state.bridgeInfo.JHSYBBZJE = parseInt(this.state.JHSYBBZJE * val);
    this.state.bridgeInfo.JHSYSBBZJE = parseInt(this.state.JHSYSBBZJE * val);
    this.state.bridgeInfo.JHSYDFZCZJ = parseInt(this.state.JHSYDFZCZJ * val);
    this.state.bridgeInfo.PFZTZ = parseInt(this.state.PFZTZ * val);
    this.setState({ sliderVal: val, bridgeInfo: this.state.bridgeInfo });
  }
  formatNumber(n) {
    n = n.toString();
    return n[1] ? n : "0" + n;
  }
  _getLongitudeAndLatitude() {
    //获取位置再得到城市先后顺序，通过Promise完成
    console.log("_getLongitudeAndLatitude");
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        location => {
          //可以获取到的数据
          var result =
            "速度：" +
            location.coords.speed +
            "\n经度：" +
            location.coords.longitude +
            "\n纬度：" +
            location.coords.latitude +
            "\n准确度：" +
            location.coords.accuracy +
            "\n行进方向：" +
            location.coords.heading +
            "\n海拔：" +
            location.coords.altitude +
            "\n海拔准确度：" +
            location.coords.altitudeAccuracy +
            "\n时间戳：" +
            location.timestamp;
          console.log("result:" + result);
          resolve([location.coords.longitude, location.coords.latitude]);
        },
        error => {
          reject(error);
        }
      );
    });
  }
  _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

  _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

  _handleDatePicked = date => {
    this.state.bridgeInfo.JGSJ = this.formatDate(date);
    console.log("A date has been picked: ", this.formatDate(date));
    this._hideDateTimePicker();
  };
  formatDate(fmt) {
    var curDate = fmt;
    return (
      curDate.getFullYear() +
      "/" +
      curDate.getMonth() +
      1 +
      "/" +
      curDate.getDate() +
      " " +
      curDate.getHours() +
      ":" +
      curDate.getMinutes()
    );
  }
  addQlxx() {
    this.state.parms.id = this.state.bridgeInfo.ID;
    this.state.parms.CJSJ = this.state.bridgeInfo.CJSJ;
    this.state.parms.JHSYBBZJE = this.state.bridgeInfo.JHSYBBZJE;
    this.state.parms.JHSYSBBZJE = this.state.bridgeInfo.JHSYSBBZJE;
    this.state.parms.JHSYDFZCZJ = this.state.bridgeInfo.JHSYDFZCZJ;
    this.state.parms.PFZTZ = this.state.bridgeInfo.PFZTZ;
    this.state.parms.JGSJ = null;
    this.state.parms.WWCYY = this.state.bridgeInfo.WWCYY;
    this.state.parms.XXJD = this.state.bridgeInfo.XXJD;
    this.state.parms.WCSBZ = this.state.bridgeInfo.WCSBZ;
    this.state.parms.JingDu = this.state.bridgeInfo.JingDu;
    this.state.parms.WeiDu = this.state.bridgeInfo.WeiDu;
    let files = [];
    this.state.bridgeInfo.Files.forEach(item => {
      if (item.FilePath != "") {
        files.push({ FileName: "", FilePath: item.FilePath, FileInfo: "" });
      }
    });
    this.state.parms.Files = files;
    let formData = new FormData();
    for (var key in this.state.parms) {
      formData.append(key, this.state.parms[key]);
    }
    console.log("formData", formData);
    fetch("http://hb.jgy-tec.com/api/app/AddQljd", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer  " + this.state.token
      },
      body: JSON.stringify(this.state.parms)
    }).then(
      response => {
        if (response.status == 401) {
          this.props.navigation.navigate("Login");
        }
        if (response.status == 200) {
          console.log("response.status", response);
          res = JSON.parse(response._bodyText);
          if (res.IsSuccess) {
            if (Platform.OS == "ios") {
              AlertIOS.alert("提示", "上传成功", [
                { text: "确定", onPress: () => console.log("Foo Pressed!") }
              ]);
            } else {
              ToastAndroid.show(
                "上传成功",
                ToastAndroid.CENTER,
                ToastAndroid.CENTER
              );
            }
          } else {
            if (Platform.OS == "ios") {
              AlertIOS.alert("提示", res.Message, [
                { text: "确定", onPress: () => console.log("Foo Pressed!") }
              ]);
            } else {
              ToastAndroid.show(
                res.Message,
                ToastAndroid.CENTER,
                ToastAndroid.CENTER
              );
            }
          }
        }
      },
      error => {
        console.log("error:", error);
      }
    );
  }
  getLocalPath(path) {
    console.log("getLocalPath:", path);
    this.state.images.push({ FilePath: path });
    this.state.bridgeInfo.Files = [];
    this.state.images.forEach((item, index) => {
      if (!item.FilePath) {
        this.state.images.splice(index, 1);
      }
    });
    this.state.images.forEach(item => {
      this.state.bridgeInfo.Files.push({
        FileName: "",
        FilePath: item.FilePath,
        FileInfo: ""
      });
    });
    this.state.images.push({ FilePath: "" });
    this.setState({ images: this.state.images });
    console.log("this.state.images:" + JSON.stringify(this.state.images));
    console.log(
      "this.state.bridgeInfo.Files:" +
        JSON.stringify(this.state.bridgeInfo.Files)
    );
  }
  renderImages() {
    console.log(this.state.images);
    let t = [];
    this.state.images.forEach(item => {
      t.push(this.renderItem(item));
    });
    return t;
  }
  renderItem(item) {
    return (
      <ImageManage
        FilePath={item.FilePath}
        uploadStatus={this.state.bridgeInfo.uploadStatus}
        getLocalPath={item => this.getLocalPath(item)}
      />
    );
  }
  upLoadBridgeInfo = async () => {
    for (let index = 0; index < this.state.bridgeInfo.Files.length; index++) {
      let item = this.state.bridgeInfo.Files[index];
      if (item.FilePath) {
        let formData = new FormData();
        formData.append("qlxxId", this.state.bridgeInfo.ID);
        let file = {
          uri: item.FilePath,
          type: "multipart/form-data",
          name: "image.jpg"
        };
        formData.append("file", file);
        await fetch("http://hb.jgy-tec.com/api/app/UploadQlImage?qlxxId=123", {
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data;charset=utf-8",
            Authorization: "Bearer  " + this.state.token
          },
          body: formData
        }).then(
          res => {
            let path = JSON.parse(res._bodyText).Result[0];
            this.state.bridgeInfo.Files[index].FilePath = path;
            console.log("await", path);
          },
          error => {
            console.log(error);
          }
        );
      }
    }
    this._getLongitudeAndLatitude().then(
      res => {
        this.state.bridgeInfo.JingDu = res[0];
        this.state.bridgeInfo.WeiDu = res[1];
        this.state.bridgeList.forEach((item, index) => {
          if (item.QLBM == this.state.bridgeInfo.QLBM) {
            this.state.bridgeInfo.uploadStatus = "uploaded";
            this.state.bridgeList[index] = this.state.bridgeInfo;
          }
        });
        let hasBridgeInfo = false;
        for (
          let index = 0;
          index < this.state.storageBridgeList.length;
          index++
        ) {
          if (
            this.state.storageBridgeList[index].QLBM ==
            this.state.bridgeInfo.QLBM
          ) {
            {
              hasBridgeInfo = true;
              this.state.storageBridgeList[index] = this.state.bridgeInfo;
              break;
            }
          }
        }
        if (!hasBridgeInfo) {
          this.state.storageBridgeList.push(this.state.bridgeInfo);
        }
        this.addQlxx();
        this._uploadStoreData(this.state.bridgeList);
      },
      error => {
        console.log("getLongitudeAndLatitude-error:" + error);
      }
    );
  };

  uploadImage(uri) {
    let formData = new FormData();
    formData.append("qlxxId", 143);
    let file = { uri: uri, type: "multipart/form-data", name: "image.jpg" };
    formData.append("file", file);
    fetch("http://hb.jgy-tec.com/api/app/UploadQlImage?qlxxId=123", {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data;charset=utf-8",
        Authorization: "Bearer  " + this.state.token
      },
      body: formData
    })
      .then(response => {
        console.log("result:" + JSON.parse(response._bodyText).Result);
        return JSON.parse(response._bodyText).Result[0];
      })
      .catch(err => {
        console.log("err", err);
        return "";
      });
  }
  updateStorageBridgeListBeforeUpload() {
    this._getLongitudeAndLatitude().then(
      res => {
        this.state.bridgeInfo.JingDu = res[0];
        this.state.bridgeInfo.WeiDu = res[1];
        this.state.bridgeList.forEach((item, index) => {
          if (item.QLBM == this.state.bridgeInfo.QLBM) {
            this.state.bridgeInfo.uploadStatus = "uploaded";
            this.state.bridgeList[index] = this.state.bridgeInfo;
          }
        });
        let hasBridgeInfo = false;
        for (
          let index = 0;
          index < this.state.storageBridgeList.length;
          index++
        ) {
          if (
            this.state.storageBridgeList[index].QLBM ==
            this.state.bridgeInfo.QLBM
          ) {
            {
              hasBridgeInfo = true;
              this.state.storageBridgeList[index] = this.state.bridgeInfo;
              break;
            }
          }
        }
        if (!hasBridgeInfo) {
          this.state.storageBridgeList.push(this.state.bridgeInfo);
        }
        this._storeData();
      },
      error => {
        console.log("getLongitudeAndLatitude-error:" + error);
        this.updateStorageBridgeList();
      }
    );
  }
  saveBridgeInfo() {
    this._getLongitudeAndLatitude().then(
      res => {
        this.state.bridgeInfo.JingDu = res[0];
        this.state.bridgeInfo.WeiDu = res[1];
        this.updateStorageBridgeList();
      },
      error => {
        this.updateStorageBridgeList();
      }
    );
  }
  updateStorageBridgeList() {
    this.state.bridgeList.forEach((item, index) => {
      if (item.QLBM == this.state.bridgeInfo.QLBM) {
        this.state.bridgeInfo.uploadStatus = "unUpload";
        this.state.bridgeList[index] = this.state.bridgeInfo;
      }
    });
    let hasBridgeInfo = false;
    for (let index = 0; index < this.state.storageBridgeList.length; index++) {
      if (
        this.state.storageBridgeList[index].QLBM == this.state.bridgeInfo.QLBM
      ) {
        {
          hasBridgeInfo = true;
          this.state.storageBridgeList[index] = this.state.bridgeInfo;
          break;
        }
      }
    }
    if (!hasBridgeInfo) {
      this.state.storageBridgeList.push(this.state.bridgeInfo);
    }
    this._storeData();
  }
  _uploadStoreData = async bridgeList => {
    try {
      await AsyncStorage.removeItem("BridgeList");
      await AsyncStorage.removeItem("StorageBridgeList");
      await AsyncStorage.setItem("BridgeList", JSON.stringify(bridgeList));
      await AsyncStorage.setItem(
        "StorageBridgeList",
        JSON.stringify(this.state.storageBridgeList)
      );
      DeviceEventEmitter.emit("updateMakers", bridgeList);
    } catch (error) {
      // Error saving data
    }
  };
  _storeData = async () => {
    try {
      await AsyncStorage.removeItem("BridgeList");
      await AsyncStorage.removeItem("StorageBridgeList");
      await AsyncStorage.setItem(
        "BridgeList",
        JSON.stringify(this.state.bridgeList)
      );
      await AsyncStorage.setItem(
        "StorageBridgeList",
        JSON.stringify(this.state.storageBridgeList)
      );
      if (Platform.OS == "ios") {
        AlertIOS.alert("提示", "保存本地成功", [
          { text: "确定", onPress: () => console.log("Foo Pressed!") }
        ]);
      } else {
        ToastAndroid.show(
          "保存本地成功",
          ToastAndroid.CENTER,
          ToastAndroid.CENTER
        );
      }
    } catch (error) {
      // Error saving data
    }
  };
  _renderItem(title, route) {
    return (
      <Touchable onPress={() => this.props.navigation.navigate(route)}>
        <View style={styles.item}>
          <Text style={styles.itemText}>{title}</Text>
        </View>
      </Touchable>
    );
  }
  render() {
    return (
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.container}
      >
        <View style={styles.group}>
          <View style={styles.TextItem}>
            <Text>桥梁编码：</Text>
            <Text>{this.state.bridgeInfo.QLBM}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.TextItem1}>
            <Text>桥梁名称：</Text>
            <Text>{this.state.bridgeInfo.QLMC}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.TextItem}>
            <Text>路线编码：</Text>
            <Text>{this.state.bridgeInfo.LXBM}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.TextItem1}>
            <Text>路线名称：</Text>
            <Text>{this.state.bridgeInfo.LXMC}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.TextItem}>
            <Text>行政区划：</Text>
            <Text>{this.state.bridgeInfo.XZQHMC}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.TextItem1}>
            <Text>中心桩号：</Text>
            <Text>{this.state.bridgeInfo.ZXZH}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.TextItem}>
            <Text>开工时间：</Text>
            <Text>{this.state.bridgeInfo.JHKGSJ}</Text>
          </View>
          <View style={styles.TextItem1}>
            <Text>预计竣工时间：</Text>
            <Text>{this.state.bridgeInfo.YJJGSJ}</Text>
          </View>
          <View style={styles.TextItem}>
            <Text>施工单位：</Text>
            <Text>{this.state.bridgeInfo.SGDW}</Text>
          </View>
          <View style={styles.TextItem1}>
            <Text>监理单位：</Text>
            <Text>{this.state.bridgeInfo.JLDW}</Text>
          </View>
          <View style={styles.TextItem}>
            <Text>采集时间：</Text>
            <Text>{this.state.bridgeInfo.CJSJ}</Text>
          </View>
          <View style={styles.TextItemInput}>
            <View style={styles.TextLabel}>
              <Text>计划使用部补助金额*</Text>
            </View>
            <Text>{this.state.bridgeInfo.JHSYBBZJE}</Text>
          </View>

          <View style={styles.TextItemInput1}>
            <View style={styles.TextLabel}>
              <Text>计划使用省补助资金*</Text>
            </View>
            <Text>{this.state.bridgeInfo.JHSYSBBZJE}</Text>
          </View>
          <View style={styles.TextItemInput}>
            <View style={styles.TextLabel}>
              <Text>计划使用地方自筹资金*</Text>
            </View>
            <Text>{this.state.bridgeInfo.JHSYDFZCZJ}</Text>
          </View>
          <View style={styles.TextItemInput1}>
            <View style={styles.TextLabel}>
              <Text>批复总投资（万元）*</Text>
            </View>
            <Text>{this.state.bridgeInfo.PFZTZ}</Text>
          </View>
          <View style={[styles.TextItemInput, styles.percentItem]}>
            <View style={styles.sliderContainer}>
              <Slider
                value={this.state.sliderVal}
                trackStyle={customStyles3.track}
                thumbStyle={customStyles3.thumb}
                minimumTrackTintColor="#eecba8"
                onValueChange={value => this.sliderChange(value)}
              />
              <Text>百分比: {parseInt(this.state.sliderVal * 100)}%</Text>
            </View>
          </View>
          <View style={styles.TextItemInput}>
            <View style={styles.TextLabel}>
              <Text>竣工时间（非必填）*</Text>
            </View>
            <TextInput
              style={styles.TextInput}
              underlineColorAndroid="transparent"
              onFocus={() => this._showDateTimePicker()}
              value={this.state.bridgeInfo.JGSJ}
            />
            <DateTimePicker
              mode="date"
              format="YYYY-MM-DD"
              confirmBtnText="确定"
              cancelBtnText="取消"
              isVisible={this.state.isDateTimePickerVisible}
              onConfirm={this._handleDatePicked}
              onCancel={this._hideDateTimePicker}
            />
          </View>
          <View style={styles.TextItemInput1}>
            <View style={styles.TextLabel}>
              <Text>备注*</Text>
            </View>
            <TextInput
              style={styles.TextInput}
              underlineColorAndroid="transparent"
              multiline
              onChangeText={text => (this.state.bridgeInfo.BZ = text)}
              value={this.state.bridgeInfo.BZ}
            />
          </View>
          <View style={styles.TextItemInput}>
            <View style={styles.TextLabel}>
              <Text>未完成原因（非必填）*</Text>
            </View>
            <TextInput
              style={styles.TextInput}
              underlineColorAndroid="transparent"
              onChangeText={text => (this.state.bridgeInfo.WWCYY = text)}
              value={this.state.bridgeInfo.WWCYY}
            />
          </View>
          <View style={styles.TextItemInput1}>
            <View style={styles.TextLabel}>
              <Text>形象进度描述（非必填）*</Text>
            </View>
            <TextInput
              style={styles.TextInput}
              underlineColorAndroid="transparent"
              onChangeText={text => (this.state.bridgeInfo.XXJD = text)}
              value={this.state.bridgeInfo.XXJD}
            />
          </View>
          <View style={styles.group}>
            <View style={styles.textImage}>
              <Text>照片</Text>
            </View>
            <View style={styles.Images}>{this.renderImages()}</View>
            <View style={styles.btns}>
              <TouchableOpacity
                style={styles.upload}
                onPress={() => {
                  this.upLoadBridgeInfo();
                }}
              >
                <View>
                  <Text style={styles.text}>上传</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveInfo}
                onPress={() => {
                  this.saveBridgeInfo();
                }}
              >
                <View>
                  <Text style={styles.text}>保存</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
}
const customStyles3 = StyleSheet.create({
  track: {
    height: 10,
    borderRadius: 5,
    backgroundColor: "#d0d0d0"
  },
  thumb: {
    width: 10,
    height: 30,
    borderRadius: 5,
    backgroundColor: "#eb6e1b"
  }
});
const styles = StyleSheet.create({
  scrollView: {
    ...Platform.select({
      android: {
        backgroundColor: "#f5f5f5"
      }
    })
  },
  sliderContainer: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
    alignItems: "stretch",
    justifyContent: "center"
  },
  container: {
    paddingBottom: 15
  },
  group: {
    marginTop: 15
  },
  item: {
    padding: 15,
    backgroundColor: "#fff"
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#eee"
  },
  itemText: {
    fontSize: 16,
    color: "#424242"
  },
  TextLabel: {
    textAlign: "center",
    justifyContent: "center"
  },
  TextItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 30,
    paddingRight: 30,
    height: 50,
    backgroundColor: "#EEEEEE"
  },
  TextItem1: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 30,
    paddingRight: 30,
    height: 50,
    backgroundColor: "#F8F8F8"
  },
  TextItemInput: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 30,
    paddingRight: 30,
    height: 50,
    backgroundColor: "#F8F8F8"
  },
  TextItemInput1: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 30,
    paddingRight: 30,
    height: 50,
    backgroundColor: "#EEEEEE"
  },
  TextInput: {
    height: 40,
    width: 160,
    borderWidth: 1,
    borderColor: "#E5E5E5"
  },
  upload: {
    flex: 1,
    backgroundColor: "#EB6100",
    height: 40,
    justifyContent: "center",
    alignItems: "center"
  },
  saveInfo: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2D82EB",
    marginTop: 15,
    height: 40
  },
  btns: {
    flexDirection: "column",
    paddingLeft: 30,
    paddingRight: 30
  },
  textImage: {
    height: 30,
    paddingLeft: 20
  },
  Images: {
    height: "auto",
    flex: 1,
    paddingLeft: 30,
    justifyContent: "center",
    flexWrap: "wrap",
    flexDirection: "row",
    alignItems: "center"
  }
});
