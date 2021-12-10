import React, {useContext} from "react";
import {Container, Header, TitleWrapper, Title, SingTitle, Footer, FooterWrapper} from './style';
import AppleSvg from '../../assets/apple.svg';
import GoogleSvg from '../../assets/google.svg';
import LogoSvg from '../../assets/logo.svg';
import { RFValue } from "react-native-responsive-fontsize";
import { SignSocialButton } from "../../components/SignSocialButton";
import { useAuth } from "../../Hooks/auth";
import {Alert} from 'react-native';



export function SignIn(){
    async function handleSignInWithApple(){
        try{
             await signInWithApple();

        }catch (error){
            console.log(error);
            Alert.alert('Não foi possível conectar a conta Apple');

        }
    }







    const {signInWithGoogle, signInWithApple}=useAuth();
    async function handleSignInWithGoogle(){
        try{
             await signInWithGoogle();

        }catch (error){
            console.log(error);
            Alert.alert('Não foi possível conectar a conta Google');

        }


    }
  


  
    
    return(<Container>
        <Header>
            <TitleWrapper>
                <LogoSvg width={RFValue(120)}
                height={RFValue(68)}
                
                />
                
           
            </TitleWrapper>
            <Title>
                Controle suas finanças de fotma muito simples.
            </Title>
            <SingTitle>
                Faça seu login com uma das contas abaixo.
            </SingTitle>
        </Header>
        <Footer>
            <FooterWrapper>
                <SignSocialButton title="Entar com Google"
                svg={GoogleSvg}
                onPress={handleSignInWithGoogle }
                
                />

<SignSocialButton title="Entar com Apple"
                svg={AppleSvg}
                
                
                />

            </FooterWrapper>
        </Footer>
        

    </Container>);
}

