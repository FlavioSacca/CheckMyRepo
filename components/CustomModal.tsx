import {
    Button,
    Image,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableHighlight, TouchableOpacity,
    useColorScheme,
    View
} from "react-native";
import {useEffect, useState} from "react";

type ModalProps = {
  modalTitle: string,
  isVisible: boolean,
  toggleVisibile: (isVisible:boolean) => void,
  inputText: string,
  inputPlaceholder: string,
  onInputConfirm: (inputText: string) => void
};

export function CustomModal(props: ModalProps) {
    const [inputText, setInputText] = useState(props.inputText);

    const textStyle = {
      color: '#000000',
      fontSize: 18
    };

    return (
      <Modal
        animationType="slide"
        visible={props.isVisible}
        onRequestClose={() => props.toggleVisibile(false)}
      >
        <View style={styles.containerView}>
          <View style={styles.stack}>
            <TouchableOpacity onPress={() => props.toggleVisibile(false)}>
              <Image style={{marginRight: 30}} source={require('../assets/back.png')}/>
            </TouchableOpacity>
            <Text style={[styles.h3, textStyle, {fontWeight: 'bold'}]}>
              {props.modalTitle}
            </Text>
          </View>
          <TextInput placeholder={props.inputPlaceholder} style={styles.input} value={inputText} onChangeText={setInputText}>
          </TextInput>
          <Text disabled={(inputText.trim()) === ''} onPress={() => props.onInputConfirm(inputText)} style={styles.button}>
            DONE
          </Text>
        </View>
      </Modal>
    );
}

const styles = StyleSheet.create({
  containerView: {
    height: '100%',
    padding: 20
  },
  stack: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row'
  },
  h1: {
      fontSize: 32
  },
  h3: {
      fontSize: 24
  },
  mt3: {
      marginTop: 20
  },
  input: {
    borderBottomColor: 'green',
    borderBottomWidth: 2,
    fontSize: 18,
    paddingBottom: 0,
    paddingLeft: 0
  },
  button: {
    fontWeight: 'bold',
    fontSize: 24,
    position: 'absolute',
    bottom: 20,
    right: 20
  }
});