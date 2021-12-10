import React,{ createContext, ReactNode, useContext, useState, useEffect } from "react";
import * as AuthSession from 'expo-auth-session';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Google from 'expo-google-app-auth';
import AsyncStorage from "@react-native-async-storage/async-storage";

const {CLIENT_ID}=process.env;
const {REDIRECT_URI}=process.env;

interface User{
    id: string;
    name: string;
    email: string;
    photo?: string;
}

interface AuthProviderProps {
    children: ReactNode;

}
interface IAuthContextData{
    user: User;
    signInWithGoogle(): Promise<void>;
    signInWithApple(): Promise<void>;

}
 const AuthContext=createContext({} as IAuthContextData);

function AuthProvider({children}: AuthProviderProps){
    const [user, setUser]=useState<User>({}as User);
    const [userStorageLoading, setUserStorageLoading]=useState(true);

    const userStoreKey='@gofinances:user';

    async function signInWithGoogle(){
        try {
            const result = await Google.logInAsync({
                iosClientId: '961501466341-g2o4ju09nb91qiq5i3i9b9ck1fa3qu48.apps.googleusercontent.com',
                androidClientId: '961501466341-g2o4ju09nb91qiq5i3i9b9ck1fa3qu48.apps.googleusercontent.com',
                scopes: ['profile','email'],
            });
            if (result.type==='success'){
                const userLogged={
                    id: String(result.user.id),
                    email: result.user.email!,
                    name: result.user.name!,
                    photo: result.user.photoUrl!


                };
                setUser(userLogged);
                await AsyncStorage.setItem('@gofinances:user', JSON.stringify(userLogged));


            }
           
           
            


            
        } catch (error) {
            throw new Error(error);
            
            
        }
    }

    async function signInWithApple() {
        try {
            const credentials =await AppleAuthentication.signInAsync({
                requestedScopes:[
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                ]
            });
            if (credentials){
                const userLogged={
                    id: String(credentials.user),
                    email: credentials.email!,
                    name: credentials.fullName!.givenName!,
                    photo: undefined!


                };
                setUser(userLogged)
                await AsyncStorage.setItem(userStoreKey, JSON.stringify(userLogged));
                

            }
         }catch (error){
                throw new Error(error);

            }
        
    }
    useEffect(()=>{
        async function loadUserStorangeData(){
            const userStoreged= await AsyncStorage.getItem(userStoreKey);

            if (userStoreged){
                const userLogged= JSON.parse(userStoreged) as User;
                setUser(userLogged);
            }
            setUserStorageLoading(false);
        }
        loadUserStorangeData();
    },[])
    return(<AuthContext.Provider value={{user,
     signInWithGoogle,
     signInWithApple
     }}>
        {children}
    </AuthContext.Provider>)
}

function useAuth(){
    const context = useContext(AuthContext);

    return context;
}

export{AuthProvider, useAuth}