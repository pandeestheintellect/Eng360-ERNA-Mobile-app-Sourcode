const React = require("react-native");
const { Dimensions, Platform } = React;
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

export default {

  bgImageContainer: {
    flex: 1,
    width: null,
    height: null
  },
  logo: {
    width: 100,
    height: 100
  },
  whiteText: {
    color: "white"
  },

  loaderBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040'
  },
  loaderIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around'
  },

  loginLogoContainer: {
    flex: 1,
    marginTop: 30,
    marginBottom: 30,
    alignItems:'center'
  },
  loginFormContainer :
  {
    width:deviceWidth-10,
    alignSelf:"center",
    padding:10,
    marginTop: 10,
    marginBottom: 10,
  },
  loginForm :
  {
    borderRadius:20,
    padding:10,
    backgroundColor: 'rgba(26, 26, 255, 0.4)'
  },
  loginBtn: {
    alignSelf: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    backgroundColor:'#ff5c33' ,
    marginTop:20,
    width: 100,
  },
  welcomeForm :
  {
    borderRadius:20,
    padding:10,
  },
  welcomeText: {
    color: "#D8D8D8",
    bottom: 6,
    marginTop: 5
  },

  sidebarDrawerCover: {
    alignSelf: "stretch",
    height: 110,
    width: null,
    position: "relative",
    marginBottom: 10
  },
  sidebarDrawerImage: {
    
    position: "absolute",
    alignSelf: "center",
    marginTop: 5,
    width: 100,
    height: 100,
    resizeMode: "cover"
  },
  sidebarText: {
    fontWeight: Platform.OS === "ios" ? "500" : "400",
    fontSize: 16,
    marginLeft: 20,
    color: "white"
  },

};
