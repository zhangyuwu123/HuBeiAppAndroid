import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  PixelRatio,
  AsyncStorage,
  TouchableOpacity,
  Image,
} from 'react-native';

import ImagePicker from 'react-native-image-picker';

export default class ImageManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      avatarSource: '',
      videoSource: null,
      token: '',
      uploadStatus: ''
    }
  }
  componentDidMount() {
    if (this.props.FilePath) {
      this.setState({ avatarSource: this.props.uploadStatus == "uploaded" ? 'http://demo.d9tec.com' + this.props.FilePath : this.props.FilePath })
    }
  }
  selectPhotoTapped() {
    const options = {
      title: '选择图片',
      cancelButtonTitle: '取消',
      takePhotoButtonTitle: '拍照',
      chooseFromLibraryButtonTitle: '相册',
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true
      }
    };

    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled photo picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        this.setState({
          avatarSource: response.uri
        })
        console.log('uri:' + response.uri)
        this.props.getLocalPath(response.uri)

        // this.uploadImage({ uri: response.uri })
      }
    });
  }
  uploadImage = async (uri) => {
    try {
      var value = await AsyncStorage.getItem("token");
      if (value) {
        this.setState({ token: value })
      } else {
        this.props.navigation.navigate('Login')
      }
    } catch (error) {
      this._appendMessage('AsyncStorage error: ' + error.message);
    }
    let formData = new FormData();
    // for (var key in params) {
    //   formData.append(key, params[key]);
    // }
    formData.append('qlxxId', 143)
    console.log('params:' + JSON.stringify(this.state))
    let file = { uri: uri.uri, type: 'multipart/form-data', name: 'image.jpg' };
    formData.append("file", file);
    fetch('http://demo.d9tec.com/api/app/UploadQlImage?qlxxId=123', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data;charset=utf-8',
        Authorization: "Bearer  " + this.state.token
      },
      body: formData,
    }).then((response) => {
      console.log('status:' + JSON.stringify(response))
      console.log('result:' + JSON.parse(response._bodyText).Result)
      this.props.getServerPath(JSON.parse(response._bodyText).Result[0])
    })
      .then((responseData) => {
        console.log('uploadImage:', responseData);
        // resolve(responseData);
      })
      .catch((err) => {
        console.log('err', err);
        // reject(err);
      });
  }
  selectVideoTapped() {
    const options = {
      title: 'Video Picker',
      takePhotoButtonTitle: 'Take Video...',
      mediaType: 'video',
      videoQuality: 'medium'
    };

    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled video picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        this.setState({
          videoSource: response.uri
        });
      }
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
          <View style={[styles.avatar, styles.avatarContainer, { marginBottom: 20 }]}>
            {this.state.avatarSource ?
              <Image style={styles.avatar} source={{ uri: this.state.avatarSource }} /> :
              <Image style={styles.avatar} source={require('../pages/images/addimage.jpg')} />

            }
          </View>
        </TouchableOpacity>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarContainer: {
    borderColor: '#9B9B9B',
    borderWidth: 1 / PixelRatio.get(),
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatar: {
    borderRadius: 0,
    width: 80,
    height: 80,
  }
});
