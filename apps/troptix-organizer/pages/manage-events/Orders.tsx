import _ from 'lodash';
import { createRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import {
  Colors,
  TabController,
  TabControllerImperativeMethods,
  TabControllerItemProps,
  View
} from 'react-native-ui-lib';
import OrdersGuestList from './OrdersGuestList';
import OrdersList from './OrdersList';

const TABS = ['Order List', 'Tickets'];

export default function Orders({ orders }) {
  const [key, setKey] = useState(Date.now())
  const [items, setItems] = useState(generateTabItems())
  const tabController = createRef<TabControllerImperativeMethods>();

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
          <OrdersList orders={orders} />
        </TabController.TabPage>
        <TabController.TabPage index={1}>
          <OrdersGuestList orders={orders} />
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
          height={60}
          spreadItems={true}
          labelStyle={styles.labelStyle}
          selectedLabelStyle={styles.selectedLabelStyle}
          activeBackgroundColor={Colors.green70}
          selectedLabelColor={Colors.green30}
          indicatorStyle={{ backgroundColor: Colors.green30, height: 2 }}
        />
        {renderTabPages()}
      </TabController>
    </View>
  );
}

const styles = StyleSheet.create({
  labelStyle: {
    fontSize: 16
  },
  selectedLabelStyle: {
    fontSize: 16
  }
});