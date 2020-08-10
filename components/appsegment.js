import React, { Component,InputGroup } from "react";
import {Header,Left, Button,Icon,Body,Title,Right,Item,Input,Segment,Text} from "native-base";

class AppSegment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            seg:'offline'
        }
    }
    onSegmentChange(tab)
    {
        this.setState({ seg: tab })
        this.props.onSegmentChange(tab);
    }
    render() {
        return (
            <Segment>
                <Button first 
                        active={this.state.seg === 'offline' ? true : false}
                        onPress={() => this.onSegmentChange('offline')}>
                    <Text>Offline</Text>
                </Button>
                <Button last 
                        active={this.state.seg === 'online' ? true : false}
                        onPress={() => this.onSegmentChange('online')}>
                    <Text>Saved</Text>
                </Button>
            </Segment>
        );
  }
}

export default AppSegment;
