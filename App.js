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
import HomeActivity from './Home/HomePage';
import { ProfileActivity, EditProfileActivity } from "./Home/Profile";
import { FriendsActivity } from './Home/Friends'
import {Explore_Friends} from './Home/ExploreFriends'

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
		Home:{screen:HomeActivity},
		CreatePost: {screen: NewPost},
		Profile: {screen: ProfileActivity},
		EditProfile: {screen: EditProfileActivity},
		Friends: {screen: FriendsActivity},
		ExploreFriends:{screen: Explore_Friends},
		},
		{
		navigationOptions: {
			headerVisible: true,
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
