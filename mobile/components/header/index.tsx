
import { View, StyleSheet, Text, Pressable, SafeAreaView, Platform, StatusBar } from "react-native";
import { Feather } from '@expo/vector-icons'
import { colors } from "@/constants/colors";
import { router } from "expo-router";

interface HeaderProps{
    step: string;
    title: string;
}

export function Header({ step, title}: HeaderProps){
    return(
        <SafeAreaView style={styles.container}>
            
            <View style={styles.content} >

                <View style={styles.row}>

                    <Pressable onPress={()=> router.back()}>
                        <Feather name="arrow-left" size={24} color="#000" />
                    </Pressable>

                    <Text style={styles.text}>
                        {step} <Feather name="loader" size={16} color="#000" />
                    </Text>

                </View>

                <Text style={styles.title}>
                    {title}
                </Text>


            </View>

        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    container:{
        backgroundColor: colors.white,
        borderBottomRightRadius: 8,
        borderBottomLeftRadius: 8,
        marginBottom: 14,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight! + 34 : 34,
    },

    content:{
        paddingLeft: 16,
        paddingRight: 16,
        paddingBottom: 34,
        borderBottomRightRadius: 14,
        borderBottomLeftRadius: 14,
    },
    row:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 8,
    },

    text:{
        fontSize: 18,
    },
    title:{
        marginTop: 20,
        fontSize: 30,
        fontWeight: 'bold',
        color: colors.background,


    },
    

})