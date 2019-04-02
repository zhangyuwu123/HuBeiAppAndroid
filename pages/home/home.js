import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  Button,
  Image,
  TouchableOpacity,
  Platform
} from "react-native";
import { MapView } from "react-native-amap3d";
import styles from "./styles";
let flag = require("../images/flag.png");

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showsCompass: true,
      showsScale: true,
      showsZoomControls: true,
      showsLocationButton: true,
      curLocation: null,
      realm: null,
      status: "",
      token: "",
      makerImg: "",
      makerTitle: "",
      makerRouter: "",
      makerTime: "",
      makerCoordinates: {
        latitude: 0,
        longitude: 0
      },
      coordinates: [],
      makerItem: "",
      eventEmitter: null,
      curcoordinate: { latitude: 0, longitude: 0 },
      bridgeList: [],
      url: "",
      makerImgs: [],
      locationView: null,
      userInfo: {
        nickName: "",
        avatar: ""
      }
    };
    this.makerImgs = [];
    this.locationView = [];
  }
  componentWillMount = async () => {
    this.state.url = "http://demo.d9tec.com/api/app/getxfqlxxs";
    try {
      var value = await AsyncStorage.getItem("token");
      if (value) {
        console.log("maps:" + value);
        this.setState({ token: value });
        this._GetBridgeList();
      } else {
        this.props.navigation.navigate("Login");
      }
    } catch (error) {
      console.log(error);
    }
    if (Platform.OS == "ios") {
      this.locationView.push(
        <TouchableOpacity
          style={styles.location}
          onPress={() => this.setLocationPostion()}
        >
          <View>
            <Image
              style={styles.locationIcon}
              source={require("../images/location.png")}
            />
          </View>
        </TouchableOpacity>
      );
      this.setState({ locationView: this.locationView, showsCompass: false });
    }
  };
  componentDidMount() {
    // this._GetUserInfo()
    // navigator.geolocation.getCurrentPosition(
    //   location => {
    //     this.setState({
    //       curcoordinate: { latitude: location.coords.latitude, longitude: location.coords.longitude }
    //     })
    //   },
    //   error => { }
    // )
  }
  componentWillReceiveProps(obj) {
    this.state.token = obj.navigation.state.params.token;
    this.setState({ makerImgs: [] });
    this._GetBridgeList();
  }
  updateMakersBridgeList() {
    if (!this.state.bridgeList || this.state.bridgeList.length <= 0) {
      this.setState({
        curcoordinate: { latitude: 30.52, longitude: 114.31 }
      });
      return;
    }
    this.state.bridgeList.forEach(item => {
      if (item.Gcjd && item.Gcjd.length > 0) {
        let temp = item.Gcjd[0];
        if (temp.JingDu && temp.WeiDu) {
          if (!this.state.curcoordinate.latitude) {
            this.setState({
              curcoordinate: {
                latitude: Number(temp.WeiDu),
                longitude: Number(temp.JingDu)
              }
            });
          }
          this.makerImgs.push(
            <MapView.Marker
              key={temp.Id}
              title={item.QLMC}
              ref={ref => {
                this.marker = ref;
              }}
              image="flag"
              onPress={() => this._onMarkerPressTemp(item)}
              coordinate={{
                latitude: Number(temp.WeiDu),
                longitude: Number(temp.JingDu)
              }}
            />
          );
        }
      }
    });
    if (!this.state.curcoordinate.latitude) {
      this.setState({
        curcoordinate: { latitude: 30.52, longitude: 114.31 }
      });
    }
    this.setState({ makerImgs: this.makerImgs });
  }
  setLocationPostion() {
    navigator.geolocation.getCurrentPosition(
      location => {
        this.setState({
          curcoordinate: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
          }
        });
        console.log(location.coords);
      },
      error => {
        console.log(error);
      }
    );
  }
  _GetUserInfo = async () => {
    try {
      var value = await AsyncStorage.getItem("token");
      if (value) {
        this.setState({ token: value });
        console.log("maps:" + this.state.token);
      } else {
        this.props.navigation.navigate("Login");
      }
    } catch (error) {
      this._appendMessage("AsyncStorage error: " + error.message);
    }
    fetch("http://demo.d9tec.com/api/app/GetUserInfo", {
      method: "POST",
      headers: {
        Authorization: "Bearer  " + this.state.token,
        "Content-Type": "application/json"
      }
    })
      .then(response => {
        if (response.status == 401) {
          this.props.navigation.navigate("Login");
        } else {
          let userInfo = JSON.parse(response._bodyInit).Result;
          this.state.userInfo.nickName = userInfo.NickName;
          this.state.userInfo.avatar =
            "http://demo.d9tec.com/Resources/master/" + userInfo.Face;
        }
      })
      .catch(error => {
        console.error(error);
      });
  };
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
  onRecord = () => {
    this.props.navigation.navigate("Record");
  };
  onEntryManage = () => {
    this.props.navigation.navigate("MySearchManage");
  };
  onSearch = () => {
    this.props.navigation.navigate("SearchManage");
  };
  onMySettings = () => {
    this.props.navigation.navigate("MySettingsManage", {
      userInfo: this.state.userInfo
    });
  };
  onBridgeDetail = item => {
    this.refs.makerContainer.setNativeProps({ display: "none" });
    this.props.navigation.navigate("ResultDetailManage", { bridgeInfo: item });
  };
  _onMarkerPressTemp = item => {
    this.refs.makerContainer.setNativeProps({ display: "flex" });
    let makerImg =
      "http://bpic.588ku.com/element_origin_min_pic/18/06/10/217da78e9f80484b354afea9bb8a6538.jpg";
    if (item.Gcjd instanceof Array) {
      for (let jd of item.Gcjd) {
        if (jd.Files.length > 0) {
          makerImg = jd.Files[0].FilePath;
          break;
        }
      }
    }
    this.setState({
      makerImg: "http://demo.d9tec.com" + makerImg,
      makerTitle: item.QLMC,
      makerRouter: item.LXBM,
      makerTime: item.CJSJ,
      makerItem: item
    });
    return false;
  };
  _onMarkerPress = item => {
    this.refs.makerContainer.setNativeProps({ display: "flex" });
    this.setState({
      makerImg:
        item.Files.length > 0
          ? "http://demo.d9tec.com" + item.Files[0].FilePath
          : "",
      makerTitle: item.QLMC,
      makerRouter: item.LXBM,
      makerTime: item.CJSJ,
      makerItem: item
    });
    if (item.JingDu && item.WeiDu) {
      this.setState({
        makerCoordinates: {
          latitude: item.JingDu,
          longitude: item.WeiDu
        }
      });
    }
  };
  _GetBridgeList() {
    fetch(this.state.url, {
      method: "POST",
      headers: {
        Authorization: "Bearer  " + this.state.token,
        "Content-Type": "application/json"
      }
    })
      .then(response => {
        if (response.status == 401) {
          this.props.navigation.navigate("Login");
        } else {
          console.log("_UpdateBridgeList:" + response._bodyInit);
          this.state.bridgeList = JSON.parse(response._bodyInit).Result;
          this.updateMakersBridgeList();
        }
      })
      .catch(error => {
        console.error(error);
      });
  }
  pressMap = e => {
    // console.log(e.currentTarget);
    // let mapStatus = e.currentTarget;
    // if (mapStatus === 2) {
    this.refs.makerContainer.setNativeProps({ display: "none" });
    // }
  };
  _renderItem = ({ item }) => {
    return (
      <Text style={styles.logText}>
        {item.time} {item.event}: {item.data}
      </Text>
    );
  };
  render() {
    return (
      <View style={StyleSheet.absoluteFill}>
        <MapView
          coordinate={this.state.curcoordinate}
          zoomLevel={10}
          locationInterval={1000}
          locationEnabled={this.state.showsLocationButton}
          showsCompass={this.state.showsCompass}
          showsScale={this.state.showsScale}
          showsLocationButton={this.state.showsLocationButton}
          showsZoomControls={this.state.showsZoomControls}
          onLocation={this.onLocationEvent}
          onPress={this.pressMap}
          style={styles.map}
        >
          {this.state.makerImgs}
        </MapView>

        <TouchableOpacity style={styles.record} onPress={this.onRecord}>
          <View style={styles.btnRecord}>
            <Image
              style={styles.btnAvatar}
              source={require("../images/icon-edit.png")}
            />
            <Text style={styles.text}>采集</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.search} onPress={this.onSearch}>
          <View style={styles.btnSearch}>
            <Image
              style={styles.btnAvatar}
              source={require("../images/icon-search2.png")}
            />
            <Text style={styles.text}>查询</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.myItem}>
          <TouchableOpacity style={styles.tpAvatar} onPress={this.onMySettings}>
            <Image
              style={styles.avatar}
              source={require("../images/myicon.png")}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.tpText} onPress={this.onEntryManage}>
            <Text
              style={{
                left: 0,
                position: "absolute",
                fontSize: 17,
                color: "black"
              }}
            >
              {" "}
              搜索项目
            </Text>
          </TouchableOpacity>
        </View>
        {this.state.locationView}
        <View style={styles.makerContainer} ref="makerContainer">
          <Image
            style={styles.makerImg}
            source={{ uri: this.state.makerImg }}
          />
          <View style={styles.detail}>
            <View>
              <Text style={styles.makerRouter}>{this.state.makerRouter}</Text>
              <Text style={styles.makerTitle}>{this.state.makerTitle}</Text>
              <Text style={styles.makerTime}>
                {this.formatDate(this.state.makerTime)}
              </Text>
            </View>
            <View style={styles.makerBtn}>
              <Button
                title="详细信息"
                onPress={this.onBridgeDetail.bind(this, this.state.makerItem)}
              />
            </View>
          </View>
        </View>
      </View>
    );
  }
}
