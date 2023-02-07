import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, Button, ScrollView } from 'react-native';
import { WebView } from 'react-native-webview';

const Browser = () => {
  const tabRefs = useRef([]);
  const [tabs, setTabs] = useState([{ url: 'https://www.example.com', title: 'Tab 1' }]);
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (index) => {
    setActiveTab(index);
  };

  const handleUrlChange = (index, url) => {
    const newTabs = [...tabs];
    newTabs[index].url = url;
    setTabs(newTabs);
  };

  const handleNewTab = () => {
    tabRefs.current.push(useRef(null));
    setTabs([...tabs, { url: '', title: `Tab ${tabs.length + 1}` }]);
    setActiveTab(tabs.length);
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal style={styles.tabs}>
        {tabs.map((tab, index) => (
          <Button
            key={tab.title}
            title={tab.title}
            onPress={() => handleTabChange(index)}
            color={index === activeTab ? '#2196F3' : '#BBB'}
          />
        ))}
        <Button title="+" onPress={handleNewTab} />
      </ScrollView>
      <View style={styles.controls}>
        <TextInput
          style={styles.urlInput}
          value={tabs[activeTab].url}
          onChangeText={(url) => handleUrlChange(activeTab, url)}
        />
        <Button
          title="Go"
          onPress={() => {
            tabRefs.current[activeTab].current.goForward();
          }}
        />
      </View>
      {tabs.map((tab, index) => (
        <WebView
          key={tab.title}
          ref={tabRefs.current[index]}
          source={{ uri: tab.url }}
          style={index === activeTab ? styles.webView : styles.hiddenWebView}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#EEE',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
  }
});

export default Browser;