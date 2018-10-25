/**
 * Created by wangdi on 4/11/16.
 */
import React, { Component } from 'react';
import { Text, Button, View, StyleSheet, TouchableOpacity, Switch, Dimensions, Platform, AsyncStorage, Image, ImageBackground, TextInput, CheckBox, ToastAndroid } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import px2dp from '../util/px2dp';
import utf8 from 'utf8'
import binaryToBase64 from 'binaryToBase64'

export default class SignInPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            pwd: '',
            visible: false,
            timeid: '',
            remainUserInfo: true,
        }
    }

    componentDidMount() {
        this._retrieveData()
    }

    componentWillUnmount() {
        // backHandler.removeEventListener('hardwareBackPress', this.handleBack);
    }

    _handleBack() {
        this.state.timeid = setTimeout(() => {
            this.setState({ visible: true })
        }, 1000);
        this._Login()
    }
    _Login = async () => {
        if (this.state.remainUserInfo) {
            await this._storeData()
        } else {
            this._deleteData()
        }
        fetch("http://demo.d9tec.com/token", {
            method: "POST",
            headers: {
                Authorization: "Basic  " + this._getBase64String(),
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: "grant_type=client_credentials"
        })
            .then(response => { console.log(response); return response.json() })
            .then(responseJson => {
                clearTimeout(this.state.timeid)
                this.setState({ visible: false })
                if (responseJson.access_token) {
                    AsyncStorage.setItem('token', responseJson.access_token);
                    this.props.navigation.navigate('Home', { token: responseJson.access_token })
                } else {
                    ToastAndroid.show(responseJson.error, ToastAndroid.CENTER, ToastAndroid.CENTER)
                }

            })
            .catch(error => {
                console.error(error);
            });
    }
    _getBase64String() {
        var text = this.state.username + ':' + this.state.pwd;
        var bytes = utf8.encode(text);
        var encoded = binaryToBase64(bytes);
        return encoded
    }
    _handlePassword(val) {
        this.setState({ pwd: val })
        console.log(val)
    }
    _handleUserName(val) {
        this.setState({ username: val })
    }
    _signupCallback() {
        this.props.navigator.push({
            component: SignUpPage
        });
    }
    remainPwd() {
        this.setState({ remainUserInfo: !this.state.remainUserInfo })
    }
    _storeData = async () => {
        try {
            await AsyncStorage.setItem('UserInfo', JSON.stringify({ username: this.state.username, pwd: this.state.pwd }));
        } catch (error) {
            // Error saving data
        }
    }
    _retrieveData = async () => {
        try {
            const value = await AsyncStorage.getItem('UserInfo');
            if (value !== null) {
                const userinfo = JSON.parse(value)
                this.setState({ username: userinfo.username, pwd: userinfo.pwd, remainUserInfo: true })
                console.log(value);
            } else {
                this.setState({ remainUserInfo: false })
            }
        } catch (error) {
            // Error retrieving data
        }
    }
    _deleteData = async () => {
        try {
            await AsyncStorage.removeItem('UserInfo')
        } catch (error) {
            // Error retrieving data
        }
    }
    render() {
        return (
            <ImageBackground source={require('../images/bg.png')} style={styles.container}>
                <View style={styles.editGroup}>
                    <View style={styles.header}>
                        <Text style={{ color: 'white', fontSize: 20 }}>湖北省养护工程进度管理</Text>
                        <View style={styles.baseline} />
                    </View>

                    <View style={styles.editView1}>
                        <TextInput
                            style={styles.edit}
                            inlineImageLeft='iconuser.png'
                            underlineColorAndroid="transparent"
                            placeholder="用户名"
                            onChangeText={this._handleUserName.bind(this)}
                            value={this.state.username}
                            placeholderTextColor="#c4c4c4" />
                    </View>

                    <View style={styles.editView2}>
                        <TextInput
                            style={styles.edit}
                            underlineColorAndroid="transparent"
                            placeholder="密码"
                            value={this.state.pwd}
                            secureTextEntry={true}
                            onChangeText={this._handlePassword.bind(this)}
                            placeholderTextColor="#c4c4c4" />
                    </View>
                    <View style={styles.editView3} >
                        <Switch onTintColor={this.state.remainUserInfo ? '#b3d4f5' : '#acacac'} tintColor='#acacac'
                            thumbTintColor={this.state.remainUserInfo ? '#3281f1' : '#ebebeb'} value={this.state.remainUserInfo} onValueChange={(value) => {
                                console.log(value)
                                this.setState({
                                    remainUserInfo: value
                                })
                            }} />
                        <Text style={styles.remainPwd}>记住密码</Text>
                    </View>
                    <View style={styles.login}>
                        <TouchableOpacity style={styles.loginBtn} onPress={this._handleBack.bind(this)}>
                            <Text style={{ color: 'white', fontSize: 18 }}>登录</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }}>
                    <Spinner style={styles.spinner} visible={this.state.visible} />
                </View>
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: null,
        height: null
    },
    actionBar: {
        marginTop: (Platform.OS === 'ios') ? px2dp(10) : 0,
    },
    logo: {
        alignItems: 'center',
        marginTop: px2dp(40)
    },
    edit: {
        height: px2dp(40),
        fontSize: px2dp(13),
        paddingLeft: px2dp(15),
        paddingRight: px2dp(15),
        color: 'white'
    },
    header: {
        height: px2dp(60),
        alignItems: 'center'
    },
    editView1: {
        height: px2dp(45),
        width: Dimensions.get('window').width - 100,
        backgroundColor: 'rgba(102,115,98,0.6)',
        justifyContent: 'center',
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,

    },
    editView2: {
        height: px2dp(45),
        width: Dimensions.get('window').width - 100,
        backgroundColor: 'rgba(102,115,98,0.6)',
        justifyContent: 'center',
        marginTop: 10,
        borderBottomLeftRadius: 3,
        borderBottomRightRadius: 3
    },
    editView3: {
        height: px2dp(25),
        width: Dimensions.get('window').width - 100,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    remainPwd: {
        color: 'white',
        fontSize: 14
    },
    editGroup: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 40
    },
    textButtonLine: {
        marginTop: px2dp(12),
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    thirdPartyView: {
        flex: 1,
        marginTop: px2dp(10),
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-around'
    },
    login: {
        marginTop: 5,
        height: px2dp(60),
        width: Dimensions.get('window').width - 100,
    },
    loginBtn: {
        height: 45, marginTop: 5, backgroundColor: '#2B82EC',
        justifyContent: 'center',
        alignItems: 'center',

    },
    baseline: {
        height: 1,
        backgroundColor: 'white',
        marginTop: 10,
        width: Dimensions.get('window').width - 100,
    }
});