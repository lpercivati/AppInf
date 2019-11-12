import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import * as Permissions from "expo-permissions";
import { Camera } from "expo-camera";
import { white } from "ansi-colors";

export default class App extends React.Component {
  state = {
    showCamera: false
  };

  takePicture = async () => {
    try {
      console.log("PICTURE ATTEMPT");
      const data = await this.camera.capture();
      console.log("PICTURE TAKEN");
      Alert.alert("Path to image: " + data.uri, "ok");
    } catch (err) {
      console.log("PICTURE FAILED", err);
    }
  };

  render() {
    if (!this.state.showCamerashowCamera) {
      return (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            height: "100%"
          }}
        >
          <TouchableOpacity onPress={() => this.setState({ showCamera: true })}>
            <Text>SHOW CAMERA</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={{ flex: 1 }}>
        <Camera
          ref={cam => {
            this.camera = cam;
          }}
          style={{ flex: 1 }}
          type={Camera.Constants.Type.back}
        >
          <TouchableOpacity onPress={this.takePicture}>
            <Text style={{ color: "white", fontSize: 30, marginTop: 150 }}>
              TAKE PICTURE
            </Text>
          </TouchableOpacity>
        </Camera>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  buttonContainer: {
    margin: 115
  }
});