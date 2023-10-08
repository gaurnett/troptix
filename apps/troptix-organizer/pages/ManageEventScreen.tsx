import _ from 'lodash';
import { useEffect, createRef, useState } from 'react';
import {
  TabController,
  Colors,
  View,
  Text,
  TabControllerItemProps,
  TabControllerImperativeMethods,
  FloatingButton,
  FloatingButtonLayouts
} from 'react-native-ui-lib';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { Keyboard, ScrollView, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import EventForm from '../components/EventForm';
import EventDashboardScreen from './EventDashboardScreen';

const TABS = ['Dashboard', 'Manage Users'];

function ManageEventScreen({ route, navigation }) {
  const { event } = route.params;
  const [key, setKey] = useState(Date.now())
  const [items, setItems] = useState(generateTabItems())
  const tabController = createRef<TabControllerImperativeMethods>();

  function openAddEvents() {
    navigation.navigate('AddEventScreen', {
      eventObject: event
    })
  }

  useEffect(() => {
    navigation.setOptions({
      title: event.name,
    });
  }, [event.title, navigation]);

  function generateTabItems(): TabControllerItemProps[] {
    const items: TabControllerItemProps[] = _.flow(tabs => _.take(tabs, 2),
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
          <EventDashboardScreen eventObject={event} />
        </TabController.TabPage>
        <TabController.TabPage index={1}>
          <EventForm eventObject={event} editEvent={true} navigation={navigation} />
        </TabController.TabPage>
      </Container>
    );
  }

  return (
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
      <View marginB-16>
        <FloatingButton
          visible={true}
          button={{
            label: 'Edit Event',
            onPress: openAddEvents
          }}
          buttonLayout={FloatingButtonLayouts.HORIZONTAL}
          bottomMargin={16}
        />
      </View>
    </View>
  );
}

export default gestureHandlerRootHOC(ManageEventScreen);

const styles = StyleSheet.create({
  labelStyle: {
    fontSize: 16
  },
  selectedLabelStyle: {
    fontSize: 16
  }
});