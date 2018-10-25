import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';
import { StackNavigator } from 'react-navigation';
import Home from './home/home'
import Login from './SignInAndSignup/SignInPage'
import Record from './Record/record'
import Bridge from './Record/bridgeManage'
import BridgeList from './Record/bridgeList'
import UploadManage from './home/uploadManage'
import SearchManage from './search/searchList'
import Statistics from './search/statistics'
import ResultList from './search/resultList'
import WqResultList from './search/wqResultList'
import SmaqResultList from './search/smaqResultList'
import ResultDetail from './search/resultDetail'
import MySettings from './mySettings/index'
import MessageManage from './mySettings/message'
import MySearch from './mySettings/mySearch'
import CjsjDetail from './search/cjsjDetail'

import DzxgcBridgeList from './dzxgc/bridgeList'
import DzxgcbridgeManage from './dzxgc/bridgeManage'
import DzxgcRecord from './dzxgc/record'

import ShxfgcBridgeList from './shxfgc/bridgeList'
import ShxfgcBridgeManage from './shxfgc/bridgeManage'
import ShxfgcRecord from './shxfgc/record'
import ShxfResultDetail from './search/shxfResultDetail'


import SmaqgcBridgeList from './smaqgc/bridgeList'
import SmaqgcBridgeManage from './smaqgc/bridgeManage'
import SmaqgcRecord from './smaqgc/record'

import ZhfzgcBridgeList from './zhfzgc/bridgeList'
import ZhfzgcBridgeManage from './zhfzgc/bridgeManage'
import ZhfzgcRecord from './zhfzgc/record'

const HomeScreen = ({ navigation }) => (
  <Home navigation={navigation} />
);

const DzxgcListScreen = ({ navigation }) => (
  <DzxgcBridgeList navigation={navigation} />
);
const DzxgcManageScreen = ({ navigation }) => (
  <DzxgcbridgeManage navigation={navigation} />
);
const DzxgcRecordScreen = ({ navigation }) => (
  <DzxgcRecord navigation={navigation} />
);

const ShxfgcListScreen = ({ navigation }) => (
  <ShxfgcBridgeList navigation={navigation} />
);
const ShxfgcManageScreen = ({ navigation }) => (
  <ShxfgcBridgeManage navigation={navigation} />
);
const ShxfgcRecordScreen = ({ navigation }) => (
  <ShxfgcRecord navigation={navigation} />
);

const ZhfzgcListScreen = ({ navigation }) => (
  <ZhfzgcBridgeList navigation={navigation} />
);
const ZhfzgcManageScreen = ({ navigation }) => (
  <ZhfzgcBridgeManage navigation={navigation} />
);
const ZhfzgcRecordScreen = ({ navigation }) => (
  <ZhfzgcRecord navigation={navigation} />
);


const SmaqgcListScreen = ({ navigation }) => (
  <SmaqgcBridgeList navigation={navigation} />
);
const SmaqgcManageScreen = ({ navigation }) => (
  <SmaqgcBridgeManage navigation={navigation} />
);
const SmaqgcRecordScreen = ({ navigation }) => (
  <SmaqgcRecord navigation={navigation} />
);


const BridgeListScreen = ({ navigation }) => (
  <BridgeList navigation={navigation} />
);
const WqResultListScreen = ({ navigation }) => (
  <WqResultList navigation={navigation} />
);
const SmaqResultListScreen = ({ navigation }) => (
  <SmaqResultList navigation={navigation} />
);

const CjsjDetailScreen = ({ navigation }) => (
  <CjsjDetail navigation={navigation} />
);
const UploadManageScreen = ({ navigation }) => (
  <UploadManage navigation={navigation} />
);
const SearchManageScreen = ({ navigation }) => (
  <SearchManage navigation={navigation} />
);
const LoginScreen = ({ navigation }) => (
  <Login navigation={navigation} />
);
const RecordScreen = ({ navigation }) => (
  <Record navigation={navigation} />
);
const BridgeScreen = ({ navigation }) => (
  <Bridge navigation={navigation} />
);
const StatisticsScreen = ({ navigation }) => (
  <Statistics navigation={navigation} />
);
const ResultScreen = ({ navigation }) => (
  <ResultList navigation={navigation} />
);
const MySettingsScreen = ({ navigation }) => (
  <MySettings navigation={navigation} />
);
const MessageScreen = ({ navigation }) => (
  <MessageManage navigation={navigation} />
);
const MySearchScreen = ({ navigation }) => (
  <MySearch navigation={navigation} />
);
const ResultDetailScreen = ({ navigation }) => (
  <ResultDetail navigation={navigation} />
);
const ShxfResultDetailScreen = ({ navigation }) => (
  <ShxfResultDetail navigation={navigation} />
);
const StactNavigatorDemo = StackNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: {
      header: null
    },
  },
  Login: {
    screen: LoginScreen,
    navigationOptions: {
      header: null
    },
  },
  Record: {
    screen: RecordScreen,
    navigationOptions: {
      headerTitle: '采集信息',
    },
  },
  Bridge: {
    screen: BridgeScreen,
    navigationOptions: {
      headerTitle: '录入信息',
    },
  },
  BridgeList: {
    screen: BridgeListScreen,
    navigationOptions: {
      headerTitle: '桥梁列表',
    },
  },
  WqResultList: {
    screen: WqResultListScreen,
    navigationOptions: {
      headerTitle: '查询项目',
    },
  },
  SmaqResultList: {
    screen: SmaqResultListScreen,
    navigationOptions: {
      headerTitle: '查询项目',
    },
  },

  UploadManage: {
    screen: UploadManageScreen,
    navigationOptions: {
      headerTitle: '上传管理',
    },
  },
  SearchManage: {
    screen: SearchManageScreen,
    navigationOptions: {
      headerTitle: '查询信息',
    },
  },
  StatisticsManage: {
    screen: StatisticsScreen,
    navigationOptions: {
      headerTitle: '统计分析',
    },
  },
  ResultManage: {
    screen: ResultScreen,
    navigationOptions: {
      headerTitle: '查询项目',
    },
  },
  MySettingsManage: {
    screen: MySettingsScreen,
    navigationOptions: {
      headerTitle: '个人信息',
      headerTintColor: '#fff',
      headerTitleStyle: { color: '#fff' },
      headerStyle: { backgroundColor: '#2B82EC', elevation: 0 },
    },
  },
  MessageManage: {
    screen: MessageScreen,
    navigationOptions: {
      headerTitle: '推送消息',
    },
  },
  MySearchManage: {
    screen: MySearchScreen,
    navigationOptions: {
      headerTitle: '查询项目',
    },
  },
  ResultDetailManage: {
    screen: ResultDetailScreen,
    navigationOptions: {
      headerTitle: '查询结果',
    },
  },
  CjsjDetail: {
    screen: CjsjDetailScreen,
    navigationOptions: {
      headerTitle: '查询结果',
    },
  },
  DzxgcList: {
    screen: DzxgcListScreen,
    navigationOptions: {
      headerTitle: '路段列表',
    },
  },
  DzxgcManage: {
    screen: DzxgcManageScreen,
    navigationOptions: {
      headerTitle: '进度信息维护',
    },
  },
  ShxfgcList: {
    screen: ShxfgcListScreen,
    navigationOptions: {
      headerTitle: '路段列表',
    },
  },
  ShxfgcManage: {
    screen: ShxfgcManageScreen,
    navigationOptions: {
      headerTitle: '进度信息维护',
    },
  },
  ZhfzgcList: {
    screen: ZhfzgcListScreen,
    navigationOptions: {
      headerTitle: '路段列表',
    },
  },
  ZhfzgcManage: {
    screen: ZhfzgcManageScreen,
    navigationOptions: {
      headerTitle: '进度信息维护',
    },
  },
  SmaqgcList: {
    screen: SmaqgcListScreen,
    navigationOptions: {
      headerTitle: '路段列表',
    },
  },
  SmaqgcManage: {
    screen: SmaqgcManageScreen,
    navigationOptions: {
      headerTitle: '进度信息维护',
    },
  },
  ShxfResultDetail: {
    screen: ShxfResultDetailScreen,
    navigationOptions: {
      headerTitle: '详细信息',
    },
  },
}, { mode: 'modal' });

export default StactNavigatorDemo;