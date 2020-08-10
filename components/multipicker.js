import React, { Component } from "react";
import {FlatList} from 'react-native';
import {Picker,CheckBox,Card,CardItem,Content,Input,Item,Text,Button,Icon, ListItem} from "native-base";

import { Col, Row, Grid } from 'react-native-easy-grid';

class MultiPicker extends Component {
  constructor(props) {
      super(props);
      this.pickerData=(this.props.Data)?this.props.Data:null;
      
      this.state = {
        displayName:'Choose',
        isExpanded:false,
        iconName:'menu-down',
        searchText:'',
        displayData:this.pickerData,
        selectedData:(this.props.SelectedData)?this.props.SelectedData:null
      }
      
      
  }
    
  componentDidMount() {
    this.onShowSelected(this.state.selectedData)
  }
  onPicked (value){
        
    var data = this.state.selectedData;
    for (var i=0;i<data.length;i++)
    {
      if(data[i].Key===value)
        return;
    }
    data.push(this.pickerData[value])
    this.setState({selectedData:data });
    this.onShowSelected(data);
    this.props.onMultiPicked(data);
    
  } 
  onShowSelected(data)
  {
    if (data)
    {
var selected=[];
    //var data = this.state.selectedData;
    for (var i=0;i<data.length;i++)
    {
      try {
        selected.push(data[i].Display)
     }
     catch (e) {
       //console.error(e.message);
     }
      
    }
    this.setState({displayName:selected.toString() });
    }
    
  }
  onRemoveSelection(value)
  {
    var data = this.state.selectedData;
    var dataremoved=[];
    for (var i=0;i<data.length;i++)
    {
      if (data[i].Key!==value)
        dataremoved.push(data[i])
    }
    this.setState({selectedData:dataremoved });
    this.onShowSelected(dataremoved);
    this.props.onMultiPicked(dataremoved);
  }
  onSearchChangeText(text)
  {
      
      var currentData = this.pickerData;
      this.setState({searchText: text})
    
      if (text==='')
      {
        this.setState({
          displayData: currentData
        })
      }
      else
      {
        const newData = currentData.filter(
          function(item)
          {
            const itemData = item.name.toUpperCase() 
            const textData = text.toUpperCase()
            return itemData.indexOf(textData) > -1
          }
        )
        this.setState({
            displayData: newData
        })
      }
  }  
  showPicker()
  {
    const newParentData = !this.state.isExpanded;  
    this.setState({ isExpanded: newParentData })
    if (newParentData)
      this.setState({ iconName: 'menu-up' })
    else
      this.setState({ iconName: 'menu-down' })
  } 
  renderTool()
  {
    return (
      <Grid>
      <Row>
        <Col><Text>{this.state.displayName}</Text></Col>
        <Col style={ { width: 50 } }><Button transparent onPress={() => this.showPicker() }><Icon active name={this.state.iconName} /></Button></Col>
      </Row>
      </Grid>
    )
  }
  renderList()
  {
    
    return(
      <Grid>
        <Row>
          <Col>
            <Item>
              <Icon active name='magnify' />
              <Input placeholder={this.props.SearchText}  style={{color:"#575757",fontSize:13}}
                      onChangeText={(text) => this.onSearchChangeText(text)}
                      value={this.state.searchText}/>
              <Button transparent
                  onPress={() => this.onSearchChangeText('')}>
                  <Icon name="close-circle" />
              </Button>
            </Item>
          </Col>
        </Row>
        <Row>
          <Col>
          <Item>
            <Picker
                mode="dropdown"
                style={{ width: undefined }}
                selectedValue={this.state.pickedValue}
                onValueChange={(value) => this.onPicked(value)}
                >
                <Picker.Item key={0} label={'Add more ...'} value={0} />
                {
                    this.renderListItem()
                
                }
            </Picker>
            </Item>
          </Col>
        </Row>
        <Row>
          <Col>
          <Item>
          <FlatList
                data={this.state.selectedData}
                extraData={this.state}
                showsVerticalScrollIndicator={false}
                renderItem={({item}) => this.renderSelectedItem(item)}
                keyExtractor={item => item.Key}
            />
            </Item>
          </Col>
        </Row>
        <Row>
          <Col>
          <Item>
            <Button success style={{ alignSelf: 'center', justifyContent: 'center'}} onPress={() => this.showPicker()}>
                  <Text>Ok</Text>
              </Button>
              </Item>
          </Col>
        </Row>
        
      </Grid>
    )
    
  }
  
  renderListItem()
  {
      if (this.state.displayData)
      {
        return (
            this.state.displayData.map((data, index) => (
                <Picker.Item key={data.Key+''} label={data.Display} value={data.Key} />
            )))
      }
      
  }
  renderSelectedItem(item)
  {
    
    return (
      <CardItem key={ item.Key+'' }>
          <Grid >
            <Row >
              <Col style={ { width: 40 } }><CheckBox
                    onPress={() => this.onRemoveSelection(item.Key)}
                    checked={true}
                /></Col>
              <Col><Text>{item.Display}</Text></Col>
              
            </Row>
          </Grid>
      </CardItem>
    )
  }
  render() {
      return (
        <Content padder>
          <Grid>
          <Row>
            <Col><Text>{this.state.displayName}</Text></Col>
            <Col style={ { width: 50 } }><Button transparent onPress={() => this.showPicker() }><Icon active name={this.state.iconName} /></Button></Col>
          </Row>
        </Grid>

          {this.state.isExpanded
            ?this.renderList()
            :<Text />
          }
          </Content>  
      );
        
  }
}

  
export default MultiPicker;
