import React, { Component } from 'react'
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  TouchableHighlight,
  TouchableNativeFeedback,
  View,
} from 'react-native'

let Touchable = TouchableHighlight
if (Platform.OS === 'android') {
  Touchable = TouchableNativeFeedback
}

export default class ShxfResultDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      bridgeInfo: {},
      parms: {
        id: '',
        CJSJ: '',
        WCZTZ: '',
        WCZYTZ: '',
        WCDFZC: '',
        JGSJ: '',
        WWCYY: '',
        BZ: '',
        Files: ''
      }
    }
  }
  componentDidMount() {
    let bridgeInfo = this.props.navigation.state.params
    this.setState({ bridgeInfo: bridgeInfo.bridgeInfo })
  }
  formatTime(date) {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
    return [year, month, day].map(this.formatNumber).join('/') + ' ' + [hour, minute, second].map(this.formatNumber).join(':')
  }

  formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  }
  getRowStyle(index) {
    if (index % 2 == 0) {
      return {
        flex: 1,
        flexDirection: 'row',
        height: 40,
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#F8F8F8',
        paddingLeft: 10,
        paddingRight: 10,
      }
    } else {
      return {
        flex: 1,
        flexDirection: 'row',
        height: 40,
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingLeft: 10,
        paddingRight: 10,
      }
    }
  }
  _renderItem(title, route) {
    return (
      <Touchable onPress={() => this.props.navigation.navigate(route)}>
        <View style={styles.item}>
          <Text style={styles.itemText}>{title}</Text>
        </View>
      </Touchable>
    )
  }
  render() {
    return (
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.container}>
        <View style={styles.group}>
          <View style={styles.TextItem} >
            <Text>管养单位</Text>
            <Text>{this.state.bridgeInfo.GYDWMC}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.TextItem1} >
            <Text>行政区划</Text>
            <Text>{this.state.bridgeInfo.XZQHMC}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.TextItem} >
            <Text>路线编号</Text>
            <Text>{this.state.bridgeInfo.LXBM}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.TextItem1} >
            <Text>路线名称</Text>
            <Text>{this.state.bridgeInfo.LXMC}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.TextItem} >
            <Text>起点桩号</Text>
            <Text>{this.state.bridgeInfo.QDZH}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.TextItem1} >
            <Text>止点桩号</Text>
            <Text>{this.state.bridgeInfo.ZDZH}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.TextItem} >
            <Text>水毁损失金额合计</Text>
            <Text>{this.state.bridgeInfo.SHSSJEHJ}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.TextItem1} >
            <Text>路基塌方-立方米</Text>
            <Text>{this.state.bridgeInfo.LJTFLFM}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.TextItem} >
            <Text>路基塌方-公里</Text>
            <Text>{this.state.bridgeInfo.LJTFGL}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.TextItem1} >
            <Text>路基塌方-损失金额</Text>
            <Text>{this.state.bridgeInfo.LJTFSSJE}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.TextItem} >
            <Text>沥青路面-平方米</Text>
            <Text>{this.state.bridgeInfo.LQLMPFM}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.TextItem1} >
            <Text>沥青路面-公里</Text>
            <Text>{this.state.bridgeInfo.LQLMGL}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.TextItem} >
            <Text>沥青路面-损失金额</Text>
            <Text>{this.state.bridgeInfo.LQLMSSJE}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.TextItem1} >
            <Text>水泥路面-平方米</Text>
            <Text>{this.state.bridgeInfo.SNLMPFM}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.TextItem} >
            <Text>水泥路面-公里</Text>
            <Text>{this.state.bridgeInfo.SNLMGL}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.TextItem1} >
            <Text>水泥路面-损失金额</Text>
            <Text>{this.state.bridgeInfo.SNLMSSJE}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.TextItem} >
            <Text>砂石路面-平方米</Text>
            <Text>{this.state.bridgeInfo.SSLMPFM}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.TextItem1} >
            <Text>砂石路面-公里</Text>
            <Text>{this.state.bridgeInfo.SSLMGL}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.TextItem} >
            <Text>砂石路面-损失金额</Text>
            <Text>{this.state.bridgeInfo.SSLMSSJE}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.TextItem1} >
            <Text>桥梁-全毁-延米</Text>
            <Text>{this.state.bridgeInfo.QHYM}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.TextItem} >
            <Text>桥梁-全毁-座</Text>
            <Text>{this.state.bridgeInfo.QHZ}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.TextItem1} >
            <Text>桥梁-全毁-损失金额</Text>
            <Text>{this.state.bridgeInfo.QHSSJE}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.TextItem} >
            <Text>桥梁-局部毁-延米</Text>
            <Text>{this.state.bridgeInfo.JBHYM}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.TextItem1} >
            <Text>桥梁-局部毁-座</Text>
            <Text>{this.state.bridgeInfo.JBHZ}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.TextItem} >
            <Text>桥梁-局部毁-损失金额</Text>
            <Text>{this.state.bridgeInfo.JBHSSJE}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.TextItem1} >
            <Text>隧道-毁坏（延米）</Text>
            <Text>{this.state.bridgeInfo.SDHHYM}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.TextItem} >
            <Text>隧道-道</Text>
            <Text>{this.state.bridgeInfo.SDD}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.TextItem1} >
            <Text>隧道-损失金额</Text>
            <Text>{this.state.bridgeInfo.SDSSJE}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.TextItem} >
            <Text>涵洞-道</Text>
            <Text>{this.state.bridgeInfo.HDD}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.TextItem1} >
            <Text>涵洞-损失金额</Text>
            <Text>{this.state.bridgeInfo.HDSSJE}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.TextItem} >
            <Text>防护工程-护坡-立方米</Text>
            <Text>{this.state.bridgeInfo.HPLFM}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.TextItem1} >
            <Text>防护工程-护坡-处</Text>
            <Text>{this.state.bridgeInfo.HPC}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.TextItem} >
            <Text>防护工程-护坡-损失金额</Text>
            <Text>{this.state.bridgeInfo.HPSSJE}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.TextItem1} >
            <Text>防护工程-驳岸、挡墙-立方米</Text>
            <Text>{this.state.bridgeInfo.BADQLFM}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.TextItem} >
            <Text>防护工程-驳岸、挡墙-处</Text>
            <Text>{this.state.bridgeInfo.BADQC}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.TextItem1} >
            <Text>防护工程-驳岸、挡墙-损失金额</Text>
            <Text>{this.state.bridgeInfo.BADQSSJE}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.TextItem} >
            <Text>坍塌方-立方米</Text>
            <Text>{this.state.bridgeInfo.TTFLFM}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.TextItem1} >
            <Text>坍塌方-处</Text>
            <Text>{this.state.bridgeInfo.TTFC}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.TextItem} >
            <Text>坍塌方-损失金额</Text>
            <Text>{this.state.bridgeInfo.TTFSSJE}</Text>
          </View>
          <View style={styles.TextItem1} >
            <Text>其他-损失金额</Text>
            <Text>{this.state.bridgeInfo.QTSSJE}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.TextItem} >
            <Text>涵洞-损失原因</Text>
            <Text>{this.state.bridgeInfo.QTSSYY}</Text>
          </View>
          <View style={styles.separator} />
        </View>
      </ScrollView >
    )
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
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 30,
    paddingRight: 30,
  },
  flatList: {
    flex: 1,
  },
  container: {
    paddingBottom: 15,
  },
  group: {
    flex: 1,

    marginTop: 15,
  },
  item: {
    padding: 15,
    backgroundColor: '#fff',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#eee',
  },
  itemText: {
    fontSize: 16,
    color: '#424242',
  },
  TextLabel: {
    textAlign: 'center',
    justifyContent: 'center'
  },
  TextItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 30,
    paddingRight: 30,
    height: 50,
    backgroundColor: '#EEEEEE',
  },
  TextItem1: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 30,
    paddingRight: 30,
    height: 50,
    backgroundColor: '#F8F8F8',
  },
})
