# TurboFilter
TurboFilter is a c++ TurboModule for React Native that provides ultra fast filtering functionality away from the js thread (Hopefully?)

TurboFilter has been tested with json datasets of up to 200mb with sub 1 second timings (Arround 120fps on Samsung 24 ultra.)

A simple example is included it contains a JSON dataset with 3000 nodes the data is displayed in tiles within a flat list.

![Screenshot_20250827_215618_RNTurboFilter](https://github.com/user-attachments/assets/b261d98b-6a3b-43e6-a57f-5f60434aaa4b)


# Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

You will likely also need to install cmake.

## Step 1: Running the project.

```sh
# Install Dependencies
npm install

# Using npm
npm start

# OR using Yarn
yarn start
```


## Step 2: Basic Example
This example will filter the dummyData object to 2 results those with `type == record` && `state == complete`
```
import { StatusBar, StyleSheet, useColorScheme, View, Text, TouchableOpacity, Alert } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import React from 'react';
import NativeTurboFilter from './specs/NativeTurboFilter';


function App() {
  const isDarkMode = useColorScheme() === 'dark';

  const testFilterArray = () => {
    try {
      // Filter criteria - only records that are complete

      const dummyData = {
        "node490": {
          "id": 490,
          "formdata": "Performance monitoring data - Entry 490",
          "type": "log",
          "state": "started"
        },
        "node1148": {
          "id": 1148,
          "formdata": "Resource allocation planning - Entry 1148",
          "type": "record",
          "state": "complete"
        },
        "node351": {
          "id": 351,
          "formdata": "Security audit trail entry - Entry 351",
          "type": "log",
          "state": "started"
        },
        "node2464": {
          "id": 2464,
          "formdata": "Profile modification request - Entry 2464",
          "type": "notification",
          "state": "shared"
        },
        "node78": {
          "type": "record",
          "state": "complete",
          "formdata": "New feature notification in review",
          "id": 78
        }
      }

      const filterCriteria = {
        type: "record",
        state: "complete"
      };

      const result = NativeTurboFilter.filterArray(dummyData, filterCriteria);

      if (result && result.length > 0) {
        Alert.alert('Filter Complete', `Found ${result.length} matching records!`);
      } else {
        Alert.alert('Filter Result', 'No matching records found.');
      }
    } catch (error) {
      Alert.alert('Error', `Failed to filter array: ${error}`);
    }
  };

  return (
    <SafeAreaProvider>
      <StatusBar barStyle= { isDarkMode? 'light-content': 'dark-content' } />
      <View>
        <TouchableOpacity onPress={ testFilterArray }>
          <Text>Test Multi - Filter(type + state)</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaProvider>
  );
}
```
