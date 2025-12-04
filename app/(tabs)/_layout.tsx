import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="vitrini"
        options={{
          title: "Vitrine",
          headerShown: true,
        }}
      />

      <Tabs.Screen
        name="admin"
        options={{
          title: "Admin",
          headerShown: true,
        }}
      />
    </Tabs>
  );
}
