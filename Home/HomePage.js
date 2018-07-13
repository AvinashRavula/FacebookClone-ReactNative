import React, {Component} from 'react'
import {View, StyleSheet, Button, StatusBar, ScrollView, Alert, TouchableHighlight,
    Text, AsyncStorage, Image, TextInput, Dimensions,ActivityIndicator,
    BackHandler } from 'react-native'
import { SecureStore } from "expo";
import AllPosts from './Posts';
import { NavigationActions} from 'react-navigation';
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { Avatar, List, ListItem } from 'react-native-elements';
import {OptimizedFlatList} from 'react-native-optimized-flatlist'
import InfiniteScroll from 'react-native-infinite-scroll';
import { Post } from "./Posts";
// import { TextInput } from 'react-native-gesture-handler';

const IMAGE_SIZE = SCREEN_WIDTH - 80;
const BASE_LINK = "https://swagbook-django.herokuapp.com/"
const MEDIA_LINK = BASE_LINK + 'media/'
const fb_color = "#4267b2";
const HOSTNAME = BASE_LINK + "facebook/";
const post_url = HOSTNAME + "posts/"
const my_profile_url = HOSTNAME + "my_profile/";
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export class HomeActivity extends Component{


    state = {
        user_token:null,
        user_id:null,
        posts:[],
        nextPage:null,
        previousPage:null,
        loading:false,
    }
    constructor(props){
        super(props);
        console.log("constructor");
        // this.intializeAsyncStorageValues();
    }

    _newPost= () =>
    {
        // console.log("new post : userid",state.params.user_id);
        let {user_token, dp,first_name, last_name} = this.state;
        let profilepicture = dp ? dp.image : null;
        let {navigate} = this.props.screenProps.rootNavigation;
        navigate('CreatePost', {mode:'Add', auth:user_token, profilepicture:profilepicture, first_name:first_name, last_name:last_name});
    }

    loadMorePosts = () => {
        console.log("hey am being called");
        this.fetchPosts(this.state.nextPage);
    }
    appendPosts = (new_posts) =>
    {
        let tempPosts = this.state.posts;
        tempPosts = tempPosts.concat(new_posts);
        this.setState({posts:tempPosts});
    }

    fetchPosts = (url) =>
    {
        
        let {user_token} = this.state;
        console.log("auth in fetch posts",user_token);
        console.log(url);
        if(url != null && user_token != null){
            this.setState((prevState) => ({loading:true}));
            fetch(url,{
                method:'GET',
                headers:{
                    Authorization : user_token
                }
            })
            .then(function(response){return response.json()})
            .then((myJson) =>
            {
                console.log(myJson);
                this.setState({
                    nextPage:myJson.next,
                    previousPage:myJson.previous,
                });
                this.appendPosts(myJson.results);
                this.setState((prevState) => ({loading:false}));
                // console.log(this.state.posts);

            })
            .catch(e=>{
                this.setState((prevState) => ({loading:false}));
                console.log(e);
                // Alert.alert("Error at Fetching");
            })
        }
    }

    fetchProfile = () =>{
        let {user_token} = this.state;
        if(user_token != null){
            fetch(my_profile_url, {
                method:'get',
                headers:{
                    Authorization: user_token
                }
            }).then(function(response) { return response.json() })
            .then((myJson) => {
                console.log(myJson);
                myJson = myJson[0];
                if('id' in myJson){
                    let dp_request_method = myJson.profilepicture ? "PUT" : "POST";
                    let cp_request_method = myJson.coverpicture ? "PUT" : "POST";
                    this.setState({loaded:true, error:false});
                    this.setState({
                        user_id:myJson.id,
                        first_name: myJson.first_name,            
                        last_name: myJson.last_name,
                        email: myJson.email,
                        profile_id: myJson.profile.id,
                        nick_name: myJson.profile.nick_name,
                        dob:myJson.profile.dob,
                        phonenum: myJson.profile.phonenum,
                        born_place:myJson.profile.born_place,
                        languages_known: myJson.profile.languages_known,
                        relationship_status:myJson.profile.relationship_status,
                        dp: myJson.profile.profilepicture,
                        cp: myJson.profile.coverpicture,
                        cp_request_method: cp_request_method,
                        dp_request_method: dp_request_method,
                    });
                }
                else{
                    this.setState({loaded:true, error:true});
                }
            }).catch(e => { console.log("ProfileActivity : User Get",e)});
        }
    }

    _refresh = () =>
    {
        console.log("refreshing posts");
        this.setState({posts:[]},this.fetchPosts(post_url));
        // this.fetchPosts(post_url);
    }

    _updateLikes = (index, likes_ids) =>
    {
        let tempPosts = this.state.posts;
        tempPosts[index].likes_ids = likes_ids
        this.setState({posts: tempPosts});
    }
    navigateToProfile = () =>{
        let {navigate} = this.props.screenProps.rootNavigation;
        let {user_token, first_name, last_name, dp,cp,email, dob, phonenum,
            relationship_status, languages_known} = this.state;
        navigate("Profile", {
            auth:user_token,
            user_token:user_token,
            first_name, first_name,
            last_name:last_name,
            dp:dp,
            cp:cp,
            email:email,
            dob:dob,
            phonenum:phonenum,
            relationship_status,relationship_status,
            languages_known:languages_known
        })
    }

    renderHeader = () =>{
        let {dp} = this.state;
        return (
            <TouchableHighlight onPress={this._newPost} 
                    underlayColor="#a8aeb5">
                <View style={styles.status_container}>
                    <View style={styles.dp}>
                        {
                            //Checking whether dp(profile picture) is there for the user...
                            dp ? <Avatar small rounded 
                                    onPress={this.navigateToProfile}
                                    source={{uri:dp.image}}
                                    activeOpacity={0.7}/>
                                :
                                <Avatar small rounded   
                                    onPress={this.navigateToProfile}
                                    source={require('../assets/facebook-logo-black-and-white-png-small.png')}
                                    activeOpacity={0.7}/>
                        }
                    </View>
                    <View style={styles.status_input}>
                        <Text style={{color:'#a8aeb5'}}>Write something here...</Text>
                    </View>
                    <View style={styles.photo_button}>
                        <MaterialIcon size={30} name="photo-library" color="black"/>
                    </View>
                </View>
            </TouchableHighlight>
        );
    }

    renderFooter = () => {
        if (!this.state.loading) return null;
    
        return (
          <View
            style={{
              paddingVertical: 20,
              borderTopWidth: 1,
              borderColor: "#CED0CE"
            }}
          >
            {/* <ActivityIndicator animating size="large" /> */}
          </View>
        );
    };

    onRefresh() {
        console.log('refreshing')
        // this.setState({ isFetching: true }, function() {
        //     this.fetchData()
        // });
    }

    handleBackButton = () => {
        Alert.alert(
            'Exit App',
            'Exiting the application?', [{
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel'
            }, {
                text: 'OK',
                onPress: () => BackHandler.exitApp()
            }, ], {
                cancelable: false
            }
        )
        return true;
    } 

    render(){
        let {user_token, user_id} = this.state;
        console.log(user_token, user_id);
        let {navigate} = this.props.screenProps.rootNavigation;
        
        return(
            <View style={styles.container}>
                <StatusBar hidden={false}/>
                    { user_token && user_id? 
                        <OptimizedFlatList
                            data={this.state.posts}
                            renderItem={({ item, index }) => (
                                <Post post={item} key={item.id} post_index={index}
                                    user_id= {user_id} auth_token={user_token} navigate={navigate}
                                    updateLikes={this._updateLikes}/>
                            )}
                            keyExtractor={item => item.id.toString()}
                            ListHeaderComponent={this.renderHeader}
                            ListFooterComponent={this.renderFooter}
                            refreshing={this.state.loading}
                            onRefresh={() => this._refresh()}
                            onEndReached={this.loadMorePosts}
                            onEndReachedThreshold={0}
                    /> : <ActivityIndicator animating size="large" />}
                    {/* { user_token ? <View>
                        <AllPosts auth={user_token} user_id={user_id} navigate={navigate}/> 
                    </View> : <Text>Loading... the posts....</Text>} */}
                
            </View>
        );
    }

    componentDidMount = () =>{
        BackHandler.addEventListener("hardwareBackPress",this.handleBackButton);
        SecureStore.getItemAsync("user_token")
        .then((user_token) => {
            console.log("value for user_token is ",user_token);
            if(user_token !== null){
                this.setState((prevState) => ({
                    user_token: user_token,
                }));
                this.fetchProfile();
                this._refresh();
                }
        })
        .catch(e => console.log("error at getting secure store", e));
    }
    componentWillUnmount = () =>{
        console.log("componentWillUnmount called in HomePage");
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
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
