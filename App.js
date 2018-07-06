import React from 'react';
import { StyleSheet, Text, View, Alert, Route, StatusBar, AsyncStorage } from 'react-native';
// import { Navigator } from 'react-native-deprecated-custom-components';
import LoginForm from './Authentication/Login';
import SignupForm from './Authentication/Signup';
import ForgotPasswordForm from './Authentication/ForgotPassword';
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
import Icon from 'react-native-vector-icons/FontAwesome';


/* FontAwesome Packages*/
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStroopwafel } from '@fortawesome/free-solid-svg-icons'

library.add(faStroopwafel)

/* FontAwesome Packages */ 

const LoginAuthContext = React.createContext(null);
const LoginUserIdContext = React.createContext(null);


export default class App extends React.Component {

	state = {
		isLoggedIn : false,
	}

	MyRoute = createStackNavigator({
		
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
