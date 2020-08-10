import React, { Component } from "react";
import {StyleSheet,StatusBar,FlatList,AsyncStorage} from 'react-native';
import {  Container,  Content,  Text,  CardItem, SwipeRow, Button,Card,Toast,
 Icon, Thumbnail,Fab} from "native-base";

import axios from 'axios'
import Moment from 'moment';

import { Col, Row, Grid } from 'react-native-easy-grid';
import AppMasters from "../boot/masters.js";

import AppHeader from '../components/appheadersearch.js';
import AppSegment from '../components/appsegment.js';
import Loader from '../components/loader.js';


class DTTR extends Component {
    constructor(props) {
      super(props);
      this.state = {
        loading:false,
        displayData: []
        
      };
      this.offlineData= [];
      this.onlineData= [];
      this.tab ='offline';
      this.component = [];
      this.selectedRow;
      }
    componentDidMount() {
      appMaster = new AppMasters();
      this.getOfflineData();
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
    async getOfflineData() {

      this.setState({loading : true})
      try 
        {
            const value = await AsyncStorage.getItem('engDTTR');
            if (value !== null ) 
            {
                if (value !== '[]' ) 
                {
                    var data =  JSON.parse(value);
                    this.offlineData =  data
                    this.setState({ 
                      displayData: data 
                    })
                }
            }
        } 
        catch (error) 
        {
        }


      this.setState({loading : false})
    }
    onSegmentChange(tab)
    {
      this.tab = tab 
      if (tab==='online')
      {
        if (this.onlineData.length===0)
          this.loadData();
        else  
          this.setState({displayData:this.onlineData}) 
      }
      else
      {
        this.setState({displayData:this.offlineData}) 
      }
      
    }
    onDetailClose(data,option,mode)
    {
      if (option==='Delete')
      {
        this.onModify(data.RowID,'Delete')
      }
      else if (option==='Save')
      {
        var originalData = this.offlineData;
        if (mode==='ADD')
        {
          originalData.push({RowID:data.RowID,ProjectID:data.ProjectID,
            ProjectName: data.ProjectName,CompanyName:data.CompanyName,
            ReportDate:data.ReportDate,Time: data.Time,Location:data.Location,
            HazardList:data.HazardList,HazardListText:data.HazardListText,OtherHazard:data.OtherHazard,
            HealthMeasure:data.HealthMeasure,PPEList:data.PPEList,PPEListText:data.PPEListText,
            EmployeeList:data.EmployeeList,Employees:data.Employees
            
          })

        }
        else
        {
          
          originalData[data.RowID].ProjectID = data.ProjectID
          originalData[data.RowID].ProjectName = data.ProjectName
          originalData[data.RowID].ReportDate = data.ReportDate
          originalData[data.RowID].Time = data.Time
          originalData[data.RowID].Location = data.Location
          originalData[data.RowID].HazardList = data.HazardList
          originalData[data.RowID].HazardListText = data.HazardListText
          originalData[data.RowID].OtherHazard = data.OtherHazard
          originalData[data.RowID].HealthMeasure = data.HealthMeasure
          originalData[data.RowID].PPEList = data.PPEList
          originalData[data.RowID].PPEListText = data.PPEListText
          originalData[data.RowID].EmployeeList = data.EmployeeList
          originalData[data.RowID].Employees = data.Employees
          

        }
        this.offlineData = originalData ;
        this.setState({ 
          displayData: originalData
        })

        AsyncStorage.setItem('engDTTR', JSON.stringify(originalData))

      }
    }
    onAdd()
    {
      this.onShowDetail('ADD',{RowID:this.offlineData.length,ProjectID:0,
        ProjectName: '',ReportDate:'Choose',CompanyName:'CompanyName',
        Time:'Choose',Location:'',HazardList:[],HazardListText:'',
        OtherHazard: '',HealthMeasure:'',
        PPEList:[],PPEListText:'',EmployeeList:[],Employees:''
        });
    }
    onRemoveAll ()
    {
      var data = [];
  
      this.setState({ 
        offlineData : data ,
        displayData: data 
      })

      AsyncStorage.setItem('engDTTR', JSON.stringify(data))
    }
    onSave(id)
    {
      this.onModify(id,'Save')
    }
    onView(id)
    {
      var data=[];
      if (this.tab==='online')
      {
        data = this.onlineData[id];
      }
      else
      {
        data = this.offlineData[id];
      }

      this.onShowDetail('VIEW',data);
    }
    onSynch(details)
    {

      var that = this;

      var hazardList1=[];
      for (var i=0;i<details.HazardList.length;i++)
      {
        hazardList1.push(details.HazardList[i].Key)
      }
      
      var ppeList1=[];
      for (var i=0;i<details.PPEList.length;i++)
      {
        ppeList1.push(details.PPEList[i].Key)
      }
      
      var workerList1=[];
      for (var i=0;i<details.EmployeeList.length;i++)
      {
        workerList1.push(details.EmployeeList[i].Key)
      }
      
      axios({
        method:'POST',
        url:global.URL_TimeEntryCreate,
        auth: {
          username: global.Username,
          password: global.Password
        },
        data:{"hazardList1":hazardList1,"ppeList1":ppeList1,"workerList1":workerList1,"SafetyID":0,
              "projectid":details.ProjectID,"CompanyName":details.CompanyName,"ProjectTitle":details.ProjectName,
              "RepDate":details.ReportDate,"RepTime":details.Time,"LocationOfWork":details.Location,
              "OtherHazard":details.OtherHazard,"ASHMeasures":details.HealthMeasure,
              "CreatedDate":"0001-01-01T00:00:00","UpdatedDate":"0001-01-01T00:00:00","SubmittedBy":global.UserID,
              "UpdatedBy":null,"Status":null,
              "userid":global.UserID,"HazardList":null,"HazardListInt":null,"PPEList":null,"PPEListInt":null,"WorkerList":null,
              "WorkerListInt":null,"DTTRType":null,"supperviosrName":null,"EmpFeedback":"ok","TranslatorList":null,
              "TranslatorListInt":null,"translatorList1":[1]}
      })
      .then(function (response) {
        that.setState({ loading: false });
        console.log(response)
        if (response.data)
          {
            var data = response.data;
            if (data.Success===true)
            {
              that.onNotification(true,'Details saved');
              that.loadData();
            }
            else
            {
              that.onNotification(false,'Save failed');
            }
          }
          else
            that.onNotification(false,'No data received');
      })
      .catch(function (error) {
        that.setState({ loading: false });
          console.log(error);
      });
    }
    onShowDetail(mode,data)
    {
      this.props.navigation.navigate("DTTRDetail", 
      {Mode:mode,ParentData:data,DataMode:this.tab,OnClose:(data,option,editmode)=>this.onDetailClose(data,option,editmode)})
    }
    onDelete(id)
    {
      this.onModify(id,'Delete')
    }
    onModify(id,Option)
    {
      var originalData = this.offlineData;

      var data = [];
      var cnt=1;
      var details;
      for (let i=0;i<originalData.length;i++)
      {
        details = originalData[i];
        if (details.RowID!==id)
        {
          details.RowID = cnt;
          data.push(details)
          cnt++
        }
        else
        {
          if (Option==='Save')
          {
            this.onSynch(details)
          }
        }
      }      
      this.offlineData = data ;
      this.setState({ 
        
        displayData: data 
      })

      AsyncStorage.setItem('engDTTR', JSON.stringify(data))
    }

    onRefresh()
    {
      //this.getProjects();
    }
    onDrawerOpen()
    {
        this.props.navigation.openDrawer();
    }
    onSearchChangeText(text)
    {
      var currentData = [];
      if (this.tab==='online')
      {
        currentData=this.onlineData;
      }
      else
      {
        currentData=this.offlineData;
      }
      const newData = currentData.filter(
        function(item)
        {
          const itemData = item.ProjectName.toUpperCase() + item.Employees.toUpperCase() 
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
          url:global.URL_DTTR,
          auth: {
              username: global.Username,
              password: global.Password
          }
      })
      .then(function (response) {
          var data = [];
          //console.log(response.data)
          {response.data &&
              response.data.map((d,i) => (
                  data.push({RowID:i,ProjectID:0,
                    ProjectName: d.ProjectTitle,ReportDate:d.RepDate.split(' ')[0],CompanyName:d.CompanyName,
                    Time:d.RepTime,Location:d.LocationOfWork,HazardList:[],HazardListText:d.HazardList,
                    OtherHazard: d.OtherHazard,HealthMeasure:d.ASHMeasures,
                    PPEList:[],PPEListText:d.PPEList,EmployeeList:[],Employees:d.WorkerList
                  })
                
                  

            ))}
            that.onlineData = data ;
            that.setState({ 
              loading : false,
              
              displayData: data
                  
            })
      })
      .catch(function (error) {
          console.log(error);
          that.setState({ loading : false})
      });
    }
    
    renderSwipeCard (entryData) 
    {
      return (
        <SwipeRow
          style={{paddingLeft:-10,paddingTop:-10,paddingRight:-15,paddingBottom:-10}}
          ref={(c) => { this.component[entryData.RowID] = c }}
          leftOpenValue={this.tab==='online'?0:55}
          rightOpenValue={this.tab==='online'?0:-55}
          onRowOpen={() => {
            if (this.selectedRow && this.selectedRow !== this.component[entryData.RowID]) { this.selectedRow._root.closeRow(); }
              this.selectedRow = this.component[entryData.RowID]
          }}
          left={
            <Button success onPress={() => this.onSave(entryData.RowID)}>
              <Icon active name="content-save" />
            </Button>
          }
          body={
            <CardItem style={styles.list} button onPress={() => this.onView(entryData.RowID)}>
              <Grid style={styles.centerGrid}>
                <Row style={styles.gridRow}>
                  <Col><Text style={{fontSize: 14}}><Icon name="file-tree" style={{fontSize: 18, color: "#7b1fa2"}}/> {entryData.ProjectName}</Text></Col>
                </Row>
                <Row style={styles.gridRow}>
                  <Col><Text style={{fontSize: 12}}><Icon name="factory" style={{fontSize: 18, color: "#7b1fa2"}}/> {entryData.CompanyName}</Text></Col>
                </Row>
                <Row style={styles.gridRow}>
                  <Col><Text style={{fontSize: 12}}><Icon name="calendar" style={{color:"#6666ff",fontSize:18}}/> {entryData.ReportDate}</Text></Col>
                  <Col><Text style={{fontSize: 12}}><Icon name="timer" style={{color:"#cc6600",fontSize:18}}/> {entryData.Time}</Text></Col>
                </Row>
                
                <Row style={styles.gridRow}>
                  <Col><Text style={{fontSize: 12}}><Icon name="worker" style={{fontSize: 18, color: "#7b1fa2"}}/> {entryData.Employees}</Text></Col>
                </Row>
              </Grid>
            </CardItem>
          }
          right={
            <Button danger onPress={() => this.onDelete(entryData.RowID)}>
              <Icon active name="delete" />
            </Button>
          }
        />  
      );
    }

  render() {
    return (
      <Container>
        <StatusBar />
        <AppHeader Name='Daily Toolbox Talk Record' SearchText='search by project or employee' 
            onSearchChangeText ={(text)=>this.onSearchChangeText(text)} onDrawerOpen={()=>this.onDrawerOpen()}/>
        <AppSegment onSegmentChange={(tab)=>this.onSegmentChange(tab)}/> 
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
                
              />
            </Content>
            :
            <Content padder>
              <Text>No Data available</Text>
            </Content>
        }
        {
          this.tab==='offline'?
            <Fab 
              
                style={{ backgroundColor: '#ff5c33' ,height:40,width:40 }}
                position="bottomRight"
                onPress={() => this.onAdd()}>
                <Icon name="plus" />
            </Fab>
          :
            <Text />
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

export default DTTR;
