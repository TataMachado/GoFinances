import React, {useState} from "react";
import {Modal, 
    TouchableWithoutFeedback,
     Keyboard,
     Alert,
    } from 'react-native';
    import * as Yup from 'yup';
    import { useNavigation } from "@react-navigation/native";
    import {yupResolver} from '@hookform/resolvers/yup';
import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from "react-native-uuid";
import { InputForm } from "../../components/Forms/InputForm";
import {useForm} from 'react-hook-form';
import { Button } from "../../components/Forms/Button";
import { TransactionsTypeButton } from "../../components/Forms/TrasactionsTypeButton";
import { CategorySelectButton } from "../../components/Forms/CategorySelectBUtton";
import { CategorySelect } from "../../screans/CategorySelect";
import {Container,
    Header,
    Title,
    Form,
    Fields,
    TrasactionTypes
} from './styles';
import { useFormState } from "react-hook-form";
import { SyntheticPlatformEmitter } from "@unimodules/react-native-adapter";

interface FormData{
    name: string;
    amount: string;

}
const schema=Yup.object().shape({
    name: Yup.string().required("Nome é obrigatório"),
    amount: Yup.number().typeError("Informe um valor numérico").
    positive("O valor é postivo").required("Valor obrigatóto")

})
export function Register(){
    const datakey='@gofinances: trasactions';
    const [trasactionTypes, setTrasactionType]=useState("");
    const [categoryModalOpen, setCategoryModalOpen]=useState(false);
    const [category, setCategory]=useState({
        key: "category",
        name: "Categoria"
        

    });


    const navigation=useNavigation();

    const {
        reset,
        control,
        handleSubmit,
        formState: {errors}
    }=useForm({
        resolver: yupResolver(schema)
    });

    function handleTrasactionsTypeSelect(type:'positive'|'negative'){
        setTrasactionType(type);


    };

    function handleOpenSelectCategoryModal(){
        setCategoryModalOpen(true);
    };

    function handleCloseSelectCategoryModal(){
        setCategoryModalOpen(false);

    };

 async function handleRegister(form : FormData){
      if(!trasactionTypes)
      return Alert.alert ("Selecione o tipo da trasisão");
      if(category.name==="category")
      return Alert.alert("Selecione a categoria");

      

      const newTransaction={
          id: String(uuid.v4()),
                name: form.name,
                amount: form.amount,
               type: trasactionTypes,
                category: category.key,
                date: new Date(),
            
            
        }
            try{
              
              const data =await AsyncStorage.getItem(datakey);
              const currentData=data? JSON.parse(data):[];
              const dataFormatted=[
                  ...currentData,
                  newTransaction

              ];
               await AsyncStorage.setItem(datakey, JSON.stringify(dataFormatted));
               reset();
               setTrasactionType('');
               setCategory({
                   key: 'category',
                   name:'categoria'
               });
               navigation.navigate('Listagem');


            }catch(error){
                console.error(error);
                Alert.alert("não foi possível salvar");

            }
        
        }
        
       
    
    return(
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <Container>
        <Header>
            <Title>Cadastro</Title>
        </Header>
        <Form>
            <Fields>
        <InputForm name="name" autoCapitalize="sentences" autoCorrect={false}
         control={control} placeholder="Nome" error={errors.name && errors.name.message} />
         
        <InputForm name="amount" control={control} keyboardType="numeric"
         placeholder="Preço" error={errors.amount && errors.amount.message} />
        <TrasactionTypes>
        <TransactionsTypeButton 
        type="up"
        title="Income"
        onPress={()=>handleTrasactionsTypeSelect('positive')}
        isActive={trasactionTypes=== 'positive'}
        />
         <TransactionsTypeButton 
        type="down"
        title="Outcome"
        onPress={()=>handleTrasactionsTypeSelect('negative')}
        isActive={trasactionTypes==='negative'}
         />
         </TrasactionTypes>
        
 
        

        <CategorySelectButton title={category.name}  onPress={handleOpenSelectCategoryModal}/>
        </Fields>

        <Button title='Enviar'
        onPress={handleSubmit(handleRegister)}
        />
    
    
        </Form>

        <Modal visible={categoryModalOpen}>
            <CategorySelect 
            category={category}
            setCategory={setCategory}
            closeSelectCategory={handleCloseSelectCategoryModal}
            />
        </Modal>

       
        
    </Container>
    </TouchableWithoutFeedback>

    
    

    );
}