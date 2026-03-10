import { StatusBar } from 'expo-status-bar';
import { ScrollView, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <ScrollView contentContainerClassName="flex-grow bg-stone-50 p-6 items-center">
      <StatusBar style="dark" />

      <View className="items-center mb-8 mt-16 w-full max-w-2xl">
        <Text className="text-5xl mb-4">🌐</Text>
        <Text className="text-2xl font-bold text-gray-900 mb-2 text-center">
          Universal App Template
        </Text>
        <Text className="text-sm text-gray-500 text-center leading-relaxed">
          Expo · NativeWind · Convex · Cloudflare Pages
        </Text>
      </View>

      <View className="w-full max-w-2xl gap-4">
        <View className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm">
          <Text className="text-sm font-semibold text-gray-900 mb-2">Frontend</Text>
          <Text className="text-sm text-gray-500 leading-relaxed">
            Expo Router with file-based routing.{' '}
            <Text className="font-mono text-xs text-violet-500 bg-violet-50 px-1 rounded">app/</Text>
            {' '}for screens,{' '}
            <Text className="font-mono text-xs text-violet-500 bg-violet-50 px-1 rounded">src/</Text>
            {' '}for shared code. NativeWind provides Tailwind classes on iOS, Android, and web.
          </Text>
        </View>

        <View className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm">
          <Text className="text-sm font-semibold text-gray-900 mb-2">Backend (Convex)</Text>
          <Text className="text-sm text-gray-500 leading-relaxed">
            Convex client is mounted. Define your schema in{' '}
            <Text className="font-mono text-xs text-violet-500 bg-violet-50 px-1 rounded">convex/</Text>
            {' '}and call functions with{' '}
            <Text className="font-mono text-xs text-violet-500 bg-violet-50 px-1 rounded">useQuery</Text>
            {' '}and{' '}
            <Text className="font-mono text-xs text-violet-500 bg-violet-50 px-1 rounded">useMutation</Text>.
          </Text>
        </View>

        <View className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm">
          <Text className="text-sm font-semibold text-gray-900 mb-2">Web Deployment</Text>
          <Text className="text-sm text-gray-500 leading-relaxed">
            Run{' '}
            <Text className="font-mono text-xs text-violet-500 bg-violet-50 px-1 rounded">pnpm build:web</Text>
            {' '}to export a static site to{' '}
            <Text className="font-mono text-xs text-violet-500 bg-violet-50 px-1 rounded">dist/</Text>.
            {' '}Deploy to Cloudflare Pages — Convex stays as your live backend.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
