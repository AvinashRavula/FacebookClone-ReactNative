import React from 'react';
import {View, StyleSheet, Image, Text, ScrollView, Button,
    ToastAndroid} from 'react-native';
import {AsyncStorage} from 'react-native';

const HOSTNAME = "http://192.168.0.5:8000/facebook/"


class UserRequest extends React.Component{

  state= {
    accepted:false,
  }
  styles = StyleSheet.create({
    row_container:{
      flexDirection:'row'
    },
    profile_picture:{
      width:100,
      height:100,
    },
    user_name:{
      fontWeight:'bold',
    }

  });

  _confirmFriend = () =>{
    let {user, auth} = this.props;
    fetch(HOSTNAME + "friends/" + user.request_id + "/",{
        method:'put',
        body:JSON.stringify({
            status:1
        }),
        headers:{
            Accept: 'application/json',
            'Content-Type':'application/json',
            Authorization:auth
        }
    }).then(function(response) {return response.json()})
    .then(response_json =>{
        console.log(response_json);
        if('id' in response_json){
            // ToastAndroid.show("Friend Request sent");
            this.setState({accepted:true});
        }
    }).catch(e => console.log("Error in Friend Request Accepted", e));
  }

  _cancelRequest =() =>{
    let {user, auth} = this.props;
    let url = HOSTNAME + "friends/" + user.request_id+"/";
    console.log(url);
    fetch(url,{
      method:'delete',
      headers:{
        Authorization:auth
      }
    }).then((response) => {
      console.log(response);
      if (response.ok){
        this.props.onRemove();
      }
    }).catch(e =>console.log("Error in Friend Request Rejected" ,e));
  }


  render(){
    let {user} = this.props;
    // console.log("user-----");
    return(
      <View style={this.styles.row_container}>
        { user.profilepicture ?
            <Image source={{uri:user.profilepicture}} style={this.styles.profile_picture}/>
          : <Image source={require('../assets/user_icon.png')} style={this.styles.profile_picture}/>
        }
        <View style={{justifyContent:'center'}}>
          <Text style={this.styles.user_name}>{user.first_name + " " + user.last_name}</Text>
            { this.state.accepted ?
                <View>
                  <Text>You are now friends</Text>
                  <Button title="Unfriend" onPress={this._cancelRequest}/>
                </View>
                 :
                <View style={this.styles.row_container}>
                  <Button title="Confirm" onPress={this._confirmFriend}/>
                  <Button title="Cancel" onPress={this._cancelRequest}/>
                </View>
            }
        </View>
      </View>
    );
  }
}

class AllFriendRequests extends React.Component{

  state = {
    users:[]
  }
  styles = StyleSheet.create({
      container:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center'
      }
  });


  _remove = (index) => {
    let tempUsers = this.state.users;
    tempUsers.splice(index, 1);
    this.setState({users:tempUsers});
  }

  render(){
    let {auth} = this.props;
    console.log("auth in friendrequests", auth);
    return(
      <View style={this.styles.container}>
        {
          auth && this.state.users.length ?
            this.state.users.map((user, index) =>{
              return <UserRequest user={user} auth={auth}
                    onRemove={() => this._remove(index)} key={user.id}/>
            })
            : <Text>No New Requests</Text>
        }
      </View>
    );
  }

  componentDidMount = () => {

    let {auth} = this.props;
    fetch(HOSTNAME + "friends/requests/",{
      method:'get',
      headers:{
        Authorization: auth
      }
    }).then(function(response) {return response.json()})
    .then(response_json =>{
        console.log(response_json);
        response_json.map((request, index) => {
          let user_url = HOSTNAME + "v2/users/" + request.user + "/";
          fetch(user_url,{
            method:'get',
            headers:{
              Authorization:auth
            }
          }).then(function(user_response) {return user_response.json()})
          .then(user =>{
            let tempUsers = this.state.users;
            user['request_id'] = request.id;
            tempUsers.push(user);
            this.setState({users:tempUsers});
            if(user.profile){
              let profile_url = HOSTNAME + "v2/profiles/" + user.profile;
              // console.log(profile_url);
              fetch(profile_url,{
                method:'get',
                headers:{
                  Authorization:auth
                }
              }).then(function(response1) {return response1.json()})
              .then(response1_json =>{
              //   console.log(response1_json);
                if(response1_json.profilepicture){
                      // console.log("profilepicture found");
                      user['profilepicture'] = response1_json.profilepicture.image;
                      console.log("user ",user);
                      let tempUsers = this.state.users;
                      tempUsers[index] = user;
                      this.setState({users:tempUsers});
                }
                // this.setState({users:user});
              }).catch(e => console.log("Error fetching the profile", e));
            }
          }) 
            
      });
    //   console.log("updated ",this.state.users);

    }).catch(e => console.log("Error fetching the User", e));
  }
}

class FriendRequest extends React.Component{

  styles = StyleSheet.create({
    container:{
      backgroundColor:'white'
    }
  });
  render(){
    let {auth} = this.props;
    return(
      <View style={this.styles.container}>
        <Text>FRIEND REQUESTS</Text>
        <AllFriendRequests auth={auth}/>
      </View>
    );
  }
}

class User extends React.Component{

  state= {
    requested:false,
  }
  styles = StyleSheet.create({
    row_container:{
      flexDirection:'row'
    },
    profile_picture:{
      width:100,
      height:100,
    },
    user_name:{
      fontWeight:'bold',
    }
  });

  _addFriend = () =>{
    let {user, auth} = this.props;
    fetch(HOSTNAME + "friends/",{
        method:'post',
        body:JSON.stringify({
            friend:user.id,
            status:0
        }),
        headers:{
            Accept: 'application/json',
            'Content-Type':'application/json',
            Authorization:auth
        }
    }).then(function(response) {return response.json()})
    .then(response_json =>{
        console.log(response_json);
        if('id' in response_json){
            // ToastAndroid.show("Friend Request sent");
            this.setState({requested:true, request_id:response_json.id});
        }
    }).catch(e => console.log("Error in Adding Friend Request", e));
  }

  _cancelRequest =() =>{
    let {request_id} = this.state;
    let {auth} = this.props;
    let url = HOSTNAME + "friends/" + request_id+"/";
    console.log(url);
    fetch(url,{
      method:'delete',
      headers:{
        Authorization:auth
      }
    }).then((response) => {
      if (response.ok){
        this.setState({requested:false});
      }
    }).catch(e =>console.log("Error in Friend Request Cancel" ,e));
  }


  render(){
    let {user, onRemove} = this.props;
    console.log("user-----");
    return(
      <View style={this.styles.row_container}>
        { user.profilepicture ?
            <Image source={{uri:user.profilepicture}} style={this.styles.profile_picture}/>
          : <Image source={require('../assets/user_icon.png')} style={this.styles.profile_picture}/>
        }
        <View style={{justifyContent:'center'}}>
          <Text style={this.styles.user_name}>{user.first_name + " " + user.last_name}</Text>
          <View style={this.styles.row_container}>
            { this.state.requested ?
                <View>
                  <Text>Request Sent</Text>
                  <Button title="Cancel Request" onPress={this._cancelRequest}/>
                </View>
                 :
                <View>
                  <Button title="Add Friend" onPress={this._addFriend}/>
                  <Button title="Remove" onPress={onRemove}/>
                </View>
            }

          </View>
        </View>
      </View>
    );
  }
}

class PeopleYouMayKnow extends React.Component{

  state = {
    users : [],
  }
  styles = StyleSheet.create({
    container:{
      backgroundColor:'white'
    }
  });

  _remove = (index) => {
    let tempUsers = this.state.users;
    tempUsers.splice(index,1);
    this.setState({users:tempUsers});
  }


  render(){
    let {users} = this.state;
    let {auth} = this.props;
    console.log(this.state.users);
    return(
      <View style={this.styles.container}>
        <Text>PEOPLE YOU MAY KNOW</Text>
        <View>
        { 
            auth && users.map((user, index) =>{
                return <User user={user} key={user.id} auth={auth}
                             onRemove={() => this._remove(index)} key={user.id} />
            })
        }
        </View>
      </View>
    );
  }

  componentDidMount(){
    let {auth} = this.props;
    fetch(HOSTNAME + "peopleyoumayknow/",{
      method:'get',
      headers:{
        Authorization: auth
      }
    }).then(function(response) {return response.json()})
    .then(response_json =>{
        this.setState({users:response_json});
        response_json.map((user, index) => {
          if(user.profile){
            let profile_url = HOSTNAME + "v2/profiles/" + user.profile;
            // console.log(profile_url);
            fetch(profile_url,{
              method:'get',
              headers:{
                Authorization:auth
              }
            }).then(function(response1) {return response1.json()})
            .then(response1_json =>{
            //   console.log(response1_json);
              if(response1_json.profilepicture){
                    // console.log("profilepicture found");
                    user['profilepicture'] = response1_json.profilepicture.image;
                    console.log("user ",user);
                    let tempUsers = this.state.users;
                    tempUsers[index] = user;
                    this.setState({users:tempUsers});
              }
              // this.setState({users:user});
            }).catch(e => console.log("Error fetching the profile", e));
          }
      });
    //   console.log("updated ",this.state.users);

    }).catch(e => console.log("Error fetching the User", e));
  }
}

export class Explore_Friends extends React.Component{

  styles = StyleSheet.create({
    container:{
      flex:1,
      backgroundColor:'#b2beb5'
    }
  });

  render(){
    // let {auth} = this.props.navigation.state.params;
    // console.log(auth);
    return(
      <ScrollView>
        <View style={this.styles.container}>
          <Text>Explore_Friends</Text>
          {/* <FriendRequest auth={auth}/>
          <View style={{marginTop:30}}>
            <PeopleYouMayKnow auth={auth} style={{marginTop:30}}/>
          </View> */}
        </View>
      </ScrollView>
    );
  }
}
