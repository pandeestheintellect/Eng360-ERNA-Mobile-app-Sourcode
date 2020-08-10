import React, { Component } from "react";
import {StyleSheet,Image,StatusBar,PixelRatio} from 'react-native';
import {
  Container,  Header,  Title,  Content,  Text,  Button,  Icon,Toast,
  Card,  Item,  Left,  Right,  Body,CheckBox,Input,Picker,Textarea,View
} from "native-base";

import LoadingSpinner from '../components/loadingspinner.js';
import { Col, Row, Grid } from 'react-native-easy-grid';
import Moment from 'moment';
import AppMasters from "../boot/masters.js";
import axios from 'axios'

import Loader from '../components/loader.js';
import DateControl from '../components/datecontrol.js';
import TimeControl from '../components/timecontrol.js';
import SinglePicker from "../components/singlepicker.js";

class DefectTrackingDetail extends Component 
{
  constructor(props) {
    super(props);
    this.state = {
      screenType:0,
      EditMode:'ADD',
      ParentData:0,
      DataMode:'',
      
      loading:false,
      DPCID: 0,
      DefectDetailID: 0,
      PAflag: false,
      CAflag: false,
      rfp_ncps: false,
      rfp_mgmtreview: false,
      rfp_cc: false,
      rfp_ea: false,
      rfp_other: false,
      rfp_other_remarks: null,
      ipt_envmt: false,
      ipt_safety: false,
      ipt_health: false,
      ipt_insandops: false,
      ipt_suggestion: false,
      ActionTaken: null,
      ActionBy: null,
      DoI: '',
      FollowupAction: null,
      Remarks: null,
      ReviewedBy: null,
      UpdatedBy: 0,
      UpdatedDate: '',
      TrackStatus: null,
      ProjectName: '',
      DefectTrackNum: '',
      Inspected_Date: '',
      DefectTitle: '',
      DefectImpactDetails: '',
      SupplierName:'' ,
      mobileFiles: null
    };


  }
  componentDidMount() {
    appMaster = new AppMasters();
    this.setState({
      EditMode:this.props.navigation.getParam('Mode','ADD'),
      ParentData : this.props.navigation.getParam('ParentData',0),
      DataMode: this.props.navigation.getParam('DataMode',''),
      screenType: this.props.navigation.getParam('Mode','ADD')==='ADD'?1:0
    })   

    this.loadData (this.props.navigation.getParam('ParentData',0))
  }
  loadData (id)
    {
      var that = this;
      that.setState({ loading : true})
      
      axios({
          method:'GET',
          url:global.URL_DefectTrackingEdit+id,
          auth: {
              username: global.Username,
              password: global.Password
          }
      })
      .then(function (response) {
          
          console.log(response)
          if (response.data){
            that.setState({
              DPCID: response.data.DPCID,
              DefectDetailID: response.data.DefectDetailID,
              PAflag: response.data.PAflag,
              CAflag: response.data.CAflag,
              rfp_ncps: response.data.rfp_ncps,
              rfp_mgmtreview: response.data.rfp_mgmtreview,
              rfp_cc: response.data.rfp_cc,
              rfp_ea: response.data.rfp_ea,
              rfp_other: response.data.rfp_other,
              rfp_other_remarks: response.data.rfp_other_remarks,
              ipt_envmt: response.data.ipt_envmt,
              ipt_safety: response.data.ipt_safety,
              ipt_health: response.data.ipt_health,
              ipt_insandops: response.data.ipt_insandops,
              ipt_suggestion: response.data.ipt_suggestion,
              ActionTaken: response.data.ActionTaken,
              ActionBy: response.data.ActionBy,
              DoI: response.data.DoI,
              FollowupAction: response.data.FollowupAction,
              Remarks: response.data.Remarks,
              ReviewedBy: response.data.ReviewedBy,
              UpdatedBy: response.data.UpdatedBy,
              UpdatedDate: response.data.UpdatedDate,
              TrackStatus: response.data.TrackStatus,
              ProjectName: response.data.ProjectName,
              DefectTrackNum: response.data.DefectTrackNum,
              Inspected_Date: response.data.Inspected_Date,
              DefectTitle: response.data.DefectTitle,
              DefectImpactDetails: response.data.DefectImpactDetails,
              SupplierName:response.data.SupplierName,
              mobileFiles: response.data.mobileFiles
            })
          }
          that.setState({ 
            loading : false
                
          })
      })
      .catch(function (error) {
          console.log(error);
          that.setState({ loading : false})
      });
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
  
  goBack(option)
  {
    this.props.navigation.goBack();
    this.props.navigation.state.params.OnClose(this.state.ParentData,option,this.state.EditMode);
  }
  showEdit()
  {
    this.setState({ screenType: 1 });
  }
  onSave()
  {
    if (this.state.ParentData.ProjectID===0 )
    {
        this.onNotification(false,'Please choose a valid Project');
        return;
    }
    if (this.state.ParentData.EmployeeID===0 )
    {
        this.onNotification(false,'Please choose a valid Employee');
        return;
    }
    if (this.state.ParentData.ReportDate==='Choose' )
    {
        this.onNotification(false,'Please choose a valid date');
        return;
    }

    if (this.state.ParentData.StartTime==='Choose'  || this.state.ParentData.EndTime==='Choose' )
    {
        this.onNotification(false,'Please choose a valid time');
        return;
    }

    var time = this.state.ParentData.StartTime.split(':');
    
    if (time.length>=1)
    {
      time = time[0]+':'+time[1]
    }
    this.onEdit('StartTime',time)
    var time = this.state.ParentData.EndTime.split(':');
    if (time.length>=1)
    {
      time = time[0]+':'+time[1]
    }
    this.onEdit('EndTime',time)
    this.goBack('Save');
  }
  onDelete()
  {
    this.goBack('Delete');
  }

  renderRightHeader()
  {
    if (this.state.DataMode==='online')
    {
      return (<Text />);
    }
    else if (this.state.DataMode==='offline')
    {
      if (this.state.screenType===0)
        return (
          <Right>
            <Button transparent onPress={() => this.onDelete() }><Icon active name="delete" /></Button>
            <Button transparent onPress={() => this.showEdit() }>
              <Icon name="pencil" />
            </Button>
          </Right>
        );
       else 
        return (
          <Right>
            <Button transparent onPress={() => this.onSave() }><Icon active name="content-save-outline" /></Button>
          </Right>
        );
    }
  }
  renderScreen()
  {
    if (this.state.screenType===0)
    {
      return this.renderViewScreen();
    }
    else if (this.state.screenType==1)
    {
      return this.renderEditScreen();
    }
  }

  renderViewScreen()
  {
    return (
      <Card  style={styles.list}>
          
          <Grid>
            <Row style={{marginBottom:8 }}>
              <Col><Text note><Icon name="file-tree" style={{fontSize: 20, color: "#7b1fa2"}}/> Project Name</Text></Col>
            </Row>
            <Row style={{marginBottom:8,marginLeft:24 }}>
              <Col><Text>{this.state.ProjectName}</Text></Col>
            </Row>
            <Row style={styles.gridRow}>
                <Col><Text note><Icon name="bug" style={{color:"#ff7043",fontSize:18}}/> Defect Track #</Text></Col>
                <Col><Text note><Icon name="calendar" style={{color:"#ff7043",fontSize:18}}/>Inspected Date</Text></Col>
            </Row>
            <Row style={{marginBottom:8,marginLeft:24 }}>
                <Col><Text>{this.state.DefectTrackNum}</Text></Col>
                <Col><Text>{this.state.Inspected_Date}</Text></Col>
            </Row>
            <Row style={{marginBottom:8 }}>
              <Col><Text note><Icon name="file-tree" style={{fontSize: 20, color: "#7b1fa2"}}/> Defect Title</Text></Col>
            </Row>
            <Row style={{marginBottom:8,marginLeft:24 }}>
              <Col><Text>{this.state.DefectTitle}</Text></Col>
            </Row>

        </Grid>
      </Card>
      
    );
  }

  renderEditScreen()
  {
    return (
      <Card  style={styles.list}>
          
        <Grid>
            <Row>
              <Col><Text note><Icon name="file-tree" style={{fontSize: 20, color: "#7b1fa2"}}/> Project Name</Text></Col>
            </Row>
            <Row style={{marginBottom:8 }}>
              <Col >
                <Item>
                    <SinglePicker   PickerType='Project'
                                    PickedValue={this.state.projectID} 
                                    Data= {appMaster.getProjects()}
                                    onPicked={(value) => this.setState({ projectID: value })}
                    />
                </Item>
              </Col>
            </Row>
            
            <Row>
              <Col><Text note><Icon name="calendar" style={{color:"#ff7043",fontSize:20}}/> Date</Text></Col>
              <Col><Text note><Icon name="map-marker" style={{color:"#ff7043",fontSize:20}}/> Location</Text></Col>
            </Row>
            <Row style={{marginBottom:8 }}>
                <Col>
                    <DateControl Date={this.state.inspectedDate} onDateSelected={(date)=> this.setState({ inspectedDate: date })}/>
                </Col>
                <Col>
                  <Item>
                    <Input
                      returnKeyType="next"
                      clearButtonMode="always"
                      autoCapitalize="none"
                      autoCorrect={false}
                      onChangeText={(text) => this.setState({ quantity: text })} 
                      value={this.state.location ? String(this.state.location) : ''}
                    />
                  </Item>

                </Col>
            </Row>

            <Row style={{marginBottom:8 }}>
              <Col>
                  <Textarea rowSpan={2} bordered value={this.state.remarks} onChangeText={(text) => this.setState({ remarks: text })}/>
                
              </Col>
            </Row>
            
            
            
        </Grid>
      </Card>
    );
  }

  render() {
    return (
      <Container style={styles.container}>
        <StatusBar />
        <Header>
          <Left>
            <Button transparent onPress={() => this.goBack('No')}>
              <Icon name="arrow-left" />
            </Button>
          </Left>
          <Body>
            <Title>Defect Tracking Details</Title>
          </Body>
          {this.renderRightHeader()}
        </Header>
        <Loader loading={this.state.loading} />
        <Content>
        {
          this.renderScreen()
        }
        </Content>
      </Container>
    );
  }
}
const styles = StyleSheet.create({
 
  list: {
      marginLeft: 6,
      marginRight: 6,
      padding:8
  }
  
});
export default DefectTrackingDetail;
