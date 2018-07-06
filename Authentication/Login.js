import React,{Component} from 'react'
import { TextInput, StyleSheet, Text, View, Image,
    Button, Alert, StatusBar, AsyncStorage} from 'react-native';
import { NavigationActions } from 'react-navigation';
import { SecureStore } from "expo";
// import  createMaterialTopTabNavigator  from "../Home/MainScreen";

class LoginForm extends Component{

    constructor(props){
        super(props);
        this.signup.bind(this);
    }

    static navigationOptions = {
        header: null
    }

    state = {
        username : '',
        password: '',
        jwt_url : 'http://192.168.0.5:8000/facebook/api-jwt-token-auth/',
    }

    styles = StyleSheet.create({
        container: {
          flex: 1,
          flexDirection:'column',
          backgroundColor: 'white',
          alignItems: 'center',
          justifyContent: 'center',
        },
        backgroundImage: {
          flex: 1,
          resizeMode: 'cover', // or 'stretch'
        },
        login_input: {
            aspectRatio:7.1,
            color : '#3B5998',
            paddingBottom : 10,
            marginBottom:10,
            fontSize : 16,
        },
        login_button:{
          margin: 20,
          aspectRatio:7.1,
        },
        create_account_button:{
          aspectRatio:8.1,
          flexDirection:"column",
        }
    });

    submit = () => {
        this.login(this.state)
    }

    login = ({username, password}) =>
    {
        let {navigate} = this.props.navigation;
        console.log("Logging in with ", username + " : "+password);
        var formData  = new FormData();
        formData.append('username', username);
        formData.append('password', password);

        fetch(this.state.jwt_url, {
            method: 'post',
            body: formData,
          }) .then(function(response) {
            return response.json();
        })
        .then((myJson) => {
            if ('token' in myJson){
                var base64 = require('base-64');
                token = 'Basic ' + base64.encode(this.state.username + ":" + this.state.password);
                SecureStore.setItemAsync("user_token",token)
                .then((response) => {
                    SecureStore.setItemAsync("user_id",myJson.user.toString())
                    .then((resp) => {
                        console.log("navigating to mainscreen");
                        navigate("MainScreen");
                    })                    
                })
                .catch(e => console.log("Error at securestore", e));
                
                // navigate("MainScreen",{auth:token, user_id:myJson.user});           
            }
            else{
                Alert.alert("Invalid Credentials");
            }
        })
        .catch(e => {
            Alert.alert("Please check your network connection");
            console.log("Error occured in fetching students..", e);});
    }

    signup = () =>{
        this.props.navigation.navigate('Signup', { name: 'Jane' });
    }

    render(){
        let {navigate} = this.props.navigation;
        return (
            <View style={this.styles.container}>
                <StatusBar hidden={true}/>
                <Image style={{marginBottom:80,}}source={require('../assets/facebook-logo-black-and-white-png-small.png')} />
                <TextInput
                    id="login_username"
                    style={this.styles.login_input} placeholder= {"Phone or Email"}
                    onChangeText={(username) => this.setState({username})}

                />
                <TextInput id="login_password"
                    style={this.styles.login_input} placeholder= {"Password"}
                    secureTextEntry={true}
                    onChangeText={(password) => this.setState({password})}
                />

                <View style={this.styles.login_button}>
                    <Button
                        onPress={this.submit}
                        title="Login"
                        color="#3B5998"
                    />
                </View >

                <Text style={{color:'#3B5998'}}onPress={()=> navigate('ForgotPassword', {title:'Find Your Account'})}>
                    Forgot Password?
                </Text>

                <Text style={{color:'black',margin:20,}}>
                    Or
                </Text>
                <View style={this.styles.create_account_button}>
                    <Button style={{flex:0.3}}
                        onPress={()=>navigate('Signup', {title: 'Signup' })}
                        title="Create a Facebook Clone Account"
                        color="green"
                    />
                </View>
          </View>
        )
    }

    componentDidMount = () => {
        SecureStore.getItemAsync("user_token")
        .then((value) =>{
            if(value !== null){
                this.props.navigation.navigate("MainScreen");
            }
        })
        .catch(e => console.log("Error", e));
    }
 }

export default LoginForm
