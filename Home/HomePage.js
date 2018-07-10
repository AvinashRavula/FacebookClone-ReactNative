import React, {Component} from 'react'
import {View, StyleSheet, Button, StatusBar, ScrollView, Alert, TouchableHighlight,
    Text, AsyncStorage, Image, TextInput, Dimensions,ActivityIndicator,
    FlatList } from 'react-native'
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
const BASE_LINK = "http://192.168.0.5:8000/"
const MEDIA_LINK = BASE_LINK + 'media/'
const fb_color = "#4267b2";
const HOSTNAME = BASE_LINK + "facebook/";
const post_url = HOSTNAME + "posts/"
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
        let {user_token, user_id} = this.state;
        let {navigate} = this.props.screenProps.rootNavigation;
        navigate('CreatePost', {mode:'Add', auth:user_token, user_id:user_id});
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

    renderHeader = () =>{
        let {navigate} = this.props.screenProps.rootNavigation;
        let {user_token} = this.state;
        return (
            <TouchableHighlight onPress={this._newPost} 
                    underlayColor="#a8aeb5">
                <View style={styles.status_container}>
                    <View style={styles.dp}>
                        <Avatar small rounded 
                                onPress={() => navigate("Profile", {auth:user_token})}
                                source={require('../assets/facebook-logo-black-and-white-png-small.png')}
                                activeOpacity={0.7}/>
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

    render(){
        let {user_token, user_id} = this.state;
        let {navigate} = this.props.screenProps.rootNavigation;
        return(
            <View style={styles.container}>
                <StatusBar hidden={false}/>
                    { user_token ? 
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
        SecureStore.getItemAsync("user_token")
        .then((user_token) => {
            console.log("value for user_token is ",user_token);
            if(user_token !== null){
                SecureStore.getItemAsync("user_id")
                .then((user_id) => {
                    console.log("value for user_id is ", user_id);
                    if(user_id !== null){
                        this.setState((prevState) => ({
                            user_token: user_token,
                            user_id: parseInt(user_id)
                        })); 
                        this._refresh();
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
