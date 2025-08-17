import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { z } from "zod";
import { Feather } from '@expo/vector-icons'; // ✅ 1. Importar a biblioteca de ícones

import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../config/firebaseConfig";

const colors = {
  background: "#121212",
  green: "#1DB954",
  white: "#FFFFFF",
  grey: "#B3B3B3",
  error: "#ff4d4d",
  inputBackground: '#3A3A3A', 
};

// ✅ 2. Componente Header atualizado para incluir a seta
type HeaderProps = {
  title: string;
  onBackPress: () => void; // Função para ser chamada ao clicar na seta
};

const Header = ({ title, onBackPress }: HeaderProps) => (
  <View style={styles.headerContainer}>
    <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
      <Feather name="arrow-left" size={24} color={colors.white} />
    </TouchableOpacity>
    <Text style={styles.headerTitle}>
      {title}
    </Text>
  </View>
);

// Componente Input (sem alterações na lógica)
type InputProps = {
  control: any;
  name: string;
  placeholder: string;
  error?: string;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
};

const Input: React.FC<InputProps> = ({
  control,
  name,
  placeholder,
  error,
  keyboardType,
}) => (
  <>
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value } }) => (
        <TextInput
          placeholder={placeholder}
          onBlur={onBlur}
          onChangeText={onChange}
          value={value || ""}
          keyboardType={keyboardType}
          style={styles.input}
          placeholderTextColor={colors.grey} 
          keyboardAppearance="dark" 
        />
      )}
    />
    {error && (
      <Text style={{ color: colors.error, fontSize: 12, marginTop: 4 }}>
        {error}
      </Text>
    )}
  </>
);

// Validação com Zod (sem alterações)
const schema = z.object({
  name: z.string().min(1, { message: "O nome é obrigatório" }),
  weight: z.string().min(1, { message: "O peso é obrigatório" }),
  age: z.string().min(1, { message: "A idade é obrigatória" }),
  height: z.string().min(1, { message: "A altura é obrigatória" }),
});

type FormData = z.infer<typeof schema>;

export default function Step() {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function handleCreate(data: FormData) {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Erro", "Nenhum usuário autenticado.");
      router.replace("/");
      return;
    }

    try {
      const userDocRef = doc(db, "users", user.uid);
      const profileData = {
        name: data.name,
        profile: {
          weight: Number(data.weight),
          age: Number(data.age),
          height: Number(data.height),
        },
      };

      await updateDoc(userDocRef, profileData);
      
      router.push({
        pathname: "/create",
        params: {
          nome: data.name,
          peso: data.weight,
          idade: data.age,
          altura: data.height,
        },
      });
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível salvar seus dados.");
    }
  }

  return (
    <View style={styles.container}>
      {/* ✅ 3. Chamada do Header atualizada para passar a função de voltar */}
      <Header title="Etapa 1 de 2" onBackPress={() => router.push('/')} />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.label}>Nome Completo:</Text>
        <Input
          control={control}
          name="name"
          placeholder="Digite seu nome..."
          error={errors.name?.message}
        />

        <View style={styles.row}>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Peso (kg)</Text>
            <Input
              control={control}
              name="weight"
              placeholder="80"
              error={errors.weight?.message}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Altura (cm)</Text>
            <Input
              control={control}
              name="height"
              placeholder="175"
              error={errors.height?.message}
              keyboardType="numeric"
            />
          </View>
        </View>

        <Text style={styles.label}>Idade:</Text>
        <Input
          control={control}
          name="age"
          placeholder="25"
          error={errors.age?.message}
          keyboardType="numeric"
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit(handleCreate)}
        >
          <Text style={styles.buttonText}>Prosseguir</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  // ✅ 4. Novos estilos para o Header
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 0,
  },
  backButton: {
    marginRight: 16, // Espaço entre a seta e o texto
    padding: 4, // Aumenta a área de toque
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.white,
  },
  contentContainer: { flexGrow: 1, padding: 24 },
  label: {
    fontSize: 16,
    color: colors.white,
    fontWeight: "bold",
    marginTop: 24,
    marginBottom: 8,
  },
  row: { flexDirection: "row", gap: 16 },
  fieldGroup: { flex: 1 },
  button: {
    backgroundColor: colors.green,
    width: "100%",
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
    marginBottom: 40,
  },
  buttonText: { color: colors.white, fontSize: 16, fontWeight: "bold" },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: colors.inputBackground,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.white,
  },
});
