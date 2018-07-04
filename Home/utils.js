import React, {Component} from 'react'
import {View} from 'react-native'


export const Row = (props) =>{
    
    return(
        <View style={{flexDirection:'row'}}>
            {props.children}
        </View>
    );
    
}

export const Column = (props) =>{
    
    return(
        <View style={{flexDirection:'column'}}>
            {props.children}    
        </View>
    );
    
}