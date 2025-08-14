

import { View, StyleSheet, Text, TextInput, KeyboardTypeOptions } from 'react-native';
import { colors } from '@/constants/colors';
import { Controller } from 'react-hook-form'

interface InputProps{
    name: string;
    control: any;
    placeholder?: string;
    rules?: object;
    error?: string;
    keyboardType: KeyboardTypeOptions;
    
}

export function Input({ name, control, placeholder, rules, error, keyboardType}: InputProps) {
    return (
    <View style={styles.input}>
        
        <Controller
            control={control}
            name={name}
            rules={rules}
            render={({field: {onChange, onBlur, value }})=> (
                <TextInput
                    placeholder={placeholder}
                    onBlur={onBlur}
                    value={value}
                    onChangeText={onChange}
                    keyboardType={keyboardType}
                />
            )}
        />

        {error &&<Text style={styles.errorText}>{error}</Text>}
        
    </View>
    );
}



const styles = StyleSheet.create({
    container:{
        marginBottom: 16,

    },
    input:{
        height: 44,
        backgroundColor: colors.white,
        paddingHorizontal: 10,
        borderRadius: 4,
    },


    errorText:{
        color: 'red',
        marginTop: 4,
        textAlign: 'right',
        
    },


})