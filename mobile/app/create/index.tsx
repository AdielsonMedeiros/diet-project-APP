    import { zodResolver } from "@hookform/resolvers/zod";
    import { router, useLocalSearchParams } from "expo-router";
    import React from "react";
    import { Controller, useForm } from "react-hook-form";
    import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    } from "react-native";
    import { z } from "zod";
    import { useDataStore } from "@/store/data";
    import { Feather } from '@expo/vector-icons'; // ✅ 1. Importar a biblioteca de ícones

    // ✅ Objeto de cores definido
    const colors = {
    background: "#121212",
    green: "#1DB954",
    white: "#FFFFFF",
    grey: "#B3B3B3",
    error: "#FF5A5F",
    cardBackground: "#282828",
    cardSelected: "#1DB954",
    };

    // ✅ 2. Componente Header atualizado para incluir a seta
    const Header = ({ step, title, onBackPress }: { step: string; title: string; onBackPress: () => void; }) => (
        <View style={styles.headerContainer}>
            <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
                <Feather name="arrow-left" size={24} color={colors.white} />
            </TouchableOpacity>
            <View>
                <Text style={styles.headerStepText}>{step}</Text>
                <Text style={styles.headerTitleText}>{title}</Text>
            </View>
        </View>
    );

    // ✅ COMPONENTE ChoiceSelector ESTILIZADO PARA O TEMA ESCURO
    type ChoiceOption = {
    label: string;
    value: string;
    description?: string;
    };

    type ChoiceSelectorProps = {
    options: ChoiceOption[];
    onSelect: (value: string) => void;
    selectedValue: string;
    horizontal?: boolean;
    };

    const ChoiceSelector = ({
    options,
    onSelect,
    selectedValue,
    horizontal,
    }: ChoiceSelectorProps) => (
    <View style={horizontal && styles.choiceHorizontalContainer}>
        {options.map((option) => (
        <TouchableOpacity
            key={option.value}
            style={[
            styles.choiceButton,
            selectedValue === option.value && styles.choiceButtonSelected,
            horizontal && { flex: 1 },
            ]}
            onPress={() => onSelect(option.value)}
        >
            <Text
            style={[
                styles.choiceButtonText,
                selectedValue === option.value && styles.choiceButtonTextSelected,
            ]}
            >
            {option.label}
            </Text>
            {option.description && (
            <Text style={styles.choiceDescriptionText}>
                {option.description}
            </Text>
            )}
        </TouchableOpacity>
        ))}
    </View>
    );

    // Validação com Zod (sem alterações)
    const schema = z.object({
    gender: z.string().min(1, { message: "O sexo é obrigatório" }),
    objective: z.string().min(1, { message: "O objetivo é obrigatório" }),
    level: z.string().min(1, { message: "Selecione seu nível de atividade" }),
    });

    type FormData = z.infer<typeof schema>;

    export default function Create() {
    const stepOneData = useLocalSearchParams();

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const setPageTwo = useDataStore((state) => state.setPageTwo);

    const levelOptions = [
        {
        label: "Sedentário",
        value: "sedentario",
        description: "Pouco ou nenhuma atividade física",
        },
        {
        label: "Levemente Ativo",
        value: "levemente_ativo",
        description: "Exercícios 1 a 3 vezes na semana",
        },
        {
        label: "Moderadamente Ativo",
        value: "moderadamente_ativo",
        description: "Exercícios 3 a 5 vezes na semana",
        },
        {
        label: "Altamente Ativo",
        value: "altamente_ativo",
        description: "Exercícios 5 a 7 dias por semana",
        },
    ];
    const genderOptions = [
        { label: "Masculino", value: "masculino" },
        { label: "Feminino", value: "feminino" },
    ];
    const objectiveOptions = [
        { label: "Emagrecer", value: "emagrecer" },
        { label: "Hipertrofia", value: "hipertrofia" },
        { label: "Hipertrofia + Definição", value: "hipertrofia_definicao" },
        { label: "Definição", value: "definicao" },
    ];

    function handleCreate(data: FormData) {
        setPageTwo({
        level: data.level,
        gender: data.gender,
        objective: data.objective,
        });

        const allData = {
        ...stepOneData,
        sexo: data.gender,
        objetivo: data.objective,
        nivel: data.level,
        };

        router.push({
        pathname: "/nutrition",
        params: allData,
        });
    }

    return (
        <View style={styles.container}>
        {/* ✅ 3. Chamada do Header atualizada para passar a função de voltar */}
        <Header 
            step="Etapa 2 de 2" 
            title="Detalhes e objetivos" 
            onBackPress={() => router.back()}
        />
        <ScrollView
            style={styles.contentContainer}
            showsVerticalScrollIndicator={false}
        >
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
            {errors.gender && (
            <Text style={styles.errorText}>{errors.gender.message}</Text>
            )}

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
            {errors.objective && (
            <Text style={styles.errorText}>{errors.objective.message}</Text>
            )}

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
            {errors.level && (
            <Text style={styles.errorText}>{errors.level.message}</Text>
            )}

            <Pressable style={styles.button} onPress={handleSubmit(handleCreate)}>
            <Text style={styles.buttonText}>Finalizar</Text>
            </Pressable>
        </ScrollView>
        </View>
    );
    }

    // ✅ 4. ESTILOS ATUALIZADOS
    const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    contentContainer: {
        paddingHorizontal: 24,
    },
    // Estilos para o novo Header
    headerContainer: {
        paddingHorizontal: 24,
        paddingTop: 24,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    backButton: {
        padding: 4, // Aumenta a área de toque
    },
    headerStepText: {
        color: colors.grey,
        fontSize: 16,
    },
    headerTitleText: {
        fontSize: 24,
        fontWeight: "bold",
        color: colors.white,
    },
    label: {
        fontSize: 18,
        color: colors.white,
        fontWeight: "bold",
        marginBottom: 16,
        marginTop: 24,
    },
    button: {
        backgroundColor: colors.green, // Cor do botão ajustada para verde
        width: "100%",
        height: 50,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 40,
        marginBottom: 40,
    },
    buttonText: {
        fontSize: 16,
        color: colors.white,
        fontWeight: "bold",
    },
    errorText: {
        color: colors.error,
        fontSize: 12,
        marginTop: 8,
    },
    // Estilos para o ChoiceSelector
    choiceHorizontalContainer: {
        flexDirection: "row",
        gap: 16,
    },
    choiceButton: {
        backgroundColor: colors.cardBackground,
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    choiceButtonSelected: {
        backgroundColor: colors.cardSelected,
        borderColor: colors.green,
    },
    choiceButtonText: {
        color: colors.white,
        fontWeight: "bold",
        fontSize: 16,
        textAlign: 'center'
    },
    choiceButtonTextSelected: {
        color: colors.white,
    },
    choiceDescriptionText: {
        color: colors.grey,
        fontSize: 12,
        marginTop: 4,
        textAlign: 'center'
    },
    });
