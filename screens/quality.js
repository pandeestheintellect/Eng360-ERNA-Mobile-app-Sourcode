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


class Quality extends Component {
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
      this.getProjects();
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
    async getProjects() {

      this.setState({loading : true})
      try 
      {
        const value = await AsyncStorage.getItem('engQuality');
        if (value !== null) {
          var  data = JSON.parse(value);
          this.offlineData = data ;
          this.setState({ 
            
            displayData: data 
          })

        }
        else
        {
          console.log('No Value');
        }
       } catch (error) {
         // Error retrieving data
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
          originalData.push({RowID:data.RowID,DefectID:data.DefectID,ProjectID:data.ProjectID,
            ProjectName: data.ProjectName,InspectedDate:data.InspectedDate,
            Location:data.Location,DrawingRecordNo: data.DrawingRecordNo,InspectionArea:data.InspectionArea,
            InspectionType:data.InspectionType,InspectedBy:data.InspectedBy,DefStatus:data.DefStatus,
            StatusImage:this.getStatusImage(data.DefStatus),
            PM_Incharge:data.PM_Incharge,SupplierFlag:data.SupplierFlag,SupplierID:data.SupplierID,Remarks:data.Remarks,
            DefectTitle:data.DefectTitle,DefectImpactDetails:data.DefectImpactDetails
          })
        }
        else
        {
          originalData[data.RowID].DefectID = data.DefectID
          originalData[data.RowID].ProjectID = data.ProjectID
          originalData[data.RowID].ProjectName = data.ProjectName
          originalData[data.RowID].InspectedDate = data.InspectedDate
          originalData[data.RowID].Location = data.Location
          originalData[data.RowID].DrawingRecordNo = data.DrawingRecordNo
          originalData[data.RowID].InspectionArea = data.InspectionArea
          originalData[data.RowID].InspectionType = data.InspectionType
          originalData[data.RowID].InspectedBy = data.InspectedBy
          originalData[data.RowID].DefStatus = data.DefStatus
          originalData[data.RowID].StatusImage = this.getStatusImage(data.DefStatus)
          originalData[data.RowID].PM_Incharge = data.PM_Incharge
          originalData[data.RowID].SupplierFlag = data.SupplierFlag
          originalData[data.RowID].SupplierID = data.SupplierID
          originalData[data.RowID].Remarks = data.Remarks
          originalData[data.RowID].DefectTitle = data.DefectTitle
          originalData[data.RowID].DefectImpactDetails = data.DefectImpactDetails
        }

        this.offlineData = originalData ;
        this.setState({ 
          displayData: originalData
        })

        AsyncStorage.setItem('engQuality', JSON.stringify(originalData))

      }
    }
    onAdd()
    {
      this.onShowDetail('ADD',{RowID:this.offlineData.length,ProjectReportID:0,ProjectID:0,
        ProjectName: '',Remarks:'',
        InspectedDate:'Choose',Location:'',
        DrawingRecordNo: '',InspectionArea:'',DefStatus: "Pending",
        InspectionType:0,SupplierFlag:false,SupplierID:0,
        Remarks:'',DefectTitle:'',DefectImpactDetails:''
        });
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
      axios({
        method:'POST',
        url:global.URL_QualityCreate,
        auth: {
          username: global.Username,
          password: global.Password
        },
        
      data:{"DefectID":0,"DefectDisplayID":null,"ProjectID":details.ProjectID,"Location":details.Location,
            "DrawingRecordNo":details.DrawingRecordNo,"InspectionArea":details.InspectionArea,"SupplierFlag":details.SupplierFlag,
            "SupplierID":details.SupplierID,"Remarks":details.Remarks,"DefStatus":details.DefStatus,
            "InspectedBy":details.InspectedBy,"InspectedDate":details.InspectedDate,"PM_Incharge":details.PM_Incharge,
            "CreatedBy":global.UserID,"CreatedDate":Moment().format(),"UpdatedBy":null,"UpdatedDate":null,
            "InspectionType":details.InspectionType,"Ext_AuditedBy":"","Ext_Auditor_Desig":"","IssueCount":0,
            "DefectTitle":details.DefectTitle,"DefectImpactDetails":details.DefectImpactDetails,
            "mobileFiles":[null],"filePaths":null,"ProjectName":details.ProjectName,"InsName":null,"ManagerName":null,
            "QIPReportType":null,"SupplierName":null}
           
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
      this.props.navigation.navigate("QualityDetail", 
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

      AsyncStorage.setItem('engQuality', JSON.stringify(data))
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
          const itemData = item.ProjectName.toUpperCase() + item.Location.toUpperCase() 
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
          url:global.URL_Quality,
          auth: {
              username: global.Username,
              password: global.Password
          }
      })
      .then(function (response) {
          var data = [];
          
          {response.data &&
              response.data.map((d,i) => (
                  data.push({RowID:i,DefectID:d.DefectID,ProjectID:d.ProjectID,
                      ProjectName: d.ProjectName,
                      InspectedDate:Moment(d.InspectedDate).format('DD/MM/YYYY') ,Location:d.Location,
                      DrawingRecordNo: d.DrawingRecordNo,InspectionArea:d.InspectionArea,
                      InspectionType:d.InspectionType,InspectedBy:d.InspectedBy,StatusImage:that.getStatusImage(d.DefStatus),
                      PM_Incharge:d.PM_Incharge,SupplierFlag:d.SupplierFlag,SupplierID:d.SupplierID,Remarks:d.Remarks,
                      DefectTitle:d.DefectTitle,DefectImpactDetails:d.DefectImpactDetails
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
                  <Col style={ { width: 50 } }><Text style={{fontSize: 12,alignSelf:'center', textAlignVertical: 'center',marginTop:5}}><Icon name={entryData.StatusImage}  style={{color:"#ff7043",fontSize:30}}/></Text></Col>
                  <Col>
                    <Row>
                    <Col><Text style={{fontSize: 12}}><Icon name="calendar" style={{color:"#6666ff",fontSize:18}}/> {entryData.InspectedDate}</Text></Col>
                    </Row>
                    <Row>
                    <Col><Text style={{fontSize: 12,textAlignVertical: 'center'}}><Icon name="map-marker" style={{color:"#f00202",fontSize:18}}/> {entryData.Location}</Text></Col>
                    </Row>
                  </Col>
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
        <AppHeader Name='Quality Inspection' SearchText='search by project or location' 
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

export default Quality;
