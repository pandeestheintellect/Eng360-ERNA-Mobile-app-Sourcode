import React, { Component } from "react";
import {Picker} from "native-base";



class SinglePicker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pickerType:this.props.PickerType,
            pickedValue:this.props.PickedValue,
            pickerData:this.props.Data,
            isLoaded:false
        }
    }
    
    componentDidMount() {

        this.state = {
            pickerType:this.props.PickerType,
            pickedValue:this.props.PickedValue,
            pickerData:this.props.Data
        }
        /*
        if (this.state.pickerData)
        {
           
            setTimeout(() => {
                var selectedData;
                if (this.state.pickerType==='Employee')
                {
                    
                    this.setState({ pickedValue: this.state.pickedValue });
                    selectedData = this.state.pickerData.find(data => data.EmpID === this.state.pickedValue);
                    this.props.onPickedValue(selectedData.FirstName+'('+selectedData.EmpNo+')')

                }
                else if (this.state.pickerType==='Project')
                {
                    selectedData = this.state.pickerData.find(data => data.ProjectID === this.state.pickedValue);
                    this.props.onPickedValue(selectedData.ProjectNo +' - ' + selectedData.ProjectName)
                }

            }, 2000);
        } 
        */  
    }
    
    onPicked (value){
        
        this.setState({ pickedValue: value });
        this.props.onPicked(value);
        var selectedData;
        if (this.state.pickerData)
        {
            if (this.state.pickerType==='Project')
            {
                selectedData = this.state.pickerData.find(data => data.ProjectID === value);
                this.props.onPickedValue(selectedData.ProjectNo +' - ' + selectedData.ProjectName)
            }
            else if (this.state.pickerType==='Employee')
            {
                selectedData = this.state.pickerData.find(data => data.EmpID === value);
                this.props.onPickedValue(selectedData.FirstName+'('+selectedData.EmpNo+')')
            }
            else if (this.state.pickerType==='ClaimType')
            {
                selectedData = this.state.pickerData.find(data => data.ClaimTypeID === value);
                this.props.onPickedValue(selectedData.ClaimType)
            }
        }
        
    }
    renderList()
    {
        
        if (this.state.pickerData)
        {
            if (this.state.pickerType==='Leave' || this.state.pickerType==='ProjectStatus'  || 
                this.state.pickerType==='InspectionType')
                return (
                    this.state.pickerData.map((data, index) => (
                        <Picker.Item key={index} label={data} value={index+1} />
                    ))
            )
            else if (this.state.pickerType==='Employee')
                return (
                    this.state.pickerData.map((data, index) => (
                        <Picker.Item key={index} label={data.FirstName+'('+data.EmpNo+')'} value={data.EmpID} />
                    ))
            )    
            else if (this.state.pickerType==='ClaimType')
                return (
                    this.state.pickerData.map((data, index) => (
                        <Picker.Item key={index} label={data.ClaimType} value={data.ClaimTypeID} />
                    ))
            )    
            else if (this.state.pickerType==='Project')
                return (
                    this.state.pickerData.map((data, index) => (
                        <Picker.Item key={index} label={data.ProjectNo +' - ' + data.ProjectName} value={data.ProjectID} />
                    ))
                    
            )    

        }
        
    }
   
    render() {

        return (

            <Picker
                mode="dropdown"
                style={{ width: undefined }}
                selectedValue={this.state.pickedValue}
                onValueChange={(value) => this.onPicked(value)}
                >
               <Picker.Item key={0} label={'Choose'} value={0} />
                {
                    this.renderList()
                
                }
            </Picker>
        );
        
  }
}

  
export default SinglePicker;
