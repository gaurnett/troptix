import {
  PostTicketRequest,
  PostTicketType,
  useCreateTicket,
} from '@/hooks/useTicket';
import { Camera, CameraView } from 'expo-camera';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import BarcodeMask from 'react-native-barcode-mask';
import { useAuth } from '../_layout';

const finderWidth: number = 300;
const finderHeight: number = 300;
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
};

export default function Scanner() {
  const { event } = useLocalSearchParams();
  const { user } = useAuth();
  const [hasPermission, setHasPermission] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogData, setDialogData] = useState<any>({});
  const createTicket = useCreateTicket();
  const [toastSettings, setToastSettings] = useState<ToastSettings>({
    toastDismiss: 0,
    toastMessage: 'Scanning Ticket...',
    showLoader: true,
  });
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  // useEffect(() => {
  //   navigation.setOptions({
  //     title: event.name,
  //   });
  // }, [event.title, navigation]);

  function formatDate(date: Date) {
    return date.toDateString();
  }

  async function handleBarCodeScanned({ type, data }) {
    if (!scanned) {
      setScanned(true);
      setShowToast(true);
      const response = await scanTicket(data);
    }
  }

  async function scanTicket(ticketId: string) {
    const request: PostTicketRequest = {
      type: PostTicketType.SCAN_TICKET,
      id: ticketId,
      eventId: event.id,
    };

    createTicket.mutate(request, {
      onSuccess: (data) => {
        setDialogData(data);
        setShowDialog(true);
        setShowToast(false);
      },
      onError: (error) => {
        setShowToast(false);
        setShowToast(true);
        setScanned(false);
        setToastSettings({
          toastMessage: 'Failed to scan ticket, please try again.',
          toastDismiss: 2000,
          showLoader: false,
          toastIcon: require('@/assets/icons/close.png'),
        });
      },
    });
  }

  function hideDialog() {
    setShowDialog(false);
    setScanned(false);
  }

  function updateToastVisibility() {
    setShowToast(!showToast);
  }

  if (hasPermission === null) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          backgroundColor: 'white',
          padding: 32,
        }}
      >
        <Text style={{ textAlign: 'center' }}>
          Requesting camera permissions
        </Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          backgroundColor: 'white',
          padding: 32,
        }}
      >
        <Text style={{ textAlign: 'center' }}>
          No access to camera. please allow this app to access your camera from
          your settings to scan tickets.
        </Text>
      </View>
    );
  }

  return (
    <View
      flex
      style={{
        backgroundColor: 'white',
        width: '100%',
        height: '100%',
        flex: 1,
        alignItems: 'center',
      }}
    >
      <View center margin-32>
        <Image
          style={{
            height: 175,
            width: 175,
          }}
          source={{
            uri: event.imageUrl,
          }}
        />

        <Text marginT-16 center text50 $textDefault>
          {event.name}
        </Text>
        <View center row>
          <Text text70 $textDefault>
            {formatDate(new Date(event.startDate))} |{' '}
          </Text>
          <Text text70>{event.organizer}</Text>
        </View>

        <Text center text70 $textDefault>
          {event.address}
        </Text>

        <Text center text70 $textDefault>
          Scan barcodes using the camera below to validate tickets.
        </Text>
      </View>
      <View>
        <CameraView
          style={{ width: finderWidth, height: finderWidth }}
          mode="picture"
          facing="back"
          mute={false}
          responsiveOrientationWhenOrientationLocked
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        >
          <BarcodeMask
            width={finderWidth}
            height={finderHeight}
            edgeColor="#62B1F6"
            showAnimatedLine={true}
          />
        </CameraView>
      </View>
    </View>
  );
}
