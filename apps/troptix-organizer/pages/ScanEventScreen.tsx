import { BarCodeScanner, BarCodeScannerResult } from 'expo-barcode-scanner';
import { useEffect, useState } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import BarcodeMask from 'react-native-barcode-mask';
import { Button, Colors, Dialog, PanningProvider, Text, Toast, View } from 'react-native-ui-lib';
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

type ToastSettings = {
  toastDismiss?: number;
  toastMessage?: string;
  toastIcon?: any;
  showLoader?: boolean;
}

export default function ScanEventScreen({ route, navigation }) {
  const { event } = route.params;
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogData, setDialogData] = useState<any>({});
  const createTicket = useCreateTicket();
  const [toastSettings, setToastSettings] = useState<ToastSettings>({
    toastDismiss: 0,
    toastMessage: "Scanning Ticket...",
    showLoader: true
  });
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
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
        setShowToast(true);
        const response = await scanTicket(data);
      }
    }
  };

  async function scanTicket(ticketId: string) {
    const request: PostTicketRequest = {
      type: PostTicketType.SCAN_TICKET,
      id: ticketId,
      eventId: event.id
    }

    createTicket.mutate(request, {
      onSuccess: (data) => {
        console.log(data);
        setDialogData(data);
        setShowDialog(true);
        setShowToast(false);
      },
      onError: (error) => {
        setShowToast(false);
        setShowToast(true);
        setToastSettings({
          toastMessage: "Failed to scan ticket, please try again.",
          toastDismiss: 2000,
          showLoader: false,
          toastIcon: require('../assets/icons/close.png')
        })
        return;
      }
    });
  }

  function hideDialog() {
    setShowDialog(false);
    setScanned(false);
  };

  function updateToastVisibility() {
    setShowToast(!showToast)
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Toast
        position={'bottom'}
        swipeable={true}
        visible={showToast}
        message={toastSettings.toastMessage}
        showLoader={toastSettings.showLoader}
        autoDismiss={toastSettings.toastDismiss}
        icon={toastSettings.toastIcon}
        onDismiss={updateToastVisibility}
      />
      <Dialog
        width={300}
        containerStyle={{ backgroundColor: `${dialogData.scanSucceeded ? Colors.green50 : Colors.red50}`, borderRadius: 8 }}
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
              <>
                {
                  !dialogData.ticketName ?
                    <View>
                      <Text center text60>Scan Failed</Text>
                      <Text center marginT-8 text70 $textDefault>Ticket not found</Text>
                      <Text marginT-8 marginB-8 center text70 $textDefault>This ticket is not valid for {event.name}</Text>
                    </View>
                    :
                    <View>
                      <Text center text60>Scan Failed</Text>
                      <Text center marginT-8 text70 $textDefault>{dialogData.ticketName}</Text>
                      <Text marginT-8 marginB-8 center text70 $textDefault>This ticket has already been scanned</Text>
                    </View>
                }
              </>
          }
          <View
            marginT-8
            backgroundColor="transparent"
            style={{ height: 50, justifyContent: 'center', alignItems: 'center' }}>
            <Button
              onPress={hideDialog}
              backgroundColor={Colors.blue20}
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