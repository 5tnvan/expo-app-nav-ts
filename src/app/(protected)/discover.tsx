import { View, Image, useColorScheme, ScrollView, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { Text } from '../../components/Themed'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import FeedCarouselByTime from '@/src/components/carousel/FeedCarouselByTime';
import FeedCarouselByCountry from '@/src/components/carousel/FeedCarouselByCountry';
import { SearchUserModal } from '@/src/components/modals/SearchUserModal';
import { FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import { PressableAnimated } from '@/src/components/pressables/PressableAnimated';
import { useState } from 'react';

export default function DiscoverScreen() {
  const colorScheme = useColorScheme();
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [chosenTab, setChosenTab] = useState('time');

  return (
    <>
      {/* HEADER: Discover & Search */}
      <View className='flex-row justify-between mt-12 p-3'>
        <View>
          <Text className='text-2xl font-semibold'>Discover</Text>
        </View>
        <TouchableOpacity className='' onPress={() => setSearchModalVisible(true)}>
          <FontAwesome5 name="search" size={24} color={colorScheme == 'dark' ? 'white' : 'black'} />
        </TouchableOpacity>
      </View>

      {/* TABs */}
      <View className='flex-row mb-1 w-full'>
        <Pressable
          className={`${chosenTab == 'time' ? 'bg-accent' : colorScheme == 'dark' ? 'bg-zinc-900' : 'bg-white'} flex-col justify-center py-6 mr-1 rounded-lg items-center grow`}
          onPress={() => setChosenTab('time')}>
          <FontAwesome6 name="clock" size={26} color={colorScheme == 'dark' ? 'white' : 'black'} />
          <Text className='text-lg mt-3'>Time to remember</Text>
        </Pressable>
        <Pressable
          className={`${chosenTab == 'country' ? 'bg-accent' : colorScheme == 'dark' ? 'bg-zinc-900' : 'bg-white'} flex-col justify-center items-center py-6 rounded-lg  grow`}
          onPress={() => setChosenTab('country')}>
            <FontAwesome6 name="location-arrow" size={26} color={colorScheme == 'dark' ? 'white' : 'black'} />
          <Text className='text-lg mt-3'>A location to visit</Text>
        </Pressable>
      </View>


      {/* SEARCH MODAL */}
      {searchModalVisible && <SearchUserModal visible={searchModalVisible} onClose={() => setSearchModalVisible(false)} />}

      {/* FEEDS */}

      {chosenTab == 'time' && <FeedCarouselByTime />}
      {chosenTab == 'country' && <FeedCarouselByCountry />}
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    height: 70,
    marginHorizontal: 10,
    marginBottom: 10,
  },
  logo: {
    width: 75,
    height: 50,
    resizeMode: "contain",
  },
});