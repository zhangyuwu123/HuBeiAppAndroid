import React, { Component } from 'react';
import {
  Dimensions,
  ScrollView,
  FlatList,
  StyleSheet,
  Text,
  AsyncStorage,
  TouchableOpacity,
  View,
} from 'react-native';
import { Echarts } from 'react-native-secharts';

export default class Statistics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: '',
      summaryData: null,
      title: '',
      option: null,
      chart: null,
      navis: []
    }
  }
  componentWillMount = async () => {
  }
  componentDidMount = async () => {
    let type = this.props.navigation.state.params
    if (type.type == 'dzxgc') {
      this.state.url = "http://demo.d9tec.com/api/app/getdzxsummary"
    } else if (type.type == 'smaqgc') {
      this.state.url = "http://demo.d9tec.com/api/app/getsmaqsummary"
    } else if (type.type == 'zhfzgc') {
      this.state.url = "http://demo.d9tec.com/api/app/getzhfzsummary"
    } else if (type.type == 'wqgzgc') {
      this.state.url = "http://demo.d9tec.com/api/app/getsummariesbyarea"
    } else if (type.type == 'shxfgc') {
      this.state.url = "http://demo.d9tec.com/api/app/getshxfsummary"
    } else {
    }
    try {
      var value = await AsyncStorage.getItem("token");
      if (value) {
        this.setState({ token: value });
        this.getSummariesByArea()
      } else {
        this.props.navigation.navigate('Login')
      }
    } catch (error) {
    }
  }
  getSummariesByArea() {
    fetch(this.state.url, {
      method: "POST",
      headers: {
        Authorization: "Bearer  " + this.state.token,
        "Content-Type": "application/json"
      }
    })
      .then(response => {
        if (response.status == 401) {
          this.props.navigation.navigate('Login')
        } else {
          this.state.bridgeList = JSON.parse(response._bodyInit).Result.List
          this.addNavis(this.state.bridgeList[0].XZQHBM, this.state.bridgeList[0].XZQHMC)
          this.setState({ bridgeList: this.state.bridgeList, navis: this.state.navis })
          this.setSummarisByArea(this.state.bridgeList[0].XZQHBM, this.state.bridgeList[0].XZQHMC)
        }
      })
      .catch(error => {
        console.error(error);
      });
  }
  setSummarisByArea(XZQHBM, XZQHMC) {
    this.setState({ title: XZQHMC })
    let formData = new FormData();
    formData.append('xzqhbm', XZQHBM)
    fetch(this.state.url + '?xzqhbm=' + XZQHBM, {
      method: "POST",
      headers: {
        "Authorization": "Bearer  " + this.state.token,
        "Content-Type": "application/json"
      },
    })
      .then(response => {
        if (response.status == 401) {
          this.props.navigation.navigate('Login')
        } else {
          console.log('_UpdateBridgeList:' + response._bodyInit)
          this.state.summaryData = JSON.parse(response._bodyInit).Result.List
          this.setOptionByArea()
        }
      })
      .catch(error => {
        console.error(error);
      });
  }
  addNavis(XZQHBM, XZQHMC) {
    let exist = false
    for (const item of this.state.navis) {
      if (item.XZQHBM == XZQHBM) {
        exist = true
        break
      }
    }
    if (!exist) {
      this.state.navis.push({
        XZQHBM: XZQHBM,
        XZQHMC: XZQHMC
      })
      this.setState({ navis: this.state.navis })
    }

  }
  setSummarisByArea1(XZQHBM, XZQHMC) {
    this.setState({ title: XZQHMC })
    this.addNavis(XZQHBM, XZQHMC)
    let formData = new FormData();
    formData.append('xzqhbm', XZQHBM)
    fetch(this.state.url + '?xzqhbm=' + XZQHBM, {
      method: "POST",
      headers: {
        "Authorization": "Bearer  " + this.state.token,
        "Content-Type": "application/json"
      },
    })
      .then(response => {
        if (response.status == 401) {
          this.props.navigation.navigate('Login')
        } else {
          this.state.summaryData = JSON.parse(response._bodyInit).Result.List
          if (true) {
            this.state.bridgeList = []
            this.setState({ bridgeList: this.state.summaryData, navis: this.state.navis })
            this.setOptionByArea()
          }
        }
      })
      .catch(error => {
        console.error(error);
      });
  }
  _renderItem = ({ item }) => (
    <TouchableOpacity key={item.XZQHBM} onPress={() => {
      this.setSummarisByArea1(item.XZQHBM, item.XZQHMC)
    }} >
      <View style={styles.itemContainer}>
        <View style={styles.zt}>
          <Text style={styles.XZQHMC}>
            {item.XZQHMC}
          </Text>
        </View>
        <View style={styles.zt}>
          <Text >
            {item.TCount}
          </Text>
        </View>
        <View style={styles.zt}>
          <Text >
            {item.WWCCount}
          </Text>
        </View>
        <View style={styles.zt}>
          <Text >
            {item.PFZTZ}
          </Text>
        </View>
        <View style={styles.zt}>
          <Text >
            {item.WCZTZ}
          </Text>
        </View>
        <View style={styles.zt}>
          <Text >
            {item.ZYTZ}
          </Text>
        </View>
        <View style={styles.zt}>
          <Text >
            {item.WCZYTZ}
          </Text>
        </View>
        <View style={styles.zt}>
          <Text >
            {item.DFTZ}
          </Text>
        </View>
        <View style={styles.zt}>
          <Text >
            {item.WCDFZC}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
  setOptionByArea() {
    let legends = []
    let series = []
    let tempSummaryData = JSON.stringify(this.state.summaryData)
    tempSummaryData = JSON.parse(tempSummaryData)
    tempSummaryData.shift()
    tempSummaryData.forEach(item => {
      if (item.TCount > 0) {
        legends.push(item.XZQHMC);
        series.push({
          value: item.TCount,
          name: item.XZQHMC,
          TCount: '项目数量：' + item.TCount + '',
          WWCCount: '未完工数量：' + item.WWCCount + '',
          WCCount: '完工数量：' + item.WCCount + '',
          PFZTZ: '批复总投资：' + item.PFZTZ + '',
          WCZTZ: '完成总投资：' + item.WCZTZ + '',
          ZYTZ: '中央投资：' + item.ZYTZ + '',
          WCZYTZ: '完成中央投资：' + item.WCZYTZ + '',
          DFTZ: '地方投资：' + item.DFTZ + '',
          WCDFZC: '完成地方投资：' + item.WCDFZC + ''
        })
      }
    })
    var option = {
      aria: {
        show: false
      },
      title: {
        text: this.state.title + ' - 统计汇总',
        subtext: '按行政区划',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: (params) => {
          var res = '<div style="text-align:center">' + params.name + '</div>' +
            '<div>' + params.data.TCount + '</div>' +
            '<div>' + params.data.WWCCount + '</div>' +
            '<div>' + params.data.WCCount + '</div>' +
            '<div>' + params.data.PFZTZ + '</div>' +
            '<div>' + params.data.WCZTZ + '</div>' +
            '<div>' + params.data.ZYTZ + '</div>' +
            '<div>' + params.data.WCZYTZ + '</div>' +
            '<div>' + params.data.DFTZ + '</div>' +
            '<div>' + params.data.WCDFZC + '</div>'
          return res
        },
      },
      legend: {
        bottom: 10,
        left: 'center',
        data: legends
      },
      series: [
        {
          type: 'pie',
          label: {
            normal: {
              show: true,
              position: 'inside',
              formatter: '{b} {d}%',//模板变量有 {a}、{b}、{c}、{d}，分别表示系列名，数据名，数据值，百分比。{d}数据会根据value值计算百分比

              textStyle: {
                align: 'center',
                baseline: 'middle',
                fontFamily: '微软雅黑',
                fontSize: 15,
                fontWeight: 'bolder'
              }
            },
          },
          data: series
        }
      ]
    };
    this.setState({ option: option })
  }
  getNextSummary(item) {
    let tempIndex = null
    this.state.navis.forEach((subitem, index) => {
      if (subitem.XZQHBM == item.XZQHBM) {
        tempIndex = index
      }
    })
    if (tempIndex + 1 == this.state.navis.length) {
      return
    } else {
      this.state.navis.splice(tempIndex + 1)
    }
    if (tempIndex == 0) {
      this.getSummariesByArea()
    } else {
      this.setSummarisByArea1(item.XZQHBM, item.XZQHMC)
    }
    console.log(item)
  }
  customNavi() {
    let cusNavi = []
    this.state.navis.forEach((item, index) => {
      cusNavi.push(
        <TouchableOpacity key={item.XZQHBM} onPress={() => this.getNextSummary(item)}>
          <View>
            <Text style={styles.cusNaviTxt}>  {item.XZQHMC} {(index + 1) < this.state.navis.length ? '>' : ''}</Text>
          </View>
        </TouchableOpacity>
      )
    })

    return (cusNavi)
  }
  render() {
    return (
      <ScrollView>
        <View style={styles.cusNavi}>
          {this.customNavi()}
        </View>
        <ScrollView
          style={styles.scrollView}
          showsHorizontalScrollIndicator={true}
          horizontal={true}
          showsHorizontalScrollIndicator={true}
          contentContainerStyle={styles.container}>
          <View style={styles.header}>
            <Text style={styles.text2}>行政区划</Text>
            <Text style={styles.text}>项目数量</Text>
            <Text style={styles.text}>未完工数量</Text>
            <Text style={styles.text}>完工数量</Text>
            <Text style={styles.text}>批复总投资</Text>
            <Text style={styles.text}>完成总投资</Text>
            <Text style={styles.text}>中央投资</Text>
            <Text style={styles.text1}>完成中央投资</Text>
            <Text style={styles.text}>地方投资</Text>
            <Text style={styles.text1}>完成地方投资</Text>
          </View>
          <FlatList
            style={styles.flatList}
            data={this.state.bridgeList}
            ItemSeparatorComponent={() => <View style={{
              height: 1,
              backgroundColor: '#D6D6D6'
            }} />}
            extraData={this.state}
            renderItem={this._renderItem}
          />
        </ScrollView>
        <Echarts style={styles.echart} option={this.state.option} height={400} />
      </ScrollView>
    )
  }
}


const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    height: 500,
  },
  cusNavi: {
    display: 'flex',
    flexDirection: 'row',
    marginLeft: 20,
    marginTop: 5,
  },
  cusNaviTxt: {
    color: '#2B82EC',
    fontSize: 18
  },
  header: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 20,
    paddingRight: 20,

  },
  container: {
    display: 'flex',
    flexDirection: 'column'
  },
  echart: {

  },
  columnimg: {
    width: 80,
    height: 80,
  },
  item: {
    flex: 1,
  },
  item1: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingLeft: 10,
  },
  itemText1: {
    color: 'black',
    fontSize: 17,

  },
  itemText3: {
    color: '#7F7F7F',
    fontSize: 16,
    paddingLeft: 10,
  },
  CJSJ: {
    color: '#7F7F7F',
    fontSize: 16,
    marginTop: 5,
    paddingLeft: 10,
  },
  zt: {
    width: 100,
    alignItems: 'center'
  },
  text: {
    color: 'black',
    fontSize: 18,
    width: 100,
  },
  text1: {
    color: 'black',
    fontSize: 18,
    width: 110,
  },
  text2: {
    color: 'black',
    fontSize: 18,
    width: 120,
  },
  XZQHMC: {
    color: 'black',
    fontSize: 16
  },
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 10,
    paddingTop: 10,
  },
  content: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    flexDirection: 'column'
  },
  scrollView1: {
  },
  flatList: {
    marginBottom: 15,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    height: 50,
    width: Dimensions.get('window').width - 50,
    marginLeft: (Dimensions.get('window').width - (Dimensions.get('window').width - 50)) / 2,
    marginTop: 10,
    paddingLeft: 10,
  },
  avatar: {
    width: 20,
    height: 20,
  },
  TextInput: {
    height: 40,
    width: Dimensions.get('window').width - 105,
    marginLeft: 10,
    color: '#B2B2B2'
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
