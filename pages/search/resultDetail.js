import React, { Component } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  TouchableHighlight,
  TouchableNativeFeedback,
  View
} from "react-native";

let Touchable = TouchableHighlight;
if (Platform.OS === "android") {
  Touchable = TouchableNativeFeedback;
}

export default class ResultDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: "",
      bridgeInfo: {},
      parms: {
        id: "",
        CJSJ: "",
        WCZTZ: "",
        WCZYTZ: "",
        WCDFZC: "",
        JGSJ: "",
        WWCYY: "",
        BZ: "",
        Files: ""
      }
    };
  }
  componentDidMount() {
    let bridgeInfo = this.props.navigation.state.params;
    this.setState({ bridgeInfo: bridgeInfo.bridgeInfo });
  }
  formatTime(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    return (
      [year, month, day].map(this.formatNumber).join("/") +
      " " +
      [hour, minute, second].map(this.formatNumber).join(":")
    );
  }

  formatNumber(n) {
    n = n.toString();
    return n[1] ? n : "0" + n;
  }
  getRowStyle(index) {
    if (index % 2 == 0) {
      return {
        flex: 1,
        flexDirection: "row",
        height: 40,
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: "#F8F8F8",
        paddingLeft: 10,
        paddingRight: 10
      };
    } else {
      return {
        flex: 1,
        flexDirection: "row",
        height: 40,
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: "white",
        paddingLeft: 10,
        paddingRight: 10
      };
    }
  }
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
            <Text>总投资</Text>
            <Text>{this.state.bridgeInfo.WCZTZ}</Text>
          </View>
          <View style={styles.TextItem}>
            <Text>中央投资</Text>
            <Text>{this.state.bridgeInfo.WCZYTZ}</Text>
          </View>
          <View style={styles.TextItem1}>
            <Text>地方自筹</Text>
            <Text>{this.state.bridgeInfo.WCDFZC}</Text>
          </View>
          <View style={styles.TextItem}>
            <Text>采集时间</Text>
          </View>
          <View style={styles.group1}>
            <FlatList
              style={styles.flatList}
              data={this.state.bridgeInfo.Gcjd}
              extraData={this.state}
              keyExtractor={this._keyExtractor}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  key={item.Id}
                  onPress={() => {
                    this.props.navigation.navigate("CjsjDetail", {
                      cjsj: item
                    });
                  }}
                >
                  <View style={this.getRowStyle(index)}>
                    <Text>{item.CJSJ}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
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
  itemContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 30,
    paddingRight: 30
  },
  flatList: {
    flex: 1
  },
  container: {
    paddingBottom: 15
  },
  group: {
    flex: 1,

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
  }
});
