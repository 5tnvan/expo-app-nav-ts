import { Image, Pressable, View, useColorScheme } from 'react-native';
import React, { memo, useState } from 'react';
import Animated, {
  Extrapolation,
  SharedValue,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { TimeAgo } from '../TimeAgo';
import { Text } from "../Themed";
import { FontAwesome } from '@expo/vector-icons';
import FormatNumber from '../FormatNumber';

type Props = {
  item: any;
  width: number;
  height: number;
  marginHorizontal: number;
  fullWidth: number;
  x: SharedValue<number>;
  index: number;
  onPress: (index: number) => void;
};

const WheelOfFortuneItem = ({
  item,
  width,
  height,
  marginHorizontal,
  fullWidth,
  x,
  index,
  onPress,
}: Props) => {
  const animatedStyle = useAnimatedStyle(() => {
    const rotateZ = interpolate(
      x.value,
      [(index - 1) * fullWidth, index * fullWidth, (index + 1) * fullWidth],
      [20, 0, -20],
      Extrapolation.CLAMP,
    );
    const translateY = interpolate(
      x.value,
      [(index - 1) * fullWidth, index * fullWidth, (index + 1) * fullWidth],
      [60, 0, 60],
      Extrapolation.CLAMP,
    );
    return {
      transform: [{ rotateZ: `${rotateZ}deg` }, { translateY: translateY }],
    };
  });

  const colorScheme = useColorScheme();

  return (
    <Pressable onPress={() => onPress(index)}>
      <Animated.View
        style={[
          { width: width, height: height, marginHorizontal: marginHorizontal, transformOrigin: 'bottom' },
          animatedStyle,
        ]}
        className={`${colorScheme == "dark" ? 'bg-zinc-900' : 'bg-neutral'} rounded-3xl overflow-hidden`}>

        {/* VIDEO THUMBNAIL */}
        <View className='flex-1'>
          <Image
            source={{ uri: item.thumbnail_url }}
            style={{ width: width }}
            resizeMode="cover"
            className='flex-1'
          />
        </View>

        {/* VIEWS */}
        <View className='flex-row items-center absolute top-0 right-0 px-3 py-1 m-3 rounded-full bg-white/60'>
          <View className='mr-1'><FontAwesome name="eye" size={14} color="black" /></View>
          {/* <Text className='text-black'><FormatNumber number={item["3sec_views"].view_count}/></Text> */}
          <Text className='text-black'>{item["3sec_views"] ? (
            <FormatNumber number={item["3sec_views"][0].view_count} />
          ) : (
            <Text>0</Text>
          )}</Text>
        </View>
        
        {/* BOTTOM */}
        <View className={`absolute bottom-0 w-full bg-white flex-row justify-between items-center px-4 py-2`}>
          <View>
            {item.country && <Text className={`text-black font-semibold`}>{item.country?.name}</Text>}
            <Text className='text-black'><TimeAgo timestamp={item.created_at}></TimeAgo> ago</Text>
          </View>
          <View><Image source={require('../../../assets/images/wildfire-logo-lit.png')} resizeMode="contain" className='w-12' /></View>
        </View>
      </Animated.View>
    </Pressable>
  );
};

export default memo(WheelOfFortuneItem, (prevProps, nextProps) => {
  return (prevProps.item === nextProps.item);
},);