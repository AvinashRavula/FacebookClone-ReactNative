import React, { Component } from "react"
import {View, Image, Dimensions, Text, TouchableHighlight, 
    Button,StyleSheet, TouchableOpacity, Alert, AsyncStorage} from 'react-native'
import { Row, Column } from './utils'
import { ImagePicker } from 'expo'
import { Sae, Avi } from 'react-native-textinput-effects';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { ScrollView } from "react-native-gesture-handler";
import { DatePickerDialog } from 'react-native-datepicker-dialog';
import moment from 'moment';
import {NavigationActions} from 'react-navigation';




const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const fb_color = "#4267b2";
const HOSTNAME = "http://192.168.0.5:8000/facebook/";

const LabelValue = (props) => {
    LabelValue.defaultProps = {
        label:'',
        labelStyle:{color:'black', width:100,},
        value:'',
        valueStyle:{color:fb_color,fontWeight:'bold'}
    };

    return (
        <Row>
            <Text style={props.labelStyle}>{props.label}</Text>
            <Text style={props.valueStyle}>{props.value}</Text>
        </Row>
    );
}

export class ProfileActivity extends Component{
    
    state = {
        loaded:false,
    }

    static navigationOptions = ({ navigation }) => {
        const {navigate, state} = navigation;
        return {
            title: 'Profile',
            style:{color:'white'},
            headerTitleStyle : {textAlign: 'center',alignSelf:'center', fontWeight:'normal', color:'white'},
            headerStyle:{
                backgroundColor:fb_color,
            }
        };
    };

    componentDidMount(){
        const {auth} = this.props.navigation.state.params;
        console.log("auth in profile activity",auth);
        const user_url= HOSTNAME + "my_profile/";
        fetch(user_url, {
            method:'get',
            headers:{
                Authorization: auth
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

    _changePicture = async (picture, aspect) =>
    {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: aspect,
            mediaTypes:ImagePicker.MediaTypeOptions.Images
          });     
          if (!result.cancelled) {
              if (picture == 'cover'){
                  let temp_cp = {};
                    if(this.state.cp == null){
                        temp_cp = { image: result.uri}
                    }
                    else{
                        temp_cp = this.state.cp;
                        temp_cp['image'] = result.uri
                    }
                    this.setState({ cp: temp_cp});
              }
              else if(picture == 'profile'){
                let temp_dp = {};
                if(this.state.dp == null){
                    temp_dp = { image: result.uri}
                }
                else{
                    temp_dp = this.state.dp;
                    temp_dp['image'] = result.uri
                }
                this.setState({ dp: temp_dp});
              }
              this.uploadPicture(picture);
          }
    }

    // pictureType defines the Cover picture or Profile Picture
    uploadPicture = (pictureType) =>
    {
        let { cp_request_method, dp_request_method, cp, dp, profile_id} = this.state;
        let {auth} = this.props.navigation.state.params;
        let url = HOSTNAME;
        let request_method = "PUT";
        var formData = new FormData();
        if(pictureType == 'cover')
        {
            request_method = cp_request_method;
            if(request_method == 'PUT')
                url += "cps/" + cp.id + '/';
            else if(request_method == 'POST')
                url += "cps/";

            let filename = cp.image.substring(cp.image.lastIndexOf("/") + 1,
                            cp.image.length);
            let fileExt = filename.substring(filename.lastIndexOf('.') + 1,filename.length);
            formData.append('image',{uri:cp.image,
                                    name: filename,
                                    type:"image/"+fileExt    
                                });
        }
        else if(pictureType == 'profile')
        {
            request_method = dp_request_method;
            if(request_method == 'PUT')
                url += "dps/" + dp.id + '/';
            else if(request_method == 'POST')
                url += "dps/";
                let filename = dp.image.substring(dp.image.lastIndexOf("/") + 1,
                                    dp.image.length);
                let fileExt = filename.substring(filename.lastIndexOf('.') + 1,filename.length);
                // console.log(fileProperties);
                formData.append('image',{uri:dp.image,
                                    name: filename,
                                    type:"image/"+fileExt    
                                });
        }
        formData.append('profile',profile_id);
        // console.log(url);
        // console.log(formData);
        // console.log(request_method);
        fetch(url,{
            method: request_method,
            body: formData,
            headers:{
                Authorization: auth
            }
        }).then(function(response) { return response.json()})
        .then((response_json) => {
            console.log(response_json);
            console.log("Updated", pictureType,"picture");
            Alert.alert(pictureType + " picture updated")
        }).catch(e => console.log(e));
    }


    render(){
        let {cp, dp, first_name, last_name, email, dob, phonenum, profile_id} = this.state;
        let {navigate} = this.props.navigation;
        let {auth} = this.props.navigation.state.params;
        console.log(cp);
        return(
            this.state.loaded? this.state.error ? <Text> Error in getting the data</Text> : 
            <ScrollView>
                <View>
                    <TouchableHighlight onPress={() => this._changePicture('cover', [4,2])}>
                        { cp ? 
                            <Image source={{uri: cp.image}} 
                                style={{width:SCREEN_WIDTH, height:200, marginTop:0,backgroundColor:'green'}}/>
                        :
                            <Image source={ require('../assets/fb_icon_small.png')} 
                                style={{width:SCREEN_WIDTH, height:200, marginTop:0}}/>
                        }
                    </TouchableHighlight> 
                    <TouchableHighlight onPress={() => this._changePicture('profile', [2,2])}
                                    style={{justifyContent:'center', alignItems:'center'}}>
                        { dp ? 
                            <Image source={{uri: dp.image}} 
                                style={{width:150, height:150, marginTop:0, backgroundColor:'green'}}/>
                            :
                            <Image source={ require('../assets/fb_icon_small.png')} 
                                style={{width:150, height:150, marginTop:0, backgroundColor:'green'}}/>
                        }
                    </TouchableHighlight>
                    <View style={{marginHorizontal :40,marginTop:20}}>
                        <LabelValue label="First Name:" 
                                    value={first_name}/>
                        <LabelValue label="Last Name:" 
                                    value={last_name}/>
                        <LabelValue label="Data of Birth:" 
                                    value={dob}/>
                        <LabelValue label="Email:" 
                                    value={email}/>
                        <LabelValue label="Phone Number:" 
                                    value={phonenum}/>
                        {/* <Button title="Edit" onPress={() => navigate('EditProfile',{
                            dp:dp, cp:cp, first_name:first_name,
                            last_name:last_name, dob: dob,
                            profile_id:profile_id, auth:auth
                        })}/> */}
                    </View>
                </View>
            </ScrollView>
            :
            <Text>Loading...</Text>
        );
    }
}


export class EditProfileActivity extends Component{
    state = {
        first_name: null,
        last_name: null,
        dob: null,
    }

    DatePickerMainFunctionCall = () => {
        let DateHolder = this.state.DateHolder;
        if(!DateHolder || DateHolder == null){
            DateHolder = new Date();
            this.setState({
                DateHolder: DateHolder
            });
        }
        //To open the dialog
        this.refs.DatePickerDialog.open({
            date: DateHolder,
        });
    }

    onDatePickedFunction = (date) => {
        this.setState({
            dob: moment(date).format('YYYY-MM-DD')
        });
        // this doesnt print the latest dob as the state differs...
        console.log('dob set to',this.state.dob);
    }

    componentDidMount(){
        const {first_name, last_name, dob} =  this.props.navigation.state.params;
        this.setState({
            first_name: first_name,
            last_name: last_name,
            dob: dob
        });
    }

    _updateProfile = () =>
    {
        const {profile_id, auth} = this.props.navigation.state.params;
        let url = HOSTNAME + "v2/profiles/" + profile_id +  '/';
        // var formData = new FormData();
        // formData.append('first_name', this.state.first_name);
        // formData.append('last_name', this.state.last_name);
        // formData.append('dob', this.state.dob);
        // console.log(formData);
        console.log(url);
        console.log(this.state.first_name);
        console.log(this.state.last_name);
        console.log(this.state.dob);
        fetch(url,{
            method:'put',
            body: JSON.stringify({
                'first_name' : this.state.first_name,
                'last_name' : this.state.last_name,
                'dob': this.state.dob
            }),
            headers:{
                Accept : 'application/json',
                'Content-Type': 'application/json',
                Authorization: auth
            }
        }).then(function(response){ console.log(response); return response.json()})
        .then((response_json) => {
            console.log(response_json);
            if ('id' in response_json){
                Alert.alert("Profile Updated");
            }
        }).catch(e => console.log(e));
    }
    

    render(){
        const {first_name, last_name, dob, phonenum, email,
                profile_id, cp, dp, auth} = this.props.navigation.state.params;
        return(
            <ScrollView>
                <View style={{marginHorizontal:40}}>
                    <Sae
                        value={this.state.first_name}
                        label={'First Name'}
                        iconClass={FontAwesomeIcon}
                        iconName={'pencil'}
                        iconColor={fb_color}
                        inputStyle={{color:'black'}}
                        onChangeText={(text) => this.setState({first_name:text})}
                    />
                    <Sae
                        value={this.state.last_name}
                        label={'Last Name'}
                        iconClass={FontAwesomeIcon}
                        iconName={'pencil'}
                        iconColor={fb_color}
                        inputStyle={{color:'black'}}
                        onChangeText={(text) => this.setState({last_name:text})}
                    />
                    <TouchableOpacity onPress={this.DatePickerMainFunctionCall.bind(this)} >
                        <View style={styles.datePickerBox}>
                            <Text style={styles.datePickerText} placeholder={"Birthday"}>{this.state.dob}</Text>
                        </View>
                    </TouchableOpacity>
                    <DatePickerDialog ref="DatePickerDialog" onDatePicked={this.onDatePickedFunction.bind(this)} />
                    <Button title="Update Profile" onPress={this._updateProfile} style={{marginTop:20}}/>
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    datePickerBox:{
        marginTop: 9,
        borderColor: 'black',
        borderWidth: 0.5,
        padding: 0,
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4,
        height: 38,
        justifyContent:'center',
    },
    datePickerText: {
        fontSize: 14,
        marginLeft: 5,
        borderWidth: 0,
        color: '#000',
    },
});