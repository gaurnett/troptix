import {
  PostTicketRequest,
  PostTicketType,
  useCreateTicket,
} from '@/hooks/useTicket';
import { Camera, CameraView } from 'expo-camera';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import BarcodeMask from 'react-native-barcode-mask';
import { useAuth } from '../_layout';

const finderWidth: number = 250;
const finderHeight: number = 250;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrContainer: {
    marginTop: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrOverlay: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 5,
  },
  organizer: {
    color: '#7B2CFF',
    fontWeight: '500',
  },
});

export default function Scanner({ event }) {
  const { jwtToken } = useAuth();
  const [hasPermission, setHasPermission] = useState(false);
  const [scanned, setScanned] = useState(false);
  const createTicket = useCreateTicket();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  function formatDate(date: Date) {
    return date.toDateString();
  }

  async function handleBarCodeScanned({ type, data }) {
    if (!scanned) {
      setScanned(true);
      await scanTicket(data);
    }
  }

  async function scanTicket(ticketId: string) {
    const request: PostTicketRequest = {
      type: PostTicketType.SCAN_TICKET,
      id: ticketId,
      eventId: event.id,
      jwtToken: jwtToken,
    };

    createTicket.mutate(request, {
      onSuccess: (data) => {
        const { scanSucceeded, ticketName } = data;
        let title = '';
        let description = '';

        if (scanSucceeded) {
          title = 'Scan Successful';
          description = `Ticket ${ticketName} has been scanned successfully`;
        } else {
          if (!ticketName) {
            title = 'Scan Failed';
            description = `Ticket not valid for ${event.name}`;
          } else {
            title = 'Scan Failed';
            description = `Ticket ${ticketName} has already been scanned`;
          }
        }
        Alert.alert(title, description, [
          {
            text: 'Okay',
            onPress: () => {
              setScanned(false);
            },
          },
        ]);
      },
      onError: (error) => {
        Alert.alert('Scan Failed', 'Failed to scan ticket, please try again.', [
          {
            text: 'Okay',
            onPress: () => {
              setScanned(false);
            },
          },
        ]);
      },
    });
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
      style={{
        backgroundColor: 'white',
        width: '100%',
        height: '100%',
        alignItems: 'center',
      }}
    >
      <View
        style={{
          justifyContent: 'center',
          marginTop: 32,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: '600',
            color: '#333',
            marginBottom: 5,
            textAlign: 'center',
          }}
        >
          {event.name}
        </Text>
        <Text style={styles.info}>
          {formatDate(new Date(event.startDate))} |{' '}
          <Text style={styles.organizer}>{event.organizer}</Text>
        </Text>

        <Text
          style={{
            textAlign: 'center',
          }}
        >
          {event.address}
        </Text>

        <Text
          style={{
            marginTop: 32,
            textAlign: 'center',
          }}
        >
          Scan barcodes using the camera below to validate tickets.
        </Text>
      </View>
      <View style={styles.qrContainer}>
        <CameraView
          style={{ width: finderWidth, height: finderWidth }}
          mode="picture"
          facing="back"
          mute={false}
          responsiveOrientationWhenOrientationLocked
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        />

        <View style={styles.qrOverlay}>
          <BarcodeMask
            width={finderWidth}
            height={finderHeight}
            edgeColor="#62B1F6"
            showAnimatedLine={true}
          />
        </View>
      </View>
    </View>
  );
}
