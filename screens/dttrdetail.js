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

class DTTRDetail extends Component 
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
    this.employeeData=[];
    this.hazardData=[];
    this.PPEData=[];
  }
  componentDidMount() {
    appMaster = new AppMasters();
    
    var Data = [];
    var MasterData=appMaster.getEmployees();        
    {MasterData &&
      MasterData.map((d,i) => (
        Data.push({Key:i,Display:d.EmpNo +'-'+d.FirstName })
          
      ))
    }
    this.employeeData= Data

    Data = [];
    MasterData=appMaster.getHazardList();        
    {MasterData &&
      MasterData.map((d,i) => (
        Data.push({Key:i,Display:d.HazardDesc })
          
      ))
    }
    this.hazardData= Data

    Data = [];
    MasterData=appMaster.getPPEList();        
    {MasterData &&
      MasterData.map((d,i) => (
        Data.push({Key:i,Display:d.PPE_Desc })
          
      ))
    }
    this.PPEData= Data

    /*
    const employee_array = this.state.ParentData.Employees.split(',');
    var mpSelectedData = [];
    for (var i=0;i<employee_array.length;i++)
    {
      mpSelectedData.push(this.getEmployeeData(employee_array[i]))
      
    }
    this.multiSelectedData= mpSelectedData
    */
    this.setState({
      screenType: this.props.navigation.getParam('Mode','ADD')==='ADD'?1:0
    })
  }
  getEmployeeData(name)
  {
    var data = this.employeeData;
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
    
    else if (key==='ReportDate')
      newParentData.ReportDate = value;
    else if (key==='Time')
      newParentData.Time = value;
    else if (key==='Location')
      newParentData.Location = value;
    else if (key==='HazardList')
      newParentData.HazardList = value;
    else if (key==='HazardListText')
      newParentData.HazardListText = value;
    else if (key==='OtherHazard')
      newParentData.OtherHazard = value;
    else if (key==='HealthMeasure')
      newParentData.HealthMeasure = value;
    else if (key==='PPEList')
      newParentData.PPEList = value;
    else if (key==='PPEListText')
      newParentData.PPEListText = value;  
    else if (key==='EmployeeList')
      newParentData.EmployeeList = value;
    else if (key==='Employees')
      newParentData.Employees = value;

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
    
    if (this.state.ParentData.ReportDate==='Choose' )
    {
        this.onNotification(false,'Please choose a valid date');
        return;
    }

    if (this.state.ParentData.Time==='Choose')
    {
        this.onNotification(false,'Please choose a valid time');
        return;
    }

    var time = this.state.ParentData.Time.split(':');
    
    if (time.length>=1)
    {
      time = time[0]+':'+time[1]
    }
    this.onEdit('Time',time)
    
    this.goBack('Save');
  }
  onDelete()
  {
    this.goBack('Delete');
  }
  onMultiPicked(source,data)
  {
    var selected=[];
    for (var i=0;i<data.length;i++)
    {
      selected.push(data[i].Display)
    }
    if (source==='Hazard')
    {
      this.onEdit('HazardList',data)
      this.onEdit('HazardListText',selected.toString())
    }
    else if (source==='PPE')
    {
      this.onEdit('PPEList',data)
      this.onEdit('PPEListText',selected.toString())
    }
    else if (source==='Employee')
    {
      this.onEdit('EmployeeList',data)
      this.onEdit('Employees',selected.toString())
    }
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
            <Row>
              <Col><Text note><Icon name="file-tree" style={{fontSize: 16, color: "#7b1fa2"}}/> Project Name</Text></Col>
            </Row>
          <Row style={{marginBottom:8,marginLeft:24 }}>
            <Col><Item><Text>{this.state.ParentData.ProjectName}</Text></Item></Col>
          </Row>
          <Row>
            <Col><Text note><Icon name="calendar" style={{color:"#ff7043",fontSize:20}}/> Date</Text></Col>
            <Col><Text note><Icon name="timer" style={{color:"#ff7043",fontSize:20}}/> Time</Text></Col>
          </Row>
          <Row style={{marginBottom:8,marginLeft:24 }}>
            <Col><Item><Text>{this.state.ParentData.ReportDate}</Text></Item></Col>
            <Col style={{marginLeft:24}}><Item><Text>{this.state.ParentData.Time}</Text></Item></Col>
          </Row>
          <Row>
            <Col><Text note><Icon name="map-marker" style={{color:"#ff7043",fontSize:20}}/> Location</Text></Col>
          </Row>
          <Row style={{marginBottom:8,marginLeft:24 }}>
            <Col><Item><Text>{this.state.ParentData.Location}</Text></Item></Col>
          </Row>    
          <Row style={{marginBottom:8 }}>
              <Col><Text note><Icon name="biohazard" style={{color:"#c2185b",fontSize:20}}/> List of Haszards 
              associated and identified in todays's task and its corresponding RA and SWP reminded (Multiple Choice)</Text></Col>
              
          </Row>    
          <Row style={{marginBottom:8,marginLeft:24 }}>
            <Col><Item><Text>{this.state.ParentData.HazardListText}</Text></Item></Col>
          </Row> 
          <Row>
            <Col><Text note><Icon name="biohazard" style={{color:"#ff7043",fontSize:20}}/> Other Hazards</Text></Col>
          </Row>
          <Row style={{marginBottom:8,marginLeft:24 }}>
            <Col><Item><Text>{this.state.ParentData.OtherHazard}</Text></Item></Col>
          </Row> 
          
          <Row style={{marginBottom:8 }}>
            <Col><Text note><Icon name="security-home" style={{fontSize: 20, color: "#303f9f"}}/> 
              Additional Safety and Health Measures highlighted to comply if any:</Text></Col>
          </Row>  
          <Row style={{marginBottom:8,marginLeft:24 }}>
            <Col><Item><Text>{this.state.ParentData.HealthMeasure}</Text></Item></Col>
          </Row> 
          <Row style={{marginBottom:8 }}>
              <Col><Item><Text note><Icon name="security" style={{color:"#c2185b",fontSize:20}}/> 
              List of PPE highlighted and reminded to comply (Multiple Choice)</Text></Item></Col>
          </Row>
          <Row style={{marginBottom:8,marginLeft:24 }}>
            <Col><Item><Text>{this.state.ParentData.PPEListText}</Text></Item></Col>
          </Row>
          
          <Row style={{marginBottom:8 }}>
              <Col><Text note>
              Acknowledgement and undertaking by employees attending this Toolbox Talk (Supervisor to highlight this)</Text></Col>
              
          </Row>
          <Row style={{marginBottom:8 }}>
              <Col><Text note>
              We, the undersigned, herewith acknowledge that we have been already briefed on all necessary RA, SWP and MOS for 
              the various activities and reminded to us today as above we undertake to comply all necessary Safety and Health Measures.</Text></Col>
          </Row>
          <Row style={{marginBottom:8 }}>
            <Col><Text note><Icon name="worker" style={{fontSize: 20, color: "#303f9f"}}/> 
            Select the list of worker (Multiple Choice)</Text></Col>
          </Row>
          <Row style={{marginBottom:8,marginLeft:24 }}>
            <Col><Item><Text>{this.state.ParentData.Employees}</Text></Item></Col>
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

            <Row>
              <Col><Text note><Icon name="calendar" style={{color:"#ff7043",fontSize:20}}/> Date</Text></Col>
              <Col><Text note><Icon name="timer" style={{color:"#ff7043",fontSize:20}}/> Time</Text></Col>
            </Row>
            <Row style={{marginBottom:8 }}>
                <Col>
                  <DateControl Date={this.state.ParentData.ReportDate} onDateSelected={(value)=> this.onEdit('ReportDate',value)}/>
                </Col>
                <Col>
                  <TimeControl Time={this.state.ParentData.Time} onTimeSelected={(value)=> this.onEdit('Time',value)}/>
                </Col>
            </Row>
            <Row>
              
              <Col><Text note><Icon name="map-marker" style={{color:"#ff7043",fontSize:20}}/> Location</Text></Col>
            </Row>
            <Row style={{marginBottom:8 }}>
                
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

            <Row style={{marginBottom:8 }}>
                <Col><Text note><Icon name="biohazard" style={{color:"#c2185b",fontSize:20}}/> List of Haszards 
                associated and identified in todays's task and its corresponding RA and SWP reminded (Multiple Choice)</Text></Col>
                
            </Row>
            <Row style={{marginBottom:8 }}>
              <Col>
              <Item>
              <MultiPicker 
                  SearchText='search in hazard list' 
                  Data={this.hazardData}
                  SelectedData={this.state.ParentData.HazardList}
                  onMultiPicked={(value) => this.onMultiPicked('Hazard',value)}
                />
                </Item>
              </Col>
            </Row>
            <Row>
              
              <Col><Text note><Icon name="biohazard" style={{color:"#ff7043",fontSize:20}}/> Other Hazards</Text></Col>
            </Row>
            <Row style={{marginBottom:8 }}>
                
                <Col>
                  <Item>
                    <Input
                      returnKeyType="next"
                      clearButtonMode="always"
                      autoCapitalize="none"
                      autoCorrect={false}
                      onChangeText={(value)=> this.onEdit('OtherHazard',value)} 
                      value={this.state.ParentData.OtherHazard ? String(this.state.ParentData.OtherHazard) : ''}
                    />
                  </Item>

                </Col>
            </Row>
            
            <Row style={{marginBottom:8 }}>
              <Col><Text note><Icon name="security-home" style={{fontSize: 20, color: "#303f9f"}}/> 
                Additional Safety and Health Measures highlighted to comply if any:</Text></Col>
            </Row>
            <Row style={{marginBottom:8 }}>
              <Col>
                  <Textarea rowSpan={2} bordered value={this.state.ParentData.HealthMeasure} onChangeText={(value) => this.onEdit('HealthMeasure',value)}/>
              </Col>
            </Row>
        
            <Row style={{marginBottom:8 }}>
                <Col><Text note><Icon name="security" style={{color:"#c2185b",fontSize:20}}/> 
                List of PPE highlighted and reminded to comply (Multiple Choice)</Text></Col>
                
            </Row>
            <Row style={{marginBottom:8 }}>
              <Col>
              <Item>
              <MultiPicker 
                  SearchText='search in PPE' 
                  Data={this.PPEData}
                  SelectedData={this.state.ParentData.PPEList}
                  onMultiPicked={(value) => this.onMultiPicked('PPE',value)}
                />
                </Item>
              </Col>
            </Row>
            <Row style={{marginBottom:8 }}>
                <Col><Text note>
                Acknowledgement and undertaking by employees attending this Toolbox Talk (Supervisor to highlight this)</Text></Col>
                
            </Row>
            <Row style={{marginBottom:8 }}>
                <Col><Text note>
                We, the undersigned, herewith acknowledge that we have been already briefed on all necessary RA, SWP and MOS for 
                the various activities and reminded to us today as above we undertake to comply all necessary Safety and Health Measures.</Text></Col>
                
            </Row>
            <Row style={{marginBottom:8 }}>
              <Col><Text note><Icon name="worker" style={{fontSize: 20, color: "#303f9f"}}/> 
              Select the list of worker (Multiple Choice)</Text></Col>
            </Row>
            <Row style={{marginBottom:8 }}>
              <Col>
              <MultiPicker 
                  SearchText='search in employee' 
                  Data={this.employeeData}
                  SelectedData={this.state.ParentData.EmployeeList}
                  onMultiPicked={(value) => this.onMultiPicked('Employee',value)}
                />
                
              </Col>
            </Row>
            <Row style={{marginBottom:8 }}>
              <Col><Text>.</Text></Col>
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
            <Title>DTTR Details</Title>
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


export default DTTRDetail;
