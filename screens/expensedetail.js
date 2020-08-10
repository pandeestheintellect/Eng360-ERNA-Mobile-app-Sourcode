import React, { Component } from "react";
import {StyleSheet,Image,StatusBar,PixelRatio,AsyncStorage} from 'react-native';
import {
  Container,  Header,  Title,  Content,  Text,  Button,  Icon,Toast,
  Card,  Item,  Left,  Right,  Body,Switch,Input,Picker,Textarea,View
} from "native-base";

import { Col, Row, Grid } from 'react-native-easy-grid';
import AppMasters from "../boot/masters.js";

import ImagePicker from 'react-native-image-crop-picker';

import DateControl from '../components/datecontrol.js';
import SinglePicker from "../components/singlepicker.js";

class ExpenseDetail extends Component 
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
    else if (key==='EmpID')
      newParentData.EmpID = value;
    else if (key==='EmployeeName')
      newParentData.EmployeeName = value;
    else if (key==='Date')
      newParentData.Date = value;
    else if (key==='TypeID')
      newParentData.TypeID = value;
    else if (key==='CategoryName')
      newParentData.CategoryName = value;
    else if (key==='Amount')
      newParentData.Amount = value;
    else if (key==='GST')
      newParentData.GST = value;
    else if (key==='Description')
      newParentData.Description = value;

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
    if (this.state.ParentData.EmpID===0 )
    {
        this.onNotification(false,'Please choose a valid Employee');
        return;
    }
    if (this.state.ParentData.Date==='Choose' )
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
              <Col><Text>{this.state.ParentData.ProjectName}</Text></Col>
            </Row>
            <Row style={{marginBottom:8 }}>
              <Col><Text note><Icon name="message-bulleted" style={{fontSize: 20, color: "#303f9f"}}/> Employee Name</Text></Col>
            </Row>
            <Row style={{marginBottom:8,marginLeft:24 }}>
              <Col><Text>{this.state.ParentData.EmployeeName}</Text></Col>
            </Row>
            <Row style={{marginBottom:8 }}>
                <Col><Text note><Icon name="timer" style={{color:"#ff7043",fontSize:20}}/> Category</Text></Col>
                <Col><Text note><Icon name="timer" style={{color:"#ff7043",fontSize:20}}/> Date</Text></Col>
            </Row>
            <Row style={{marginBottom:8,marginLeft:24 }}>
              <Col><Text>{this.state.ParentData.CategoryName}</Text></Col>
              <Col style={{marginLeft:24}}><Text>{this.state.ParentData.Date}</Text></Col>
            </Row>

            <Row style={{marginBottom:8 }}>
                <Col><Text note><Icon name="timer" style={{color:"#ff7043",fontSize:20}}/> Amount</Text></Col>
                <Col><Text note><Icon name="timer" style={{color:"#ff7043",fontSize:20}}/> GST</Text></Col>
            </Row>
            <Row style={{marginBottom:8,marginLeft:24 }}>
              <Col><Text>{this.state.ParentData.Amount}</Text></Col>
              <Col style={{marginLeft:24}}><Text>{this.state.ParentData.GST?'Yes':'No'}</Text></Col>
            </Row>
           
            <Row>
              <Col><Text note><Icon name="message-bulleted" style={{fontSize: 20, color: "#303f9f"}}/> Description</Text></Col>
            </Row>
            <Row style={{marginBottom:8 ,marginLeft:24}}>
              <Col><Text>{this.state.ParentData.Description}</Text></Col>
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
              <Col><Text note><Icon name="file-tree" style={{fontSize: 16, color: "#7b1fa2"}}/> Project Name</Text></Col>
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
            <Row style={{marginBottom:8 }}>
              <Col><Text note><Icon name="message-bulleted" style={{fontSize: 20, color: "#303f9f"}}/> Employee Name</Text></Col>
            </Row>
            <Row style={{marginBottom:8 }}>
              <Col>
                <Item>
                    <SinglePicker   PickerType='Employee'
                                    PickedValue={this.state.ParentData.EmpID} 
                                    Data= {appMaster.getEmployees()}
                                    onPicked={(value) => this.onEdit('EmpID',value)}
                                    onPickedValue={(value) => this.onEdit('EmployeeName',value)}
                    />
                </Item>
              </Col>
            </Row>

            <Row>
                <Col><Text note><Icon name="calendar" style={{color:"#ff7043",fontSize:20}}/> Category</Text></Col>
                <Col><Text note><Icon name="calendar" style={{color:"#ff7043",fontSize:20}}/> Date</Text></Col>
            </Row>
            <Row style={{marginBottom:8 }}>
                <Col>
                  <Item>
                    <SinglePicker   PickerType='ClaimType'
                                    PickedValue={this.state.ParentData.TypeID} 
                                    Data= {appMaster.getClaimType()}
                                    onPicked={(value) => this.onEdit('TypeID',value)}
                                    onPickedValue={(value) => this.onEdit('CategoryName',value)}
                    />
                  </Item>
                </Col>
                <Col>
                  <DateControl Date={this.state.ParentData.Date} onDateSelected={(value)=> this.onEdit('Date',value)}/>
                </Col>
            </Row>
            <Row style={{marginBottom:8 }}>
                <Col><Text note><Icon name="check" style={{color:"#ff7043",fontSize:20}}/> Amount</Text></Col>
                <Col><Text note><Icon name="check" style={{color:"#ff7043",fontSize:20}}/> GST</Text></Col>
            </Row>
            <Row style={{marginBottom:8 ,marginLeft:24}}>
              <Col>
              <Item>
                <Input
                      keyboardType="numeric"
                      returnKeyType="next"
                      clearButtonMode="always"
                      autoCapitalize="none"
                      autoCorrect={false}
                      onChangeText={(value) => this.onEdit('Amount',value)} 
                      value={this.state.ParentData.Amount ? String(this.state.ParentData.Amount) : ''}
                    />
                </Item>    
              </Col>
              <Col style={{marginLeft:24}}>
                <Row>
                  <Col><Text>No</Text></Col>
                  <Col><Switch value={this.state.ParentData.GST} onValueChange = {(value) => this.onEdit('GST',value)} trackColor="#50B948" /></Col>
                  <Col><Text>Yes</Text></Col>
                </Row>
              </Col>
            </Row>

            <Row>
              <Col><Text note><Icon name="message-bulleted" style={{fontSize: 20, color: "#303f9f"}}/> Description</Text></Col>
              
            </Row>
            <Row style={{marginBottom:8 }}>
              <Col>
               
                  <Textarea rowSpan={2} bordered value={this.state.ParentData.Description} onChangeText={(value) => this.onEdit('Description',value)}/>
                
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
            <Title>Expense Details</Title>
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


export default ExpenseDetail;
