import React, { Component } from 'react'
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  Image,
  TouchableHighlight,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from 'react-native'
import { Modal } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';

let Touchable = TouchableHighlight
if (Platform.OS === 'android') {
  Touchable = TouchableNativeFeedback
}

export default class CjsjDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      id: '',
      clickIndex: 0,
      modalVisible: false,
      cjsj: {},
      images: [],
    }
  }
  componentDidMount() {
    let cjsj = this.props.navigation.state.params
    console.log(cjsj)
    this.setState({ cjsj: cjsj.cjsj })
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
  _closeModal() {
    this.setState({
      modalVisible: false
    });
  }
  viewImg(item) {
    let index = 0
    let temp = this.state.cjsj.Files
    if (temp) {
      temp.forEach((mitem, mindex) => {
        if (mitem.Id == item.Id) {
          index = mindex
        }
      })
      this.setState({ images: this.state.images, modalVisible: true, clickIndex: index })
    }
  }
  renderImages() {
    if (this.state.images.length > 0) {
      this.state.images = []
    }
    let t = []
    if (this.state.cjsj.Files && this.state.cjsj.Files.length <= 0) {
      return
    }
    let temp = this.state.cjsj.Files
    console.log(typeof (temp))
    if (temp) {
      temp.forEach(item => {
        t.push(this.renderItem(item))
        this.state.images.push({
          url: 'http://hb.jgy-tec.com' + item.FilePath,
          props: {
            headers: '桥梁信息'
          },
        })
      })
      return t
    }
  }
  renderItem(item) {
    return (
      <TouchableOpacity key={item.Id} onPress={this.viewImg.bind(this, item)} >
        <Image style={styles.avatar} source={{ uri: 'http://hb.jgy-tec.com' + item.FilePath }} />
      </TouchableOpacity>
    );
  }
  render() {
    return (
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.container}>
        <View style={styles.group}>
          <View style={styles.TextItem} >
            <Text>采集时间：</Text>
            <Text>{this.state.cjsj.CJSJ}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.TextItem1} >
            <Text>完成总投资（万元）：</Text>
            <Text>{this.state.cjsj.WCZTZ}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.TextItem} >
            <Text>完成中央投资（万元）：</Text>
            <Text>{this.state.cjsj.WCZYTZ}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.TextItem1} >
            <Text>完成地方自筹（万元）:</Text>
            <Text>{this.state.cjsj.WCDFZC}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.TextItem} >
            <Text >备注：</Text>
            <Text>{this.state.cjsj.BZ}</Text>
          </View>
          <View style={styles.TextItem1} >
            <Text >是否竣工：</Text>
            <Text >{this.state.cjsj.WCZYTZ}</Text>
          </View>
          <View style={styles.TextItem} >
            <Text >经度：</Text>
            <Text >{this.state.cjsj.JingDu}</Text>
          </View>
          <View style={styles.TextItem1} >
            <Text >纬度：</Text>
            <Text >{this.state.cjsj.WeiDu}</Text>
          </View>
          <View style={styles.TextItem} >
            <Text >照片</Text>
          </View>
          <View style={styles.images}>
            {this.renderImages()}
          </View>
          <Modal onRequestClose={this._closeModal.bind(this)} visible={this.state.modalVisible} transparent={true}>
            <TouchableOpacity style={styles.modalClose} onPress={() => { this._closeModal() }}>
              <Image style={{ width: 25, height: 25 }} source={require('../images/close.png')} />
            </TouchableOpacity>
            <ImageViewer index={this.state.clickIndex} saveToLocalByLongPress={false} imageUrls={this.state.images} />
          </Modal>
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
  images: {
    padding: 30,
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap'
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
  avatar: {
    width: 100,
    height: 100,
    marginRight: 5,
    marginBottom: 5,
  },
  modalClose: {
    position: 'absolute',
    zIndex: 9999,
    left: 20,
    top: 30,
    width: 25,
    height: 25,
  }
})
