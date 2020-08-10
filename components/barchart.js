import React, { Component } from "react";
import { FlatList } from "react-native";
import { BarChart, Grid  } from 'react-native-svg-charts'

import {
    Text,
    Content
  } from "native-base";
  


class BarTextChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Title:this.props.Title,
            ChartData:this.props.ChartData
        }
        this.Data=[];
        for (var i=0;i<this.props.ChartData.length;i++)
            this.Data.push(this.props.ChartData[i].Value);
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
            
            <Text style={{fontSize: 12}}>{(data.key+1) + ' ' + data.Name + ' ' + data.Value}</Text>
        )

    }  
    
    render() {

        return (


            <Content padder>
                <Text>{this.state.Title}</Text>
                <BarChart
                   style={{ height: 200 }}
                    data={this.Data}
                    horizontal={true}
                    svg={{ fill: '#F60ABC', }}
                    contentInset={{ top: 10, bottom: 10 }}
                    spacing={0.2}
                    gridMin={0}
                >
                    <Grid direction={Grid.Direction.VERTICAL}/>
                </BarChart>
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

  
export default BarTextChart;
