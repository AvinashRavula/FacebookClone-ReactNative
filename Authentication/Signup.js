import React, {Component} from 'react'
import {View, Text, StatusBar, ScrollView, StyleSheet,Dimensions,
    Picker, DatePickerAndroid,Alert, Button, TouchableOpacity } from 'react-native'
import { DatePickerDialog } from 'react-native-datepicker-dialog'
import moment from 'moment';
// import {Button} from 'react-native-elements'
import {Icon} from 'react-native-vector-icons'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { Font } from 'expo';
import { TextInput } from 'react-native-gesture-handler';
import MultiSelect from 'react-native-multiple-select';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const HOSTNAME = "http://192.168.0.5:8000/facebook/"
const auth_key = "Basic YXZpbmFzaDpyYXZ1bGFAMTIyOQ=="

class SignupForm extends Component{


    static navigationOptions = ({ navigation }) => ({
        title: `Signup`,
         headerTitleStyle : {textAlign: 'center',alignSelf:'center'},
            headerStyle:{
                backgroundColor:'white',
            },
        });

    state = {
        firstname: '',
        lastname: '',
        email: '',
        phonenum: '',
        gender: '',
        nickname: '',
        dob: '00-00-0000',
        born_place: '',
        relationship_status: '',
        languages_known: '',
        pwd:'',
        re_pwd:'',
        validEmail:true,
        validPhonenum:true,
        passwordMatch:true,
        gender_items: [{id:'m',value:'Male'},{id:'fm',value:'Female'}],
        relationship_items: [
            {id:'1',value:'Single'},{id:'2',value:'In a relationship'},
            {id:'3',value:'Engaged'},{id:'4',value:'Married'},
            {id:'5',value: 'In a civil partnership'},
            {id:'6',value:'In a domestic partnership'},
            {id:'7',value:'In an open relationship'},
            {id:'8',value:'It\'s complicated'},{id:'11',value:'Divorced'},
            {id:'9',value:'Separated'},{id:'10',value:'Widowed'},{id:'12',value: '---'},
        ],
        selectedItems: [],
        items: [{
            id: '92iijs7yta',
            name: 'English',
          }, {
            id: 'a0s0a8ssbsd',
            name: 'Hindi',
          }, {
            id: '16hbajsabsd',
            name: 'Telugu',
          }, {
            id: 'nahs75a5sg',
            name: 'Marati',
          }, {
            id: '667atsas',
            name: 'Panjabi',
          }, {
            id: 'hsyasajs',
            name: 'Tamil',
          }, {
            id: 'djsjudksjd',
            name: 'Bengali',
          }, {
            id: 'sdhyaysdj',
            name: 'Kaduna',
          }, {
            id: 'suudydjsjd',
            name: 'Abuja',
          }]
      };

    onSelectedItemsChange = selectedItems => {
        this.setState({ selectedItems });
    };

    // DatePickerMainFunctionCall = () => {
    //     let DateHolder = this.state.DateHolder;
    //     if(!DateHolder || DateHolder == null){
    //         DateHolder = new Date();
    //         this.setState({
    //             DateHolder: DateHolder
    //         });
    //     }
    //     //To open the dialog
    //     this.refs.DatePickerDialog.open({
    //         date: DateHolder,
    //     });
    // }

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

    validateEmail = () =>
    {
        console.log("validateEmail function called");
        fetch(`${HOSTNAME}duplicate_email/?email=${this.state.email}`,
        {
            method:'GET',
            headers:{
                Authorization: auth_key
            }
        }).then(function(response){
            return response.json()
        }).then((myJson) =>
        {
            console.log("EMail json : ", myJson);
            if( myJson.email == 'invalid'){
                this.setState({validEmail:false});
                Alert.alert("Email already exists.")
            }
            else{
                this.setState({validEmail:true});
            }
        }).catch(e => {console.log(e)});
    }

    validatePhoneNum =() =>
    {
        console.log("validatePhonenum function called");
        fetch(`${HOSTNAME}/duplicate_phonenum/?phonenum=${this.state.phonenum}`,
        {
            method:'GET',
            headers:{
                Authorization:auth_key
            }
        }).then(function(response){
            return response.json()
        }).then((myJson) =>
        {
            console.log("Phonenum json : ", myJson);
            if( myJson.phonenum == 'invalid'){
                this.setState({validPhonenum:false});
                Alert.alert("Phonenum already exists.")
            }
            else{
                this.setState({validPhonenum:true});
            }
        }).catch(e => {console.log(e)});
    }

    validatePassword = () =>
    {
        if (this.state.pwd.length >= 8 && this.state.pwd === this.state.re_pwd)
        {
            this.setState({passwordMatch:true});
            return true;
        }
        this.setState({passwordMatch:false});
        Alert.alert("Passwords not matched");
        return false;
    }

    validateForm = () =>
    {
        console.log('validateForm called');
        if(!this.state.validEmail || !this.state.validPhonenum || !this.validatePassword()
            || this.state.firstname == '' || this.state.lastname == ''
            || this.state.email == '' || this.state.phonenum == '' ){
            console.log('validateform exiting');
            return false;
        }
        else {
            console.log('validateForm exiting');
            return true;
        }
    }

    signup = () =>
    {
        console.log('signup called');
        if(this.validateForm()){
            let user_id = '0';
            console.log("validateForm return true");
            var formData = new FormData();
            formData.append('username',this.state.email);
            formData.append('first_name', this.state.firstname);
            formData.append('last_name',this.state.lastname);
            formData.append('email', this.state.email);
            formData.append('password', this.state.pwd);
            fetch(HOSTNAME + 'users',
            {
                method:'post',
                body:formData,
                headers:{
                    Authorization:auth_key
                }
            }).then(function(response) {
                console.log(response);
                return response.json();
            })
            .then((myJson) =>{
                console.log('user fetched : ',myJson);
                if ('id' in myJson)
                {
                    user_id = myJson.id;
                    var profileData = new FormData();
                    profileData.append('nick_name', this.state.nickname);
                    profileData.append('dob', this.state.dob);
                    profileData.append('phonenum', this.state.phonenum);
                    profileData.append('gender', this.state.gender);
                    profileData.append('born_place', this.state.born_place);
                    let languages_known = this.state.selectedItems.join(',');
                    if( languages_known == '')
                    {
                        languages_known = '-'
                    }
                    profileData.append('languages_known', languages_known);
                    profileData.append('relationship_status', this.state.relationship_status);
                    profileData.append('user', user_id);
                    fetch(HOSTNAME + 'profiles',
                    {
                        method:'POST',
                        headers:{
                            'Authorization':auth_key
                        },
                        body:profileData,
                    }).then(function(response){
                        return response.json()
                    }).then((myJson) => {
                        console.log("profile : ",myJson);
                        Alert.alert('Profile created');
                    }).catch(e => console.log("Error creating profile"));
                }
            }).catch(e => console.log("Error creating User"));
        }
        console.log('signup exited');
    }

    render(){
        const { selectedItems } = this.state;
        let relationshipPickerItems = this.state.relationship_items.map( (item) => {
            return <Picker.Item key={item.id} value={item.id} label={item.value} />
        });
        return (
            <View style={{flex: 1}}>
                <View style={{flex: 1, backgroundColor: 'rgba(47,44,60,1)'}}>
                  <StatusBar hidden={false}/>
                    <View style={styles.statusBar} />
                        <View style={styles.navBar}>
                            <Text style={styles.nameHeader}>
                                Signup
                            </Text>
                        </View>
                    <ScrollView style={{flex: 1}}>
                        <TextInput placeholder="First Name" underlineColorAndroid={"white"}
                        style={styles.text_input}
                        onChangeText={(firstname) => this.setState({firstname})}/>

                        <TextInput placeholder="Last Name" underlineColorAndroid={"white"}
                        style={styles.text_input}
                        onChangeText={(lastname) => this.setState({lastname})}/>

                        <TextInput placeholder="Email" underlineColorAndroid={ this.state.validEmail ? "white" : "red"}
                        style={styles.text_input}
                        onChangeText={(email) => this.setState({email})} onBlur={this.validateEmail}/>

                        <TextInput placeholder="Phone Number" underlineColorAndroid={ this.state.validPhonenum ? "white" : "red"}
                        style={styles.text_input}
                        onChangeText={(phonenum) => this.setState({phonenum})} onBlur={this.validatePhoneNum}/>

                        <TextInput placeholder="Password" underlineColorAndroid="white"
                        style={styles.text_input} secureTextEntry={true}
                        onChangeText={(pwd) => this.setState({pwd})}/>

                        <TextInput placeholder="Re-Enter Password" underlineColorAndroid={ this.state.passwordMatch ? "white" : "red"}
                        style={styles.text_input}
                        onChangeText={(re_pwd) => this.setState({re_pwd})} />

                        <View style={{flex:1,flexDirection:"row",marginHorizontal:40,justifyContent:'center',alignItems:'center'}}>
                            <Text style={{textAlign:'left',fontSize:16,color:'white',flex:0.5}}>Gender:</Text>
                            <Picker
                                selectedValue={this.state.gender}
                                style={{ height: 50, flex:1, color:'white' }}
                                mode={"dropdown"}
                                onValueChange={(itemValue, itemIndex) => this.setState({gender: itemValue})}>
                                <Picker.Item label="--Select--" value="-" disabled={true}/>
                                <Picker.Item label="Male" value="m" />
                                <Picker.Item label="Female" value="fm" />
                            </Picker>
                        </View>

                        <TextInput placeholder="Nick Name" underlineColorAndroid={"white"}
                        style={styles.text_input}
                        onChangeText={(nickname) => this.setState({nickname})}/>

                        <TouchableOpacity onPress={this.DatePickerMainFunctionCall.bind(this)} >
                            <View style={styles.datePickerBox}>
                                <Text style={styles.datePickerText} placeholder={"Birthday"}>{this.state.dob}</Text>
                            </View>
                        </TouchableOpacity>
                        <DatePickerDialog ref="DatePickerDialog" onDatePicked={this.onDatePickedFunction.bind(this)} />

                        <TextInput placeholder="Born Place" underlineColorAndroid={"white"}
                        style={styles.text_input}
                        onChangeText={(born_place) => this.setState({born_place})}/>

                        <View style={styles.container}>
                            <Text style={{color:'white',flex:0.5,textAlign:'left'}}> Relationship: </Text>
                            <Picker
                                selectedValue={this.state.relationship_status}
                                style={{color:'white',flex:1}}
                                mode={'dropdown'}
                                onValueChange={(itemValue,itemIndex) => this.setState({relationship_status:itemValue})}>
                                <Picker.Item label="--Select--" value="-" disabled={true}/>
                                {relationshipPickerItems}
                            </Picker>
                        </View>

                         <View style={{ flex: 1, marginHorizontal:40 }}>
                            <MultiSelect
                                hideTags
                                items={this.state.items}
                                uniqueKey="id"
                                ref={(component) => { this.multiSelect = component }}
                                onSelectedItemsChange={this.onSelectedItemsChange}
                                selectedItems={this.state.selectedItems}
                                selectText="Languages Known"
                                searchInputPlaceholderText="Search Languages..."
                                onChangeInput={ (text)=> console.log(text)}
                                // altFontFamily="ProximaNova-Light"
                                tagRemoveIconColor="#CCC"
                                tagBorderColor="#CCC"
                                tagTextColor="#CCC"
                                selectedItemTextColor="#CCC"
                                selectedItemIconColor="#CCC"
                                itemTextColor="#000"
                                displayKey="name"
                                searchInputStyle={{ color: '#CCC' }}
                                submitButtonColor="#CCC"
                                submitButtonText="Done"
                            />
                            <View >
                                {
                                this.multiSelect ?
                                     this.multiSelect.getSelectedItemsExt(this.state.selectedItems)
                                    : null
                                }
                            </View>
                        </View>

                        <View style={{marginHorizontal:60, margin:30}}>
                            <Button title="Signup" onPress={this.signup}/>
                        </View>
                    </ScrollView>
                </View>
            </View>
        );
    }


}


const styles = StyleSheet.create({
    statusBar: {
        height: 10,
    },
    navBar: {
        height: 80,
        width: SCREEN_WIDTH,
        justifyContent: 'center',
        alignContent: 'center'
    },
    nameHeader: {
        color: 'white',
        fontSize: 22,
        textAlign: 'center'
    },
    text_input: {
        marginHorizontal:40,
        color : 'white',
        paddingBottom : 10,
        fontSize : 16,
        margin:10,
    },
    container:{
        flex:1,
        flexDirection:'row',
        marginHorizontal:40,
        justifyContent:'center',
        alignItems:'center'
    },
    datePickerBox:{
        marginTop: 9,
        borderColor: 'white',
        borderWidth: 0.5,
        padding: 0,
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4,
        height: 38,
        justifyContent:'center',
        marginHorizontal:40,
    },
    datePickerText: {
        fontSize: 14,
        marginLeft: 5,
        borderWidth: 0,
        color: '#fff',

    },
})

export default SignupForm
