import React from 'react';
import { StyleSheet, Text, View, Alert, Route, StatusBar, AsyncStorage } from 'react-native';
// import { Navigator } from 'react-native-deprecated-custom-components';
import LoginForm from './Authentication/Login';
import SignupForm from './Authentication/Signup';
import ForgotPasswordForm from './Authentication/ForgotPassword';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import Home from './Home/NewPost';
import { Switch } from 'react-native-gesture-handler';
import {
  createStackNavigator
} from 'react-navigation';
import NewPost from './Home/NewPost';

import { ProfileActivity, EditProfileActivity } from "./Home/Profile";
import { FriendsActivity } from './Home/Friends'
// import  createMaterialTopTabNavigator  from "./Home/MainScreen";

// import MainScreenTabNavigator from "./Home/MainScreen";
import { HomeActivity } from "./Home/HomePage";
import { Explore_Friends } from "./Home/ExploreFriends";
import {NotificationActivity} from './Home/Notification';
import { MenuActivity } from "./Home/Menu";
import {createMaterialTopTabNavigator} from 'react-navigation';
import { MainScreenActivity } from './Home/MainScreen';
import {StartUpScreen} from './Home/StartUpScreen';
import { SearchUsers } from "./Home/SearchUsers";
import { MessengerActivity } from "./Home/Messenger";
import Icon from 'react-native-vector-icons/FontAwesome'; 

const LoginAuthContext = React.createContext(null);
const LoginUserIdContext = React.createContext(null);


export default class App extends React.Component {

	state = {
		isLoggedIn : false,
	}

	_menu = null;
 
	setMenuRef = ref => {
        console.log("setMenuRef");
        this._menu = ref;
    };
    
    hideMenu = () => {
        console.log("hideMenu");
        this._menu.hide();
    };
    
    showMenu = () => {
        console.log("showMenu");
        this._menu.show();
    };

	MyRoute = createStackNavigator({
		StartScreen:{ screen:StartUpScreen},
		Login:  { screen: LoginForm },
		Signup: { screen: SignupForm },
		ForgotPassword : {screen: ForgotPasswordForm},
		MainScreen: { screen: MainScreenActivity },
		Home:{screen:HomeActivity},
		CreatePost: {screen: NewPost},
		Profile: {screen: ProfileActivity},
		EditProfile: {screen: EditProfileActivity},
		Friends: {screen: FriendsActivity},
		ExploreFriends:{screen: Explore_Friends},
		Search: { screen: SearchUsers},
		Messenger: {screen : MessengerActivity},
		}
		,
		{
		navigationOptions: {
			headerVisible: false,
		}
	});

	updateLogin = (isLoggedIn) =>
	{
		this.setState({isLoggedIn})
	//  Alert.alert("UpdateLogin" + this.state.isLoggedIn);
	}


  render() {
    return (
			<LoginAuthContext.Provider>
				<this.MyRoute/>
			</LoginAuthContext.Provider>
			// <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
			// 	<Menu
			// 	ref={this.setMenuRef}
			// 	button={<Text onPress={this.showMenu}>Show menu</Text>}
			// 	>
			// 		<MenuItem onPress={this.hideMenu}>Menu item 1</MenuItem>
			// 		<MenuItem onPress={this.hideMenu}>Menu item 2</MenuItem>
			// 		<MenuItem onPress={this.hideMenu} disabled>
			// 			Menu item 3
			// 		</MenuItem>
			// 		<MenuDivider />
			// 		<MenuItem onPress={this.hideMenu}>Menu item 4</MenuItem>
			// 	</Menu>
			// </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// export class MainScreenActivity extends React.Component{

//     render() {
//         return (
//             // <ViewPagerAndroid
//             //     style={styles.viewPager}
//             //     initialPage={4}>
//             //     <View style={styles.pageStyle} key="1">
//             //         <Text>First page</Text>
//             //     </View>
//             //     <View style={styles.pageStyle} key="2">
//             //         <Text>Second page</Text>
//             //     </View>
// 			// </ViewPagerAndroid>
// 			<createMaterialTopTabNavigator/>
//         );
//     }
// }

// const styles = {
//     viewPager: {
//       flex: 1
//     },
//     pageStyle: {
//       alignItems: 'center',
//       padding: 20,
//     }
// };
//   // 
