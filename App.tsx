/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { StatusBar, StyleSheet, useColorScheme, View, Text, TouchableOpacity, Alert, FlatList } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import React, { useState } from 'react';
import NativeTurboFilter from './specs/NativeTurboFilter';
import dummyDataObject from './dummyData.json';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const testFilterArray = () => {
    try {
      setIsLoading(true);
      // Filter criteria - only records that are complete
      const filterCriteria = {
        type: "record",
        state: "complete"
      };
      
      const result = NativeTurboFilter.filterArray(dummyDataObject, filterCriteria);
      
      if (result && result.length > 0) {
        setFilteredData(result);
        Alert.alert('Filter Complete', `Found ${result.length} matching records!`);
      } else {
        setFilteredData([]);
        Alert.alert('Filter Result', 'No matching records found.');
      }
    } catch (error) {
      Alert.alert('Error', `Failed to filter array: ${error}`);
      setFilteredData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const testSingleFilter = () => {
    try {
      setIsLoading(true);
      // Filter criteria - only by type
      const filterCriteria = {
        type: "record"
      };
      
      const result = NativeTurboFilter.filterArray(dummyDataObject, filterCriteria);
      
      if (result && result.length > 0) {
        setFilteredData(result);
        Alert.alert('Filter Complete', `Found ${result.length} records of type "record"!`);
      } else {
        setFilteredData([]);
        Alert.alert('Single Filter Result', 'No matching records found.');
      }
    } catch (error) {
      Alert.alert('Error', `Failed to filter array: ${error}`);
      setFilteredData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.tile}>
      <View style={styles.tileHeader}>
        <Text style={styles.tileType}>{item.type.toUpperCase()}</Text>
        <Text style={[styles.tileState, { backgroundColor: getStateColor(item.state) }]}>
          {item.state}
        </Text>
      </View>
      <Text style={styles.tileId}>ID: {item.id}</Text>
      <Text style={styles.tileFormData} numberOfLines={2}>{item.formdata}</Text>
    </View>
  );

  const getStateColor = (state: string) => {
    switch (state) {
      case 'complete': return '#4CAF50';
      case 'started': return '#2196F3';
      case 'draft': return '#FF9800';
      case 'shared': return '#9C27B0';
      default: return '#757575';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={testFilterArray}>
          <Text style={styles.buttonText}>Test Multi-Filter (type + state)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={testSingleFilter}>
          <Text style={styles.buttonText}>Test Single Filter (type only)</Text>
        </TouchableOpacity>
        {filteredData.length > 0 && (
          <Text style={styles.resultCount}>Showing {filteredData.length} results</Text>
        )}
      </View>
      {filteredData.length > 0 && (
        <View style={styles.listContainer}>
          <FlatList
            data={filteredData}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            contentContainerStyle={styles.flatListContent}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    padding: 20,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultCount: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  flatListContent: {
    paddingBottom: 20,
  },
  tile: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    margin: 5,
    flex: 1,
    maxWidth: '48%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tileType: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  tileState: {
    fontSize: 10,
    color: 'white',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    textAlign: 'center',
    fontWeight: '600',
  },
  tileId: {
    fontSize: 11,
    color: '#666',
    marginBottom: 4,
  },
  tileFormData: {
    fontSize: 12,
    color: '#444',
    lineHeight: 16,
  },
});

export default App;
