import _ from "lodash";
import { useRef, useState } from "react";
import {
  Text,
  View,
  Image,
  Button,
  Colors,
} from "react-native-ui-lib";
import {
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { Event } from "troptix-models";
import { storage, ref, uploadBytesResumable, getDownloadURL } from 'troptix-firebase';
import * as ImagePicker from 'expo-image-picker';
import CustomTextField from "../../components/CustomTextField";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function DetailsScreen({ event, setEvent }) {
  const eventSummaryRef = useRef();
  const eventDescriptionRef = useRef();
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      base64: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      // aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const { uri } = result.assets[0];
      const fileName = uri.split("/").pop();
      const fetchResponse = await fetch(uri);
      const theBlob = await fetchResponse.blob();

      const storageRef = ref(storage, `images/${fileName}`);
      const uploadTask = uploadBytesResumable(storageRef, theBlob);
      // Listen for state changes, errors, and completion of the upload.
      uploadTask.on('state_changed',
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
          }
        },
        (error) => {
          console.log("Error: ", error)
          switch (error.code) {
            case 'storage/unauthorized':
              // User doesn't have permission to access the object
              break;
            case 'storage/canceled':
              // User canceled the upload
              break;
            case 'storage/unknown':
              // Unknown error occurred, inspect error.serverResponse
              break;
            default:
            // Default case
          }
        },
        () => {
          // Upload completed successfully, now we can get the download URL
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImage(uri);
            setEvent(prevEvent => ({ ...prevEvent, ["imageUrl"]: downloadURL }));
          });
        }
      );
    }
  };

  function handleChange(name, value) {
    setEvent(previousEvent => ({ ...previousEvent, [name]: value }))
  }

  return (
    <View style={{ flex: 1 }}>
      <View
        paddingR-16
        paddingL-16
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback
          onPress={Keyboard.dismiss}
          accessible={false}
        >
          <ScrollView automaticallyAdjustKeyboardInsets>
            <View>
              <Text
                style={{ fontSize: 24, fontWeight: "bold" }}
                marginT-16
                marginB-16
                $textDefault
              >
                Event Flyer
              </Text>
              <TouchableOpacity
                activeOpacity={.95}
                onPress={() => pickImage()}>
                {
                  event.imageUrl === undefined || event.imageUrl === null ?
                    <View style={styles.container}>
                      <ImageBackground
                        blurRadius={10}
                        width={300}
                        height={300}
                        style={styles.coverImage}
                        source={require('../../assets/images/image-placeholder.jpg')}>
                        <View style={styles.textView}>
                          <Text style={styles.imageText}>TAP TO UPLOAD EVENT FLYER</Text>
                        </View>
                      </ImageBackground>
                    </View> :
                    <Image
                      marginT-8
                      marginB-8
                      style={{ alignSelf: 'center' }}
                      source={{
                        uri: event.imageUrl
                      }}
                      width={300}
                      height={300}
                    />
                }
              </TouchableOpacity>
            </View>

            <View>
              <Text
                style={{ fontSize: 24, fontWeight: "bold" }}
                marginT-16
                marginB-8
                $textDefault
              >
                Event Details
              </Text>

              <View>
                <CustomTextField
                  name="summary"
                  label="Event Summary *"
                  placeholder="Summary"
                  value={event.summary}
                  reference={eventSummaryRef}
                  handleChange={handleChange}
                  isTextArea={true}
                  textAreaSize={100}
                />
              </View>
              <View>
                <CustomTextField
                  name="description"
                  label="Event Description *"
                  placeholder="Description"
                  value={event.description}
                  reference={eventDescriptionRef}
                  handleChange={handleChange}
                  isTextArea={true}
                  textAreaSize={150}
                />
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  coverImage: {
    width: '100%',
    height: 300,
  },
  textView: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  imageText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
});