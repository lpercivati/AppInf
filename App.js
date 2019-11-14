import * as React from 'react';
import { Button, Image, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import Clarifai from 'clarifai';

export default class ImagePickerExample extends React.Component {
  state = {
    image: null,
  };

  render() {
    let { image } = this.state;

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Button style={{ marginBottom:100 }}
          title="Pick an image from camera roll"
          onPress={this._pickImage}
        />

        <Button style={divStyle}
          title="Open camera"
          onPress={this._takePhoto}
        />

        {image &&
          <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
      </View>
    );
  }

  componentDidMount() {
    this.getPermissionAsync();
  }

  getPermissionAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
  }

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync(options);

    if (!result.cancelled) {
      this.setState({ image: result.uri });
      this.analizePhoto(result.base64);
    }
    
  };

  _takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync(options);
  
    if (!result.cancelled) {
      this.setState({ image: result.uri });
      this.analizePhoto(result.base64);
    }
  };

  analizePhoto = (base64Photo) => {
    
    clarifaiApp.models.predict(Clarifai.FOOD_MODEL, { base64: base64Photo }).then(
    function(response) {
      console.log(response.data.concepts);
    },
    function(err) {
      console.log(err);
      // there was an error
    }
  );
  }
  
}

let options = {
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  allowsEditing: true,
  aspect: [16, 9],
  quality: 1,
  base64: true
}


const clarifaiApp = new Clarifai.App({
 apiKey: '5234ecbf19af4f7ea6bf659ebe861907'
});


const divStyle = {
  margin: 100
};