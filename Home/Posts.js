import React, {Component} from 'react'
import {Alert, View, Text, Image, Dimensions, Button, AsyncStorage} from'react-native'
import {Video} from 'expo';

import { NavigationActions } from 'react-navigation';
import { Sae } from 'react-native-textinput-effects';
import { TextInput } from 'react-native-gesture-handler';
import { Avatar } from 'react-native-elements';
import { ClickableIcon } from "./MainScreen";


const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const IMAGE_SIZE = SCREEN_WIDTH - 80;
const BASE_LINK = "http://192.168.0.5:8000/"
const MEDIA_LINK = BASE_LINK + 'media/'
const fb_color = '#3B5998';
const HOSTNAME = BASE_LINK + "facebook/";
const post_url = HOSTNAME + "posts/"

const Attachment = (props) =>
{
    // console.log(props);
    // console.log("Link ",link);
    const attachment = props.item;
    if(attachment.type.contains('image'))
    {
        return(
                <Image source={{uri:attachment.file}} style={{width:200,height:200}}/>
        );
    }
    else{
        return(
                <Video source={{uri:attachment.file}} rate={1.0}
                  volume={1.0}
                  isMuted={false}
                  resizeMode="cover"
                //   shouldPlay
                  style={{ width: 300, height: 300 }}/>
        );
    }
}


class Post extends Component{
    constructor(props){
        super(props);
    }

    state= {
        showCommentBox:false,
        comment_text:""
    }


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
        this.setState({showCommentBox:true});
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
        Alert.alert("Oops! Our developers are adding this feature");
    }

    _deletePost = () =>
    {
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
                    <View style={{flex:1}}>
                        <Avatar small rounded 
                                onPress={() => console.log("Works!")}
                                source={require('../assets/facebook-logo-black-and-white-png-small.png')}
                                activeOpacity={0.7}/>
                    </View>
                    <View style={{flex:3}}>
                        <Text style={{fontWeight:'bold', color:fb_color}}>{post.first_name} {post.last_name} </Text>
                        {post.tagged_ids ? <Text>is with { post.tagged_ids}</Text> : <Text> added a new post</Text>}
                    </View>
                    <View style={{flex:1}}>
                        <ClickableIcon name="camera" color="white"/>,
                    </View>
                </View>
                
                
                <Text style={{fontSize:20}}>{post.captions}</Text>
                {
                    post.attachments.map((attachment) =>
                    {
                        return <Attachment item={attachment} key={attachment.id}/>
                    })

                }
               <View style={{flexDirection:'row',flex:1}}>
                    { like_state?  <Button title="Unlike" onPress={() => this._like_unlike(0)}/>
                                :  <Button title="Like" onPress={() => this._like_unlike(1)}/> }
                    <Button title="Comment" onPress={this._showCommentBox}/>
                    <Button title="Share" onPress={this._share}/>
                </View>
                { this.state.showCommentBox && this.state.showCommentBox ?
                    <View>
                        <TextInput placeholder="Enter Comment" underlineColorAndroid="transparent"
                                onChangeText={(text) => this.setState({comment_text:text})}
                                style={{color : 'black', paddingBottom : 10,
                                        fontSize : 16, margin:10,}}/>
                        <Button title="Add Comment" onPress={this._comment}/>
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


export default class AllPosts extends Component{

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
