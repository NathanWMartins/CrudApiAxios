import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AplicativoCRUD from "./AplicativoCRUD";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="AplicativoCRUD" component={AplicativoCRUD} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
