import styled from 'styled-components/native';
import {Feather} from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';


interface TransactionsProps{
    type: 'positive'|'negative';
}

export const Container=styled.View`
background-color: ${({theme})=>theme.colors.shape} ;
border-radius: 5px;
padding: 24px 12px;
margin-bottom: 16px;

`;
export const Title = styled.Text`
font-size: ${RFValue(14)}px;
`;
export const Amount=styled.Text<TransactionsProps>`
font-size: ${RFValue(20)}px;
padding: 2px;
font-family: ${({theme})=>theme.fonts.regular};
color: ${({theme, type})=>
 type==='positive'? theme.colors.success: theme.colors.attention};
`;
export const Footer = styled.View`
flex-direction: row;
justify-content: space-between;
align-items: center;
margin-top: 19px;
`;
export const Category = styled.View`
flex-direction: row;
align-items: center;
color: ${({theme})=>theme.colors.text} ;
`;
export const Icon = styled(Feather)`
font-size: ${RFValue(29)}px;
color: ${({theme})=>theme.colors.text} ;
`;
export const CategoryName=styled.Text`
font-size: ${RFValue(14)}px;
color: ${({theme})=>theme.colors.text} ;
margin-left: 17px;
`;
export const Date=styled.Text`
font-size: ${RFValue(14)}px;
font-family: ${({theme})=>theme.fonts.regular};
margin-left: 45px;
justify-content: space-between;
;
`;




