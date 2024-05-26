import { View, Image, Pressable, useColorScheme, StyleSheet, useWindowDimensions, Modal } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '../../components/Themed';
import { useUser } from '@/src/hooks/useUser';
import { Avatar } from '@/src/components/avatars/avatar';
import { useUserFollows } from '@/src/hooks/useUserFollows';
import { Entypo, FontAwesome, Fontisto, MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from 'react';
import { fetchUser } from '@/src/utils/fetch/fetchUser';
import { supabase } from '@/src/lib/supabase';
import { useUserFeed, useUserFeedByUsername } from '@/src/hooks/useUserFeed';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import Item from '@/src/components/Item';
import { PressableAnimated } from '@/src/components/pressables/PressableAnimated';
import { useIsFocused } from '@react-navigation/native';
import StoryComponent from '@/src/components/StoryComponent';
import { Ionicons } from '@expo/vector-icons';
import { FollowsModal } from '@/src/components/modals/FollowsModal';
import { InfoWithEmoji } from '@/src/components/InfoWithEmoji';

export default function ProfileUsernameScreen() {

  const isFocused = useIsFocused(); // Get focused state
  const colorScheme = useColorScheme();
  const { width } = useWindowDimensions();
  const { username } = useLocalSearchParams();
  const usernameAsTitle = Array.isArray(username) ? username[0] : username;
  const [followsModalVisible, setFollowsModalVisible] = useState(false); //follows modal
  const [storyIndex, setStoryIndex] = useState<any>(null);

  //CONSUME PROVIDERS
  const { user } = useUser(username);
  const { followed, followers, following } = useUserFollows(username);
  const { feed, refetch } = useUserFeedByUsername(username);

  console.log("feed", feed)

  //SPINNING CAROUSELL ANIMATION 
  const x = useSharedValue(0);
  const ITEM_WIDTH = 250;
  const ITEM_HEIGHT = 450;
  const MARGin_HORIZONTAL = 20;
  const ITEM_FULL_WIDTH = ITEM_WIDTH + MARGin_HORIZONTAL * 2;
  const SPACER = (width - ITEM_FULL_WIDTH) / 2;

  const onScroll = useAnimatedScrollHandler({
    onScroll: event => {
      x.value = event.contentOffset.x;
    },
  });

  //OPEN CLOSE STORY MODAL 
  const [insideModal, setInsideModal] = useState(false);
  function openModal() { setInsideModal(true); }
  function closeModal() { setInsideModal(false); }

  const [insideStory, setInsideStory] = useState(false);
  function openStory() { setInsideStory(true); openModal(); }
  function closeStory() { setInsideStory(false); closeModal() }

  //HANDLE PRESS ITEM
  const handleItemPress = (index: number) => {
    setStoryIndex(index);
    openStory();
  };

  if (!user) return <><Text>User not found</Text></>

  return (
    <>
      {insideStory ?
        // STORY MODAL
        <Modal
          visible={insideModal}
          onRequestClose={() => closeModal()}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <StoryComponent data={feed} storyIndex={storyIndex} onFinishStory={closeStory} />
        </Modal>
        :
        <>
          {/* HEADER */}
          <Stack.Screen options={{
            headerShown: true,
            headerBackTitle: 'Back',
            title: '@' + usernameAsTitle ?? '',
            headerRight: () => (
              <View>
                {followed ?
                <PressableAnimated className="py-1 px-3 flex-row justify-center" onPress={() => setFollowsModalVisible(true)}>
                  <Text>Following ✓</Text>
                </PressableAnimated> : <PressableAnimated className="bg-accent py-1 px-3 flex-row justify-center" onPress={() => setFollowsModalVisible(true)}>
                  <Text className='text-black font-medium'>Follow</Text>
                </PressableAnimated>}
              </View>
            )
          }} />
          {/* FOLLOWS MODAL */}
          <FollowsModal visible={followsModalVisible} data={user} onClose={() => setFollowsModalVisible(false)}/>

          {/* SPINNING CAROUSEL */}
          {feed?.length > 0 ? 
            <View style={styles.container}>
            <Animated.FlatList
              onScroll={onScroll}
              ListHeaderComponent={<View />}
              ListHeaderComponentStyle={{ width: SPACER }}
              ListFooterComponent={<View />}
              ListFooterComponentStyle={{ width: SPACER }}
              data={feed}
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => item.id + item.name}
              renderItem={({ item, index }) => {
                return (
                  <Item
                    item={item}
                    index={index}
                    x={x}
                    width={ITEM_WIDTH}
                    height={ITEM_HEIGHT}
                    marginHorizontal={MARGin_HORIZONTAL}
                    fullWidth={ITEM_FULL_WIDTH}
                    onPress={handleItemPress}
                  />
                );
              }}
              horizontal
              scrollEventThrottle={16}
              decelerationRate="fast"
              snapToInterval={ITEM_FULL_WIDTH}
            />
          </View>
          :
          <View className='flex-1 p-20'><InfoWithEmoji emoji={'🤫'} text={`User hasn't posted yet`} /></View>
          }
          
          {/* USER INTRO */}
          <View className={`${colorScheme == "dark" ? "bg-zinc-900" : "bg-white"} w-full items-center justify-center p-10`}>
            <View className='absolute' style={{ top: -30 }}>
              <Avatar
                avatar_url={user.avatar_url}
                username={user.username}
                size="lg"
                ring={true}
              ></Avatar>
            </View>
            <Text className='font-medium text-lg text-accent'>@{user.username}</Text>
            <Pressable className="flex-row gap-1 mb-3">
              <Text className="font-semibold text-lg text-accent">
                {followers?.length}
              </Text>
              <Text className="text-lg">followers</Text>
              {/* <Text className="font-semibold text-lg text-accent">
            {following?.length}
          </Text>
          <Text className="text-lg">following</Text> */}
            </Pressable>
            <PressableAnimated
              onPress={() => alert("djhdjs")}>
              <Text className="text-lg"> </Text>
              <Text className="text-base">Tip Now</Text>
              <MaterialCommunityIcons
                name="ethereum"
                size={17}
                color={colorScheme === "dark" ? "white" : "black"} // Adjust color based on colorScheme
              />
            </PressableAnimated>
          </View>
        </>}
    </>

  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
    flex: 1,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 20,
  },
  textContainer: {
    flex: 2,
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: 26,
    fontWeight: '300',
    textAlign: 'center',
  },
});