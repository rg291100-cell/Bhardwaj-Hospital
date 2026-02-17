import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
  TextInput,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const Doctors = () => {
  const [search, setSearch] = useState('');
  const [expertTips, setExpertTips] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔗 Open YouTube
  const openYoutube = (url) => Linking.openURL(url);

  // 📡 Get all expert tips
  const getExpertTips = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('access_token');
      const response = await axios.get(
        'https://argosmob.uk/bhardwaj-hospital/public/api/health-tips',
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }
      );
      console.log("ajkdfhajkdfhjad", response.data);
      
      setExpertTips(response?.data?.data || []);
    } catch (error) {
      console.log('Expert Tips API Error:', error?.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔍 Search API
  const searchHealthTips = async (query) => {
    if (!query) {
      getExpertTips();
      return;
    }
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('access_token');
      const response = await axios.get(
        `https://argosmob.uk/bhardwaj-hospital/public/api/health-tips-search?q=${query}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }
      );
      setExpertTips(response?.data?.data || []);
    } catch (error) {
      console.log('Search API Error:', error?.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Initial load
  useEffect(() => {
    getExpertTips();
  }, []);

  // 🔄 Search debounce
  useEffect(() => {
    const delay = setTimeout(() => {
      if (search.length > 0) {
        searchHealthTips(search);
      } else {
        getExpertTips();
      }
    }, 500);

    return () => clearTimeout(delay);
  }, [search]);

  // 🎬 Render Item
  const renderItem = ({ item }) => {
    // ✅ Fix: Construct full image URL
    const thumbnailUrl = `https://argosmob.uk/bhardwaj-hospital/public/storage/${item.thumbnail_image}`;
    
    return (
      <TouchableOpacity 
        style={styles.card} 
        onPress={() => openYoutube(item.link)} // ✅ Fix: Use 'link' instead of 'video_link'
      >
        <Image 
          source={{ uri: thumbnailUrl }} 
          style={styles.thumbnail}
          resizeMode="cover" // ✅ Add resize mode
        />
        <Image 
          source={require('../assets/youtube.png')} 
          style={styles.playIcon} 
        />
        <Text style={styles.title}>{item.title}</Text>
        {item.description && (
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.content}>
        <Text style={styles.header}>Explore</Text>

        {/* 🔍 Search */}
        <View style={styles.searchBox}>
          <Image source={require('../assets/search.png')} style={styles.searchIcon} />
          <TextInput
            placeholder="Search videos..."
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
            placeholderTextColor="#8e8e93"
          />
        </View>

        {/* 📺 List */}
        <FlatList
          data={expertTips}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={() => (
            <Text style={styles.emptyText}>
              {loading ? 'Loading...' : 'No data found'}
            </Text>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default Doctors;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { paddingHorizontal: 16, paddingTop: 10, flex: 1 },
  header: { 
    fontSize: 20, 
    color: '#111', 
    textAlign: 'center', 
    marginVertical: 16, 
    fontFamily: 'Poppins-SemiBold' 
  },
  searchBox: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#f2f4f7', 
    borderRadius: 14, 
    paddingHorizontal: 14, 
    paddingVertical: 12, 
    marginBottom: 20 
  },
  searchIcon: { width: 20, height: 20, tintColor: '#8e8e93' },
  searchInput: { 
    flex: 1, 
    marginLeft: 10, 
    fontSize: 14, 
    color: '#000', 
    fontFamily: 'Poppins-Regular' 
  },
  card: { 
    backgroundColor: '#fff', 
    borderRadius: 16, 
    paddingBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  thumbnail: { 
    width: '100%', 
    height: 190, 
    borderRadius: 16,
    backgroundColor: '#f0f0f0' // ✅ Placeholder color while loading
  },
  playIcon: { 
    position: 'absolute', 
    top: '35%', 
    alignSelf: 'center', 
    width: 58, 
    height: 58 
  },
  title: { 
    marginTop: 12, 
    fontSize: 15, 
    color: '#111', 
    fontFamily: 'Poppins-Medium', 
    textAlign: 'center', 
    paddingHorizontal: 10, 
    lineHeight: 22 
  },
  description: {
    marginTop: 4,
    fontSize: 12,
    color: '#666',
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    paddingHorizontal: 10,
    lineHeight: 18,
  },
  separator: { height: 16 },
  emptyText: { 
    marginTop: 60, 
    textAlign: 'center', 
    color: '#8e8e93', 
    fontSize: 14, 
    fontFamily: 'Poppins-Regular' 
  },
});