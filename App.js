import * as React from 'react';
import { Image, View, Alert, StyleSheet, Text, ScrollView, ActivityIndicator, ImageBackground } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { Icon } from 'react-native-elements'
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';


export default class ImagePickerExample extends React.Component {
  state = {
    image: null,
    mostrarResultados: false,
    filas: [],
    tableHead: ["Food", "Percentage"],
    animating: false
  };

  render() {

    return (
      <View style={styles.container}>
        <ImageBackground source={require('../AppInf/assets/fondo.jpg')} style={{width: '100%', height: '100%'}}>

        <View style={styles.boxTitle}>
           <Text style={ styles.titulo }>FoodApp!</Text>
        </View>
          { this.renderizar() }

        </ImageBackground>
      </View>
    );
     
  }

  renderizar(){
    if(this.state.mostrarResultados){
      return(
      <View style={{ flex:8 }}>

        <View style={styles.boxImagen}>
          <Image source={{ uri: this.state.image }} style={styles.imagen} />
        </View>
        <View style={{ flex:3}}>
            <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
              <Row data={this.state.tableHead} style={styles.head} textStyle={styles.text}/>
              <ScrollView>
                <Rows borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}} data={this.state.filas} textStyle={styles.text}/>
              </ScrollView>

            </Table>
        </View>
        <View style={styles.boxVolver}>
          <Icon raised size={30} name='arrow-left' type='font-awesome' color='#630090' onPress={this.irAInicio} />
          <Icon raised size={30} name='arrow-down' type='font-awesome' color='#630090' onPress={this.saveFile}/>
        </View>
      </View>
      )

    }else{
      return (
        <View style={{ flex:8 }}>
            <View style={styles.box}>
              <Icon raised size={50} name='image' type='font-awesome' color='#630090' onPress={this.abrirGaleria} />

            </View>
            <ActivityIndicator style={{opacity: this.state.animating ? 1.0 : 0.0}} animating={true} color='#bc2b78' size="large"/>
            <View style={styles.box} >
              <Icon raised size={50} name='camera-retro' type='font-awesome' color='#630090' onPress={this.abrirCamara} />

            </View>
        </View>
      )
    }
  }

  saveFile = async () => {
    let contenFile = this.createContentFile(this.state.filas.join("\n"));
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status === "granted") {
        let fileUri = FileSystem.documentDirectory + "image_analysis.txt";
        await FileSystem.writeAsStringAsync(fileUri, contenFile, { encoding: FileSystem.EncodingType.UTF8 });
        const asset = await MediaLibrary.createAssetAsync(fileUri)
        await MediaLibrary.createAlbumAsync("Download", asset, false)
    }
  }



  createContentFile(info) {
    var header = "IMAGE ANALYSIS: \n========================\n"
    var result = `${header}${info}`; 
    return result;
  }

  componentDidMount() {
    this.getPermissionAsync();
  }

  getPermissionAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    const { statusCamera } = await Permissions.askAsync(Permissions.CAMERA);
      if (status !== 'granted' && statusCamera !== 'granted') {
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
          })
        })
        .catch((err) => alert(err));
        
  }  
}

let options = {
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  allowsEditing: true,
  aspect: [4, 3],
  quality: 0.5,
  base64: true
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: "column" },
  head: { height: 40, backgroundColor: '#f1f8ff' },
  text: { margin: 6, textAlign: 'center' },
  box: {
    justifyContent: "center",
    alignItems:"center", 
    flex: 5
  },
  boxTitle:{
    justifyContent: "flex-end",
    alignItems:"center", 
    flex: 1
  },
  titulo:{
    fontSize:40, 
    fontFamily: "sans-serif-condensed", 
    textShadowColor:"#c8e1ff", 
    textShadowRadius:15
  },
  boxVolver:{
    flex:1, 
    marginTop: 10, 
    justifyContent: "flex-end",  
    alignItems:"center" 
  },
  imagen:{ 
    width: 200, 
    height: 200, 
    paddingBottom:20, 
    borderColor:"#f1f8ff", 
    borderWidth:1 
  },
  boxImagen:{ 
    flex: 2, 
    justifyContent: "flex-start", 
    alignItems:"center", 
    marginBottom:10 
  }
});

const Clarifai = require('clarifai');
const app = new Clarifai.App({apiKey: '5234ecbf19af4f7ea6bf659ebe861907'});