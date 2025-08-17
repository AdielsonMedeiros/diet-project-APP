    import { colors } from "@/constants/colors";
    import { Feather, Ionicons } from "@expo/vector-icons";
    import { useQuery } from "@tanstack/react-query";
    import { Link, router, useLocalSearchParams } from "expo-router";
    import { Pressable, ScrollView, StyleSheet, Text, View, Share, ActivityIndicator } from "react-native";
    import { api } from "../../services/api";


    interface ComposicaoAlimento {
    alimento: string;
    quantidade: string;
    }
    interface RefeicaoType {
        nome: string;
        horario: string;
        composicao: ComposicaoAlimento[];
    }
    interface ResponseData {
        nome: string;
        sexo: string;
        idade: number;
        altura: number;
        peso: number;
        objetivo: string;
        refeicoes: RefeicaoType[];
        suplementos: string[];
        taxa_metabolica_basal_diario: number;
        gasto_metabolico_basal: number;
    }
    interface MealCardProps {
        refeicao: RefeicaoType;
        isLast?: boolean; 
    }
    interface SupplementsCardProps {
        suplementos: string[];
    }

    // --- Componentes ---
    const LoadingScreen = () => (
        <View style={styles.statusContainer}>
            <ActivityIndicator size="large" color={colors.white} />
            <Text style={styles.statusText}>Gerando sua dieta...</Text>
        </View>
    );

    const ErrorScreen = () => (
        <View style={styles.statusContainer}>
            <Text style={styles.statusText}>Falha ao gerar dieta</Text>
            <Link href="/">
                <Text style={[styles.statusText, styles.retryText]}>Tente novamente</Text>
            </Link>
        </View>
    );

    
    const MealCard = ({ refeicao, isLast }: MealCardProps) => {

        const getIconName = (mealName: string) => {
            const name = mealName.toLowerCase();
            if (name.includes('café')) return 'coffee';
            if (name.includes('almoço')) return 'sunset';
            if (name.includes('jantar')) return 'moon';
            if (name.includes('lanche')) return 'grid';
            if (name.includes('ceia')) return 'star';
            return 'clipboard'; 
        };

        return (

            <View style={[styles.mealContainer, !isLast && styles.mealSeparator]}>
                <View style={styles.itemHeader}>
                    <Feather name={getIconName(refeicao.nome)} size={22} color={colors.green} />
                    <View style={styles.itemHeaderText}>
                        <Text style={styles.itemName}>{refeicao.nome}</Text>
                        <Text style={styles.itemTime}>{refeicao.horario}</Text>
                    </View>
                </View>
                <View style={styles.foodList}>
                    {(refeicao.composicao ?? []).map((item) => (
                        <Text key={item.alimento} style={styles.foodListItem}>
                            <Text style={{ fontWeight: 'bold' }}>• {item.alimento}:</Text> {item.quantidade}
                        </Text>
                    ))}
                </View>
            </View>
        );
    };

    const SupplementsCard = ({ suplementos }: SupplementsCardProps) => (
        <View style={[styles.card, { marginBottom: 24 }]}>
            <Text style={styles.cardTitle}>Dica de suplementos</Text>
            {(suplementos ?? []).map((item) => (
                <Text key={item} style={styles.foodListItem}>• {item}</Text>
            ))}
        </View>
    );


    export default function Nutrition() {
        const params = useLocalSearchParams(); 

        const { data, isFetching, error } = useQuery({
            queryKey: ["nutrition"],
            queryFn: async () => {
                if (!params.nome) { 
                    throw new Error("Dados do usuário não encontrados para gerar a dieta.");
                }
                
                const response = await api.post<{ data: ResponseData }>("/create", {
                    name: params.nome,
                    age: params.idade,
                    gender: params.sexo,
                    height: params.altura,
                    weight: params.peso,
                    objective: params.objetivo,
                    level: params.nivel
                });

                console.log("RESPOSTA DA API:", JSON.stringify(response.data, null, 2));
                return response.data.data;
            },
            retry: false,
        });

        async function handleShare() {
            if (!data) return;
            const mealsText = (data.refeicoes ?? [])
                .map((refeicao: RefeicaoType) => {
                    const composicaoText = (refeicao.composicao ?? [])
                        .map(item => `  - ${item.alimento} (${item.quantidade})`)
                        .join('\n');
                    return `\n- ${refeicao.nome} (${refeicao.horario}):\n${composicaoText}`;
                })
                .join('');
            const supplementsText = (data.suplementos ?? []).join(', ');
            const message = `Dieta: ${data.nome} - Objetivo: ${data.objetivo}\n\nRefeições:${mealsText}\n\n- Dica de suplementos: ${supplementsText}`;
            await Share.share({ message });
        }

        if (isFetching) {
            return <LoadingScreen />;
        }

        if (error || !data) {
            return <ErrorScreen />;
        }

        return (
            <View style={styles.container}>
                <View style={styles.containerHeader}>
                    <View style={styles.contentHeader}>
                        <Text style={styles.title}>Minha Dieta</Text>
                        <Pressable style={styles.buttonShare} onPress={handleShare}>
                            <Feather name="share-2" size={16} color={colors.background} />
                            <Text style={styles.buttonShareText}>Compartilhar</Text>
                        </Pressable>
                    </View>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <Text style={styles.name}>Nome: {data.nome}</Text>
                    <Text style={styles.objective}>Foco: {data.objetivo}</Text>

                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Resumo Metabólico</Text>
                        <Text style={styles.foodListItem}>
                            Taxa Metabólica Basal Diária: {data.taxa_metabolica_basal_diario} kcal
                        </Text>
                        <Text style={styles.foodListItem}>
                            Gasto Metabólico Basal: {data.gasto_metabolico_basal} kcal
                        </Text>
                    </View>

                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Refeições</Text>
                        {(data.refeicoes ?? []).map((refeicao: RefeicaoType, index) => (
                            <MealCard 
                                key={refeicao.nome} 
                                refeicao={refeicao} 
                                isLast={index === (data.refeicoes?.length ?? 0) - 1}
                            />
                        ))}
                    </View>

                    <SupplementsCard suplementos={data.suplementos ?? []} />

                    <Pressable style={styles.button} onPress={() => router.replace("/")}>
                        <Text style={styles.buttonText}>Gerar Nova Dieta</Text>
                    </Pressable>
                </ScrollView>
            </View>
        );
    }


    const styles = StyleSheet.create({
        statusContainer: {
            flex: 1,
            backgroundColor: colors.background,
            justifyContent: "center",
            alignItems: "center",
            padding: 16,
        },
        statusText: {
            fontSize: 18,
            color: colors.white,
            marginTop: 16,
            textAlign: 'center',
        },
        retryText: {
            color: colors.blue,
            fontWeight: 'bold',
            marginTop: 8,
        },
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        scrollContainer: {
            paddingHorizontal: 16,
            paddingBottom: 32,
        },
        containerHeader: {
            backgroundColor: colors.background,
            paddingTop: 60,
            paddingBottom: 20,
            paddingHorizontal: 16,
            marginBottom: 24,
            borderBottomWidth: 1,
            borderBottomColor: '#282828'
        },
        contentHeader: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
        },
        title: {
            fontSize: 28,
            color: colors.white,
            fontWeight: "bold",
        },
        buttonShare: {
            backgroundColor: colors.white,
            flexDirection: 'row',
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 8,
            paddingVertical: 8,
            paddingHorizontal: 12,
            gap: 8,
        },
        buttonShareText: {
            color: colors.background,
            fontWeight: "bold",
        },
        name: {
            fontSize: 22,
            color: colors.white,
            fontWeight: "bold",
        },
        objective: {
            color: colors.white,
            fontSize: 16,
            marginBottom: 24,
            opacity: 0.8
        },
        card: {
            backgroundColor: '#282828',
            padding: 16,
            borderRadius: 12,
            marginBottom: 16,
        },
        cardTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.white,
            marginBottom: 16,
        },

        mealContainer: {
            paddingVertical: 16,
        },
        mealSeparator: {
            borderBottomWidth: 1,
            borderBottomColor: '#3A3A3A',
        },
        itemHeader: {
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            marginBottom: 12,
        },
        itemHeaderText: {
            flex: 1,
        },
        itemName: {
            fontSize: 18,
            color: colors.white, 
            fontWeight: "bold",
        },
        itemTime: {
            color: colors.grey,
            fontSize: 14,
        },
        foodList: {
            paddingLeft: 34,
        },
        foodListItem: {
            fontSize: 15,
            color: '#E0E0E0',
            lineHeight: 22,
        },
        
        button: {
            backgroundColor: colors.green,
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 12,
            marginTop: 16,
        },
        buttonText: {
            color: colors.white,
            fontSize: 16,
            fontWeight: 'bold',
        },
    });
