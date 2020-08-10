import React, { Component } from "react";
import {StyleSheet} from 'react-native';
import {Content,Text,  Button} from "native-base";

import DateTimePicker from 'react-native-modal-datetime-picker';
import Moment from 'moment';


class DateControl extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date:this.props.Date,
            isDatePickerVisible:false
        }
    }
    onDateSelected = (selectedDate) => {
        this.setState({ date:Moment(selectedDate).format('DD/MM/YYYY') });
        this.setState({ isDatePickerVisible: false });
        this.props.onDateSelected(this.state.date);
    };

    render() {

        return (
            <Content>
                <Button style={styles.inputBackground}   transparent onPress={()=>this.setState({ isDatePickerVisible: true })}>
                    <Text style={styles.inputText} >{this.state.date}</Text>
                </Button>
                <DateTimePicker
                    isVisible={this.state.isDatePickerVisible}
                    onConfirm={this.onDateSelected}
                    onCancel={() => this.setState({ isDatePickerVisible: false })}
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
  
export default DateControl;
