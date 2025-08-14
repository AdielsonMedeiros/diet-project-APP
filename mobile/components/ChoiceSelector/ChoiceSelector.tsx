import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';

// Define o "molde" para um objeto de opção
    type Option = {
    label: string;
    value: string;
    description?: string; // '?' torna a propriedade opcional
    };

// Define o "contrato" para todas as props do componente
    type ChoiceSelectorProps = {
    options: Option[];
    onSelect: (value: string) => void;
    selectedValue: string | null | undefined;
    horizontal?: boolean;
    };

// Aplica o contrato de props ao componente
    export function ChoiceSelector({
        options,
        onSelect,
        selectedValue,
        horizontal = false
    }: ChoiceSelectorProps) {
        return (
            <View style={horizontal ? styles.horizontalContainer : styles.verticalContainer}>
                {options.map((option) => {
                    const isSelected = selectedValue === option.value;
                    return (
                        <Pressable
                            key={option.value}
                            onPress={() => onSelect(option.value)}
                            style={[
                                styles.optionContainer,
                                isSelected && styles.selectedOption,
                                horizontal && styles.horizontalItem
                            ]}
                        >
                            <Text style={[styles.optionLabel, isSelected && styles.selectedText]}>
                                {option.label}
                            </Text>
                            {option.description && (
                                <Text style={[styles.optionDescription, isSelected && styles.selectedText]}>
                                    {option.description}
                                </Text>
                            )}
                        </Pressable>
                    );
                })}
            </View>
        );
    }

// Seus estilos permanecem os mesmos
const styles = StyleSheet.create({
    verticalContainer: {
        width: '100%',
    },
    horizontalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 16,
    },
    optionContainer: {
        backgroundColor: '#000000',
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    horizontalItem: {
        flex: 1,
        alignItems: 'center',
    },
    selectedOption: {
        borderColor: colors.green,
        backgroundColor: '#000000',
    },
    optionLabel: {
        color: colors.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
    optionDescription: {
        color: colors.grey,
        fontSize: 12,
        marginTop: 4,
    },
    selectedText: {
        color: colors.white,
    },
});