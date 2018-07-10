import React, {Component} from 'react'
import {Text, StyleSheet, View, Image, Dimensions,
   Alert, StatusBar, ScrollView, ToastAndroid, AsyncStorage} from 'react-native'
import { Avatar, Button } from 'react-native-elements';
import {DocumentPicker, ImagePicker, Video} from 'expo';
import { TextInput } from 'react-native-gesture-handler';


const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const IMAGE_SIZE = SCREEN_WIDTH - 80;
const BASE_LINK = "http://192.168.0.5:8000/"
const HOSTNAME =  BASE_LINK + "facebook/"
const post_url = HOSTNAME + "posts/"
const file_url = HOSTNAME + "files/"
const MEDIA_URL = BASE_LINK + "media/"
const fb_color = "#4267b2";

class NewPost extends Component{

    constructor(props){
      super(props);
    }

    static navigationOptions = ({ navigation }) => {
        const {navigate, state} = navigation;
        return {
            title: 'Create Post',
            style:{color:'white'},
            headerTitleStyle : {textAlign: 'center',alignSelf:'center', fontWeight:'normal', color:'white'},
            headerStyle:{
                backgroundColor:fb_color,
            }
        };
    };

    state = {
        files: [],
        captions:'',
        tagged_ids:null,
        likes_ids:null,
    };

     _pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 4],
        mediaTypes:ImagePicker.MediaTypeOptions.Images
      });

      if (!result.cancelled) {
        let tempFiles = this.state.files;
        tempFiles.push(result);
        this.setState({ files : tempFiles });
        // this.setState({ file: result.uri, type: result.type, file_modified:true });
      }
    };

    _pickVideo = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        // aspect: [4, 4],
        mediaTypes:ImagePicker.MediaTypeOptions.Videos
      });

      // alert(result.uri);
      // console.log(result)

      if (!result.cancelled) {
        let tempFiles = this.state.files;
        tempFiles.push(result);
        this.setState({ files : tempFiles });
        // this.setState({ file: result.uri,type:result.type, file_modified:true });
      }
    };

    upload = () =>
    {
      // if(this.state.image == null)
      // console.log("user_id", this.props.navigation.state.params.user_id);
      let {auth, user_id} = this.props.navigation.state.params;
      // postFormData.append('user',user_id);
      fetch(post_url, {
        method:'post',
        body:JSON.stringify({
          captions:this.state.captions
        }),
        headers:{
          'Accept':'application/json',
          'Content-Type':'application/json',
          Authorization : auth
        }
      }).then(function(response){  return response.json()})
      .then((myJson) =>{
        console.log('post response in new post ',myJson)
        if ('id' in myJson){
          // if(this.state.files.length > 0){
            this.state.files.map((file) =>{
              let filename = file.uri.substring(file.uri.lastIndexOf("/"), file.uri.length);
              let fileExt = filename.substring(filename.lastIndexOf('.') + 1,filename.length);
              let fileType = ''+ file.type+'/'+fileExt;
              var data = new FormData();
              data.append('file', {uri: file.uri,name: filename, type:fileType});
              data.append('type', fileType);
              data.append('post', myJson.id);
              // console.log(data);
              fetch(file_url,{
                method:"POST",
                body: data,
                headers:{
                  'Accept': 'application/json',
                  'Content-Type': 'multipart/form-data',
                  Authorization : auth
                }
              })
              .then((function(response){return response.json()}))
              .then((myJson) => {
                // if ('id' in myJson){
                //   Alert.alert('Posted Along with file');
                // }
                // else{
                //   Alert.alert('Error Posting with file');
                // }
                console.log("upload",myJson)})
              .catch(e=>{console.log('upload error',e)});
            })
          // }
          // else{
            Alert.alert("Posted");
          // }
        }
        else{
          Alert.alert("failed to create a post");
        }
      }).catch(e => { console.log("POST", e)})

    }

    updatePost = () =>
    {
      console.log("updatepost called");
      let {post_id, auth} = this.props.navigation.state.params;
      var formData = new FormData();
      formData.append('captions',this.state.captions);
      formData.append('tagged_ids',this.state.tagged_ids);
      // formData.append('likes_ids',this.state.likes_ids);
      let postJsonData = {'captions':this.state.captions,'tagged_ids':this.state.tagged_ids,
                          'likes_ids':this.state.likes_ids};
      console.log(postJsonData);
      fetch(post_url + post_id + '/', {
        method:'put',
        headers:{
          Accept : 'application/json',
          'Content-Type': 'application/json',
          Authorization: auth
        },
        body : JSON.stringify({
          captions: this.state.captions,
          tagged_ids: this.state.tagged_ids,
          likes_ids: this.state.likes_ids
        })
      })
      .then(function(response){ return response.json()})
      .then((myJson) => {
            // console.log(myJson);
          // if (this.state.files.length > 0){
            
            this.state.files.map((file) => {
              if(!file.id && !file.deleted){
                let filename = file.uri.substring(file.uri.lastIndexOf("/"),
                                    file.uri.length);
                let fileExt = filename.substring(filename.lastIndexOf('.') + 1,filename.length);
                let fileType = ''+file.type+'/'+fileExt;
                var data = new FormData();
                data.append('file', {uri: file.uri,name: filename, type:fileType});
                data.append('type', fileType);
                data.append('post', post_id);
                fetch(file_url, {
                  method:'post',
                  headers:{
                    Authorization: auth
                  },
                  body : data,
                })
                .then(function(response) {return response.json()})
                .then((myJson) => {console.log(myJson)})
                .catch(e => {console.log("Error updating attachment", e)});
              }
              else if(file.deleted){
                fetch(file_url + file.id + '/', {
                  method:'delete',
                  headers:{
                    Authorization: auth
                  },
                })
                .then(function(response) {
                  if( response.ok)
                  {
                    ToastAndroid.show("Deleted");
                  }
                })
                .catch(e => {console.log("Error updating attachment", e)});
              }
          })
        if('id' in myJson){
          Alert.alert("Updated");
        }

      }).catch(e => {console.log("post not updated ", e)});
    }

    componentDidMount(){
        let {mode, post_id, auth} = this.props.navigation.state.params;
        if(post_id && mode && auth){
          if (mode == 'Edit'){
            fetch(post_url + post_id + '/',{
              method:'get',
              headers:{
                Authorization: auth
              }
            })
            .then(function(response){return response.json()})
            .then((myJson) => {
              console.log(myJson);
              this.setState({captions:myJson.captions,likes_ids:myJson.likes_ids,
                            tagged_ids:myJson.tagged_ids });
              myJson.attachments.map((attachment) =>
              {
                // console.log("file : ",attachment);
                // splitted_attachment = attachment.split(" : ");
                jsonObject = {id:attachment.id, uri: attachment.file,
                              type: attachment.type};
                let tempFiles = this.state.files;
                tempFiles.push(jsonObject);
                this.setState({ files : tempFiles });
              })
              // if(myJson.attachments.length > 0){
              //   splitted_attachment = myJson.attachments[0].split(" : ");
              //   this.setState({ captions:myJson.captions,
              //       file:MEDIA_URL + splitted_attachment[1], type:splitted_attachment[2]})
              // }
            })
            .catch(e => console.log(e));
          }
       }
    }

    deleteFile = (fileIndex) =>
    {
      tempFiles = this.state.files;
      tempFiles[fileIndex]['deleted'] = true;
      this.setState({files:tempFiles});
    }

    render() {
           let { files } = this.state;
           let {mode, profilepicture, first_name, last_name} = this.props.navigation.state.params;
      return (
        // this.props.navigation.state.params.auth ?
        <View style={styles.container}>
          <ScrollView>
          <StatusBar hidden={false}/>
            <View style={{flexDirection:'row', marginTop:15}}>
                <View style={styles.dp}>
                    { profilepicture ?         
                        <Avatar small rounded 
                                onPress={() => console.log("Works!")}
                                source={require('../assets/facebook-logo-black-and-white-png-small.png')}
                                activeOpacity={0.7}/>
                        :   <Avatar small rounded 
                                onPress={() => console.log("Works!")}
                                source={require('../assets/facebook-logo-black-and-white-png-small.png')}
                                activeOpacity={0.7}/>
                    }
                </View>
                <Text style={{flex:4, fontWeight:'bold'}}>{first_name + " " + last_name}</Text>
            </View>
            <TextInput multiline={true} defaultValue={this.state.captions}
                style={{width:SCREEN_WIDTH-20,height:150, fontSize:20, margin:10, marginTop:0}}
                onChangeText={(text) => this.setState({captions:text})}
                placeholder="Whats on your mind.."/>
            <View style={{flexDirection:'row',marginTop: 10, width:SCREEN_WIDTH, justifyContent:'center', alignItems:'center'}}>
                <Button title="Add Image" onPress={this._pickImage} color={fb_color}
                        backgroundColor="white" style={{flex:1}} />
                <Button
                  title={"Add Video"} color={fb_color} backgroundColor={"white"} 
                  onPress={this._pickVideo} style={{flex:1}}
                />
            </View>
            {/* <View style={{'margin': 20}}>        */}

              { files.map((file, index) =>

                {
                  if (file.type.contains('image') && !file.deleted){

                    return (
                      <View key={index} style={{margin:20, justifyContent:'center',alignItems:'center'}}>
                        <Button title="Delete" onPress={() => this.deleteFile(index)}/>
                        <Image source={{ uri: file.uri }}
                          style={{width: SCREEN_WIDTH, height: SCREEN_WIDTH }} />
                      </View>
                    )
                  }
                  else if(file.type.contains('video') && !file.deleted){
                    return (
                      <View key={index} style={{margin:20, justifyContent:'center',alignItems:'center'}}>
                        <Button title="Delete" onPress={() => this.deleteFile(index)}/>
                        <Video
                          source={{ uri: file.uri }}
                          rate={1.0}
                          volume={1.0}
                          isMuted={false}
                          resizeMode="cover"
                          shouldPlay
                          style={{width: SCREEN_WIDTH, height: SCREEN_WIDTH }}
                        />
                      </View>
                     )
                  }
                }
              )
              }
              <View style={{marginBottom:20}}>
              {
                mode == 'Edit' ?
                  <Button title="Update Post" onPress={this.updatePost} backgroundColor={fb_color}/>
                  :
                  <Button title="Add Post" onPress={this.upload} backgroundColor={fb_color}/>
              }
              </View>
          </ScrollView>
        </View>
      );
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    dp:{
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
        margin:0,
    },
  });

export default NewPost
