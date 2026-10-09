import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const App = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Don's Grounded AI Empire - Native Preview</Text>
      <Text style={styles.subtext}>The full UI is being optimized for native mobile.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtext: {
    color: '#94a3b8',
    fontSize: 14,
    marginTop: 10,
  },
});

export default App;
