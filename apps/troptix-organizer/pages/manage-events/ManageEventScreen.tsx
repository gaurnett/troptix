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
import EventForm from '../../components/EventForm';
import EventDashboardScreen from './EventDashboardScreen';
import EventDelegationScreen from './EventDelegationScreen';
import PromotionsScreen from './PromotionsScreen';

const TABS = ['Dashboard', 'Promotions', 'Delegation'];

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
    const items: TabControllerItemProps[] = _.flow(tabs => _.take(tabs, 3),
      (tabs: TabControllerItemProps[]) =>
        _.map<TabControllerItemProps>(tabs, (tab: TabControllerItemProps, index: number) => ({
          label: tab,
          key: tab,
        })))(TABS);

    return items;
  };

  function renderTabPages() {
    const Container = View;
    const containerProps = { flex: true };
    return (
      <Container {...containerProps}>
        <TabController.TabPage index={0}>
          <EventDashboardScreen eventObject={event} navigation={navigation} />
        </TabController.TabPage>
        <TabController.TabPage index={1}>
          <PromotionsScreen eventObject={event} navigation={navigation} />
        </TabController.TabPage>
        <TabController.TabPage index={2}>
          <EventDelegationScreen eventObject={event} navigation={navigation} />
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