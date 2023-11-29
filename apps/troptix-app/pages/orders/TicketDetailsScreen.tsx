import { format } from 'date-fns';
import { Image } from 'expo-image';
import _ from 'lodash';
import { Platform, ScrollView, StyleSheet } from "react-native";
import QRCode from 'react-native-qrcode-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Carousel, Colors, Text, View } from "react-native-ui-lib";

export default function TicketDetailsScreen({ route }) {
  const { summary } = route.params;

  function getDateFormatted(date, time) {
    return format(date, 'MMM dd, yyyy') + ", " + format(time, 'hh:mm a');
  }

  function renderTicket(ticket, index, total) {
    return (
      <View key={index} style={{
        borderRadius: 15,
        backgroundColor: ticket.status === "NOT_AVAILABLE" ? Colors.red50 : Colors.green50,
        width: '100%', height: '100%'
      }}>

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
              {summary.name}
            </Text>
          </View>

          <View>
            <Text style={[styles.itemTitle]} marginT-16 marginB-8 $textDefault>
              Event
            </Text>
            <Text style={[styles.itemBody]} $textDefault>
              {summary.event.name}
            </Text>
          </View>

          <View>
            <Text style={[styles.itemTitle]} marginT-16 marginB-8 $textDefault>
              Ticket
            </Text>
            <Text style={[styles.itemBody]} $textDefault>
              {ticket.ticketType.name}
            </Text>
          </View>

          <View marginT-16 >
            <Text style={[styles.itemTitle]} marginB-8 $textDefault>
              Date
            </Text>
            <Text style={[styles.itemBody]} $textDefault>
              Start: {getDateFormatted(new Date(summary.event.startDate), new Date(summary.event.startTime))}
            </Text>
            <Text style={[styles.itemBody]} $textDefault>
              End: {getDateFormatted(new Date(summary.event.endDate), new Date(summary.event.endTime))}
            </Text>
          </View>

          <View marginT-16>
            <Text style={[styles.itemTitle]} marginB-8 $textDefault>
              Venue
            </Text>
            <Text style={[styles.itemBody]} $textDefault>
              {summary.event.venue}
            </Text>
            <Text style={[styles.itemBody]} $textDefault>
              {summary.event.address}
            </Text>
          </View>

          <View>
            <Text style={[styles.itemTitle]} marginT-16 marginB-8 $textDefault>
              Order Number
            </Text>
            <Text style={[styles.itemBody]} $textDefault>
              {String(ticket.orderId).toUpperCase()}
            </Text>
          </View>

          <View>
            <Text style={[styles.itemTitle]} marginT-16 marginB-8 $textDefault>
              Event Summary
            </Text>
            <Text style={[styles.itemBody]} $textDefault>
              {summary.event.summary}
            </Text>
          </View>

          <View>
            <Text style={[styles.itemTitle]} marginT-16 marginB-8 $textDefault>
              Organizer
            </Text>
            <Text style={[styles.itemBody]} $textDefault>
              {summary.event.organizer}
            </Text>
          </View>

        </View>

      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: summary.event.imageUrl
        }}
        blurRadius={Platform.OS === 'ios' ? 8 : 3}
        contentFit="cover"
        style={styles.image}>

        <SafeAreaView>
          <View style={styles.root}>
            <View style={styles.background}>
              <View style={[styles.eventImage, { zIndex: 2 }]} >
                <Image
                  contentFit='cover'
                  height={350}
                  width='100%'
                  source={{
                    uri: summary.event.imageUrl
                  }} />
              </View>

              <View style={[styles.ticketDetailsArea, { borderRadius: 15, marginTop: -48, zIndex: 3, height: '80%' }]}>
                <ScrollView>
                  <Carousel
                    showCounter={true}
                    containerStyle={{
                      height: '100%'
                    }}
                    onChangePage={() => console.log('page changed')}>
                    {_.map(summary.tickets, (ticket, i) => {
                      return (
                        renderTicket(ticket, i, summary.tickets.length)
                      )
                    })}
                  </Carousel>
                </ScrollView>
              </View>
            </View>
          </View>
        </SafeAreaView>


      </Image>
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
    paddingLeft: 16,
    paddingRight: 16,
    alignItems: 'center',
  },

  eventImage: {
    height: 200,
    width: 300,
    padding: 16,
  },

  ticketDetailsArea: {
    height: '100%',
    width: '100%',
  },
});