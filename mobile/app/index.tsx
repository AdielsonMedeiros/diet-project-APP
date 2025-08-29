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
  Platform,
} from "react-native";
import { auth } from "../config/firebaseConfig";


import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";


const colors = {
  background: "#121212",
  green: "#1DB954",
  white: "#FFFFFF",
  grey: "#B3B3B3",
  inputBackground: '#3A3A3A',
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
      if (typeof error === "object" && error !== null && "code" in error) {
        const err = error as { code: string };
        console.log(err);

        if (err.code === "auth/user-not-found" || err.code === "auth/invalid-credential") {
          Alert.alert("Erro", "E-mail ou senha inválidos.");
        } else if (err.code === "auth/wrong-password") {
          Alert.alert("Erro", "Senha incorreta.");
        } else {
          Alert.alert("Erro de Login", "Não foi possível fazer o login.");
        }
      } else {
        Alert.alert("Erro de Login", "Não foi possível fazer o login.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    
    
    <SafeAreaView style={styles.container}>
      <StatusBar 
        style="dark" 
        backgroundColor="transparent" 
        translucent 
      />
      
     
      <KeyboardAvoidingView
        style={{ flex: 1 }} 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.innerContainer}>
          <Image
            style={styles.logo}
            source={require("../assets/images/logoprojeto.png")}
          />
          <Text style={styles.title}>
            Nutri<Text style={{ color: colors.white }}>.io</Text>
          </Text>
          <Text style={styles.text}>Acesse sua conta para continuar</Text>
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
            placeholder="Sua senha"
            placeholderTextColor={colors.grey}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            keyboardAppearance="dark"
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
          <Link href="/register" asChild>
            <TouchableOpacity>
              <Text style={styles.linkText}>
                Não tem uma conta? Crie uma
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
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
  buttonText: {
    fontSize: 16,
    color: colors.white,
    fontWeight: "bold",
  },
  linkText: {
    color: colors.white,
    marginTop: 24,
    fontSize: 14,
  },
});
