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


class Safety extends Component {
    constructor(props) {
      super(props);
      this.state = {
          loading:false,
          offlineData: [],
          onlineData: [],
          displayData: [],
          tab:'offline'
        };
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
            const value = await AsyncStorage.getItem('engTimeEntry');
            if (value !== null ) 
            {
                if (value !== '[]' ) 
                {
                    var data =  JSON.parse(value);
                    this.setState({ 
                        offlineData : data ,
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
      this.setState({tab:tab}) 
      if (tab==='online')
      {
        if (this.state.onlineData.length===0)
          this.loadData();
        else  
          this.setState({displayData:this.state.onlineData}) 
      }
      else
      {
        this.setState({displayData:this.state.offlineData}) 
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
        var originalData = this.state.offlineData;
        if (mode==='ADD')
        {
          originalData.push({RowID:data.RowID,TEID:data.TEID,ProjectID:data.ProjectID,
            ProjectName: data.ProjectName,Employees:data.Employees,
            ReportDate:data.ReportDate,StartTime: data.StartTime,EndTime:data.EndTime,
            EmployeeID:data.EmployeeID,Lunchtime:data.Lunchtime,Holiday:data.Holiday,
            Remarks:data.Remarks,Leave:data.Leave
            
          })
        }
        else
        {
          originalData[data.RowID].TEID = data.TEID
          originalData[data.RowID].ProjectID = data.ProjectID
          originalData[data.RowID].ProjectName = data.ProjectName
          originalData[data.RowID].Employees = data.Employees
          originalData[data.RowID].ReportDate = data.ReportDate
          originalData[data.RowID].StartTime = data.StartTime
          originalData[data.RowID].EndTime = data.EndTime
          originalData[data.RowID].EmployeeID = data.EmployeeID
          originalData[data.RowID].Lunchtime = data.Lunchtime
          originalData[data.RowID].Holiday = data.Holiday
          originalData[data.RowID].Remarks = data.Remarks
          originalData[data.RowID].Leave = data.Leave
        }

        this.setState({ 
          offlineData : originalData ,
          displayData: originalData
        })

        AsyncStorage.setItem('engTimeEntry', JSON.stringify(originalData))

      }
    }
    onAdd()
    {
      this.onShowDetail('ADD',{RowID:this.state.offlineData.length,TEID:0,ProjectID:0,
        ProjectName: '',Remarks:'',
        ReportDate:'Choose',Employees:'',EmployeeID:0,
        StartTime: 'Choose',EndTime:'Choose',
        Lunchtime:false,Holiday:false,Leave:0
        });
    }
    onRemoveAll ()
    {
      var data = [];
  
      this.setState({ 
        offlineData : data ,
        displayData: data 
      })

      AsyncStorage.setItem('engTimeEntry', JSON.stringify(data))
    }
    onSave(id)
    {
      this.onModify(id,'Save')
    }
    onView(id)
    {
      var data=[];
      if (this.state.tab==='online')
      {
        data = this.state.onlineData[id];
      }
      else
      {
        data = this.state.offlineData[id];
      }

      this.onShowDetail('VIEW',data);
    }
    onSynch(details)
    {

      var that = this;
      axios({
        method:'POST',
        url:global.URL_TimeEntryCreate,
        auth: {
          username: global.Username,
          password: global.Password
        },
        data:{"TEID":0,"EmpID":details.EmployeeID,"ProjectID":details.ProjectID,
              "ReportDate":details.ReportDate,"Work_Start_Time":details.StartTime,"Work_End_Time":details.EndTime,
              "Ot_Start_Time":null,"Ot_End_Time":null,"No_of_WorkHours":8.0,"No_of_OtHours":2.0,
              "Remarks":details.Remarks,"SubmittedBy":global.UserID,"SubmittedDate":null,"UpdatedBy":null,"UpdatedDate":null,
              "FirstName":details.Employees,"ProjectName":null,"islunchtime":details.Lunchtime?1:0,
              "ispublicholiday":details.Holiday?1:0,"Leave":details.Leave}
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
      this.props.navigation.navigate("TimeEntryDetail", 
      {Mode:mode,ParentData:data,DataMode:this.state.tab,OnClose:(data,option,editmode)=>this.onDetailClose(data,option,editmode)})
    }
    onDelete(id)
    {
      this.onModify(id,'Delete')
    }
    onModify(id,Option)
    {
      var originalData = this.state.offlineData;

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
  
      this.setState({ 
        offlineData : data ,
        displayData: data 
      })

      AsyncStorage.setItem('engTimeEntry', JSON.stringify(data))
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
      if (this.state.tab==='online')
      {
        currentData=this.state.onlineData;
      }
      else
      {
        currentData=this.state.offlineData;
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
          url:global.URL_TimeEntry+global.UserID,
          auth: {
              username: global.Username,
              password: global.Password
          }
      })
      .then(function (response) {
          var data = [];
          
          {response.data &&
              response.data.map((d,i) => (
                  data.push({RowID:i,TEID:d.TEID,ProjectReportID:d.ProjectReportID,ProjectID:d.ProjectID,
                      ProjectName: d.ProjectName,Remarks:d.Remarks,
                      ReportDate:d.ReportDate,Employees:d.FirstName,EmployeeID:d.EmpID,
                      StartTime: d.Work_Start_Time,EndTime:d.Work_End_Time,
                      Lunchtime:d.islunchtime,Holiday:d.ispublicholiday,
                      Leave:d.Leave
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
    
    renderSwipeCard (entryData) 
    {
      return (
        <SwipeRow
          style={{paddingLeft:-10,paddingTop:-10,paddingRight:-15,paddingBottom:-10}}
          ref={(c) => { this.component[entryData.RowID] = c }}
          leftOpenValue={this.state.tab==='online'?0:55}
          rightOpenValue={this.state.tab==='online'?0:-55}
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
                  <Col><Text style={{fontSize: 12}}><Icon name="calendar" style={{color:"#6666ff",fontSize:18}}/> {entryData.ReportDate}</Text></Col>
                  <Col><Text style={{fontSize: 12}}><Icon name="timer" style={{color:"#cc6600",fontSize:18}}/> {entryData.StartTime} - {entryData.EndTime}</Text></Col>
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
        <AppHeader Name='Safety Inspection' SearchText='search in inspection or location' 
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
                refreshing={this.state.loading}
                onRefresh={()=>this.onRefresh()}
              />
            </Content>
            :
            <Content padder>
              <Text>No Data available</Text>
            </Content>
        }
        {
          this.state.tab==='offline'?
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

export default Safety;
