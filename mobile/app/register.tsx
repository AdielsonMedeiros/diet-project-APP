import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";


import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "../config/firebaseConfig";

import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";


const colors = {
  background: "#121212",
  green: "#1DB954",
  white: "#FFFFFF",
  grey: "#B3B3B3",
  inputBackground: "#3A3A3A",
};

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (!email || !password) {
      Alert.alert("Atenção", "Por favor, preencha e-mail e senha.");
      return;
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      try {
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          createdAt: serverTimestamp(),
        });
        Alert.alert(
          "Sucesso!",
          "Sua conta foi criada. Faça o login para continuar."
        );
        router.replace("/");
      } catch (firestoreError) {
        console.log(firestoreError);
        Alert.alert(
          "Conta criada",
          "Sua conta foi criada, mas houve um erro ao salvar seus dados. Você já pode fazer login."
        );
        router.replace("/");
      }
    } catch (error) {
      console.log(error);
      if (typeof error === "object" && error !== null && "code" in error) {
        const err = error as { code: string };
        if (err.code === "auth/email-already-in-use") {
          Alert.alert("Erro", "Este e-mail já está em uso.");
        } else if (err.code === "auth/weak-password") {
          Alert.alert("Erro", "A senha precisa ter no mínimo 6 caracteres.");
        } else {
          Alert.alert("Erro de Cadastro", "Não foi possível criar a conta.");
        }
      } else {
        Alert.alert("Erro de Cadastro", "Não foi possível criar a conta.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      
      <StatusBar style="light" backgroundColor="transparent" translucent />

      
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.innerContainer}>
          <Text style={styles.title}>Crie sua conta</Text>
          <Text style={styles.text}>É rápido e fácil.</Text>
          <TextInput
            style={styles.input}
            placeholder="Seu e-mail"
            placeholderTextColor={colors.grey} 
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            keyboardAppearance="dark" 
          />
          <TextInput
            style={styles.input}
            placeholder="Sua senha (mín. 6 caracteres)"
            placeholderTextColor={colors.grey} 
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            keyboardAppearance="dark"
          />
          <TouchableOpacity
            style={styles.button}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Criando..." : "Criar Conta"}
            </Text>
          </TouchableOpacity>
          <Link href="/" asChild>
            <TouchableOpacity>
              <Text style={styles.linkText}>Já tem uma conta? Faça login</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </SafeAreaView>
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
    backgroundColor: colors.inputBackground,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.white,
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
  buttonText: { fontSize: 16, color: colors.white, fontWeight: "bold" },
  linkText: {
    color: colors.white,
    marginTop: 24,
    fontSize: 14,
  },
});
