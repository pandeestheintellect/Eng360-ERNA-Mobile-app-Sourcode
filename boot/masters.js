import React, { Component } from "react";
import {AsyncStorage} from 'react-native';

import axios from 'axios'

class AppMaster extends Component {
  
    doLoadMasters=()=> {
        global.ProjectStatus =  ["Pending", "Inprogress", "Completed"]; 
        global.LeaveList =  ["Anual Leave", "Medical Leave", "Other Leave"]; 
        global.InspectionType =  ["Internal", "External"]; 
        global.URL_ProjectReport ='http://eng360demo.smartdigitalprojects.com/api/v1/mobilelogin/getAllProjectReports?id=';
        global.URL_ProjectReportCreate ='http://eng360demo.smartdigitalprojects.com/api/v1/mobilelogin/createprojectreport';
        global.URL_TimeEntry='http://eng360demo.smartdigitalprojects.com/api/v1/mobilelogin/getAllTimeEntry?id='
        global.URL_TimeEntryCreate='http://eng360demo.smartdigitalprojects.com/api/v1/mobilelogin/createtimeentry'
        global.URL_Expense='http://eng360demo.smartdigitalprojects.com/api/v1/mobilelogin/getClaims?userid=';
        global.URL_ExpenseCreate='http://eng360demo.smartdigitalprojects.com/api/v1/mobilelogin/createcliam';
        global.URL_DTTR = 'http://eng360demo.smartdigitalprojects.com/api/v1/mobilelogin/getAllDTTRReports';
        global.URL_Quality = 'http://eng360demo.smartdigitalprojects.com/api/v1/mobilelogin/getAllQIP';
        global.URL_QualityCreate = 'http://eng360demo.smartdigitalprojects.com/api/v1/mobilelogin/createQIP';

        global.URL_DefectTracking = 'http://eng360demo.smartdigitalprojects.com/api/v1/mobilelogin/getDefectTracking';
        global.URL_DefectTrackingEdit ='http://eng360demo.smartdigitalprojects.com/api/v1/mobilelogin/getDefectCPA?id='
        this.doRemoveStorage();
    }
    doRemoveStorage()
    {
       // this.removeLocalItem('engProjectReport');
    }
    async removeLocalItem(key) 
    {
        try {
            await AsyncStorage.removeItem(key);
            return true;
        }
        catch(exception) {
            return false;
        }
    }
    doLoadProjects=()=>{

        var that = this;
        axios({
            method:'GET',
            url:'http://eng360demo.smartdigitalprojects.com/api/v1/mobilelogin/getProjects',
            auth: {
                username: global.Username,
                password: global.Password
            }
        })
        .then(function (response) {
            
            if (response.data)
            {
                global.Projects = response.data;
            }
            
        })
        .catch(function (error) {
            console.log(error);
        });
    }
    
    doLoadEmployees=()=>{

        var that = this;
        axios({
            method:'GET',
            url:'http://eng360demo.smartdigitalprojects.com/api/v1/mobilelogin/getAllEmployees',
            auth: {
                username: global.Username,
                password: global.Password
            }
        })
        .then(function (response) {
           
            if (response.data)
            {
                global.Employees = response.data;
            }
            
        })
        .catch(function (error) {
            console.log(error);
        });
   
    }

    doLoadClaimType=()=>{

        var that = this;
        axios({
            method:'GET',
            url:'http://eng360demo.smartdigitalprojects.com/api/v1/mobilelogin/getClaimType',
            auth: {
                username: global.Username,
                password: global.Password
            }
        })
        .then(function (response) {
            
            if (response.data)
            {
                global.ClaimType = response.data;
            }
            
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    doLoadHazardList=()=>{

        var that = this;
        axios({
            method:'GET',
            url:'http://eng360demo.smartdigitalprojects.com/api/v1/mobilelogin/getAllHazards',
            auth: {
                username: global.Username,
                password: global.Password
            }
        })
        .then(function (response) {
            
            if (response.data)
            {
                global.HazardList = response.data;
            }
            
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    doLoadPPEList=()=>{

        var that = this;
        axios({
            method:'GET',
            url:'http://eng360demo.smartdigitalprojects.com/api/v1/mobilelogin/getAllPPE',
            auth: {
                username: global.Username,
                password: global.Password
            }
        })
        .then(function (response) {
            
            if (response.data)
            {
                global.PPEList = response.data;
            }
            
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    getEmployees=()=>{

        return global.Employees;
    
    }
    getProjects=()=>{

        return global.Projects;
    
    }
    getClaimType=()=>{

        return global.ClaimType;
    
    }
    getHazardList=()=>{

        return global.HazardList;
    
    }
    getPPEList=()=>{

        return global.PPEList;
    
    }
    getProjectStatus=()=>
    {
        return global.ProjectStatus
    }
    getLeaveList=()=>
    {
        return global.LeaveList
    }
    getInspectionType=()=>
    {
        return global.InspectionType
    }
        
}

export default AppMaster;
