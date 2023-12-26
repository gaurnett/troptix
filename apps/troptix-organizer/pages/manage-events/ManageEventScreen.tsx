import _ from 'lodash';
import { createRef, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import {
  Colors,
  LoaderScreen,
  TabController,
  TabControllerImperativeMethods,
  TabControllerItemProps,
  View
} from 'react-native-ui-lib';
import { useFetchEventOrders } from '../../hooks/useOrders';
import EventDashboardScreen from './EventDashboardScreen';
import Orders from './Orders';

const TABS = ['Dashboard', 'Orders'];

export default function ManageEventScreen({ route, navigation }) {
  const { event } = route.params;
  const [key, setKey] = useState(Date.now())
  const [items, setItems] = useState(generateTabItems())
  const tabController = createRef<TabControllerImperativeMethods>();
  const { isLoading, isError, data, error } = useFetchEventOrders(event.id);

  useEffect(() => {
    navigation.setOptions({
      title: event.name,
    });
  }, [event.title, navigation]);

  function generateTabItems(): TabControllerItemProps[] {
    // @ts-expect-error
    const items: TabControllerItemProps[] = _.flow(tabs => _.take(tabs, 2),
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
          <EventDashboardScreen eventObject={event} navigation={navigation} orders={data} />
        </TabController.TabPage>
        <TabController.TabPage index={1}>
          <Orders orders={data} />
        </TabController.TabPage>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <View paddingR-16 paddingL-16 style={{ height: "100%" }} backgroundColor='white'>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <LoaderScreen message={'Fetching Order Summary'} color={Colors.grey40} />
        </View>
      </View>
    )
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

// export default gestureHandlerRootHOC(ManageEventScreen);

const styles = StyleSheet.create({
  labelStyle: {
    fontSize: 16
  },
  selectedLabelStyle: {
    fontSize: 16
  }
});