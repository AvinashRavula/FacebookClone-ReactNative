
import React from 'react';
import {createMaterialTopTabNavigator} from 'react-navigation';
import { HomeActivity } from "./HomePage";
import { Explore_Friends } from "./ExploreFriends";
import {NotificationActivity} from './Notification';
import { MenuActivity } from "./Menu";
import {StatusBar, View, Text, Dimensions, StyleSheet, Image} from 'react-native';
import { Header } from 'react-native-elements';
// import FontAwesome, {Icon} from 'react-native-vector-icons/FontAwesome'
import TabBarItem from 'react-native-vector-icons/FontAwesome';
import Ionicon from "react-native-vector-icons/Ionicons";
import Icon from 'react-native-vector-icons/FontAwesome';

import fontawesome from '@fortawesome/fontawesome'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckSquare, faCoffee } from '@fortawesome/fontawesome-free-solid'

fontawesome.library.add(faCheckSquare, faCoffee);

const fb_color = "#4267b2";
const SCREEN_WIDTH = Dimensions.get('screen').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const MainScreenTabNavigator = createMaterialTopTabNavigator({
	Home: {
		screen: HomeActivity,
		navigationOptions: ({ navigation }) => ({
				tabBarIcon: ({tintColor}) => <TabBarItem size={20} name="feed" color={tintColor}  />
		}),
	},
	ExploreFriends:{
		screen: Explore_Friends,
		navigationOptions: ({ navigation }) => ({
			tabBarIcon: ({tintColor}) => <Ionicon size={30} name="md-people" color={tintColor}  />
		})
	},
	Notification: {
		screen: NotificationActivity,
		navigationOptions: ({ navigation }) => ({
			tabBarIcon: ({tintColor}) => <Ionicon size={30} name="md-notifications" color={tintColor}  />
		})
	},
	Menu: {
		screen: MenuActivity,
		navigationOptions: ({ navigation }) => ({
			tabBarIcon: ({tintColor}) => <Ionicon size={30} name="md-menu" color={tintColor}  />
		})
	},
	},
	{
		animationEnabled:true,
		tabBarOptions:{
			activeTintColor:"#3578e5",
			inactiveTintColor:'black',
			style:{
				backgroundColor:'white',
				
			},
			indicatorStyle: {
				opacity: 0
			},
			showLabel:false,
			showIcon: true,
		},
	});


const ClickableIcon = (props) => {
	return(
		<View style={{margin:10}}>
			<Icon size={30} name={props.name} color={props.color} />
		</View>
	);
}

const HeaderRightComponents = () =>{
	return (
		<View style={{flexDirection:"row"}}> 
			<ClickableIcon size={30} name="search" color="white"/>
			<Image source={require('../assets/messenger_icon_white.png')} style={styles.headerImage}/>
		</View>
	);
}

export class MainScreenActivity extends React.Component{

	static navigationOptions = ({ navigation }) => {
        const {navigate, state} = navigation;
        return {
          title: 'Facebook Clone',
          style:{color:'white'},
          headerTitleStyle : {textAlign: 'center',alignSelf:'center', fontWeight:'normal', color:'white'},
          headerStyle:{
              backgroundColor:fb_color,
		  },
		  headerLeft: <ClickableIcon name="camera" color="white"/>,
		  headerRight: <HeaderRightComponents/>,
        };
    };


	render(){
		console.log("rendering...");
		return (
				<MainScreenTabNavigator screenProps={{rootNavigation: this.props.navigation}}/>
		);
	}
}

const styles = StyleSheet.create({
	headerImage:{
		width:35,
		height:35,
		margin:10,
	}
});