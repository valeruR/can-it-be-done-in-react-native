// @flow
import * as React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

import Header from './Header';

export const SMALL_HEADER_SIZE = 45 + 64;
export const MEDIUM_HEADER_SIZE = 300;
const {
  Extrapolate, event, Value, interpolate,
} = Animated;
const { width, height: wHeight } = Dimensions.get('window');

type HeadersProps = {
  sections: Section[],
  y: Value,
};

export default class Headers extends React.PureComponent<HeadersProps> {
  render() {
    const { sections, y } = this.props;
    const sectionHeight = wHeight / sections.length;
    const height = interpolate(
      y,
      {
        inputRange: [-wHeight + SMALL_HEADER_SIZE, -wHeight + MEDIUM_HEADER_SIZE, 0],
        outputRange: [SMALL_HEADER_SIZE, MEDIUM_HEADER_SIZE, sectionHeight],
        extrapolate: Extrapolate.CLAMP,
      },
    );
    const containerHeight = interpolate(y, {
      inputRange: [-wHeight + SMALL_HEADER_SIZE, 0],
      outputRange: [SMALL_HEADER_SIZE, wHeight],
      extrapolate: Extrapolate.CLAMP,
    });
    return (
      <Animated.View style={[styles.container, { width: width * sections.length, height: containerHeight }]}>
        {
          sections.map((section, key) => {
            const translateX = interpolate(y, {
              inputRange: [-wHeight + MEDIUM_HEADER_SIZE, 0],
              outputRange: [key * width, 0],
              extrapolate: Extrapolate.CLAMP,
            });
            const translateY = interpolate(y, {
              inputRange: [-wHeight + SMALL_HEADER_SIZE, -wHeight + MEDIUM_HEADER_SIZE, 0],
              outputRange: [-key * SMALL_HEADER_SIZE, -key * MEDIUM_HEADER_SIZE, 0],
              extrapolate: Extrapolate.CLAMP,
            });
            return (
              <Animated.View
                key={section.title}
                style={{
                  width,
                  height,
                  transform: [{ translateY, translateX }],
                }}
              >
                <Header
                  numberOfHeaders={sections.length}
                  {...{ key, section }}
                />
              </Animated.View>
            );
          })
        }
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#343761',
  },
});
