import * as React from 'react';
import { Button, Image, View, Alert, StyleSheet, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';

export default class ImagePickerExample extends React.Component {
  state = {
    image: null,
    mostrarResultados: false,
    filas: [],
    tableHead: ["Alimento", "Porcentaje"]
  };

  render() {

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        { this.renderizar() }
      </View>
    );
     
  }

  renderizar(){
    let { image } = this.state;

    if(this.state.mostrarResultados){
      return(
      <View style={styles.container}>
        <Text>Reconocimiento de imagenes</Text>
        
        <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
          <Row data={this.state.tableHead} style={styles.head} textStyle={styles.text}/>
          <Rows data={this.state.filas} textStyle={styles.text}/>
        </Table>
      </View>
      )

    }else{
      return (
      <View >
      
        <Button style={{ marginBottom:100 }} title="Pick an image from camera roll" onPress={this._pickImage} />

        <Button style={divStyle} title="Open camera" onPress={this._takePhoto} />

        {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
      
      </View>
      )
    }
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
      this.identifyImage(result.base64);
    }
  };

  _takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync(options);
  
    if (!result.cancelled) {
      this.identifyImage(result.base64);
    }
  };

  identifyImage(imageData){
    app.models.predict(Clarifai.FOOD_MODEL, {base64: imageData})
        .then((response) => {
          this.parseResponse(response)
        })
        .catch((err) => alert(err));
}

  parseResponse(response){
    this.setState({
      mostrarResultados: true,
      filas: response.outputs[0].data.concepts.map(item => [item.name, item.value])
    })
  }
  
}

let options = {
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  allowsEditing: true,
  aspect: [16, 9],
  quality: 1,
  base64: true
}

const divStyle = {
  margin: 100
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  head: { height: 40, backgroundColor: '#f1f8ff' },
  text: { margin: 6 }
});

const Clarifai = require('clarifai');
const app = new Clarifai.App({apiKey: '5234ecbf19af4f7ea6bf659ebe861907'});