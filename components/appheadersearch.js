import React, { Component } from "react";
import {Header,Left, Button,Icon,Body,Title,Right,Item,Input} from "native-base";

class AppHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searching:false,
            searchText:''
        }
    }
    
    onDrawerOpen()
    {
        this.props.onDrawerOpen();
    }
    onSearchChangeText(text)
    {
        this.setState({searchText: text})
        this.props.onSearchChangeText(text);
    }
    
    renderSearch()
    {
        return (
            <Header searchBar rounded hasSegment>
                <Item>
                    <Button transparent
                        onPress={() => this.setState({searching:false})}>
                        <Icon name="arrow-left" />
                    </Button>
                    <Icon active name='magnify' />
                    <Input placeholder={this.props.SearchText}  style={{color:"#575757",fontSize:13}}
                            onChangeText={(text) => this.onSearchChangeText(text)}
                            value={this.state.searchText}/>
                    <Button transparent
                        onPress={() => this.onSearchChangeText('')}>
                        <Icon name="close-circle" />
                    </Button>
                    
                </Item>
            </Header>
        );
    }
    renderHeader()
    {
        return (
            <Header hasSegment>
                <Left>
                    <Button transparent
                        onPress={() => this.onDrawerOpen()}>
                        <Icon name="menu" />
                    </Button>
                </Left>
                <Body>
                    <Title>{this.props.Name}</Title>
                </Body>
                <Right>
                    <Button transparent 
                        onPress={() => this.setState({searching:true})}>
                        <Icon name="magnify" />
                    </Button>
                </Right>
            </Header>
            
        );
    }
    render() {
        if (this.state.searching)
        {
            return this.renderSearch()
        }
        else
            return this.renderHeader();
        
  }
}

export default AppHeader;
