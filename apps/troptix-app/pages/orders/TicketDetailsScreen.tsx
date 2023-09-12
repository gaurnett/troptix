import _ from 'lodash';
import { Carousel, Colors, Image, Text, View } from "react-native-ui-lib";
import { ImageBackground, Platform, ScrollView, StyleSheet } from "react-native";
import QRCode from 'react-native-qrcode-svg';
import { useHeaderHeight } from '@react-navigation/elements';

export default function TicketDetailsScreen({ route }) {
  const { order } = route.params;
  console.log(order);
  const image = { uri: 'https://legacy.reactjs.org/logo-og.png' };

  function renderTicket(ticket, index, total) {
    return (
      <View key={index} style={{ borderRadius: 15, backgroundColor: Colors.green50, width: '100%', height: '100%' }}>
        <ScrollView>
          <View marginT-16 style={{ alignSelf: 'center' }}>
            <QRCode
              value={ticket.id}
              size={120}
              logo={require('../../assets/logo/logo_v1.png')}
            />
            <Text style={{ alignSelf: 'center' }} marginT-8>Ticket {index + 1} of {total}</Text>
          </View>

          <View margin-16>
            <View>
              <Text style={[styles.itemTitle]} marginT-16 marginB-8 $textDefault>
                Name
              </Text>
              <Text style={[styles.itemBody]} $textDefault>
                Gaurnett Flowers
              </Text>
            </View>

            <View>
              <Text style={[styles.itemTitle]} marginT-16 marginB-8 $textDefault>
                Event
              </Text>
              <Text style={[styles.itemBody]} $textDefault>
                Sunrise Breakfast Party
              </Text>
            </View>

            <View>
              <Text style={[styles.itemTitle]} marginT-16 marginB-8 $textDefault>
                Ticket
              </Text>
              <Text style={[styles.itemBody]} $textDefault>
                General Admission
              </Text>
            </View>

            <View marginT-16 row>
              <View marginR-8 style={{ flex: 1 }}>
                <Text style={[styles.itemTitle]} marginB-8 $textDefault>
                  Date
                </Text>
                <Text style={[styles.itemBody]} $textDefault>
                  Sat Sept 2, 8PM -
                </Text>
                <Text style={[styles.itemBody]} $textDefault>
                  Sun Sept 3, 4AM
                </Text>

              </View>
              <View marginL-8 style={{ flex: 1 }}>
                <Text style={[styles.itemTitle]} marginB-8 $textDefault>
                  Venue
                </Text>
                <Text style={[styles.itemBody]} $textDefault>
                  Melrose Ballroom
                </Text>
                <Text style={[styles.itemBody]} $textDefault>
                  3608 33rd Street Queens, NY 11106
                </Text>
              </View>
            </View>

            <View>
              <Text style={[styles.itemTitle]} marginT-16 marginB-8 $textDefault>
                Order Number
              </Text>
              <Text style={[styles.itemBody]} $textDefault>
                #19300392843500324
              </Text>
            </View>

            <View>
              <Text style={[styles.itemTitle]} marginT-16 marginB-8 $textDefault>
                Event Summary
              </Text>
              <Text style={[styles.itemBody]} $textDefault>
                Lorem Ipsum
              </Text>
            </View>

            <View>
              <Text style={[styles.itemTitle]} marginT-16 marginB-8 $textDefault>
                Organizer
              </Text>
              <Text style={[styles.itemBody]} $textDefault>
                Sunnation Jamaica
              </Text>
            </View>

          </View>

        </ScrollView>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{
          uri: order.event.imageUrl
        }}
        blurRadius={Platform.OS === 'ios' ? 8 : 3}
        resizeMode="cover"
        style={styles.image}>

        <View style={styles.root}>
          <View
            style={[
              styles.background,
              {
                // backgroundColor: '#e1e4e8',
              },
            ]}>

            <View style={[styles.eventImage, { marginTop: useHeaderHeight(), zIndex: 2 }]} >
              <Image
                resizeMode='cover'
                height={350}
                width='100%'
                source={{
                  uri: order.event.imageUrl
                }} />
            </View>

            <View style={[styles.ticketDetailsArea, { borderRadius: 15, marginTop: -48, zIndex: 3 }]}>
              <Carousel
                showCounter={true}
                containerStyle={{
                  height: '100%'
                }}
                onChangePage={() => console.log('page changed')}>
                {_.map(order.tickets, (ticket, i) => {
                  return (
                    renderTicket(ticket, i, order.tickets.length)
                  )
                })}
              </Carousel>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
  itemTitle: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  itemBody: {
    fontSize: 18,
    fontWeight: '200'
  },
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: 42,
    lineHeight: 84,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#000000c0',
  },
  root: {
    // flex: 1,
    // backgroundColor: '#fff',
    // height: '100%',
    alignItems: 'center',
    // justifyContent: 'center',
  },
  background: {
    height: '100%',
    width: 400,
    padding: 16,
    alignItems: 'center',
  },

  eventImage: {
    height: 200,
    width: 300,
    padding: 16,
  },

  ticketDetailsArea: {
    height: 600,
    width: '100%',
  },
});