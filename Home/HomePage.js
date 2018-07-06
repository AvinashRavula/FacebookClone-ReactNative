import React, {Component} from 'react'
import {View, StyleSheet, Button, StatusBar, ScrollView, Alert, TouchableHighlight,
    Text, AsyncStorage, Image, TextInput} from 'react-native'
import { SecureStore } from "expo";
import AllPosts from './Posts';
import { NavigationActions} from 'react-navigation';
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { Avatar } from 'react-native-elements';
// import { TextInput } from 'react-native-gesture-handler';

const fb_color = '#4267b2';

export class HomeActivity extends Component{


    state = {
        user_token:null,
        user_id:null,
    }
    constructor(props){
        super(props);
        console.log("constructor");
        // this.intializeAsyncStorageValues();
    }
    // state = {
    //     auth:null,
    // }
    // static navigationOptions = ({ navigation }) => {
    //     const {navigate, state} = navigation;
    //     return {
    //       title: 'Facebook Clone',
    //       style:{color:'white'},
    //       headerTitleStyle : {textAlign: 'center',alignSelf:'center', fontWeight:'normal', color:'white'},
    //       headerStyle:{
    //           backgroundColor:fb_color,
    //       },
    //       headerRight:
    //           <Button title="Profile" onPress={() => navigate('Profile', {auth:state.params.auth})} />
    //     };
    // };

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
    // render(){
    //     let {auth, user_id} = this.props.navigation.state.params;
    //     let {navigate} = this.props.navigation;
    //     console.log("HomePage render auth : ",auth);
    //     return (
    //         <View style={styles.container}>
    //             <StatusBar hidden={false}/>
    //             { auth && <ScrollView>
    //                 <View style={{flexDirection:'row'}}>
                    
    //                     <Button title="Add Post" onPress={this._newPost}/>
    //                     <Button title="Explore Friends" 
    //                         onPress={() => navigate('ExploreFriends', {auth:auth})} 
    //                     />
    //                     {/* <Button title="Logout" onPress={this._logout}/> */}
    //                 </View> 
    //                 <AllPosts auth={auth} user_id={user_id} navigate={navigate}/> 
    //             </ScrollView> }
    //         </View>
    //     );
    // }

    render(){
        let {user_token, user_id} = this.state;
        let {navigate} = this.props.navigation;
        return(
            <View style={styles.container}>
            <ScrollView>
                <StatusBar hidden={false}/>
                    <TouchableHighlight onPress={this._newPost} 
                            underlayColor="#a8aeb5">
                        <View style={styles.status_container}>
                            <View style={styles.dp}>
                                <Avatar small rounded 
                                        onPress={() => console.log("Works!")}
                                        source={require('../assets/facebook-logo-black-and-white-png-small.png')}
                                        activeOpacity={0.7}/>
                            </View>
                            <View style={styles.status_input}>
                                <Text style={{color:'#a8aeb5'}}>Write something here...</Text>
                            </View>
                            <View style={styles.photo_button}>
                                <MaterialIcon size={30} name="photo-library" color="black"/>
                                {/* <Avatar small 
                                        onPress={() => console.log("Hey it works!")}
                                        // source={require('../assets/facebook-logo-black-and-white-png-small.png')}
                                        icon={{name:'photo-library'}}
                                        activeOpacity={0.7}/> */}
                            </View>
                        </View>
                    </TouchableHighlight>
                    { user_token ? <View>
                        <AllPosts auth={user_token} user_id={user_id} navigate={navigate}/> 
                    </View> : <Text>Loading... the posts....</Text>}
                </ScrollView>
            </View>
        );
    }

    componentDidMount = () =>{
        SecureStore.getItemAsync("user_token")
        .then((user_token) => {
            console.log("value for user_token is ",user_token);
            if(user_token !== null){
                SecureStore.getItemAsync("user_id")
                .then((user_id) => {
                    console.log("value for user_id is ", user_id);
                    if(user_id !== null){
                        this.setState({user_token: user_token, user_id: parseInt(user_id)});
                    }
                })
            }
        })
        .catch(e => console.log("error at getting secure store", e));
    }
}


const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#a8aeb5',
    },
    dp:{
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    photo_button:{
        flex:1,
        margin:10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    status_input:{
        flex:3,
        margin:10,
        justifyContent:'center',
        alignItems:'center',
        borderColor:'#a8aeb5',
        borderWidth: 1,
        borderRadius: 50,
    },
    status_container:{
        flexDirection: 'row',
        height:75,
        backgroundColor:'white'
    },
});
