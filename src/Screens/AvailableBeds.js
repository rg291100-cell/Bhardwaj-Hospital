import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const AvailableBeds = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={()=>navigation.goBack()}>
          <Icon name="arrow-left" size={26} color="#000" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Available Beds</Text>

        <View style={{ width: 26 }} />
      </View>

      {/* Filters */}
      <View style={styles.filterRow}>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Department</Text>
          <Icon name="chevron-down" size={18} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Room Type</Text>
          <Icon name="chevron-down" size={18} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Ward Title */}
        <Text style={styles.wardTitle}>Ward 3</Text>

        {/* ------ CARD 1 ------- */}
        <View style={styles.card}>
          <View style={styles.topRow}>
            <Image
              source={require('../assets/Images/Room1.png')}
              style={styles.roomImage}
            />

            <View style={{ flex: 1 }}>
              <Text style={styles.roomTitle}>Private Room</Text>
              <Text style={styles.roomSub}>Room 301</Text>
            </View>

            <Text style={styles.price}>Rs2250/night</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoBlock}>
              <Text style={styles.label}>Bed Type</Text>
              <Text style={styles.value}>Adjustable</Text>
            </View>

            <View style={styles.infoBlock}>
              <Text style={styles.label}>Amenities</Text>
              <Text style={styles.value}>TV, Wi-Fi, Private Bathroom</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.bottomRow}>
            <View>
              <Text style={styles.label}>Availability</Text>
              <Text style={styles.available}>Available</Text>
            </View>

            <TouchableOpacity 
            onPress={()=>navigation.navigate('BedBookingStatus')}
            style={styles.bookBtn}>
              <Text style={styles.bookText}>Book Now</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ------ CARD 2 ------- */}
        <View style={styles.card}>
          <View style={styles.topRow}>
            <Image
              source={require('../assets/Images/Room1.png')}
              style={styles.roomImage}
            />

            <View style={{ flex: 1 }}>
              <Text style={styles.roomTitle}>Semi-Private Room</Text>
              <Text style={styles.roomSub}>Room 302</Text>
            </View>

            <Text style={styles.price}>$150/night</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoBlock}>
              <Text style={styles.label}>Bed Type</Text>
              <Text style={styles.value}>Standard</Text>
            </View>

            <View style={styles.infoBlock}>
              <Text style={styles.label}>Amenities</Text>
              <Text style={styles.value}>TV, Shared Bathroom</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.bottomRow}>
            <View>
              <Text style={styles.label}>Availability</Text>
              <Text style={styles.available}>Available</Text>
            </View>

            <TouchableOpacity 
            onPress={()=>navigation.navigate('BedBookingStatus')}
            style={styles.bookBtn}>
              <Text style={styles.bookText}>Book Now</Text>
            </TouchableOpacity>
          </View>
        </View>
         {/* ------ CARD 2 ------- */}
        <View style={styles.card}>
          <View style={styles.topRow}>
            <Image
              source={require('../assets/Images/Room1.png')}
              style={styles.roomImage}
            />

            <View style={{ flex: 1 }}>
              <Text style={styles.roomTitle}>Semi-Private Room</Text>
              <Text style={styles.roomSub}>Room 302</Text>
            </View>

            <Text style={styles.price}>$150/night</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoBlock}>
              <Text style={styles.label}>Bed Type</Text>
              <Text style={styles.value}>Standard</Text>
            </View>

            <View style={styles.infoBlock}>
              <Text style={styles.label}>Amenities</Text>
              <Text style={styles.value}>TV, Shared Bathroom</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.bottomRow}>
            <View>
              <Text style={styles.label}>Availability</Text>
              <Text style={styles.available}>Available</Text>
            </View>

            <TouchableOpacity 
            onPress={()=>navigation.navigate('BedBookingStatus')}
            style={styles.bookBtn}>
              <Text style={styles.bookText}>Book Now</Text>
            </TouchableOpacity>
          </View>
        </View>
         {/* ------ CARD 2 ------- */}
          <Text style={styles.wardTitle}>Ward 4</Text>
        <View style={styles.card}>
          <View style={styles.topRow}>
            <Image
              source={require('../assets/Images/Room2.png')}
              style={styles.roomImage}
            />

            <View style={{ flex: 1 }}>
              <Text style={styles.roomTitle}>Deluxe Private Room</Text>
              <Text style={styles.roomSub}>Room 401</Text>
            </View>

            <Text style={styles.price}>$350/night</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoBlock}>
              <Text style={styles.label}>Bed Type</Text>
              <Text style={styles.value}>Adjustable</Text>
               <Text style={styles.value}> Recliner</Text>
            </View>

            <View style={styles.infoBlock}>
              <Text style={styles.label}>Amenities</Text>
              <Text style={styles.value}>TV, Wi-Fi, Private Bathroom , Guest {'\n'} Chair</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.bottomRow}>
            <View>
              <Text style={styles.label}>Availability</Text>
              <Text style={styles.available}>Available</Text>
            </View>

            <TouchableOpacity 
            onPress={()=>navigation.navigate('BedBookingStatus')}
            style={styles.bookBtn}>
              <Text style={styles.bookText}>Book Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AvailableBeds;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },

  // HEADER
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 15,
    marginTop:20,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },

  // FILTERS
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 10,
  },

  filterButton: {
    flexDirection: 'row',
    backgroundColor: '#FF5A00',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignItems: 'center',
    marginRight: 10,
  },

  filterText: {
    color: '#fff',
    marginRight: 4,
    fontWeight: '500',
  },

  // WARD TITLE
  wardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 16,
    marginTop: 20,
  },

  // CARD
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 0.7,
    borderColor: '#e5e5e5',
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  roomImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },

  roomTitle: {
    fontSize: 16,
    fontWeight: '600',
  },

  roomSub: {
    color: '#777',
    marginTop: 2,
  },

  price: {
    fontWeight: '700',
    color: '#333',
  },

  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 10,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  infoBlock: {
    width: '48%',
  },

  label: {
    color: '#999',
    fontSize: 13,
  },

  value: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },

  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  available: {
    color: '#1fa000',
    fontWeight: '600',
  },

  bookBtn: {
    backgroundColor: '#FF5A00',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
  },

  bookText: {
    color: '#fff',
    fontWeight: '600',
  },
});
