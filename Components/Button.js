import react from "react"

import { TouchableHighlight } from "react-native"

{/* Todo lo visible va entre view y lo escribible entre text */}

export default function Button(props){
<TouchableHighlight onPress={props.funcion}>
    <Text>{props.text}</Text>
</TouchableHighlight>

}

