import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button } from 'react-native';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as mobilenet from '@tensorflow-models/mobilenet';
import * as FileSystem from 'expo-file-system';
import * as tf from '@tensorflow/tfjs-core';
import axios from 'axios';

const TomatoHealthDetection = () => {
  const [imageUri, setImageUri] = useState(null);
  const [prediction, setPrediction] = useState('');

  useEffect(() => {
    getPermission();
  }, []);

  const getPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);

    if (status !== 'granted') {
      alert('Sorry, we need media library permission to make this work!');
    }
  };

  const selectImage = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert('Permission to access media library is required!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const { uri } = result;
      setImageUri(uri);
      detectPlantHealth(uri);
    }
  };

  const detectPlantHealth = async (uri) => {
    const model = await mobilenet.load();
    const imageBuffer = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    const imageTensor = tf.node.decodeImage(imageBuffer, 3);
    const prediction = await model.classify(imageTensor);
    setPrediction(prediction[0].className);
    sendToBackend(uri, prediction[0].className);
  };
  
  fetch('/classify')
    .then(response => console.log(response))
    .then(json => console.log(json))

  return (
    <View>
      <Text>Tomato Health Detection</Text>
      <Button title="Select Image" onPress={selectImage} />
      {imageUri && <Image source={{ uri: imageUri }} style={{ width: 200, height: 200 }} />}
      {prediction && <Text>Prediction: {prediction}</Text>}
    </View>
  );
};

export default TomatoHealthDetection;
