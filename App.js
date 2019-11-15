import * as React from 'react';
import { Button, Image, View, Alert, StyleSheet, Text, ScrollView, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';

export default class ImagePickerExample extends React.Component {
  state = {
    image: null,
    mostrarResultados: false,
    filas: [],
    tableHead: ["Alimento", "Porcentaje"],
    animating: false
  };

  render() {

    return (
      <View style={{ flex: 1, alignItems: 'center'}}>
        <Text style={{ fontSize:30, paddingTop:50 }}>ComidApp!</Text>

        { this.renderizar() }
      </View>
    );
     
  }

  renderizar(){
    if(this.state.mostrarResultados){
      return(
      <View style={styles.container}>
         <ActivityIndicator
               animating = {this.state.animating}
               color = '#bc2b78'
               size = "large"/>

        <Image source={{ uri: this.state.image }} style={{ width: 200, height: 200 }} />
        <ScrollView>
          <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
            <Row data={this.state.tableHead} style={styles.head} textStyle={styles.text}/>
            <Rows data={this.state.filas} textStyle={styles.text}/>
          </Table>
        </ScrollView>

        <Button title="Back" onPress={this.irAInicio} />
      </View>
      )

    }else{
      return (
      <View >
      
        <Button style={{ marginBottom:100 }} title="Pick an image galery" onPress={this.abrirGaleria} />

        <Button style={{ marginTop: 100 }} title="Open camera" onPress={this.abrirCamara} />

      
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

  abrirGaleria = async () => {
    let result = await ImagePicker.launchImageLibraryAsync(options);

    if (!result.cancelled) {
      this.identificarImagen(result.base64, result.uri);
    }
  };

  abrirCamara = async () => {
    let result = await ImagePicker.launchCameraAsync(options);
  
    if (!result.cancelled) {
      this.identificarImagen(result.base64, result.uri);
    }
  };

  irAInicio = ()=> {
    this.setState({
      mostrarResultados: false
    })
  }

  identificarImagen(imageDataBase64, imageUri){
    this.setState({
      animating: true
    });

    app.models.predict(Clarifai.FOOD_MODEL, {base64: imageDataBase64})
        .then((response) => {
          this.setState({
            animating: false,
            image: imageUri,
            mostrarResultados: true,
            filas: response.outputs[0].data.concepts
              .filter(item => item.value > 0.6)
              .map(item => [item.name, (item.value * 100).toFixed(2) + "%"])
              //.map(item => [translate(item.name, {to: "es"}), (item.value * 100).toFixed(2) + "%"])
          })
        })
        .catch((err) => alert(err));
  }
  
}

let options = {
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  allowsEditing: true,
  aspect: [16, 9],
  quality: 1,
  base64: true
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  head: { height: 40, backgroundColor: '#f1f8ff' },
  text: { margin: 6 }
});

const Clarifai = require('clarifai');
const app = new Clarifai.App({apiKey: '5234ecbf19af4f7ea6bf659ebe861907'});