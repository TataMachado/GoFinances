import React from "react";
import {Container} from './styles';
import {createStackNavigator} from '@react-navigation/stack';
import {SignIn} from './../screans/signin';

const { Navigator, Screen}= createStackNavigator();

export function AuthRoutes(){
    return(
        <Navigator>
            <Screen name='SignIn' component={SignIn} />

            
        </Navigator>
    );
}
