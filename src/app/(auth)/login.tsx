import { View, Text, Image } from 'react-native';
import AuthLogin from '../components/auth/AuthLogin';

export default function LoginPage() {
    return (
        <View className="flex flex-col justify-center items-end px-4 grow">
            <Image source={{ uri: "https://media.tenor.com/ZZu2QC-efdUAAAAi/cute-cat-white.gif" }} width={80} height={80} />
            <Text className="text-3xl text-primary">Welcome back</Text>
            <AuthLogin />
        </View>
    )
}