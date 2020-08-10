import React, { Component } from "react";
import { ImageBackground, StatusBar } from "react-native";
import { Container, Content, Form, Item,Label,Button,Toast,Text,View,Input } from "native-base";

import styles from "../theme/engstyle/styles";
import axios from 'axios'
import Loader from '../components/loader.js';

const launchscreenBg = require("../../assets/images/launchscreen-bg.png");
const launchscreenLogo = require("../../assets/images/logo-dark.png");

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading:false,
      showToast: false,
      username: 'admin',
      password: 'abcd1234'
    };
  }
  onLoginNotification(status,message)
  {
    Toast.show({
      text: message,
      buttonText: "Okay",
      type: "danger",
      position: "top"
    });
  }
  async userLogin () {
   
    this.setState({ loading: true });
    
    var that = this;
    await axios({
        method:'GET',
        url:'http://eng360demo.smartdigitalprojects.com/api/v1/mobilelogin/englogin?username='+this.state.username+'&password='+this.state.password
    })
    .then(function (response) {
      that.setState({ loading: false });
        if (response.data)
        {
          var data = response.data;
          if (data.Success===true)
          {
            global.UserLoggedIn = true;
            global.UserID = data.User.userId;
            global.Username = data.User.userName;
            global.UserFullName = data.User.userFullName;
            global.Password = data.Credentials;

            that.props.navigation.navigate("Welcome");
            //that.props.onLoginNotification(true,'Login success');
          }
          else
          {
            that.onLoginNotification(false,'Login failed');
          }
        }
        else
          that.onLoginNotification(false,'No data received');
        
    })
    .catch(function (error) {
      console.log(error);
      that.setState({ loading: false });
      that.onLoginNotification(false,error);
        
    });
       
  }
  
  render() {
    return (
      <Container>
        <StatusBar barStyle="light-content" />
        <ImageBackground source={launchscreenBg} style={styles.bgImageContainer}>
          <View style={styles.loginLogoContainer}>
            <ImageBackground source={launchscreenLogo} style={styles.logo} />
          </View>
          <Content style={styles.loginFormContainer}>
                   
            <Form style={styles.loginForm}>
              <Item stackedLabel>
                <Label style={styles.whiteText}>Username</Label>
                <Input
                    style={styles.whiteText}
                    returnKeyType="next"
                    clearButtonMode="always"
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={this.state.username} 
                    onChangeText={(text) => this.setState({ username: text })} />
              </Item>
              <Item stackedLabel>
                <Label style={styles.whiteText}>Password</Label>
                <Input
                    secureTextEntry={true}
                    style={styles.whiteText}
                    clearButtonMode="always"
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={this.state.password} 
                    onChangeText={(text) => this.setState({ password: text })} />
              </Item>
              <Button rounded success style={styles.loginBtn} onPress={() => this.userLogin()}>
                  <Text>Login</Text>
              </Button>
            </Form>
          </Content>
        </ImageBackground>
        <Loader
          loading={this.state.loading} />
      </Container>
    );
  }
}

export default Login;
