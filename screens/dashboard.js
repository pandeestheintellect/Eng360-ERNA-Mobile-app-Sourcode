import React, { Component } from "react";
import { StatusBar } from "react-native";
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

import DashboardProject from "./dashproject.js"
import DashboardQuality from "./dashquality.js"

class Dashboard extends Component {
    constructor(props) {
        super(props);
        
      }
  render() {
    return (
      <Container>
        <StatusBar />
        <Header hasTabs>
          <Left>
            <Button
              transparent
              onPress={() => this.props.navigation.openDrawer()}
            >
              <Icon name="menu" />
            </Button>
          </Left>
          <Body>
            <Title>Dashboard</Title>
          </Body>
          <Right/>
          
        </Header>
        <Tabs renderTabBar={()=> <ScrollableTab />}>
          <Tab heading="Project">
            <DashboardProject />
          </Tab>
          <Tab heading="Quality">
            <DashboardQuality />
          </Tab>
        </Tabs>
      </Container>
    );
  }
}

export default Dashboard;
