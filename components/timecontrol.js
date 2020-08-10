import React, { Component } from "react";
import {StyleSheet} from 'react-native';
import {Content,Text,  Button} from "native-base";

import DateTimePicker from 'react-native-modal-datetime-picker';
import Moment from 'moment';


class TimeControl extends Component {
    constructor(props) {
        super(props);
        this.state = {
            time:this.props.Time,
            isTimePickerVisible:false
        }
    }
    onTimeSelected = (selectedTime) => {
        this.setState({ time:Moment(selectedTime).format('HH:mm') });
        this.setState({ isTimePickerVisible: false });
        this.props.onTimeSelected(this.state.time);
    };

    render() {

        return (
            <Content>
                <Button style={styles.inputBackground}   transparent onPress={()=>this.setState({ isTimePickerVisible: true })}>
                    <Text style={styles.inputText} >{this.state.time}</Text>
                </Button>
                <DateTimePicker
                    mode='time'
                    isVisible={this.state.isTimePickerVisible}
                    onConfirm={this.onTimeSelected}
                    onCancel={() => this.setState({ isTimeickerVisible: false })}
                />
            </Content>
        );
  }
}

const styles = StyleSheet.create({

    inputBackground:
    {
      borderBottomColor:"#D9D5DC",
      borderBottomWidth:2
    },
    inputText:
    {
        color:"#000"
    }

});
  
export default TimeControl;
