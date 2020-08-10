import React, { Component } from "react";
import {StyleSheet,StatusBar,FlatList,AsyncStorage} from 'react-native';
import {  Container,  Content,  Text,  CardItem, SwipeRow, Button,Card,Toast,
 Icon, Thumbnail,Fab} from "native-base";

import axios from 'axios'
import Moment from 'moment';

import { Col, Row, Grid } from 'react-native-easy-grid';
import AppMasters from "../boot/masters.js";

import AppHeader from '../components/appheadersearch.js';
import Loader from '../components/loader.js';


class DefectTracking extends Component {
    constructor(props) {
      super(props);
      this.state = {
          loading:false,
          onlineData: [],
          displayData: []
        };
      }
    componentDidMount() {
      appMaster = new AppMasters();
      this.loadData();
    }
    onNotification(status,message)
    {
      Toast.show({
        text: message,
        buttonText: "Okay",
        type: "danger",
        position: "top"
      });
    }
    
    onDetailClose(data,option,mode)
    {
      
    }
    
    onView(id)
    {
      this.onShowDetail('VIEW',id);
    }

    onShowDetail(mode,data)
    {
      this.props.navigation.navigate("DefectTrackingDetail", 
      {Mode:mode,ParentData:data,DataMode:this.state.tab,OnClose:(data,option,editmode)=>this.onDetailClose(data,option,editmode)})
    }
    

    onRefresh()
    {
      this.loadData();
    }
    onDrawerOpen()
    {
        this.props.navigation.openDrawer();
    }
    onSearchChangeText(text)
    {
      var currentData = this.state.onlineData;
      
      const newData = currentData.filter(
        function(item)
        {
          const itemData = item.ProjectName.toUpperCase() + item.DefectTitle.toUpperCase() 
          const textData = text.toUpperCase()
          return itemData.indexOf(textData) > -1
        }
      )
      this.setState({
          displayData: newData
      })
    }
    
    loadData ()
    {
      var that = this;
      that.setState({ loading : true})
      
      axios({
          method:'GET',
          url:global.URL_DefectTracking,
          auth: {
              username: global.Username,
              password: global.Password
          }
      })
      .then(function (response) {
          var data = [];
          console.log(response)
          {response.data &&
              response.data.map((d,i) => (
                  data.push({RowID:i,DefectID:d.DefectDetailID,
                      ProjectName: d.ProjectName,DefectTrackNum:d.DefectTrackNum,
                      DefectTitle:d.DefectTitle,DefectImpactDetails:d.DefectImpactDetails,
                      DefectStatus: d.DefectStatus,InspectionNO:d.InspectionNO
                  })
                
            ))}
            
            that.setState({ 
              loading : false,
              onlineData : data ,
              displayData: data
                  
            })
      })
      .catch(function (error) {
          console.log(error);
          that.setState({ loading : false})
      });
    }

    getStatusImage(status)
    {
      if (status=='Pending')
        return 'calendar-blank'
      else if (status=='Completed')
        return 'calendar-check'
      else
        return 'calendar-clock'        
      
    }
    
    renderSwipeCard (entryData) 
    {
      return (
              <CardItem style={styles.list} button onPress={() => this.onView(entryData.DefectID)}>
              <Grid style={styles.centerGrid}>
                <Row style={styles.gridRow}>
                  <Col><Text style={{fontSize: 14}}><Icon name="file-tree" style={{fontSize: 18, color: "#7b1fa2"}}/> {entryData.ProjectName}</Text></Col>
                </Row>
                <Row style={styles.gridRow}>
                <Col style={ { width: 50 } }><Text style={{fontSize: 12,alignSelf:'center', textAlignVertical: 'center',marginTop:5}}><Icon name={entryData.StatusImage}  style={{color:"#ff7043",fontSize:30}}/></Text></Col>
                      <Col>
                        <Row>
                        <Col><Text style={{fontSize: 12}}><Icon name="alert-box" style={{color:"#ff7043",fontSize:18}}/> {entryData.DefectTitle}</Text></Col>
                        </Row>
                        <Row>
                        <Col><Text style={{fontSize: 12}}><Icon name="calendar" style={{color:"#ff7043",fontSize:18}}/> {entryData.InspectionNO}</Text></Col>
                        </Row>
                        
                      </Col>
                    </Row>
                    <Row style={styles.gridRow}>
                        <Col><Text style={{fontSize: 12}}><Icon name="bug" style={{color:"#ff7043",fontSize:18}}/> {entryData.DefectTrackNum}</Text></Col>
                        <Col><Text style={{fontSize: 12}}><Icon name="book-multiple" style={{color:"#ff7043",fontSize:18}}/> {entryData.InspectionNO}</Text></Col>
                    </Row>
                    <Row style={styles.gridRow}>
                      <Col><Text style={{fontSize: 14}}><Icon name="details" style={{fontSize: 18, color: "#7b1fa2"}}/> {entryData.DefectImpactDetails}</Text></Col>
                    </Row>
              </Grid>
            </CardItem>
          
      );
    }

  render() {
    return (
      <Container>
        <StatusBar />
        <AppHeader Name='Defect Tracking' SearchText='search in defect' 
            onSearchChangeText ={(text)=>this.onSearchChangeText(text)} onDrawerOpen={()=>this.onDrawerOpen()}/>
        
        <Loader loading={this.state.loading} />
        {
          this.state.displayData.length>0?
            <Content>
              <FlatList
                data={this.state.displayData}
                extraData={this.state}
                showsVerticalScrollIndicator={false}
                renderItem={({item}) => this.renderSwipeCard(item)}
                keyExtractor={item => item.RowID+''}
                refreshing={this.state.loading}
                onRefresh={()=>this.onRefresh()}
              />
            </Content>
            :
            <Content padder>
              <Text>No Data available</Text>
            </Content>
        }
        
      </Container>
    );
  }
}

const styles = StyleSheet.create({
    list: {
      marginLeft: 6,
      marginRight: 6,
      paddingLeft:-10,paddingTop:-10,paddingRight:-15,paddingBottom:-10,
      borderBottomColor:"#D9D5DC",
      borderBottomWidth:1
    },
    centerGrid:
    {
      padding:2
    },
    gridRow:
    {
      marginBottom:4,
    }

  });

export default DefectTracking;
