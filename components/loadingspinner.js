import React, { Component } from 'react';
import { ImageBackground } from "react-native";

import { Container, Content, Spinner } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';

import styles from "../theme/engstyle/styles";

const launchscreenBg = require("../../assets/images/loadingspinner.png");

export default class LoadingSpinner extends Component {
  render() {
    return (
      
        <ImageBackground source={launchscreenBg} style={styles.bgImageContainer}>
        <Grid style={{marginTop:50}}>
              <Row>
                <Col><Spinner color='red' /></Col>
                <Col><Spinner color='green' /></Col>
                <Col><Spinner color='blue' /></Col>
              </Row>
         </Grid>
        </ImageBackground>
      
    );
  }
}