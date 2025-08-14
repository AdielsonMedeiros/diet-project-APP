import React, { useState } from "react";
import { Link, useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth } from "../config/firebaseConfig"; // Caminho correto para o auth centralizado

const colors = {
  background: "#121212",
  green: "#1DB954",
  white: "#FFFFFF",
};

export default function Index() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert("Atenção", "Por favor, preencha e-mail e senha.");
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/step");
    } catch (error) {
      console.log(error);
      // @ts-ignore
      if (error.code === "auth/user-not-found") {
        Alert.alert("Erro", "Usuário não encontrado.");
      // @ts-ignore
      } else if (error.code === "auth/wrong-password") {
        Alert.alert("Erro", "Senha incorreta.");
      } else {
        Alert.alert("Erro de Login", "E-mail ou senha inválidos.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={styles.innerContainer}>
        <Image
          style={styles.logo}
          source={{ uri: "https://placehold.co/80x80/121212/1DB954?text=N" }}
        />
        <Text style={styles.title}>
          Nutri<Text style={{ color: colors.white }}>.io</Text>
        </Text>
        <Text style={styles.text}>Acesse sua conta para continuar</Text>
        <TextInput
          style={styles.input}
          placeholder="Seu e-mail"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Sua senha"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Entrando..." : "Entrar"}
          </Text>
        </TouchableOpacity>
        <Link href="/register" style={styles.linkText}>
          Não tem uma conta? Crie uma
        </Link>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 16,
    borderRadius: 8,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: colors.green,
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    color: colors.white,
    textAlign: "center",
    marginBottom: 24,
  },
  input: {
    width: "100%",
    maxWidth: 400,
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#000",
    marginBottom: 12,
  },
  button: {
    backgroundColor: colors.green,
    width: "100%",
    maxWidth: 400,
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  buttonText: {
    fontSize: 16,
    color: colors.white,
    fontWeight: "bold",
  },
  linkText: {
    color: colors.white,
    marginTop: 24,
    fontSize: 14,
    textDecorationLine: "underline",
  },
});