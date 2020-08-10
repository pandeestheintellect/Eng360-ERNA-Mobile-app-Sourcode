import React, { Component } from "react";
import {StyleSheet,Image,StatusBar,PixelRatio,AsyncStorage} from 'react-native';
import {
  Container,  Header,  Title,  Content,  Text,  Button,  Icon,Toast,
  Card,  Item,  Left,  Right,  Body,Label,Input,Picker,Textarea,View
} from "native-base";

import { Col, Row, Grid } from 'react-native-easy-grid';
import AppMasters from "../boot/masters.js";

import MultiPicker from '../components/multipicker.js';

import ImagePicker from 'react-native-image-crop-picker';

import DateControl from '../components/datecontrol.js';
import TimeControl from '../components/timecontrol.js';
import SinglePicker from "../components/singlepicker.js";

class ProjectReportDetail extends Component 
{
  constructor(props) {
    super(props);
    this.state = {
      screenType:0,
      ParentData:this.props.navigation.getParam('ParentData',''),
      image:null
    };
    
    this.EditMode =this.props.navigation.getParam('Mode','ADD');
    this.DataMode=this.props.navigation.getParam('DataMode','');
    this.imagedata=null;
    this.multiPickData=null;
    this.multiSelectedData=null;
  }
  componentDidMount() {
    appMaster = new AppMasters();
    
    var mpData = [];
    var empMaster=appMaster.getEmployees();        
    {empMaster &&
      empMaster.map((d,i) => (
            mpData.push({Key:i,Display:d.FirstName+'('+d.EmpNo+')' })
          
      ))
    }
    this.multiPickData= mpData
    var mpSelectedData = [];
    if (this.state.ParentData.Employees!=='')
    {
      const employee_array = this.state.ParentData.Employees.split(',');
      
      for (var i=0;i<employee_array.length;i++)
      {
        mpSelectedData.push(this.getEmployeeData(employee_array[i]))
        
      }
    }
    this.multiSelectedData= mpSelectedData;
    this.setState({
      screenType: this.props.navigation.getParam('Mode','ADD')==='ADD'?1:0
    })
  }
  getEmployeeData(name)
  {
    var data = this.multiPickData;
    for (var i=0;i<data.length;i++)
    {
      if (data[i].Display===name)
        return (data[i])
    }
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
    else if (key==='Employees')
      newParentData.Employees = value;
    else if (key==='ReportDate')
      newParentData.ReportDate = value;
    else if (key==='StartTime')
      newParentData.StartTime = value;
    else if (key==='EndTime')
      newParentData.EndTime = value;
    else if (key==='Quantity')
      newParentData.Quantity = value;
    else if (key==='ProgressPercentage')
      newParentData.ProgressPercentage = value;
    else if (key==='TaskStatusID')
      newParentData.TaskStatusID = value;
    else if (key==='Remarks')
      newParentData.Remarks = value;
    else if (key==='Description')
      newParentData.Description = value;

      this.setState({
        
        ParentData:newParentData
      })
    

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
  showImagePicker()
  {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: false,
      includeBase64: true,
      includeExif: true,
    }).then(image => {

      this.image= {uri: `data:${image.mime};base64,`+ image.data, width: image.width, height: image.height},

      this.setState({
        imagedata:image.data
      });
    }).catch(e => alert(e));
  }
  onSave()
  {
    if (this.state.ParentData.ProjectID===0 )
    {
        this.onNotification(false,'Please choose a valid Project');
        return;
    }
    if (this.state.ParentData.TaskStatusID===0 )
    {
        this.onNotification(false,'Please choose a valid status');
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
  onMultiPicked(data)
  {
    var selected=[];
    for (var i=0;i<data.length;i++)
    {
      selected.push(data[i].Display)
    }
    this.onEdit('Employees',selected.toString())
  }
  onSelectedEmployee = (selectedItems) => {
    this.setState({ selectedEmployee: selectedItems});
    this.onEdit('Employees',selectedItems.toString())
  };
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
              <Col><Text note><Icon name="message-bulleted" style={{fontSize: 20, color: "#303f9f"}}/> Employees</Text></Col>
            </Row>
            <Row style={{marginBottom:8,marginLeft:24 }}>
              <Col><Text>{this.state.ParentData.Employees}</Text></Col>
            </Row>
            <Row style={{marginBottom:8 }}>
              <Col><Text note><Icon name="calendar" style={{color:"#ff7043",fontSize:20}}/> Date</Text></Col>
              <Col></Col>
            </Row>
            <Row style={{marginBottom:8,marginLeft:24 }}>
              <Col><Text>{this.state.ParentData.ReportDate}</Text></Col>
              <Col></Col>
            </Row>
            <Row style={{marginBottom:8 }}>
                <Col><Text note><Icon name="timer" style={{color:"#ff7043",fontSize:20}}/> Start</Text></Col>
                <Col><Text note><Icon name="timer" style={{color:"#ff7043",fontSize:20}}/> End</Text></Col>
            </Row>
            <Row style={{marginBottom:8,marginLeft:24 }}>
              <Col><Text>{this.state.ParentData.StartTime}</Text></Col>
              <Col style={{marginLeft:24}}><Text>{this.state.ParentData.EndTime}</Text></Col>
            </Row>
            <Row style={{marginBottom:8 }}>
                <Col><Text note><Icon name="counter" style={{color:"#c2185b",fontSize:20}}/> Quantity</Text></Col>
                <Col><Text note><Icon name="debug-step-over" style={{color:"#c2185b",fontSize:20}}/> Progress</Text></Col>
            </Row>
            <Row style={{marginBottom:8,marginLeft:24 }}>
              <Col><Text>{this.state.ParentData.Quantity}</Text></Col>
              <Col style={{marginLeft:24}}><Text>{this.state.ParentData.ProgressPercentage}</Text></Col>
            </Row>
            <Row style={{marginBottom:8 }}>
              <Col><Text note><Icon name="traffic-light" style={{fontSize: 20, color: "#00796b"}}/> Status</Text></Col>
            </Row>
            <Row style={{marginBottom:8,marginLeft:24 }}>
              <Col><Text>{appMaster.getProjectStatus()[this.state.ParentData.TaskStatusID-1] }</Text></Col>
            </Row>
            
            <Row>
              <Col><Text note><Icon name="message-bulleted" style={{fontSize: 20, color: "#303f9f"}}/> Remarks</Text></Col>
            </Row>
            <Row style={{marginBottom:8 ,marginLeft:24}}>
              <Col><Text>{this.state.ParentData.Remarks}</Text></Col>
            </Row>
            <Row>
              <Col><Text note><Icon name="file-plus" style={{fontSize: 20, color: "#303f9f"}}/> Description</Text></Col>
            </Row>
            <Row style={{marginBottom:8,marginLeft:24 }}>
              <Col><Text>{this.state.ParentData.ProjectDescription}</Text></Col>
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
              <Col><Text note><Icon name="message-bulleted" style={{fontSize: 20, color: "#303f9f"}}/> Employees</Text></Col>
            </Row>
            <Row style={{marginBottom:8 }}>
              <Col>
              <MultiPicker 
                  SearchText='search in employee' 
                  Data={this.multiPickData}
                  SelectedData={this.multiSelectedData}
                  onMultiPicked={(value) => this.onMultiPicked(value)}
                />
                
              </Col>
            </Row>

            <Row>
              <Col><Text note><Icon name="calendar" style={{color:"#ff7043",fontSize:20}}/> Date</Text></Col>
              <Col></Col>
            </Row>
            <Row style={{marginBottom:8 }}>
                <Col>
                  <DateControl Date={this.state.ParentData.ReportDate} onDateSelected={(value)=> this.onEdit('ReportDate',value)}/>

                </Col>
                <Col></Col>
            </Row>
            <Row>
                <Col><Text note><Icon name="timer" style={{color:"#ff7043",fontSize:20}}/> Start</Text></Col>
                <Col><Text note><Icon name="timer" style={{color:"#ff7043",fontSize:20}}/> End</Text></Col>
            </Row>
            <Row style={{marginBottom:8 }}>
                <Col>
                  <TimeControl Time={this.state.ParentData.StartTime} onTimeSelected={(value)=> this.onEdit('StartTime',value)}/>

                </Col>
                <Col>
                   <TimeControl Time={this.state.ParentData.EndTime} onTimeSelected={(value)=> this.onEdit('EndTime',value)}/>
                
                </Col>
            </Row>
            <Row>
                <Col><Text note><Icon name="counter" style={{color:"#c2185b",fontSize:20}}/> Quantity</Text></Col>
                <Col><Text note><Icon name="debug-step-over" style={{color:"#c2185b",fontSize:20}}/> Progress</Text></Col>
            </Row>
            <Row style={{marginBottom:8 }}>
                <Col>
                  <Item>
                    <Input
                      keyboardType="numeric"
                      returnKeyType="next"
                      clearButtonMode="always"
                      autoCapitalize="none"
                      autoCorrect={false}
                      onChangeText={(value) => this.onEdit('Quantity',value)} 
                      value={this.state.ParentData.Quantity ? String(this.state.ParentData.Quantity) : ''}
                    />
                  </Item>
                </Col>
                <Col>
                  <Item>
                    <Input
                      keyboardType="numeric"
                      returnKeyType="next"
                      clearButtonMode="always"
                      autoCapitalize="none"
                      autoCorrect={false}
                      onChangeText={(value) => this.onEdit('ProgressPercentage',value)} 
                      value={this.state.ParentData.ProgressPercentage ? String(this.state.ParentData.ProgressPercentage) : ''}
                    />
                  </Item>
                </Col>
            </Row>
            <Row>
              <Col><Text note><Icon name="traffic-light" style={{fontSize: 20, color: "#00796b"}}/> Status</Text></Col>
            </Row>
            <Row style={{marginBottom:8 }}>
              <Col >
                <Item>
                  <SinglePicker   PickerType='ProjectStatus'
                                    PickedValue={this.state.ParentData.TaskStatusID} 
                                    Data= {appMaster.getProjectStatus()}
                                    onPicked={(value) => this.onEdit('TaskStatusID',value)}
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
              <Col><Text note><Icon name="file-plus" style={{fontSize: 20, color: "#303f9f"}}/> Description</Text></Col>
            </Row>
            <Row style={{marginBottom:8 }}>
              <Col>
                
                  <Textarea rowSpan={2} bordered value={this.state.ParentData.Description} onChangeText={(value) => this.onEdit('Description',value)}/>
                
              </Col>
            </Row>

            <Row style={{marginBottom:8 }}>
              <Col>
              <View>

                { this.state.image === null ? 
                  <Button iconLeft  transparent onPress={() => this.showImagePicker()}>
                    <Icon name='camera' />
                    <Text>Select Picture</Text>
                  </Button>
                   :
                  <Image style={styles.ImageContainer} source={this.state.image} />
                }

              </View>

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
            <Title>Project Details</Title>
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
  },
  ImageContainer: {
    borderRadius: 10,
    width: 250,
    height: 250,
    borderColor: '#9B9B9B',
    borderWidth: 1 / PixelRatio.get(),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#CDDC39',
    
  },
  
  
});


export default ProjectReportDetail;
