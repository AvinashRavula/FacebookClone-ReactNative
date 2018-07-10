import React, { Component } from "react";
import {View, Image, Dimensions} from 'react-native';
import {SecureStore} from 'expo';

const fb_color = "#4267b2";
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export class StartUpScreen extends Component{

    static navigationOptions = {
        header: null
    }

    render()
    {
        return(
            <View style={{backgroundColor:fb_color, justifyContent:'center', alignItems:'center',
                            height:SCREEN_HEIGHT}}>
                <Image source={require('../assets/facebook-logo-black-and-white-png-small.png')}/>
            </View>
        );
    }

    componentDidMount = () =>{
        SecureStore.getItemAsync("user_token")
        .then((user_token) => {
            console.log("value for user_token is ",user_token);
            if(user_token !== null){
                this.props.navigation.navigate('MainScreen');
            }
            else{
                this.props.navigation.navigate('Login');
            }
        })
        .catch(e => {
            console.log("error at getting secure store", e);
            this.props.navigation.navigate('Login')
        });
    }
}