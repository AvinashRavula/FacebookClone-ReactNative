import React, {Component} from 'react';
import {Text, View, StatusBar, Button, Alert} from 'react-native';
import { Sae, Avi } from 'react-native-textinput-effects';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

const fb_color = '#3B5998';
const auth_key = "Basic YXZpbmFzaDpyYXZ1bGExMjI5"

class ForgotPasswordForm extends Component{

  constructor(props){
    super(props);
    // this.changeThisTitle("Find Your Account");
  }

  base_url = 'http://192.168.0.5:8000/'
  state = {
    email_or_phonenum :'',
    showChangePasswordComponent:false,
    pwd:'',
    re_pwd:'',
    user_id:'',
  }

  static navigationOptions = ({ navigation }) => {
    const {state} = navigation;
    return {
      title: `${state.params.title}`,
      style:{color:'white'},
      headerTitleStyle : {textAlign: 'center',alignSelf:'center', fontWeight:'normal', color:'white'},
      headerStyle:{
          backgroundColor:'#3B5998',
      },
    };
  };


  changeThisTitle = (titleText) => {
      const {setParams} = this.props.navigation;
      setParams({ title: titleText })
  }

  findUser = () =>
  {
    url = this.base_url + "facebook/findUser?key="+this.state.email_or_phonenum
    console.log(url);
    fetch(url,{
      method:'get',
      headers:{
        Authorization: auth_key
      }
    }).then(function(response) {return response.json()})
    .then((myJson) => {
        console.log(myJson);
        if('id' in myJson){
          this.setState({user_id : myJson.id});
          this.setState({username : myJson.username})
          this.changeThisTitle("Change Password");
          this.setState({showChangePasswordComponent:true});
        }
        else{
          Alert.alert("Details not found");
        }
    }).catch(e =>{
      console.log(e);
    });
  }

  validatePasswords = () =>
  {
    if( this.state.pwd.length >= 8){
      if (this.state.pwd == this.state.re_pwd)
      {
        return true;
      }
      else{
        Alert.alert("Passwords not matched");
      }
    }
    else{
      Alert.alert("Password must be ateast  8 Characters");
    }
    return false;
  }

  changePassword = () =>
  {
    if(this.validatePasswords()){
      url = this.base_url + "facebook/users/"+this.state.username
      console.log(url);
      var formData = new FormData();
      formData.append('password',this.state.pwd);
      formData.append('username',this.state.username);
      console.log(formData);
      fetch(url,{
        method:'put',
        body:formData,
        headers:{
          Authorization: auth_key
        }
      }).then(function(response) {return response.json()})
      .then((myJson) => {
          if('id' in myJson){
              Alert.alert("Successfully changed password");
              this.changeThisTitle("Find Your Account");
              this.setState({showChangePasswordComponent:false});
          }
          else{
            Alert.alert("Cannot change the password");
          }
      }).catch(e =>{
        console.log(e);
      });
    }
  }

  render(){
      return (
          <View>
            <StatusBar hidden={false} backgroundColor="#3B5998"  barStyle="light-content"/>
            {!this.state.showChangePasswordComponent ?
                <View>
                  <View style={{marginHorizontal:40,marginTop:40,}}>
                    <Sae
                      label={'Email or Phone'}
                      iconClass={FontAwesomeIcon}
                      iconName={'pencil'}
                      iconColor={'#3B5998'}
                      // TextInput props
                      autoCapitalize={'none'}
                      autoCorrect={false}
                      labelStyle={{color:"#3B5998"}}
                      inputStyle={{color:'black'}}
                      onChangeText={(text) => this.setState({email_or_phonenum:text})}
                    />
                  </View>
                  <View style={{marginHorizontal:40,margin:30}}>
                    <Button title="Find" color="#3B5998" onPress={this.findUser}/>
                  </View>
                </View>
                :
                <View style={{marginHorizontal:40,marginTop:20,}}>
                  <Sae
                    label="New Password"
                    labelStyle={{color:fb_color}}
                    iconClass={FontAwesomeIcon}
                    iconName={'pencil'}
                    iconColor={fb_color}
                    inputStyle={{color:'black'}}
                    onChangeText={(text) => this.setState({pwd:text})}
                  />
                  <Sae
                    label="Re-enter Password"
                    labelColor={fb_color}
                    iconClass={FontAwesomeIcon}
                    iconName={'pencil'}
                    iconColor={fb_color}
                    inputStyle={{color:'black'}}
                    onChangeText={(text) => this.setState({re_pwd:text})}
                  />
                  <View style={{marginHorizontal:40,margin:40}}>
                    <Button title="Change Password" color={fb_color} onPress={this.changePassword}/>
                  </View>
                </View>
            }
          </View>
      );
  }
}


export default ForgotPasswordForm
