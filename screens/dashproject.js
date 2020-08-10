import React, { Component } from "react";
import { StatusBar,FlatList } from "react-native";
import {
  Container,
  Header,
  Left,
  Button,
  Text,
  Content,
  Body,
  Title,
  Right,
  Tabs,Tab,ScrollableTab,
  Icon
} from "native-base";

import axios from 'axios'
import Loader from '../components/loader.js';
import PieTextChart from '../components/piechart.js';
import BarTextChart from '../components/barchart.js';

const data = [
    {
        key: 1,
        amount: 50,
        name: 'Name1',
        fgcolor:'#22C8E8',
        svg: { fill: '#22C8E8' },
    },
    {
        key: 2,
        amount: 50,
        name: 'Name2',
        fgcolor:'#26E50B',
        svg: { fill: '#26E50B' }
    },
    {
        key: 3,
        amount: 40,
        name: 'Name3',
        fgcolor:'#F6260A',
        svg: { fill: '#F6260A' }
    },
    {
        key: 4,
        amount: 95,
        name: 'Name4',
        fgcolor:'#F60ABC',
        svg: { fill: '#F60ABC' }
    },
    {
        key: 5,
        amount: 35,
        name: 'Name5',
        fgcolor:'#280AF6',
        svg: { fill: '#280AF6' }
    }
]

const colorData = ['#22C8E8','#26E50B','#F6260A','#F60ABC','#280AF6']

class DashboardProject extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading:true
            
        }
        this.ActiveData=[];
        this.PendingData=[];
        this.ProjectwiseExpenseData=[];
        this.CategorywiseExpenseData=[];
        this.EmployeewiseExpenseData=[];
      }
      componentDidMount() {
        this.loadData();
      }
      loadData ()
      {
        var that = this;
        that.setState({ loading : true})
        
        axios({
            method:'GET',
            url:global.URL_ProjectReport+global.UserID,
            auth: {
                username: global.Username,
                password: global.Password
            }
        })
        .then(function (response) {
            var data = [];

            {response.data &&
                response.data.map((d,i) => (
                     
                    data.push({RowID:i,ProjectReportID:d.ProjectReportID,ProjectID:d.ProjectID-1,
                        ProjectName: d.ProjectName,Remarks:d.Remarks,
                        ReportDate:d.ReportDate,Employees:d.Resource_name,
                        StartTime: d.Start_Date_Time,EndTime:d.End_Date_Time,
                        Quantity:d.Quantity,TaskStatusID:d.TaskStatusID,
                        ProgressPercentage:d.ProgressPercentage,
                        Description:d.Task_Description
                    })
                  
              ))}
              that.parseProjectData(data);
        })
        .catch(function (error) {
            
        });

        axios({
            method:'GET',
            url:global.URL_Expense+global.UserID+'&groupid='+global.UserID,
            auth: {
                username: global.Username,
                password: global.Password
            }
        })
        .then(function (response) {
            var data = [];
            
            {response.data &&
                response.data.map((d,i) => (
                    data.push({RowID:i,ID:d.ClaimID,ProjectID:d.ProjectID,ProjectName: d.ProjectName,
                        EmpID: d.UserID,EmployeeName:d.EmployeeName,GST:d.eng_claim_description[0].GST==='YES'?true:false,
                        TypeID: d.eng_claim_description[0].ClaimTypeID,CategoryName: d.eng_claim_description[0].ClaimCategoryName,
                        Amount:d.eng_claim_description[0].RecpAmount,Description:d.eng_claim_description[0].ClaimDescription
                    })
                  
              ))}
              that.parseExpenseData(data);
        })
        .catch(function (error) {
            that.setState({ loading : false})
        });
      }
      parseProjectData(data)    
    {
        for (let i=0;i<data.length;i++)
        {
            if (data[i].TaskStatusID==1)
            {
                this.makeProjectData(data[i],this.PendingData);
            }
            else if (data[i].TaskStatusID==2)
            {
                this.makeProjectData(data[i],this.ActiveData);
            }
        }
 
    }
    parseExpenseData(data)    
    {
        for (let i=0;i<data.length;i++)
        {
            this.makeExpenseData(data[i],this.ProjectwiseExpenseData,'project');
            this.makeExpenseData(data[i],this.CategorywiseExpenseData,'category');
            this.makeExpenseData(data[i],this.EmployeewiseExpenseData,'employee');
        }
        this.setState({ 
            loading : false
                
          })
  
    }

    makeProjectData(data,displaydata)    
    {
        if (displaydata.length==0)
        {
            displaydata.push({key: 0, Name: data.ProjectName,Value:1,FGColor:colorData[0],svg: { fill:colorData[0] } })
        }
        else
        {
            let i = this.getItemIndex(data.TaskStatusID,data.ProjectName,displaydata);
            if (i==-1)
            {
                displaydata.push({key: displaydata.length, Name: data.ProjectName,Value:1,
                    FGColor:colorData[displaydata.length],svg:{ fill:colorData[displaydata.length]}})
            }
            else
            {
                let curdata=displaydata[i];
                curdata.Value = curdata.Value+1;
                displaydata[i]=  curdata;
            }
        }
    }
    makeExpenseData(data,displaydata,type)    
    {
        if (displaydata.length==0)
        {
            if (type=='project')
                displaydata.push({key: 0, Name: data.ProjectName,Value:data.Amount,FGColor:colorData[0],svg: { fill:colorData[0] } })
            else if (type=='employee')
                displaydata.push({key: 0, Name: data.EmployeeName,Value:data.Amount,FGColor:colorData[0],svg: { fill:colorData[0] } })    
            else
                displaydata.push({key: 0, Name: data.CategoryName,Value:data.Amount,FGColor:colorData[0],svg: { fill:colorData[0] } })    
        }
        else
        {
            let i = -1
            if (type=='project')
            {
                i = this.getItemIndex(data.TaskStatusID,data.ProjectName,displaydata);
                if (i==-1)
                {
                    displaydata.push({key: displaydata.length, Name: data.ProjectName,Value:data.Amount,
                        FGColor:colorData[displaydata.length],svg:{ fill:colorData[displaydata.length]}})
                }
            }
            else if (type=='employee')
            {
                i = this.getItemIndex(data.TaskStatusID,data.EmployeeName,displaydata);
                if (i==-1 && displaydata.length <=4)
                {
                    displaydata.push({key: displaydata.length, Name: data.EmployeeName,Value:data.Amount,
                        FGColor:colorData[displaydata.length],svg:{ fill:colorData[displaydata.length]}})
                }
                else
                    i=-1;
            }
            else
            {
                i = this.getItemIndex(data.TaskStatusID,data.CategoryName,displaydata);
                if (i==-1)
                {
                    displaydata.push({key: displaydata.length, Name: data.CategoryName,Value:data.Amount,
                    FGColor:colorData[displaydata.length],svg:{ fill:colorData[displaydata.length]}})
                }
            }

            if (i>=0)
            {
                let curdata=displaydata[i];
                curdata.Value = curdata.Value+data.Amount;
                displaydata[i]=  curdata;
            }
        }
    }
    
    getItemIndex(ID,Name,displaydata)
    {
       
        for (let i=0;i<displaydata.length;i++)
        {
            if (displaydata[i].Name==Name)
                return i;
        }
        
        return -1
    }
  render() {
    return (
      <Container>
        <Loader loading={this.state.loading} />        
        <Content padder>
        {
          this.state.loading===false?
            <Content>
                <PieTextChart Title='Project Tasks currently going on' ChartData = {this.ActiveData} />
                <PieTextChart Title='Project Tasks to be started' ChartData = {this.PendingData} />
                <PieTextChart Title='Expense Project wise breakup' ChartData = {this.ProjectwiseExpenseData} />
                <PieTextChart Title='Expense Category wise breakup' ChartData = {this.CategorywiseExpenseData} />
                <BarTextChart Title='Expense Top 5 Spender' ChartData = {this.EmployeewiseExpenseData} />
            </Content>
          :
            <Text />
        }
            
        </Content>
        
      </Container>
    );
  }
}

export default DashboardProject;
