import React, { Component } from "react";
import { StatusBar,FlatList } from "react-native";
import {
  Container,
  Header,
  Left,
  Button,
  Text,
  Content,
  Body,
  Title,
  Right,
  Tabs,Tab,ScrollableTab,
  Icon
} from "native-base";


class DashboardQuality extends Component {
    constructor(props) {
        super(props);
        
      }
      componentDidMount() {
        
      }
  render() {
    return (
      <Container>
        <Content padder>
        <Text>Dashboard - Quality</Text>
        </Content>
        
      </Container>
    );
  }
}

export default DashboardQuality;
