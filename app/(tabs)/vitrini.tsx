import React, { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from "react-native";
import { supabase } from "../../lib/supabase";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";

export default function Vitrine() {
  const router = useRouter();
  const [produtos, setProdutos] = useState([]);

  async function carregarProdutos() {
    try {
      const { data, error } = await supabase.from("products").select("*");
      if (error) {
        console.log("[VITRINE] Erro ao carregar produtos:", error);
        return;
      }
      // garante array mesmo quando vazio
      setProdutos(data ?? []);
    } catch (err) {
      console.log("[VITRINE] Exceção ao carregar produtos:", err);
    }
  }

  // Recarrega quando a tela ganha foco (fallback confiável)
  useFocusEffect(
    useCallback(() => {
      carregarProdutos();
    }, [])
  );

  useEffect(() => {
    // tenta criar listener realtime (caso o ambiente suporte)
    let canal: any = null;

    try {
      canal = supabase
        .channel("realtime-products")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "products" },
          (payload) => {
            console.log("[VITRINE] evento realtime:", payload.event, payload);
            // Você pode otimizar aplicando a mudança localmente com payload,
            // mas aqui recarregamos tudo para garantir consistência.
            carregarProdutos();
          }
        )
        .subscribe((status) => {
          console.log("[VITRINE] subscribe status:", status);
        });
    } catch (e) {
      console.log("[VITRINE] realtime não inicializado:", e);
    }

    return () => {
      // remove o canal caso exista
      try {
        if (canal) supabase.removeChannel(canal);
      } catch (e) {
        // em algumas versões pode ser removeAllChannels ou similar; apenas loga
        console.log("[VITRINE] erro ao remover canal realtime:", e);
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vitrine de Produtos</Text>

      <FlatList
        data={produtos}
        keyExtractor={(item) => item.id?.toString() ?? Math.random().toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {item?.image ? (
              <Image source={{ uri: item.image }} style={styles.image} />
            ) : (
              <View style={styles.noImage}>
                <Text>Sem Imagem</Text>
              </View>
            )}
            <View style={styles.cardBody}>
              <Text style={styles.nome}>{item?.title ?? "Sem título"}</Text>
              <Text style={styles.preco}>R$ {Number(item?.price ?? 0).toFixed(2)}</Text>
            </View>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 24 }}
      />

      <TouchableOpacity style={styles.botaoVoltar} onPress={() => router.push("/")}>
        <Text style={styles.textVoltar}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#eef2f7",
  },
  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 18,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    textAlign: "center",
    color: "#0f172a",
    marginBottom: 18,
    letterSpacing: 0.2,
  },
  listContent: {
    paddingBottom: 20,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    padding: 14,
    borderRadius: 14,
    marginBottom: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  image: {
    width: 96,
    height: 96,
    borderRadius: 10,
    marginRight: 14,
    resizeMode: "cover",
    backgroundColor: "#f3f4f6",
  },
  noImage: {
    width: 96,
    height: 96,
    borderRadius: 10,
    marginRight: 14,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
  },
  noImageText: {
    color: "#6b7280",
    fontSize: 12,
  },
  cardBody: {
    flex: 1,
  },
  nome: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0b1320",
    marginBottom: 6,
  },
  preco: {
    fontSize: 15,
    fontWeight: "700",
    color: "#047857",
  },
  botaoVoltar: {
    marginTop: 10,
    marginHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#0f172a",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  textVoltar: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
});
