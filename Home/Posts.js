import React, {Component} from 'react'
import {Alert, View, Text, Image, Dimensions, AsyncStorage} from'react-native'
import {Video} from 'expo';

import { NavigationActions } from 'react-navigation';
import { Sae } from 'react-native-textinput-effects';
import { TextInput, FlatList } from 'react-native-gesture-handler';
import { Avatar, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';


const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const IMAGE_SIZE = SCREEN_WIDTH - 80;
const BASE_LINK = "https://swagbook-django.herokuapp.com/"
const MEDIA_LINK = BASE_LINK + 'media/'
const fb_color = "#4267b2";
const HOSTNAME = BASE_LINK + "facebook/";
const post_url = HOSTNAME + "posts/"

const ClickableIcon = (props) => {
	return(
		<View style={{margin:10}}>
			<Icon size={30} name={props.name} color={props.color} />
		</View>
	);
}

class Attachment extends Component{
    
    // console.log(props);
    // console.log("Link ",link);
    videoRef = null;
    state= {
        shouldPlayVideo:false
    }

    onReady = () =>{
        console.log("onready");
        this.setState({shouldPlayVideo:true});
    }

    

    render(){
        let attachment = this.props.item;
       return(
        attachment.type.contains('image') ?
            <Image source={{uri:attachment.file}} style={{width:SCREEN_WIDTH, height:SCREEN_WIDTH}}/> 
            :
            <Video source={{uri:attachment.file}} rate={1.0}
                    volume={1.0}
                    isMuted={false}
                    resizeMode="cover"
                    useNativeControls
                    isLooping
                    // shouldPlay={this.state.shouldPlayVideo}
                    // onReadyForDisplay={
                    //     this.onReady
                    // }
                    style={{ width: SCREEN_WIDTH, height: SCREEN_WIDTH }}/>
       );
    }
}


export class Post extends Component{
    constructor(props){
        super(props);
    }

    state= {
        showCommentBox:false,
        comment_text:""
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

    _like_unlike = (operation) =>
    {
        let {post,post_index, auth_token} = this.props;
        url = ""
        if (operation == 1){
            url = HOSTNAME + "posts/" + post.id + "/like";
        }
        else{
            url = HOSTNAME + "posts/" + post.id + "/unlike";
        }
        fetch(url,{
            method:'PUT',
            headers:{
                Authorization : auth_token
            }
        }).then(function(response){return response.json()})
        .then((response_json) => {
            if ('id' in response_json){
                this.props.updateLikes(post_index,response_json.likes_ids);
                console.log("Thanks for liking");
            }
            else{
                console.log("Like Operation failed");
            }
        }).catch(e => console.log(e));
    }



    _showCommentBox = () =>
    {
        this.setState((prevState) => ({showCommentBox:!prevState.showCommentBox}));
    }

    _comment = () =>
    {
        let {auth_token, post} = this.props;
        url = HOSTNAME + "comments/";
        fetch(url,{
            method:'post',
            headers:{
                Accept:'application/json',
                'Content-Type':'application/json',
                Authorization:auth_token
            },
            body:JSON.stringify({
                comment_text:this.state.comment_text,
                post:post.id
            })
        }).then(function(response) {return response.json()})
        .then((response_json) => {
            console.log(response_json);
            if ('id' in response_json)
            {
                console.log("Comment added");
                this.setState({showCommentBox:false});
            }
            else{
                console.log("Comment adding failed");
            }
        }).catch(e=> console.log(e));
    }

    _share = () =>  
    {
        Alert.alert("Oops! This feature is under development");
    }

    _deletePost = () =>
    {
        this.hideMenu();
        let {post, auth_token} = this.props;
        fetch(post_url + post.id + '/' ,{
            method:'delete',
            headers:{
                Authorization : auth_token
            }
        })
        .then(function(response) { if (response.ok){Alert.alert("Deleted")}})
        .catch(e=>{console.log('Error in deleting the post')});
    }

    _editPost = () =>
    {
        this.hideMenu();
        let {auth_token, navigate} = this.props;
        navigate('CreatePost',{post_id:this.props.post.id, mode:'Edit', auth:auth_token});
    }

    render(){
        let {post, user_id} = this.props;
        let likes_ids = post.likes_ids? post.likes_ids.split(',') : [];
        let like_state = likes_ids.indexOf(user_id.toString()) >= 0;
        return(
             user_id && <View style={{marginTop:10, backgroundColor:'white'}}>
                {/* <View style={{flexDirection:'row'}}>
                    <Button title="Delete" style={{width:20,height:20, fontSize:20}}
                                onPress={this._deletePost}/>
                    <Button title="Edit" style={{width:20,height:20, fontSize:20}}
                                onPress={this._editPost}/>
                </View> */}
                <View style={{flexDirection:'row', margin:10}}>
                    <View style={{flex:1, marginLeft:10,marginTop:5}}>
                    {
                        post.profile_picture ? 
                                <Avatar small rounded 
                                        onPress={() => console.log("Works!")}
                                        source={{uri:MEDIA_LINK + post.profile_picture }}
                                        activeOpacity={0.7}/>
                                :
                                <Avatar small rounded 
                                        onPress={() => console.log("Works!")}
                                        source={require('../assets/facebook-logo-black-and-white-png-small.png')}
                                        activeOpacity={0.7}/>
                    }
                    </View>
                    <View style={{flex:3}}>
                        <Text style={{fontWeight:'bold', color:fb_color}}>{post.first_name} {post.last_name} </Text>
                        {post.tagged_ids ? <Text>is with { post.tagged_ids}</Text> : <Text> added a new post</Text>}
                    </View>
                    <View style={{flex:0.5, height:10, justifyContent:'center', alignItems:'center'}}>
                    { post.user == user_id ? <Menu
                            ref={this.setMenuRef}
                            button={ <Text onPress={this.showMenu} 
                                        style={{fontSize:40}}>...</Text>}>
                                <MenuItem onPress={this._editPost}>Edit</MenuItem>
                                <MenuItem onPress={this._deletePost}>Delete</MenuItem>
                        </Menu> : null }
                    </View>
                </View>
                <View style={{margin:10}}>
                    <Text style={{fontSize:20}}>{post.captions}</Text>
                </View>
                {
                    post.attachments.map((attachment) =>
                    {
                        return <Attachment item={attachment} key={attachment.id}/>
                    })

                }
                <View style={{flexDirection:'row',alignItems:'flex-start', margin:10}}>
                    <Text style={{flex:1, marginLeft:10}}>
                    { post.likes_ids ? post.likes_ids.split(",").length + " Likes" : "Be the first to like"}
                    </Text>
                    <View style={{flex:1,alignItems:'flex-end'}}>
                        <Text style={{marginRight:10}}>{post.comments ? post.comments.length + " Comments" : "No Comments"}</Text>
                    </View>
                </View>
               <View style={{flexDirection:'row', borderBottomColor:'#a8aeb5', borderTopColor:'#a8aeb5', borderWidth:1}}>
                    <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                        { like_state?  <Button title="Like" onPress={() => this._like_unlike(0)}
                                            color="#3578e5" backgroundColor="white"
                                            icon={{name: 'thumbsup', type: 'octicon', color:'#3578e5'}}/>
                                :  <Button title="Like" onPress={() => this._like_unlike(1)}
                                        color="black" backgroundColor="white"
                                        icon={{name: 'thumbsup', type: 'octicon', color:'black'}}/> }
                    </View>
                    <View style={{flex:1}}>
                        <Button title="Comment" color="black" backgroundColor="white"
                             onPress={this._showCommentBox} icon={{name: 'comment', type: 'octicon', color:'black'}}/>
                    </View>
                    <View style={{flex:1}}>
                        <Button title="Share" onPress={this._share} color="black"
                                 backgroundColor="white" icon={{name: 'share', type: 'font-awesome', color:'black'}}/>
                    </View>
                </View>
                { this.state.showCommentBox && this.state.showCommentBox ?
                    <View style={{marginBottom:10}}>
                        <TextInput placeholder="Enter Comment" underlineColorAndroid="transparent"
                                onChangeText={(text) => this.setState({comment_text:text})}
                                style={{color : 'black', paddingBottom : 10,
                                        fontSize : 16, margin:10,}}/>
                        <Button title="Add Comment" onPress={this._comment} backgroundColor={fb_color} color="white"/>
                    </View> : null }
            </View>

        );
    }
}


// const Posts = (props) => {
//     let {postItems, navigate} = props;
//     return(
//         <View style={{margin:20}}>
//         {
//             postItems && postItems.map((post) =>
//                 <Post post={post} key={post.id}
//                         navigate={navigate}
//                         auth_token={props.auth_token}/>
//             )
//         }
//         </View>
//     );
// }


export class AllPosts extends Component{

    state = {
        posts:[],
        nextPage:null,
        previousPage:null,
    }

    appendPosts = (new_posts) =>
    {
        let tempPosts = this.state.posts;
        tempPosts = tempPosts.concat(new_posts);
        this.setState({posts:tempPosts});
    }

    fetchPosts = (url) =>
    {
        let {auth} = this.props;
        console.log("auth in fetch posts",auth);
        console.log(url);
        fetch(url,{
            method:'GET',
            headers:{
                Authorization : auth
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
            // console.log(this.state.posts);

        })
        .catch(e=>{console.log(e);Alert.alert("Error at Fetching");})
    }

    componentDidMount(){
        console.log("componentDidMount called");
        this._refresh();
    }

    _refresh = () =>
    {
        console.log("refreshing posts");
        this.setState({posts:[]},this.fetchPosts(post_url))
        // this.fetchPosts(post_url);
    }

    _updateLikes = (index, likes_ids) =>
    {
        let tempPosts = this.state.posts;
        tempPosts[index].likes_ids = likes_ids
        this.setState({posts: tempPosts});
    }

    

    render(){
        let {posts} = this.state;
        let {user_id, auth, navigate} = this.props;
        return (
            // <View>
            //     <Button title="Refresh" onPress={this._refresh}/>
            //     {posts && posts ? <Posts postItems={posts}
            //         navigate={this.props.navigate}
            //         auth_token={this.props.auth_token}/> : <Text>Avinash</Text>
            //     }
            // </View>
             <View>
                {/* <Button title="Refresh" onPress={this._refresh}/> */}
                
                {
                    posts && posts ? posts.map((post, index) =>
                        <Post post={post} key={post.id} post_index={index}
                                user_id= {user_id} auth_token={auth} navigate={navigate}
                                updateLikes={this._updateLikes}/>
                    ) : <Text> Loading.. </Text>
                }
             </View>
        );
    }
}
