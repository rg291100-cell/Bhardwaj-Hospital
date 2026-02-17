import AsyncStorage from '@react-native-async-storage/async-storage';

export const FAV_KEY = 'FAV_DOCTORS';

export const getFavourites = async () => {
  try {
    const json = await AsyncStorage.getItem(FAV_KEY);
    return json ? JSON.parse(json) : [];
  } catch (e) {
    return [];
  }
};

export const toggleFavouriteDoctor = async (doctorId) => {
  try {
    const favs = await getFavourites();
    let updatedFavs;

    if (favs.includes(doctorId)) {
      updatedFavs = favs.filter(id => id !== doctorId);
    } else {
      updatedFavs = [...favs, doctorId];
    }

    await AsyncStorage.setItem(FAV_KEY, JSON.stringify(updatedFavs));
    return updatedFavs;
  } catch (e) {
    return [];
  }
};
