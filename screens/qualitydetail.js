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

class QualityDetail extends Component 
{
  constructor(props) {
    super(props);
    this.state = {
      screenType:0,
      ParentData:this.props.navigation.getParam('ParentData','')
    };
    
    this.EditMode =this.props.navigation.getParam('Mode','ADD');
    this.DataMode=this.props.navigation.getParam('DataMode','');


  }
  componentDidMount() {
    appMaster = new AppMasters();
    this.setState({
      screenType: this.props.navigation.getParam('Mode','ADD')==='ADD'?1:0
    })
   
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
  onEdit(key,value)
  {
    const newParentData = this.state.ParentData;
    if (key==='ProjectID')
      newParentData.ProjectID = value;
    else if (key==='ProjectName')
      newParentData.ProjectName = value;
    else if (key==='InspectedDate')
      newParentData.InspectedDate = value;
    else if (key==='Location')
      newParentData.Location = value;
    else if (key==='DrawingRecordNo')
      newParentData.DrawingRecordNo = value;
    else if (key==='InspectionArea')
      newParentData.InspectionArea = value;
    else if (key==='InspectionType')
      newParentData.InspectionType = value;
    else if (key==='InspectedBy')
      newParentData.InspectedBy = value;
    else if (key==='DefStatus')
      newParentData.DefStatus = value;
    
    else if (key==='PM_Incharge')
      newParentData.PM_Incharge = value;
      else if (key==='SupplierFlag')
      newParentData.SupplierFlag = value;
      else if (key==='SupplierID')
      newParentData.SupplierID = value;
      else if (key==='Remarks')
      newParentData.Remarks = value;
      else if (key==='DefectTitle')
      newParentData.DefectTitle = value;
      else if (key==='DefectImpactDetails')
      newParentData.DefectImpactDetails = value;

    this.setState({ ParentData: newParentData })

  }
  goBack(option)
  {
    this.props.navigation.goBack();
    this.props.navigation.state.params.OnClose(this.state.ParentData,option,this.EditMode);
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

    
    this.goBack('Save');
  }
  onDelete()
  {
    this.goBack('Delete');
  }

  renderRightHeader()
  {
    if (this.DataMode==='online')
    {
      return (<Text />);
    }
    else if (this.DataMode==='offline')
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
              <Col><Text>{this.state.projectName}</Text></Col>
            </Row>
            
            <Row style={{marginBottom:8 }}>
              <Col><Text note><Icon name="calendar" style={{color:"#ff7043",fontSize:20}}/> Date</Text></Col>
              <Col><Text note><Icon name="map-marker" style={{color:"#ff7043",fontSize:20}}/> Location</Text></Col>
            </Row>
            <Row style={{marginBottom:8,marginLeft:24 }}>
              <Col><Text>{this.state.inspectedDate}</Text></Col>
              <Col><Text>{this.state.location}</Text></Col>
            </Row>
            
            <Row style={{marginBottom:8 }}>
              <Col><Text note><Icon name="calendar" style={{color:"#ff7043",fontSize:20}}/> Drawing NO</Text></Col>
              <Col><Text note><Icon name="map-marker" style={{color:"#ff7043",fontSize:20}}/> Inspection Area</Text></Col>
            </Row>
            <Row style={{marginBottom:8,marginLeft:24 }}>
              <Col><Text>{this.state.drawingRecordNo}</Text></Col>
              <Col><Text>{this.state.inspectionArea}</Text></Col>
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
                                    PickedValue={this.state.ParentData.ProjectID} 
                                    Data= {appMaster.getProjects()}
                                    onPicked={(value) => this.onEdit('ProjectID',value)}
                                    onPickedValue={(value) => this.onEdit('ProjectName',value)} 
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
                  <DateControl Date={this.state.ParentData.InspectedDate} onDateSelected={(value)=> this.onEdit('InspectedDate',value)}/>
                </Col>
                <Col>
                  <Item>
                    <Input
                      returnKeyType="next"
                      clearButtonMode="always"
                      autoCapitalize="none"
                      autoCorrect={false}
                      onChangeText={(value)=> this.onEdit('Location',value)} 
                      value={this.state.ParentData.Location ? String(this.state.ParentData.Location) : ''}
                    />
                  </Item>

                </Col>
            </Row>
            <Row>
              <Col><Text note><Icon name="calendar" style={{color:"#ff7043",fontSize:20}}/> Drawing No</Text></Col>
              <Col><Text note><Icon name="map-marker" style={{color:"#ff7043",fontSize:20}}/> Type</Text></Col>
            </Row>
            <Row style={{marginBottom:8 }}>
                <Col>
                <Item>
                    <Input
                      returnKeyType="next"
                      clearButtonMode="always"
                      autoCapitalize="none"
                      autoCorrect={false}
                      onChangeText={(value)=> this.onEdit('DrawingRecordNo',value)} 
                      value={this.state.ParentData.DrawingRecordNo ? String(this.state.ParentData.DrawingRecordNo) : ''}
                    />
                  </Item>
                </Col>
                <Col>
                  <Item>
                    <SinglePicker   PickerType='InspectionType'
                                    PickedValue={this.state.ParentData.InspectionType} 
                                    Data= {appMaster.getInspectionType()}
                                    onPicked={(value) => this.onEdit('InspectionType',value)}
                    />
                  </Item>

                </Col>
            </Row>

            <Row>
              <Col><Text note><Icon name="calendar" style={{color:"#ff7043",fontSize:20}}/> Inspection Area</Text></Col>
            </Row>
            <Row style={{marginBottom:8 }}>
                <Col>
                  <Item>
                    <Input
                      returnKeyType="next"
                      clearButtonMode="always"
                      autoCapitalize="none"
                      autoCorrect={false}
                      onChangeText={(value)=> this.onEdit('InspectionArea',value)} 
                      value={this.state.ParentData.InspectionArea ? String(this.state.ParentData.InspectionArea) : ''}
                    />
                  </Item>

                </Col>
            </Row>

            <Row>
              <Col><Text note><Icon name="message-bulleted" style={{fontSize: 20, color: "#303f9f"}}/> Remarks</Text></Col>
            </Row>
            <Row style={{marginBottom:8 }}>
              <Col>
               
                  <Textarea rowSpan={2} bordered value={this.state.ParentData.Remarks} onChangeText={(value) => this.onEdit('Remarks',value)}/>
                
              </Col>
            </Row>
            <Row>
              <Col><Text note><Icon name="calendar" style={{color:"#ff7043",fontSize:20}}/> Defect Title</Text></Col>
            </Row>
            <Row style={{marginBottom:8 }}>
                <Col>
                  <Item>
                    <Input
                      returnKeyType="next"
                      clearButtonMode="always"
                      autoCapitalize="none"
                      autoCorrect={false}
                      onChangeText={(value)=> this.onEdit('DefectTitle',value)} 
                      value={this.state.ParentData.DefectTitle ? String(this.state.ParentData.DefectTitle) : ''}
                    />
                  </Item>

                </Col>
            </Row>
            <Row>
              <Col><Text note><Icon name="message-bulleted" style={{fontSize: 20, color: "#303f9f"}}/> Defect Impact</Text></Col>
            </Row>
            <Row style={{marginBottom:8 }}>
              <Col>
               
                  <Textarea rowSpan={2} bordered value={this.state.ParentData.DefectImpactDetails} onChangeText={(value) => this.onEdit('DefectImpactDetails',value)}/>
                
              </Col>
            </Row>
            
        </Grid>
      </Card>
    );
  }

  render() {
    return (
      <Container style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Header>
          <Left>
            <Button transparent onPress={() => this.goBack('No')}>
              <Icon name="arrow-left" />
            </Button>
          </Left>
          <Body>
            <Title>Quality Details</Title>
          </Body>
          {this.renderRightHeader()}
          
        </Header>
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
export default QualityDetail;
