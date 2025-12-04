import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";

export default function Login() {
  const router = useRouter();
  const [senha, setSenha] = useState("");

  function entrarCliente() {
    router.push("/(tabs)/vitrini");
  }

  function entrarAdmin() {
    if (senha === "1234") {
      router.push("/(tabs)/admin");
    } else {
      Alert.alert("Acesso Negado", "Senha incorreta.");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>TechMarket Kiosk</Text>

      <TouchableOpacity style={styles.buttonCliente} onPress={entrarCliente}>
        <Text style={styles.buttonText}>Entrar como Cliente</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Senha Administrativa:</Text>

      <TextInput
        style={styles.input}
        placeholder="Digite a senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      <TouchableOpacity style={styles.buttonAdmin} onPress={entrarAdmin}>
        <Text style={styles.buttonText}>Área Administrativa</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#f2f2f2", // COR DE FUNDO DA TELA TODA
  },

  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff", // FUNDO DO BLOCO DA TELA
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },

  label: {
    fontSize: 16,
    color: "#555",
    marginTop: 20,
  },

  input: {
    width: "90%",
    height: 45,
    borderWidth: 1,
    borderColor: "#888",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginTop: 8,
    backgroundColor: "#fff",
  },

  buttonCliente: {
    width: "90%",
    backgroundColor: "#007bff",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },

  buttonAdmin: {
    width: "90%",
    backgroundColor: "#28a745",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  produto: {
    width: "90%",
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },

  produtoTitulo: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },

  produtoPreco: {
    fontSize: 18,
    color: "#008000",
    fontWeight: "600",
  },
});
