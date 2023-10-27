import { useEffect, useState } from 'react';
import { Text, View, Button } from 'react-native-ui-lib';
import { Camera } from 'expo-camera';
import { BarCodeScanner, BarCodeScannerResult } from 'expo-barcode-scanner';
import { StyleSheet, Dimensions, Alert } from 'react-native';
import BarcodeMask from 'react-native-barcode-mask';
import { scanTicket } from 'troptix-api';

const finderWidth: number = 250;
const finderHeight: number = 250;
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const viewMinX = (width - finderWidth) / 2;
const viewMinY = (height - finderHeight) / 2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default function ScanEventScreen({ route, navigation }) {
  const { event } = route.params;
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      title: event.name,
    });
  }, [event.title, navigation]);

  async function handleBarCodeScanned(scanningResult: BarCodeScannerResult) {
    if (!scanned) {
      const { type, data, bounds } = scanningResult;
      // @ts-ignore
      const { x, y } = bounds.origin;
      if (x >= viewMinX && y >= viewMinY && x <= (viewMinX + finderWidth / 2) && y <= (viewMinY + finderHeight / 2)) {
        console.log("Ticket Data: " + data);
        setScanned(true);
        try {
          const response = await scanTicket(data);
          if (response.response.scan_succeeded) {
            setScanned(true);
            Alert.alert('Scan Successful', 'This ticket has been scanned successfully', [
              {
                text: 'Okay', onPress: () => {
                  setScanned(false);
                }
              },
            ]);
          } else {
            setScanned(true);
            Alert.alert('Scan Failed', 'This ticket has already been scanned', [
              {
                text: 'Okay', onPress: () => {
                  setScanned(false);
                }
              },
            ]);
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
  };

  // const handleBarCodeScanned = ({ type, data }) => {
  //   setScanned(true);
  //   alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  // };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      >
        <BarcodeMask
          width={finderWidth}
          height={finderHeight}
          edgeColor="#62B1F6"
          showAnimatedLine />
      </BarCodeScanner>
    </View>
  );
}