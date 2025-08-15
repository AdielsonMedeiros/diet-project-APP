import { colors } from "@/constants/colors";
// import { useDataStore } from "@/store/data"; // ✅ 1. REMOVA OU COMENTE ESTA LINHA
import { Feather, Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { Link, router, useLocalSearchParams } from "expo-router"; // ✅ 2. IMPORTE useLocalSearchParams
import { Pressable, ScrollView, StyleSheet, Text, View, Share, ActivityIndicator } from "react-native";
import { api } from "../services/api";

// --- As interfaces e componentes (MealCard, etc) continuam iguais ---
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
}
interface SupplementsCardProps {
    suplementos: string[];
}
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
const MealCard = ({ refeicao }: MealCardProps) => (
    <View style={styles.cardItem}>
        <View style={styles.itemHeader}>
            <Text style={styles.itemName}> {refeicao.nome} </Text>
            <Ionicons name="restaurant-outline" size={20} color={colors.black} />
        </View>
        <View style={styles.itemContent}>
            <Feather name="clock" size={14} color={colors.black} />
            <Text>Horário: {refeicao.horario}</Text>
        </View>
        <View style={styles.foodList}>
            <Text style={styles.itemSubtitle}>Composição:</Text>
            {(refeicao.composicao ?? []).map((item) => (
                <Text key={item.alimento} style={styles.foodListItem}>
                    - {item.alimento} ({item.quantidade})
                </Text>
            ))}
        </View>
    </View>
);
const SupplementsCard = ({ suplementos }: SupplementsCardProps) => (
     <View style={[styles.card, { marginBottom: 24 }]}>
        <Text style={styles.cardTitle}>Dica de suplementos</Text>
        {(suplementos ?? []).map((item) => (
            <Text key={item} style={styles.foodListItem}>{item}</Text>
        ))}
    </View>
);
// --------------------------------------------------------------------------

export default function Nutrition() {
    // const user = useDataStore((state) => state.user); // ✅ 3. ESTA LINHA NÃO É MAIS NECESSÁRIA

    const params = useLocalSearchParams(); // ✅ 4. PEGUE TODOS OS DADOS DA ROTA

    const { data, isFetching, error } = useQuery({
        queryKey: ["nutrition"],
        queryFn: async () => {
            // ✅ 5. VERIFIQUE SE OS PARÂMETROS EXISTEM
            if (!params.nome) { // Podemos checar por qualquer campo, como o nome.
                throw new Error("Dados do usuário não encontrados para gerar a dieta.");
            }
            
            // ✅ 6. USE O OBJETO `params` DIRETAMENTE NA CHAMADA DA API
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

    // A função handleShare e o resto do componente continuam iguais
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
                        <Feather name="share-2" size={16} color={colors.white} />
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
                    {(data.refeicoes ?? []).map((refeicao: RefeicaoType) => (
                        <MealCard key={refeicao.nome} refeicao={refeicao} />
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

// Estilos (sem alterações)
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
        backgroundColor: colors.white,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 16,
        marginBottom: 24,
    },
    contentHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    title: {
        fontSize: 28,
        color: colors.background,
        fontWeight: "bold",
    },
    buttonShare: {
        backgroundColor: colors.blue,
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 12,
        gap: 8,
    },
    buttonShareText: {
        color: colors.white,
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
        backgroundColor: colors.white,
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.black,
        marginBottom: 16,
    },
    cardItem: {
        backgroundColor: "rgba(230, 230, 230, 0.5)",
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
    },
    itemHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    itemName: {
        fontSize: 16,
        color: colors.black,
        fontWeight: "bold",
    },
    itemContent: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginBottom: 8,
    },
    foodList: {
        marginTop: 8,
        paddingLeft: 8,
    },
    itemSubtitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
    },
    foodListItem: {
        fontSize: 14,
        color: '#333',
        lineHeight: 20,
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