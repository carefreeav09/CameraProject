/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, View, Button, Text} from 'react-native';
import {
  RTCView,
  mediaDevices,
  MediaStream,
  MediaStreamConstraints,
  MediaStreamTrack,
} from 'react-native-webrtc';
import {captureScreen, captureRef} from 'react-native-view-shot';

const App = () => {
  const [localStream, setLocalStream] = useState();
  const imageRef = React.useRef();

  const startLocalStream = async () => {
    const isFrontCamera = false;
    const devices = await mediaDevices.enumerateDevices();
    console.log('devices', devices);

    const facing = isFrontCamera ? 'front' : 'environment';
    const videoSourceId = devices.find(
      device => device.kind === 'videoinput' && device.facing === facing,
    );
    console.log(videoSourceId, 'video source id');
    const facingMode = isFrontCamera ? 'user' : 'environment';
    const constraints = {
      audio: true,
      video: {
        mandatory: {
          minWidth: 500,
          minHeight: 300,
          minFrameRate: 30,
        },
        facingMode,
        optional: videoSourceId ? [{sourceId: videoSourceId}] : [],
      },
    };

    const newStream = await mediaDevices.getUserMedia(constraints);
    setLocalStream(newStream);
  };

  React.useEffect(() => {
    console.log('localStream is here');

    localStream &&
      setTimeout(() => {
        captureRef(imageRef.current, {
          format: 'jpg',
          quality: 0.1,
          result: 'base64',
        }).then((data, error, result) => {
          console.log(JSON.stringify(data), 'data ma k aauyo');
        });
      }, 3000);
  }, [localStream]);

  return (
    <SafeAreaView style={styles.container} ref={imageRef}>
      <Button title="start stream" onPress={startLocalStream} />
      <View style={styles.rtcview} collapsable={false}>
        {localStream && (
          <RTCView
            style={styles.rtc}
            streamURL={localStream.toURL()}
            renderInContext={true}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  canvas: {
    display: 'none',
  },
  container: {
    backgroundColor: '#333',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
  },
  rtcview: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
    backgroundColor: 'black',
  },
  rtc: {
    width: '100%',
    height: '100%',
  },
});

export default App;
