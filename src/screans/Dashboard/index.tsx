
import React, { useState, useEffect, useCallback } from 'react';
import { HighLightCard } from '../../components/HighLight';
import { TransactionCardProps, TransactionsCards } from '../../components/TransactionsCards';
import { useFocusEffect } from '@react-navigation/core';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from 'styled-components';


import {Container,
Header,
UserInfo,
User,
UserGretting,
UserName,
Photo,
UserWrapper,
Icon,
HighlightCards,
Transactions,
Title,
TransactionList,
LogoutButton,
LoadContainer


} from './styles';
import { Category } from '../../components/Forms/CategorySelectBUtton/styles';
import { TrasactionTypes } from '../Register/styles';
import { ActivityIndicator } from 'react-native';

export interface DataListProps extends TransactionCardProps{
    id: string;
}
interface HightlightProps{
    amount: string;
    lastTransaction: string;
}
interface HightligthData{
    entries: HightlightProps;
    expensive: HightlightProps;
    total: HightlightProps;
}



export function Dashboard(){
    const [transactions, setTransactions]=useState<DataListProps[]>([]);
    const [hightligthData, setHightlightData]=useState<HightligthData>({} as HightligthData);
    const [isLoading, setIsLoading]=useState(true);
    const theme=useTheme();
    



    function getLastTransactionsDate(
        collection: DataListProps[],
        type: 'positive'| 'negative'
    ){
        const lastTransaction =new Date(Math.max.apply(Math ,  collection
            .filter(transactions=>transactions.type===type)
        .map((transaction: DataListProps)=> new Date(transaction.date).getTime())))

        return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString('pt-BR',{
            month:'long'
        })}`
        

    }


    let entriesTotal=0;
    let expensiveTotal=0;

    async function loadTrasactions(){
        try {
             
        const datakey='@gofinances: trasactions';
        const response= await AsyncStorage.getItem(datakey);
        
        const trasactions=response ? JSON.parse(response):[];
        const trasactionsFormatted :DataListProps []=trasactions.map((item: DataListProps)=>{
            if (item.type==='positive'){
              entriesTotal+=Number(item.amount);
            }else{
                expensiveTotal+=Number(item.amount);
            }
            const amount=Number(item.amount).toLocaleString('pt-BR',{
                style: 'currency',
                currency: 'BRL',

            });
            const date=item.date? new Date(item.date): new Date();
            
            const dateFormatted=Intl.DateTimeFormat('pt-BR',{
                day: '2-digit',
                month: '2-digit',
                year:'2-digit'
            }).format(date);
            return{
                id: item.id,
                name: item.name,
                amount,
                type: item.type,
                category: item.category,
                date: dateFormatted
            }

        });
        setTransactions(trasactionsFormatted);
        const lastTransactionsEntries=getLastTransactionsDate(trasactions, 'positive');
        const lastTransactionsExpensive=getLastTransactionsDate(trasactions, 'negative');
        const totalInterval=`01 a ${lastTransactionsExpensive}`;


        


        const total=entriesTotal-expensiveTotal;
    
        setHightlightData({
           
            entries:{
                amount: entriesTotal.toLocaleString('pt-BR',{
                    style: 'currency',
                    currency: 'BRL'
                }),
                lastTransaction: `Última entrada dia ${lastTransactionsEntries}`,
            },
            expensive:{
                amount: entriesTotal.toLocaleString('pt-BR',{
                    style: 'currency',
                    currency: 'BRL'
                }),
                lastTransaction: `Última saída dia ${lastTransactionsExpensive}`,
            },
            total:{
                amount: total.toLocaleString('pt-BR',{
                    style: 'currency',
                    currency: 'BRL'
                }),
                lastTransaction: totalInterval,
            

            },


        });

    
        console.log(trasactionsFormatted);
        setIsLoading(false);
        
    }catch(error){
        console.log( "erro",error)
    }
    }

     useEffect(()=>{
           
            loadTrasactions(); 
            // const datakey='@gofinances: trasactions';
            //  AsyncStorage.removeItem(datakey);
  

        },[]);

        useFocusEffect(useCallback(()=>{
            loadTrasactions();
        },[]));
       
   

   
  
    return(<Container>
       
        {
            isLoading ? <LoadContainer>
                <ActivityIndicator color={theme.colors.primary}
                size="large"
                />

            </LoadContainer> :
            <>

        <Header>
            <UserWrapper>
            
        <UserInfo>
            <Photo source={{uri: 'https://avatars.githubusercontent.com/u/72242565?s=400&v=4'}} />
            <User>
                    <UserName>Tati</UserName>
                
            </User>
    
        </UserInfo>
        <LogoutButton onPress={()=>{}}>
        <Icon name="power"/>
        </LogoutButton>

        
        
    
        </UserWrapper>

        
        
        </Header>

        
    

        <HighlightCards >
        
        

            <HighLightCard type="up" title="Entradas"
             amount={hightligthData.entries.amount}
             lastTransaction={hightligthData.entries.lastTransaction}/>

<HighLightCard type='down'  title='Saídas'
             amount={hightligthData.expensive.amount}
             lastTransaction={hightligthData.expensive.lastTransaction}/>

<HighLightCard type='total' title='Total'
             amount={hightligthData.total.amount}
             lastTransaction={hightligthData.total.lastTransaction}/>

            

        </HighlightCards>

        <Transactions >
            <Title>Listagens</Title>

            <TransactionList 
            keyExtractor={item=>item.id}
            data={transactions}
            renderItem={({item})=><TransactionsCards data={item}/>}
            
            />

        

            

           

   

            

    

             
            
        </Transactions >

        </>
}

        
        





    
        
    </Container>
        );
    }
