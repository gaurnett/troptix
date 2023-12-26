import { BarCodeScanner, BarCodeScannerResult } from 'expo-barcode-scanner';
import { useEffect, useState } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import BarcodeMask from 'react-native-barcode-mask';
import { Button, Dialog, PanningProvider, Text, View } from 'react-native-ui-lib';
import { PostTicketRequest, PostTicketType, useCreateTicket } from '../hooks/useTicket';

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
  const [showDialog, setShowDialog] = useState(false);
  const [dialogData, setDialogData] = useState<any>({});
  const createTicket = useCreateTicket();

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
        setScanned(true);
        const response = await scanTicket(data);
      }
    }
  };

  async function scanTicket(ticketId: string) {
    const request: PostTicketRequest = {
      type: PostTicketType.SCAN_TICKET,
      id: ticketId
    }

    createTicket.mutate(request, {
      onSuccess: (data) => {
        console.log(data);
        setDialogData(data);
        setShowDialog(true);
        setScanned(true);
      },
      onError: (error) => {
        console.log(error);
        return;
      }
    });
  }

  function hideDialog() {
    setShowDialog(false);
    setScanned(false);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Dialog
        width={300}
        containerStyle={{ backgroundColor: 'white', borderRadius: 8 }}
        visible={showDialog}
        ignoreBackgroundPress={true}
        onDismiss={() => console.log('dismissed')}
        panDirection={PanningProvider.Directions.DOWN}
      >
        <View marginV-16 marginH-8>
          {
            dialogData.scanSucceeded ?
              <View margin-4>
                <Text center text60>Scan Successful</Text>
                <Text center marginT-8 text70 $textDefault>{dialogData.ticketName}</Text>
                <Text marginT-8 marginB-8 center text90 $textDefault>This ticket has been scanned successfully</Text>
              </View>
              :
              <View>
                <Text center text60>Scan Failed</Text>
                <Text center marginT-8 text70 $textDefault>{dialogData.ticketName}</Text>
                <Text marginT-8 marginB-8 center text70 $textDefault>This ticket has already been scanned</Text>
              </View>
          }
          <View
            marginT-8
            backgroundColor="transparent"
            style={{ height: 50, justifyContent: 'center', alignItems: 'center' }}>
            <Button
              onPress={hideDialog}
              style={{ width: '60%', height: '100%', justifyContent: 'center', alignItems: 'center' }}
              label={"Done"}
              labelStyle={{ fontSize: 18 }} />
          </View>
        </View>
      </Dialog>
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