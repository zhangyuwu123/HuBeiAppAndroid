import { StyleSheet, Platform, Dimensions } from 'react-native'

export default StyleSheet.create({
  map: {
    flex: 1,
    ...Platform.select({
      ios: {
        marginBottom: 0,
      },
    }),
  },
  absoluteFill: {
    display: 'flex'
  },
  controls: {
    height: 180,
    flexDirection: 'row',
    justifyContent: 'space-between',
    elevation: 4,
    paddingLeft: 20,
    paddingRight: 20,
    ...Platform.select({
      android: {
        backgroundColor: 'transparent',
      },
      ios: {
        backgroundColor: '#fff',
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        borderTopColor: '#e0e0e0',
        borderTopWidth: StyleSheet.hairlineWidth,
        zIndex: 1,
      },
    }),
  },
  control: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  switch: {
    marginTop: 5,
  },
  btnRecord: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  btnSearch: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  btnAvatar: {
    width: 20,
    height: 20,
  },
  record: {
    position: 'absolute',
    backgroundColor: '#2B82EC',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    left: 60,
    width: 85,
    height: 40,
    bottom: 60,
    zIndex: 99,
    borderRadius: 20,
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
  search: {
    position: 'absolute',
    backgroundColor: '#2B82EC',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    right: 60,
    width: 85,
    height: 40,
    bottom: 60,
    zIndex: 99,
    borderRadius: 20,
  },
  myItem: {
    position: 'absolute',
    display: 'flex',
    backgroundColor: '#F9F9F9',
    width: Dimensions.get('window').width - 50, //窗口宽度
    justifyContent: 'center',
    alignItems: 'center',
    height: 45,
    left: (Dimensions.get('window').width - (Dimensions.get('window').width - 50)) / 2,
    top: 50,
  },
  tpAvatar: {
    position: 'absolute',
    left: 5,
    width: 40,
    height: 35,
  },
  avatar: {
    position: 'absolute',
    left: 5,
    width: 30,
    height: 30,
  },
  tpText: {
    left: 50,
    position: 'absolute',
    width: Dimensions.get('window').width - 100,
    height: 40,
    justifyContent: 'center',
  },
  makerContainer: {
    position: 'absolute',
    left: 0,
    padding: 10,
    bottom: 0,
    width: Dimensions.get('window').width,
    height: 100,
    backgroundColor: '#F4F9FA',
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 999,
    display: 'none'
  },
  makerImg: {
    borderRadius: 3,
    marginLeft: 8,
    height: 80,
    width: 80,
  },
  detail: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 8,
  },
  makerRouter: {
    color: 'black',
    fontSize: 18
  },
  makerTitle: {
    fontSize: 17
  },
  makerTime: {
    fontSize: 16
  },
  makerBtn: {
    display: 'flex',
    justifyContent: 'center',
  },
  customMarker: {
    width: 40,
    height: 40,
  },
  spinner: {
    fontSize: 18,
    position: 'absolute',
    left: -Dimensions.get('window').width / 2,
    top: -Dimensions.get('window').height / 2,
    transform: [
      { 'translateX': Dimensions.get('window').width / 2 },
      { 'translateY': Dimensions.get('window').height / 2 }
    ]
  },
  location: {
    position: "absolute",
    top: 10,
    right: 5
  },
  locationView: {
    width: 50,
    height: 50,
  },
  locationIcon: {
    width: 40,
    height: 40,
  }
})
