import { Text, View, StyleSheet, Pressable, ScrollView } from "react-native";
import { Header } from "@/components/header";
import { colors } from "../../constants/colors";
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { useDataStore } from "@/store/data";
// 1. Importe o useLocalSearchParams para pegar os dados da rota
import { router, useLocalSearchParams } from "expo-router"; 
import { ChoiceSelector } from "@/components/ChoiceSelector/ChoiceSelector";

const schema = z.object({
    gender: z.string().min(1, { message: "O sexo é obrigatório" }),
    objective: z.string().min(1, { message: "O objetivo é obrigatório" }),
    level: z.string().min(1, { message: "Selecione seu nível de atividade" }),
});

type FormData = z.infer<typeof schema>;

export default function Create() {
    // 2. Pegue os parâmetros da rota (nome, peso, etc. da tela anterior)
    const stepOneData = useLocalSearchParams();

    const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
    });
    
    const setPageTwo = useDataStore(state => state.setPageTwo);

    const levelOptions = [
        { label: 'Sedentário', value: 'sedentario', description: 'Pouco ou nenhuma atividade física' },
        { label: 'Levemente Ativo', value: 'levemente_ativo', description: 'Exercícios 1 a 3 vezes na semana' },
        { label: 'Moderadamente Ativo', value: 'moderadamente_ativo', description: 'Exercícios 3 a 5 vezes na semana' },
        { label: 'Altamente Ativo', value: 'altamente_ativo', description: 'Exercícios 5 a 7 dias por semana' },
    ];
    const genderOptions = [
        { label: "Masculino", value: "masculino" },
        { label: "Feminino", value: "feminino" }
    ];
    const objectiveOptions = [
        { label: 'Emagrecer', value: 'emagrecer' },
        { label: 'Hipertrofia', value: 'hipertrofia' },
        { label: 'Hipertrofia + Definição', value: 'hipertrofia_definicao' },
        { label: 'Definição', value: 'definicao' },
    ];

    // 3. Modifique a função handleCreate
    function handleCreate(data: FormData) {
        // Salva os dados desta página no seu store (como você já fazia)
        setPageTwo({
            level: data.level,
            gender: data.gender,
            objective: data.objective,
        });

        // Junta os dados da tela anterior com os dados desta tela
        const allData = {
            ...stepOneData, // nome, peso, idade, altura
            sexo: data.gender, // renomeie se sua API esperar 'sexo'
            objetivo: data.objective,
            nivel: data.level, // renomeie se sua API esperar 'nivel'
        };

        // Envia TUDO para a próxima tela (/nutrition)
        router.push({
            pathname: "/nutrition",
            params: allData,
        });
    }

    return (
        <View style={styles.container}>
            <Header
                step="Etapa 2"
                title="Detalhes e objetivos"
            />
            <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
                {/* --- Sexo --- */}
                <Text style={styles.label}>Sexo:</Text>
                <Controller
                    name="gender"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                        <ChoiceSelector
                            options={genderOptions}
                            onSelect={onChange}
                            selectedValue={value}
                            horizontal
                        />
                    )}
                />
                {errors.gender && <Text style={styles.errorText}>{errors.gender.message}</Text>}


                {/* --- Objetivo --- */}
                <Text style={styles.label}>Qual seu principal objetivo?</Text>
                <Controller
                    name="objective"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                        <ChoiceSelector
                            options={objectiveOptions}
                            onSelect={onChange}
                            selectedValue={value}
                        />
                    )}
                />
                {errors.objective && <Text style={styles.errorText}>{errors.objective.message}</Text>}


                {/* --- Nível de Atividade --- */}
                <Text style={styles.label}>Nível de Atividade Física:</Text>
                <Controller
                    name="level"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                        <ChoiceSelector
                            options={levelOptions}
                            onSelect={onChange}
                            selectedValue={value}
                        />
                    )}
                />
                {errors.level && <Text style={styles.errorText}>{errors.level.message}</Text>}


                <Pressable style={styles.button} onPress={handleSubmit(handleCreate)}>
                    <Text style={styles.buttonText}>Finalizar</Text>
                </Pressable>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    contentContainer: {
        paddingHorizontal: 24,
    },
    label: {
        fontSize: 18,
        color: colors.white,
        fontWeight: 'bold',
        marginBottom: 16,
        marginTop: 24,
    },
    button: {
        backgroundColor: colors.blue, // ou colors.green
        width: '100%',
        height: 50,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 40,
    },
    buttonText: {
        fontSize: 16,
        color: colors.white,
        fontWeight: 'bold',
    },
    errorText: {
        color: '#FF5A5F', // Uma cor de erro
        fontSize: 12,
        marginTop: -8,
        marginBottom: 8,
    },
});