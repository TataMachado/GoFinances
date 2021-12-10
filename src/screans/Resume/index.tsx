import React ,{useEffect, useState, useCallback} from "react";
import {Container, Header, Title, Content, 
    ChartContainer, Month, MothSelect,
     MothSelectButton, MothSelectIcon, LoadContainer} from './styles';
import { HistoryCard } from "../../components/HistoryCard";
import AsyncStorage from '@react-native-async-storage/async-storage'
import { categories } from "../../Utils/categories";
import {VictoryPie} from 'victory-native';
import { Category } from "../../components/Forms/CategorySelectBUtton/styles";
import { RFValue } from "react-native-responsive-fontsize";
import theme from "../../global/styles/theme";
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import {addMonths, subMonths, format} from 'date-fns';
import {ptBR} from 'date-fns/locale';
import {ActivityIndicator} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';


interface TransactionsData{

    type: 'positive'|'negative',
    name: string;
    amount: string;
    category: string;
    date: string;

}
interface categoryData{
    name: string;
    total: number;
    color: string;
    key: string;
    totalFormatted: string;
    percent: string;
    
    
}


export function Resume(){
    const [isLoading, setLoading]=useState(false);
    const [selectedDate, setSelectedDate]= useState(new Date());
    const [totalByCategories, setTotalByCategories]=useState<categoryData[]>([]);

    function handleDateChange(action: 'next'| 'prev'){
        if (action==='next'){
            const newDate=addMonths(selectedDate, 1)
            setSelectedDate(newDate)

        }else{
            const newDate=subMonths(selectedDate, 1)
            setSelectedDate(newDate)

        }

    }

         async function loadData(){
            setLoading(true);
    const datakey='@gofinances: trasactions';
    const response= await AsyncStorage.getItem(datakey);
    
    const responseFormatted=response ? JSON.parse(response):[];
    const expensives=responseFormatted
    .filter((expensive: TransactionsData)=>
    expensive.type==='negative'&& 
    new Date(expensive.date).getMonth()===selectedDate.getMonth()&&
    new Date (expensive.date).getFullYear()===selectedDate.getFullYear()
    
    );

    const expensivesTotal=expensives
    .reduce((acumullator: number, expensive: TransactionsData) =>
     {return acumullator+ Number (expensive.amount);
        
    },0);

    const totalByCategory: categoryData[]=[];

    categories.forEach(category=>{
        let categorySum=0;
        const totalFormatted=categorySum.toLocaleString('pt-BR',{
            style:'currency',
            currency:'BRL'
        })
        expensives.forEach((expensive:TransactionsData)=>{
            if (expensive.category===category.key){
                categorySum +=Number(expensive.amount);
            }

        });
        const percent= `${(categorySum/expensivesTotal*100).toFixed(0)}%`;
        if(categorySum>0){
            totalByCategory.push({
                name: category.name,
                color: category.color,
                key: category.key,
                total: categorySum,
                totalFormatted,
                percent
            
                
                
            });
            

        }
       
    })
    setTotalByCategories(totalByCategory);
    setLoading(false);
         }
      

         useFocusEffect(useCallback(()=>{
            // const datakey='@gofinances: trasactions';
            // AsyncStorage.removeItem(datakey);
            loadData();
        },[selectedDate]));
       

    return(
        <Container>
            
            
            <Header>
            {
             isLoading ? <LoadContainer>
                <ActivityIndicator color={theme.colors.primary}
                size="large"
                />

            </LoadContainer> :
                <Title>
                    Resumo da Categoria
                </Title>
}
            </Header>
            <Content showVerticalScrollIndicator={false}
            contentContainerStyle={{paddinHorizontal:24, 
                paddinBotton:useBottomTabBarHeight(),}}

                
    >
         <MothSelect>
                    <MothSelectButton onPress={()=>handleDateChange('prev')}>
                        <MothSelectIcon name='chevron-left' />
                    </MothSelectButton>
                    <Month>{format(selectedDate, 'MMMM, yyyy',{locale:ptBR})}</Month>
                    <MothSelectButton onPress={()=>handleDateChange('next')}>
                        <MothSelectIcon name='chevron-right'/>
                        </MothSelectButton>
                    <MothSelect/>

                    </MothSelect>
                <ChartContainer>
                <VictoryPie width={300} data={totalByCategories}
                x='percent'
                y='total'
                colorScale={totalByCategories.map(Category=>Category.color)}
                style={{
                    labels: {
                        fontSize:RFValue(18),
                        fontWeight: 'bold',
                        fill: theme.colors.shape,
                    }
                }}
                />
                </ChartContainer>
            {

                
                totalByCategories.map(item=>(
            <HistoryCard title={item.name}
                amount={item.totalFormatted}
                color={item.color}
                key={item.key}
                />
                

               
                
    ))
                
            }
            
            </Content>
            
        

            </Container>
            );
}
