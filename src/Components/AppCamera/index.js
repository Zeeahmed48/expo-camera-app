import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Video } from 'expo-av';
import { FontAwesome } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

const AppCamera = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [image, setImage] = useState('');
  const [videoRecorded, setVideoRecorded] = useState('');
  const [videoStarted, setVideoStarted] = useState(false);
  const [previewImage, setPreviewImage] = useState(false);
  const [previewVideo, setPreviewVideo] = useState(false);
  const [flashMode, setFlashMode] = useState('off');
  let camera = Camera;
  let video = Video;

  useEffect(() => {
    (async () => {
      const camera = await Camera.requestPermissionsAsync();
      const audio = await Camera.requestMicrophonePermissionsAsync();
      setHasPermission(
        camera.status === 'granted' && audio.status === 'granted'
      );
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const toggleFlash = () => {
    if (flashMode === 'off') {
      setFlashMode('on');
    } else {
      setFlashMode('off');
    }
  };

  const switchCamera = () => {
    setType(
      type === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  const pickImage = async () => {
    let photo = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!photo.cancelled) {
      setImage(photo);
      setPreviewImage(true);
    }
  };

  const snap = async () => {
    try {
      if (camera) {
        let photo = await camera.takePictureAsync();
        setImage(photo);
        setPreviewImage(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const recordVideo = async () => {
    if (!videoStarted) {
      setVideoStarted(true);
      const { uri } = await camera.recordAsync();
      setVideoRecorded(uri);
      console.log(uri);
    } else {
      setVideoStarted(false);
      setPreviewVideo(true);
      await camera.stopRecording();
    }
  };

  const goBack = async () => {
    setPreviewImage(false);
    setPreviewVideo(false);
  };

  return (
    <View style={styles.container}>
      {previewImage ? (
        image && (
          <ImageBackground
            style={styles.previewImage}
            source={{ uri: image.uri }}
          >
            <View style={styles.topBar}>
              <TouchableOpacity style={styles.button} onPress={goBack}>
                <Ionicons name='chevron-back' size={22} color='black' />
              </TouchableOpacity>
            </View>
          </ImageBackground>
        )
      ) : previewVideo ? (
        <>
          <View style={styles.topBar}>
            <TouchableOpacity style={styles.button} onPress={goBack}>
              <Ionicons name='chevron-back' size={22} color='black' />
            </TouchableOpacity>
          </View>
          <Video
            ref={(ref) => {
              video = ref;
            }}
            style={styles.video}
            source={{
              uri: videoRecorded,
            }}
            useNativeControls
            resizeMode='contain'
            isLooping
          />
        </>
      ) : (
        <Camera
          style={styles.camera}
          flashMode={flashMode}
          type={type}
          ref={(ref) => {
            camera = ref;
          }}
        >
          <View style={styles.topBar}>
            <TouchableOpacity style={styles.button} onPress={toggleFlash}>
              <FontAwesome
                name='flash'
                size={22}
                color={flashMode === 'on' ? '#FFD700' : 'black'}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={switchCamera}>
              <MaterialCommunityIcons
                name='rotate-3d-variant'
                size={22}
                color='black'
              />
            </TouchableOpacity>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={pickImage}>
              <FontAwesome name='photo' size={22} color='black' />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={snap}>
              <Feather name='camera' size={22} color='black' />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={recordVideo}>
              <Feather
                name={!videoStarted ? 'video' : 'stop-circle'}
                size={22}
                color='black'
              />
            </TouchableOpacity>
          </View>
        </Camera>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#fff',
  },
  camera: {
    flex: 1,
    backgroundColor: '#000',
    position: 'relative',
  },
  topBar: {
    paddingHorizontal: 10,
    paddingTop: 50,
    paddingBottom: 10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  previewImage: {
    flex: 1,
    height: 'auto',
    resizeMode: 'cover',
  },
  video: {
    flex: 1,
  },
  buttonContainer: {
    width: '100%',
    minHeight: 80,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#000',
    position: 'absolute',
    bottom: 0,
  },
  button: {
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    backgroundColor: '#fff',
  },
});

export default AppCamera;
