import { Stack } from "expo-router";
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  
  const queryClient = new QueryClient();

  return (
    
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
       
        <Stack
          screenOptions={{
            statusBarStyle: 'light', 
            headerShown: false,      
          }}
        >
          
          <Stack.Screen name="index" />
          <Stack.Screen name="step/index" />
          <Stack.Screen name="create/index" />
          <Stack.Screen name="nutrition/index" />
        </Stack>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}