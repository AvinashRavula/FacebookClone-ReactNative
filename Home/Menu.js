import React from "react";
import { View, Text } from "react-native";
import { Button } from "react-native-elements";
import { SecureStore } from "expo";

export class MenuActivity extends React.Component{

    _logout = () =>{
        SecureStore.deleteItemAsync("user_token")
        .then(() => {
            SecureStore.deleteItemAsync("user_id")
            .then(()=>{
                this.props.screenProps.rootNavigation.navigate('Login');
            })
        })
        .catch(e => console.log("Error in logging out"));
    }
    render(){
        return (
            <View style={{justifyContent:'center', alignItems: 'center',}}>
                <Text>Menus will be fetched sooner...</Text>
                <Button title="Logout" onPress={this._logout}/>
            </View>
        );
    }
}