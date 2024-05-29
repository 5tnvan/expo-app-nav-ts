import React, { useState, useRef, useEffect } from 'react';
import { ActivityIndicator, FlatList, Pressable, View, Text } from 'react-native';
import PostItem from './PostItem';
import { useUserFollowingFeed } from "@/src/hooks/useUserFollowingFeed";
import { useIsFocused } from '@react-navigation/native';
import { PressableAnimated } from '../pressables/PressableAnimated';
import { useRouter } from 'expo-router';

export default function Posts({ setIsScrolling, following }: any) {
  const isFocused = useIsFocused();
  const router = useRouter();

  // FETCH DIRECTLY
  const { isLoading, feed: userFollowingFeed, fetchMore, refetch } = useUserFollowingFeed();

  // FIGURE OUT WHICH VIDEO IS IN USER'S VIEW TO PLAY
  const [playingIndex, setPlayingIndex] = useState<any>(null);
  const viewabilityConfig = { itemVisiblePercentThreshold: 50 };
  const onViewableItemsChanged = ({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setPlayingIndex(viewableItems[0].index);
    }
  };
  const viewabilityConfigCallbackPairs = useRef([{ viewabilityConfig, onViewableItemsChanged }]);

  // HANDLE SCROLL
  const handleScroll = (event: any) => {
    if (setIsScrolling) {
      const scrollY = event.nativeEvent.contentOffset.y;
      setIsScrolling(scrollY > 0);
    }
  };

  // HANDLE TOGGLE MUTE
  const [isMuted, setIsMuted] = useState(true);
  const handleToggleMute = () => {
    setIsMuted(!isMuted);
  };

  // HANDLE END REACHED
  const handleEndReached = () => {
    console.log("end reached");
    if (!isLoading) {
      fetchMore();
    }
  };

  // HANDLE REFRESH
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    refetch();
    setRefreshing(false);
  };

  console.log("playingIndex", playingIndex);
  console.log("following", following);
  // PAUSE ALL VIDEOS WHEN NOT IN FOCUS
  useEffect(() => {
    if (!isFocused) {
      setPlayingIndex(null);
    }
  }, [isFocused]);


  return (
    <>
    {following && following.length == 0 && userFollowingFeed && userFollowingFeed.length == 0 && !isLoading &&
    <View className="flex-row justify-center items-center grow ">
      <PressableAnimated onPress={() => router.push("/discover")}>🥳 Start following someone</PressableAnimated>
    </View>
    }
    {following && following.length > 0 && userFollowingFeed && userFollowingFeed.length == 0 && !isLoading &&
    <View className="flex-row justify-center items-center grow ">
      <PressableAnimated onPress={() => handleRefresh()}>🎉 Start feed</PressableAnimated>
    </View>
    }
    {userFollowingFeed && userFollowingFeed.length > 0 && 
      <FlatList
        data={userFollowingFeed}
        renderItem={({ item, index }) => (
          <PostItem
            item={item}
            isPlaying={index === playingIndex}
            isMuted={isMuted}
            toggleMute={handleToggleMute}
          />
        )}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.1} // Adjust the threshold as needed
        ListFooterComponent={() => (isLoading ? <ActivityIndicator size="large" color="#000" /> : null)}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />}
    </>
  );
}
