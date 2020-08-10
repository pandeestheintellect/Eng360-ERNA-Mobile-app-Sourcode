import React, { Component } from "react";

import axios from 'axios'

class ProjectReportModel extends Component {
  
    doLoadServerData()
    {
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
                    
                    data.push({ProjectReportID:d.ProjectReportID,ProjectID:d.ProjectID,
                        ProjectName: d.ProjectName,Remarks:d.Remarks,
                        ReportDate:d.ReportDate,Employees:d.Resource_name,
                        StartTime: d.Start_Date_Time,EndTime:d.End_Date_Time,
                        Quantity:d.Quantity,TaskStatusID:d.TaskStatusID,StatusImage:that.getStatusImage(d.TaskStatusID),
                        ProgressPercentage:d.ProgressPercentage,
                        Description:d.Task_Description
                    })
                 
              ))}
              
              that.setState({ 
                    isLoading : false,
                    projectDisplayData : data ,
                    projectData: data
                   
              })
              
              
        })
        .catch(function (error) {
            console.log(error);
        });
    }
    
}

export default ProjectReportModel;
