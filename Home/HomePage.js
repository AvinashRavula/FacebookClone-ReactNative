import React, {Component} from 'react'
import {View, StyleSheet, Button, StatusBar, ScrollView,
    Text, AsyncStorage} from 'react-native'
import AllPosts from './Posts';
import { NavigationActions} from 'react-navigation';

const fb_color = '#3B5998';

export default class HomeActivity extends Component{


    // constructor(props){
    //     super(props);
    //     console.log("constructor");
    //     this.intializeAsyncStorageValues();
    // }
    // state = {
    //     auth:null,
    // }
    static navigationOptions = ({ navigation }) => {
        const {navigate, state} = navigation;
        return {
          title: 'Facebook Clone',
          style:{color:'white'},
          headerTitleStyle : {textAlign: 'center',alignSelf:'center', fontWeight:'normal', color:'white'},
          headerStyle:{
              backgroundColor:fb_color,
          },
          headerRight:
              <Button title="Profile" onPress={() => navigate('Profile', {auth:state.params.auth})} />
        };
    };

    _newPost= () =>
    {
        // console.log("new post : userid",state.params.user_id);
        let {navigate, state} = this.props.navigation;
        navigate('CreatePost', {mode:'Add', auth:state.params.auth, user_id:state.params.user_id});
    }

    // intializeAsyncStorageValues = () => {
    //     console.log("intializeAsyncStorageValues called");
    //     let {navigate} = this.props.navigation;
    //     AsyncStorage.multiGet('user_auth', 'user_id').then((auth, user_id)=>
    //     {
    //         console.log(auth, user_id);
    //         if(auth !== null && user_id !== null)
    //             this.setState({auth:auth, user_id:user_id})
    //         else
    //             navigate("Login");
    //     });
    // }

    // componentDidUpdate = () =>{
    //     console.log("componentDidUpdate");
    //     this.intializeAsyncStorageValues();
    // }

    // _logout = () => {
    //     let {navigate} = this.props.navigation;
    //     console.log("Logout called");
    //     AsyncStorage.multiRemove(['user_auth', 'user_id']).then((value) =>{
    //         console.log("in asyncstorage");
    //         navigate('Login');
    //     });
    // }
    render(){
        let {auth, user_id} = this.props.navigation.state.params;
        let {navigate} = this.props.navigation;
        console.log("HomePage render auth : ",auth);
        return (
            <View style={styles.container}>
                <StatusBar hidden={false}/>
                { auth && <ScrollView>
                    <View style={{flexDirection:'row'}}>
                    
                        <Button title="Add Post" onPress={this._newPost}/>
                        <Button title="Explore Friends" 
                            onPress={() => navigate('ExploreFriends', {auth:auth})} 
                        />
                        {/* <Button title="Logout" onPress={this._logout}/> */}
                    </View> 
                    <AllPosts auth={auth} user_id={user_id} navigate={navigate}/> 
                </ScrollView> }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'white',
    }
});
