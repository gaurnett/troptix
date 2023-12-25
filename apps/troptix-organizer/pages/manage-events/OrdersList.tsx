import { useRef, useState } from 'react';
import {
  Colors,
  Text,
  TextField,
  View
} from 'react-native-ui-lib';

export default function OrdersList({ orders }) {

  const [orderList, setOrderList] = useState<any[]>(orders);
  const [originalOrderList, setOriginalOrderList] = useState<any[]>(orders);
  const [searchValue, setSearchValue] = useState("");
  const searchValueRef = useRef();

  function handleChange(value) {
    setSearchValue(value);
    filterList(value);
  }

  function doesStringInclude(string1: string, string2: string) {
    if (!string1 || !string2) {
      return false;
    }

    return string1.toLowerCase().includes(string2.toLowerCase());
  }

  function filterList(value: string) {
    if (value === "" || value === undefined) {
      setOrderList(originalOrderList);
    } else {
      setOrderList(originalOrderList.filter(guest =>
        doesStringInclude(guest.id as string, value) || doesStringInclude(guest?.firstName as string, value) || doesStringInclude(guest?.lastName as string, value)
      ));
    }
  }

  return (
    <View height={'100%'}>
      <View height={'100%'} bg-$backgroundDefault marginV-8 marginH-16 marginB-90>
        <View>
          <TextField
            placeholder={"Search order number, email, or name"}
            value={searchValue}
            ref={searchValueRef}
            onChangeText={(txt) => handleChange(txt)}
            marginV-8
            style={{
              fontSize: 16,
              height: 50,
              width: "100%",
              borderWidth: 0.5,
              borderColor: "#D3D3D3",
              borderRadius: 4,
              padding: 8
            }}
          />
        </View>
        {orderList.map((order, index: any) => {
          return (
            <View key={index}>
              <View marginT-16 row>
                <View flex>
                  <View>
                    <Text>{String(order.id).toUpperCase()}</Text>
                    <Text>{order.firstName} {order.lastName}</Text>
                    <Text>{order.user ? order.user.email : order.email}</Text>
                  </View>
                </View>
              </View>
              <View marginT-16 style={{ height: 1 }} backgroundColor={Colors.grey60} />
            </View>
          );
        })}
      </View>
    </View>
  );
}
