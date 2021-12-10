import React from "react";
import { categories } from "../../Utils/categories";
 import {Container, 
    Title,
    Amount, 
    Footer, 
    Category, 
    Icon, 
    CategoryName,
     Date} from './styles';

     export interface TransactionCardProps {
         type: 'positive'|'negative',
         name: string;
         amount: string;
         category: string;
         date: string;
         }

         interface Data {
             data: TransactionCardProps;
         }
    
     

     export function TransactionsCards({data}: Props){
         const [category]= categories.filter(
             item=>item.key===data.category
         );
         return(
            <Container>
                <Title>
                    {data.name}

                </Title>
                <Amount type={data.type}>
                    {data.type==='negative' &&'- '}
                    {data.amount}

                </Amount>
                <Footer>
                    <Category>
                    <Icon name={Category.icon}/>
                    <CategoryName>{Category.name}</CategoryName>
                    <Date>{data.date}</Date>
                    </Category>
                </Footer>
            </Container>);
     }