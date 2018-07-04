import React from 'react'
import {FlatList} from 'react-native'

export class FriendsActivity extends React.Component{

  state = {
    friends:[],
  }

  render(){
    return(
      <View>
            {/* <FlatList
              data={this.state.friends}
              renderItem={({item} => {<Text>{item.name}</Text>})}
            /> */}
      </View>
    );
  }

  componentDidMount(){
    let {auth, user_id} = this.props;
    let url = HOSTNAME + "friends/" + user_id;
    fetch(url,{
      method:'get',
      headers:{
        Authorization:auth
      }
    }).then(function(response) { return response.json()})
    .then((response_json) => {
      this.setState({friends:response_json.friends})
    }).catch(e=>console.log(e));
  }
}
