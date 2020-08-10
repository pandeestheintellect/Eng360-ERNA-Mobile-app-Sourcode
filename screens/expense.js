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


class Expense extends Component {
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
        const value = await AsyncStorage.getItem('engExpense');
        if (value !== null) {
          var  data = JSON.parse(value);
          
          this.offlineData =  data
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
   
            originalData.push({RowID:data.RowID,ID:data.ID,ProjectID:data.ProjectID,
            ProjectName: data.ProjectName,EmpID:data.EmpID,
            EmployeeName:data.EmployeeName,GST: data.GST,TypeID:data.TypeID,
            CategoryName:data.CategoryName,Date:data.Date,Amount:data.Amount,
            Description:data.Description,StatusImage:this.getStatusImage(1)
          })
        }
        else
        {
          originalData[data.RowID].ProjectID = data.ProjectID
          originalData[data.RowID].ProjectName = data.ProjectName
          originalData[data.RowID].EmpID = data.EmpID
          originalData[data.RowID].EmployeeName = data.EmployeeName
          originalData[data.RowID].GST = data.GST
          originalData[data.RowID].TypeID = data.TypeID
          originalData[data.RowID].CategoryName = data.CategoryName
          originalData[data.RowID].Date = data.Date
          originalData[data.RowID].Amount = data.Amount
          originalData[data.RowID].Description = data.Description
        }

        this.offlineData = originalData ;
        this.setState({ 
          displayData: originalData
        })

        AsyncStorage.setItem('engExpense', JSON.stringify(originalData))

      }
    }
    onAdd()
    {
      this.onShowDetail('ADD',{RowID:this.offlineData.length,ID:0,ProjectID:0,ProjectName: '',
        EmpID: 0,EmployeeName:'',GST:true,
        TypeID: 0,CategoryName: '',Date:'Choose',
        Amount:'',Description:''
        
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
        url:global.URL_ExpenseCreate,
        auth: {
          username: global.Username,
          password: global.Password
        },
      data: {"ClaimID":0,"UserID":details.EmpID,"ProjectID":details.ProjectID,
            "ClaimDisplayID":null,"ClaimAmount":null,"Status":null,
            "ClaimAgainst":null,"SVRemarks":"","ApprovalRemarks":null,"RejectRemarks":null,
            "ApprovedBy":0,"ApprovedDate":null,"SubmittedBy":global.UserID,"SubmittedDate":Moment().format('DD/MM/YYYY'),
            "PaymentSource":"Self",
            "eng_claim_description":[{"ClaimDescID":0,"ClaimID":null,"ClaimTypeID":details.TypeID,
                "ClaimCategoryName":details.CategoryName,"RecpDate":details.Date,"ClaimDescription":details.Description,
                "RecpAmount":details.Amount,"GST":details.GST?'YES':'NO'}],
            "filepath":null,"files":[null],
            "ProjectName":details.ProjectName,"EmployeeName":details.EmployeeName,"ManagerName":null}
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
      this.props.navigation.navigate("ExpenseDetail", 
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

      AsyncStorage.setItem('engExpense', JSON.stringify(data))
    }

    onRefresh()
    {
      //this.getOfflineData();
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
          const itemData = item.ProjectName.toUpperCase() + item.EmployeeName.toUpperCase() 
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
          url:global.URL_Expense+global.UserID+'&groupid='+global.UserID,
          auth: {
              username: global.Username,
              password: global.Password
          }
      })
      .then(function (response) {
          var data = [];
          console.log(response.data)
          {response.data &&
              response.data.map((d,i) => (
                  data.push({RowID:i,ID:d.ClaimID,ProjectID:d.ProjectID,ProjectName: d.ProjectName,
                      EmpID: d.UserID,EmployeeName:d.EmployeeName,GST:d.eng_claim_description[0].GST==='YES'?true:false,
                      TypeID: d.eng_claim_description[0].ClaimTypeID,CategoryName: d.eng_claim_description[0].ClaimCategoryName,
                      Date:Moment(d.eng_claim_description[0].RecpDate).format('DD/MM/YYYY') ,StatusImage:that.getStatusImage(d.Status),
                      Amount:d.eng_claim_description[0].RecpAmount,Description:d.eng_claim_description[0].ClaimDescription
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
        if (status==0)
        return 'thumbs-up-down'
      else if (status==2)
        return 'thumb-down'
      else
        return 'thumb-up'  
      
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
                  <Col style={ { width: 80 } }><Text style={{fontSize: 12,alignSelf:'center', textAlignVertical: 'center',marginTop:5}}><Icon name={entryData.StatusImage}  style={{color:"#ff7043",fontSize:30}}/></Text></Col>
                  <Col>
                    <Row>
                    <Col><Text style={{fontSize: 12}}><Icon name="calendar" style={{color:"#6666ff",fontSize:18}}/> {entryData.Date}</Text></Col>
                    </Row>
                    <Row>
                    <Col><Text style={{fontSize: 12,textAlignVertical: 'center'}}><Icon name="cash" style={{color:"#f00202",fontSize:18}}/> {entryData.Amount}</Text></Col>
                    </Row>
                  </Col>
                </Row>
                <Row style={styles.gridRow}>
                  <Col><Text style={{fontSize: 12}}><Icon name="worker" style={{fontSize: 18, color: "#7b1fa2"}}/> {entryData.EmployeeName}</Text></Col>
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
        <AppHeader Name='Expenses Claim' SearchText='search by project or employee' 
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

export default Expense;
