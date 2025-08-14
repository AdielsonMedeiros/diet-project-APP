import { colors } from "@/constants/colors";
import { useDataStore } from "@/store/data";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { Link, router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View, Share, ActivityIndicator } from "react-native";
import { Data } from "../../types/data";
import { api } from "../services/api";

interface ResponseData {
    data: Data;
}

// --- Definição de Tipos ---
// Definimos o formato (a "interface") de um objeto de refeição.
interface RefeicaoType {
  nome: string;
  horario: string;
  alimentos: string[];
}

// Dizemos que as props do MealCard devem conter um objeto 'refeicao' com o formato acima.
interface MealCardProps {
  refeicao: RefeicaoType;
}

// Dizemos que as props do SupplementsCard devem conter um array de strings chamado 'suplementos'.
interface SupplementsCardProps {
  suplementos: string[];
}


// --- Componentes Internos para melhor organização ---

// Componente para o estado de Carregamento
const LoadingScreen = () => (
    <View style={styles.statusContainer}>
        <ActivityIndicator size="large" color={colors.white} />
        <Text style={styles.statusText}>Gerando sua dieta...</Text>
    </View>
);

// Componente para o estado de Erro
const ErrorScreen = () => (
    <View style={styles.statusContainer}>
        <Text style={styles.statusText}>Falha ao gerar dieta</Text>
        <Link href="/">
            <Text style={[styles.statusText, styles.retryText]}>Tente novamente</Text>
        </Link>
    </View>
);

// Componente para o Cartão de Refeição (AGORA COM TIPOS)
const MealCard = ({ refeicao }: MealCardProps) => ( // << AQUI aplicamos o tipo
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
            <Text style={styles.itemSubtitle}>Alimentos:</Text>
            {/* Agora o TypeScript sabe que 'alimento' é uma string! */}
            {refeicao.alimentos.map((alimento) => (
                <Text key={alimento} style={styles.foodListItem}>- {alimento}</Text>
            ))}
        </View>
    </View>
);

// Componente para o Cartão de Suplementos (AGORA COM TIPOS)
const SupplementsCard = ({ suplementos }: SupplementsCardProps) => ( // << AQUI aplicamos o tipo
     <View style={[styles.card, { marginBottom: 24 }]}>
        <Text style={styles.cardTitle}>Dica de suplementos</Text>
        {/* Agora o TypeScript sabe que 'item' é uma string! */}
        {suplementos.map((item) => (
            <Text key={item} style={styles.foodListItem}>{item}</Text>
        ))}
    </View>
);


export default function Nutrition() {
    const user = useDataStore((state) => state.user);

    const { data, isFetching, error } = useQuery({
        queryKey: ["nutrition"],
        queryFn: async () => {
            if (!user) {
                throw new Error("Usuário não encontrado para gerar a dieta.");
            }
            const response = await api.post<ResponseData>("/create", {
                name: user.name,
                age: user.age,
                gender: user.gender,
                height: user.height,
                weight: user.weight,
                objective: user.objective,
                level: user.level
            });
            return response.data.data;
        },
        retry: false, 
    });

    async function handleShare() {
        if (!data) return;

        const mealsText = data.refeicoes
            .map(item => `\n- ${item.nome} (${item.horario}):\n  ${item.alimentos.join(', ')}`)
            .join('');

        const supplementsText = data.suplementos.join(', ');

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
                    <Text style={styles.cardTitle}>Refeições</Text>
                    {data.refeicoes.map((refeicao) => (
                        <MealCard key={refeicao.nome} refeicao={refeicao} />
                    ))}
                </View>

                <SupplementsCard suplementos={data.suplementos} />

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