import React from 'react'
import { RNCamera } from 'react-native-camera'
import { useCamera } from 'react-native-camera-hooks'
import { View, StyleSheet, Pressable } from 'react-native'
import { Text } from 'native-base'
import {Actions} from 'react-native-router-flux'
import { uploadImageInCloudniary } from "../../utils/sendToCloudinary";

export const CameraComponent = () => {
  const { cameraRef } = useCamera(null)

  const captureHandle = async () => {
    try {
      const options = { quality: 0.5, base64: true, mirrorImage: true }
      const data = await cameraRef.current.takePictureAsync(options)
      const { base64 } = data

      const res = await uploadImageInCloudniary(base64)
      const response = res.json()
      Actions.dialog({ url: response.url })
    } catch (error) {
      throw new Error({
        ...error,
        path: 'CameraComponent'
      })
    }
  }

  return (
    <View style={styles.body}>
      <RNCamera
        ref={cameraRef}
        style={styles.preview}
        type={RNCamera.Constants.Type.back}
      >
        <Pressable
          onPress={() => captureHandle()}
          hitSlop={{ top: 10, bottom: 10, right: 10, left: 10 }}
          android_ripple={{ color: '#00000050' }}
          style={({ pressed }) => [
            { backgroundColor: pressed ? '#dddddd' : '#1eb900' },
            styles.button
          ]}
        >
          <Text style={styles.text}>Capture</Text>
        </Pressable>
      </RNCamera>
    </View>
  )
}

const styles = StyleSheet.create({
  body: {
    flex: 1
  },
  preview: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  text: {
    color: '#ffffff',
    fontSize: 20,
    margin: 10,
    textAlign: 'center'
  },
  button: {
    width: 150,
    height: 50,
    alignItems: 'center',
    borderRadius: 5,
    margin: 10
  }
})
