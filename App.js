import React, {Component} from "react";
import { Root } from "native-base";
import { createStackNavigator, createDrawerNavigator } from "react-navigation";

import SideBar from "./screens/sidebar.js";
import Login from "./screens/login.js";
import Dashboard from "./screens/dashboard.js";
import Welcome from "./screens/welcome.js";
import ProjectReport from "./screens/projectreport.js";
import TimeEntry from './screens/timeentry.js';
import Expense from './screens/expense.js';
import DTTR from './screens/dttr.js'
import Quality from './screens/quality.js';
import DefectTracking from './screens/defecttracking.js';

import ProjectReportDetail from "./screens/projectreportdetail.js";
import TimeEntryDetail from "./screens/timeentrydetail.js";
import ExpenseDetail from "./screens/expensedetail.js";
import DTTRDetail from './screens/dttrdetail.js'
import QualityDetail from "./screens/qualitydetail.js";
import DefectTrackingDetail from "./screens/defecttrackingdetail.js";
import Safety from './screens/safety.js'


const Drawer = createDrawerNavigator(
  {
    Login: {screen:Login},
    Dashboard: { screen: Dashboard },
    Welcome: { screen: Welcome },
    ProjectReport: { screen: ProjectReport },
    TimeEntry:{screen: TimeEntry},
    Expense:{screen: Expense},
    DTTR:{screen:DTTR},
    Quality:{screen: Quality},
    DefectTracking:{screen: DefectTracking},
    Safety:{screen:Safety}
  },
  {
    initialRouteName: "Login",
    contentOptions: {
      activeTintColor: "#e91e63"
    },
    contentComponent: props => <SideBar {...props} />
  }
);

const AppNavigator = createStackNavigator(
  {
    Drawer: { screen: Drawer },
    ProjectReportDetail: { screen: ProjectReportDetail },    
    TimeEntryDetail: { screen: TimeEntryDetail },  
    ExpenseDetail: { screen: ExpenseDetail },  
    DTTRDetail:{screen:DTTRDetail},
    QualityDetail: { screen: QualityDetail },  
    DefectTrackingDetail: { screen: DefectTrackingDetail },  
  },
  {
    initialRouteName: "Drawer",
    headerMode: "none"
  }
);

export default () =>
  <Root>
    <AppNavigator />
  </Root>;

