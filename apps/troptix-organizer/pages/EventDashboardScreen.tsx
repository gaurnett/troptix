import 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import * as React from 'react';
import { ScrollView } from 'react-native';
import { Image, ListItem, Text, View } from 'react-native-ui-lib';
import CircularProgress from 'react-native-circular-progress-indicator';

export default function EventDashboardScreen() {
  function getFormattedCurrency(price) {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });

    return formatter.format(price)
  }

  function TicketSoldItem(ticketName, sold, total) {
    return (
      <View style={{backgroundColor: 'white', height: 80}}>
        <ListItem>
          <ListItem.Part left>
            <CircularProgress 
              value={sold/total * 100}
              radius={30}
              inActiveStrokeOpacity={0.5}
              inActiveStrokeWidth={1}
              activeStrokeWidth={2}
              progressFormatter={(value: number) => {
                'worklet';
                return value + "%"
              }}
            />        
          </ListItem.Part>
          <ListItem.Part>
            <ListItem.Part containerStyle={{marginBottom: 3}}>
              <View>
                <Text grey10 text70 style={{marginLeft: 16}}>
                  {ticketName}
                </Text>
                <Text grey10 text70 style={{marginLeft: 16}}>
                  {sold}/{total}
                </Text>
              </View>
            </ListItem.Part>
          </ListItem.Part>
        </ListItem>
      </View>
    );
  }

  return (
    <View paddingR-16 paddingL-16 style={{height: "100%"}} backgroundColor='white'>
      <ScrollView>
        <View>
          <Text style={{fontSize: 20}} marginT-16 marginB-8 $textDefault>
            Gross Sales
          </Text> 
          <Text style={{fontSize: 42, fontWeight: '600' }} $textDefault>
            {getFormattedCurrency(12000)}
          </Text>
        </View>
        <View>
          <Text style={{fontSize: 20}} marginT-16 marginB-8 $textDefault>
            Ticket Summary
          </Text> 
          {TicketSoldItem("Total Tickets", 500, 1000)}
          {TicketSoldItem("Early Bird", 500, 500)}
          {TicketSoldItem("General Admission", 100, 250)}
          {TicketSoldItem("VIP", 150, 250)}
        </View>
        <View>
          <Text style={{fontSize: 20}} marginT-16 marginB-8 $textDefault>
            Ticket Summaryy
          </Text> 
          <Text text80 $textDefault>
            Tickets Sold
          </Text>
          <Text text80 $textDefault>
            500/1000
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}