import React, { Component } from "react";
import { FlatList } from "react-native";
import { PieChart } from 'react-native-svg-charts'

import {
    Text,
    Content
  } from "native-base";
  


class PieTextChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Title:this.props.Title,
            ChartData:this.props.ChartData
        }
    }
    
    componentDidMount() {

        this.state = {
            Title:this.props.Title,
            ChartData:this.props.ChartData
        }
    }
    renderPieName(data)
    {
        return (
            
            <Text style={{fontSize: 12,color:data.FGColor}}>{data.Name + ' ' + data.Value}</Text>
        )

    }  
    
    render() {

        return (

            <Content padder>
                <Text>{this.state.Title}</Text>
                <PieChart
                    style={{ height: 200 }}
                    valueAccessor={({ item }) => item.Value}
                    data={this.state.ChartData}
                    spacing={0}
                    outerRadius={'95%'}
                >
                </PieChart>
                <FlatList
                    data={this.state.ChartData}
                    extraData={this.state}
                    showsVerticalScrollIndicator={false}
                    renderItem={({item}) => this.renderPieName(item)}
                    keyExtractor={item => item.key+''}
                    
                />
                
                
            </Content>
        );
        
  }
}

  
export default PieTextChart;
