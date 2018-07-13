import React from 'react';
import {View, TextInput, Text, Dimensions, StyleSheet} from 'react-native';
import { Header, Button  } from "react-native-elements";
import { User } from "./ExploreFriends";
import {SecureStore} from 'expo';

const SCREEN_WIDTH = Dimensions.get('screen').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const fb_color = "#4267b2";
const HOSTNAME = "https://swagbook-django.herokuapp.com/facebook/"
const user_search_url = HOSTNAME + "search_users/?query="

const SearchBar = (props)=>{
    return (
        <TextInput
            placeholder="Search..."
            style={{
            height: 60,
            width:SCREEN_WIDTH - 80,
            borderColor: 'white',
            }} 
            onChangeText={(text) => props.searchUser(text)}
            />
    );
}



export class SearchUsers extends React.Component{

    static navigationOptions = ({navigate}) =>({
        header:null
    });

    state={
        user_token :null,
        users:[],
    }

    searchUser = (text) => {
        console.log("Text is ", text);
        let {user_token} = this.state;
        if(user_token != null && text != ''){
            fetch(user_search_url + text,{
                method:'get',
                headers:{
                    Authorization: user_token,
                }
            }).then(function(response) {return response.json()})
            .then((resp_json) =>{
                console.log(resp_json);
                this.setState({users:resp_json});
            }).catch(e => {console.log("Error occured at search api")});
        }
    }

    _remove = (index) => {
        let tempUsers = this.state.users;
        tempUsers.splice(index,1);
        this.setState({users:tempUsers});
    }

    render(){
        let {user_token, users} = this.state;
        let {goBack} = this.props.navigation;
        return(
            <View style={{flex:1}}>
                <View style={{backgroundColor:fb_color, height:20}}/>
                <View style={{backgroundColor:fb_color, flexDirection:'row'}}>
                    <Button icon={{name: 'arrow-left', type: 'font-awesome', color:'white', size:30}}
                            backgroundColor={fb_color} style={{marginTop:10}} 
                            onPress={() => goBack()}/>
                    <SearchBar searchUser={this.searchUser}/>
                </View>
                <View>
                    {
                        users.map((user) =>{
                            return <User user={user} key={user.id} auth={user_token}
                             onRemove={() => this._remove(index)} />
                        })
                    }
                </View>
            </View>
        );
    }

    componentDidMount = () =>{
        SecureStore.getItemAsync("user_token")
        .then((user_token) => {
            console.log("value for user_token is ",user_token);
            if(user_token !== null){
                this.setState((prevState) => ({
                    user_token: user_token,
                }));
            }
        })
        .catch(e => console.log("error at getting secure store", e));
    }
}

const styles= StyleSheet.create({
    text_input: {
        color : 'white',
        paddingBottom : 10,
        fontSize : 16,
        marginTop:10,
    }, 
});