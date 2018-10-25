'use strict';

import { AsyncStorage } from 'react-native';

export default async function getAsyncStorageBridgeList() {
  try {
    const value = await AsyncStorage.getItem('BridgeList');
    if (value !== null) {
      return JSON.parse(value)
    } else {
      return []
    }
  } catch (error) {
    return []
  }
}