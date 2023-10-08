import _ from 'lodash';
import { createRef, useContext, useEffect, useState } from 'react';
import { Text, View, TextField, Colors, TabControllerItemProps, TabController, TabControllerImperativeMethods, Button } from 'react-native-ui-lib';
import { Keyboard, ScrollView, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import EventForm from '../../components/EventForm';
import { Event } from 'troptix-models';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import BasicInfoForm from './BasicInfoScreen';
import DetailsScreen from './DetailsScreen';
import TicketsScreen from './TicketsScreen';
import { TropTixContext } from '../../App';
import { TropTixResponse, saveEvent } from 'troptix-api';

const TABS = ['Basic Info', 'Details', 'Tickets', 'Preview'];

function AddEventScreen({ navigation, route }) {
  const { eventObject } = route.params;
  const [user, setUser] = useContext(TropTixContext);
  const [event, setEvent] = useState<Event>(eventObject === undefined ? new Event(user.id) : eventObject);
  const [key, setKey] = useState(Date.now())
  const [items, setItems] = useState(generateTabItems())
  const tabController = createRef<TabControllerImperativeMethods>();

  function generateTabItems(): TabControllerItemProps[] {
    const items: TabControllerItemProps[] = _.flow(tabs => _.take(tabs, TABS.length),
      (tabs: TabControllerItemProps[]) =>
        _.map<TabControllerItemProps>(tabs, (tab: TabControllerItemProps, index: number) => ({
          label: tab,
          key: tab,
          badge: index === 5 ? { label: '2' } : undefined,
        })))(TABS);

    return items;
  };

  function renderTabPages() {
    const Container = View;
    const containerProps = { flex: true };
    return (
      <Container {...containerProps}>
        <TabController.TabPage index={0}>
          <BasicInfoForm event={event} setEvent={setEvent} navigation={navigation} />
        </TabController.TabPage>
        <TabController.TabPage index={1}>
          <DetailsScreen event={event} setEvent={setEvent} />
        </TabController.TabPage>
        <TabController.TabPage index={2}>
          <TicketsScreen event={event} setEvent={setEvent} navigation={navigation} />
        </TabController.TabPage>
      </Container>
    );
  }

  async function publishEvent(isSaveDraft) {
    const isEditEvent = eventObject !== undefined;
    try {
      const response: TropTixResponse = await saveEvent(event, isEditEvent);
      console.log("[updateEvent] ", response);
    } catch (error) {
      console.log("[updateEvent] Events Error: " + error)
    }
  }

  return (
    <View style={{ height: "100%", flex: 1, backgroundColor: "white" }}>
      <View flex bg-$backgroundDefault>
        <TabController
          key={key}
          ref={tabController}
          items={items}
        >
          <TabController.TabBar
            key={key}
            spreadItems={true}
            labelStyle={styles.labelStyle}
            selectedLabelStyle={styles.selectedLabelStyle}
            enableShadow
            activeBackgroundColor={Colors.$backgroundPrimaryMedium}
          />
          {renderTabPages()}
        </TabController>
      </View>
      <View
        row
        backgroundColor="transparent"
        marginB-24
        marginR-16
        marginL-16

        style={{
          borderTopColor: "#D3D3D3",
          borderTopWidth: 1,
          height: 70,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button
          onPress={() => publishEvent(/* isSaveDraft */true)}
          marginR-8
          backgroundColor={Colors.red50}
          style={{ flex: 1, height: "70%" }}
          label={"Save Draft"}
          labelStyle={{ fontSize: 18 }}
        />

        <Button
          onPress={() => publishEvent(/* isSaveDraft */false)}
          marginL-8
          style={{ flex: 1, height: "70%" }}
          label={"Publish"}
          labelStyle={{ fontSize: 18 }}
        />
      </View>
    </View>

  );
}

export default gestureHandlerRootHOC(AddEventScreen);

const styles = StyleSheet.create({
  labelStyle: {
    fontSize: 16
  },
  selectedLabelStyle: {
    fontSize: 16
  }
});