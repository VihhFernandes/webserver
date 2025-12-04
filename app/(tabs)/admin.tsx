import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from "react-native";
import { supabase } from "../../lib/supabase";
import { useRouter } from "expo-router";

export default function Admin() {
  const router = useRouter();
  const [produtos, setProdutos] = useState([]);

  const [titulo, setTitulo] = useState("");
  const [preco, setPreco] = useState("");
  const [imagem, setImagem] = useState("");
  const [editandoId, setEditandoId] = useState(null);

  async function carregar() {
    const { data } = await supabase.from("products").select("*");
    setProdutos(data);
  }

  useEffect(() => {
    carregar();
  }, []);

  async function salvarProduto() {
    if (!titulo || !preco) {
      Alert.alert("Erro", "Preencha título e preço");
      return;
    }

    if (editandoId) {
      await supabase.from("products").update({
        title: titulo,
        price: preco,
        image: imagem
      }).eq("id", editandoId);
    } else {
      await supabase.from("products").insert({
        title: titulo,
        price: preco,
        image: imagem
      });
    }

    setTitulo("");
    setPreco("");
    setImagem("");
    setEditandoId(null);
    carregar();
  }

  async function deletar(id) {
    await supabase.from("products").delete().eq("id", id);
    carregar();
  }

  function editar(produto) {
    setTitulo(produto.title);
    setPreco(String(produto.price));
    setImagem(produto.image);
    setEditandoId(produto.id);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gerenciamento de Estoque</Text>

      <TextInput style={styles.input} placeholder="Título" value={titulo} onChangeText={setTitulo} />
      <TextInput style={styles.input} placeholder="Preço" value={preco} onChangeText={setPreco} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="URL da Imagem" value={imagem} onChangeText={setImagem} />

      <TouchableOpacity style={styles.botaoSalvar} onPress={salvarProduto}>
        <Text style={styles.textSalvar}>{editandoId ? "Salvar Alterações" : "Cadastrar produto"}</Text>
      </TouchableOpacity>

      <FlatList
        data={produtos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={{ flex: 1 }}>
              <Text style={styles.prodTitle}>{item.title}</Text>
              <Text>R$ {Number(item.price).toFixed(2)}</Text>
            </View>

            <TouchableOpacity onPress={() => editar(item)} style={styles.botaoEditar}>
              <Text style={styles.btnTxt}>Editar</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => deletar(item.id)} style={styles.botaoDelete}>
              <Text style={styles.btnTxt}>Del</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <TouchableOpacity style={styles.botaoVoltar} onPress={() => router.push("/")}>
        <Text style={styles.btnTxt}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#f8fafc"
  },
  container: {
    flex: 1,
    padding: 18,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 18,
    textAlign: "center",
    color: "#0b1320"
  },
  input: {
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#e6eef8",
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  botaoSalvar: {
    backgroundColor: "#0b74ff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  textSalvar: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 15
  },
  item: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  prodTitle: {
    fontWeight: "800",
    fontSize: 16,
    color: "#0b1320"
  },
  prodPrice: {
    marginTop: 4,
    color: "#047857",
    fontWeight: "700"
  },
  botaoEditar: {
    backgroundColor: "#f59e0b",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginHorizontal: 6,
  },
  botaoDelete: {
    backgroundColor: "#ef4444",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginHorizontal: 6,
  },
  botaoVoltar: {
    backgroundColor: "#0b1220",
    padding: 14,
    borderRadius: 12,
    marginTop: 8,
    alignItems: "center",
  },
  btnTxt: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 14
  }
});