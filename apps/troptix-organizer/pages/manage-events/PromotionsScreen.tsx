import 'react-native-gesture-handler';
import _ from 'lodash';
import Animated from 'react-native-reanimated';
import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Pressable, ScrollView } from 'react-native';
import { Colors, FloatingButton, FloatingButtonLayouts, Image, ListItem, LoaderScreen, Text, View } from 'react-native-ui-lib';
import CircularProgress from 'react-native-circular-progress-indicator';
import { GetPromotionsType, GetPromotionsRequest, getPromotions } from 'troptix-api';
import { Event, Promotion, PromotionType } from "troptix-models";
import { RefreshControl } from 'react-native-gesture-handler';

export default function PromotionsScreen({ eventObject, navigation }) {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isFetchingPromotions, setIsFetchingPromotions] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPromotions = async () => {
    const getPromotionsRequest: GetPromotionsRequest = {
      getPromotionsType: GetPromotionsType.GET_PROMOTIONS_ALL,
      eventId: eventObject.id,
    }

    try {
      const response = await getPromotions(getPromotionsRequest);

      console.log("Promotions Response: " + JSON.stringify(response));
      if ((response.error === undefined || response.error === undefined) && response.length !== 0) {
        setPromotions(response);
      }
    } catch (error) {
      console.log("PromotionsScreen [fetchPromotions] error: " + error)
    }
    setIsFetchingPromotions(false);
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchPromotions();
    setRefreshing(false);
  }, []);

  function deletePromotion(index) {
    const deletedPromotion = promotions.at(index);
    Alert.alert('Delete Promotion', 'Are you sure you want to delete this promotion?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Delete', onPress: () => {
          setPromotions(
            promotions.filter(promotion => promotion.id !== deletedPromotion.id)
          );
        }
      },
    ]);
  }

  function addPromo(promo) {
    setPromotions([...promotions, promo]);
  }

  function editPromo(index, promotion) {
    const updatedUsers = [
      ...promotions.slice(0, index),
      promotion,
      ...promotions.slice(index)
    ];
    setPromotions(updatedUsers);
  }

  function openAddPromotionPage(promotion, isEditPromotion = false, index = 0) {
    navigation.navigate('AddPromotionScreen', {
      isEditPromotion: isEditPromotion,
      promotionIndex: index,
      promo: promotion,
      addPromo: addPromo,
      editPromo: editPromo,
    })
  }

  function getPromotionType(access) {
    switch (access) {
      case PromotionType.PERCENTAGE:
        return "Percentage";
      case PromotionType.DOLLAR_AMOUNT:
        return "Dollar amount";
      default:
        break;
    }
  }

  function PromotionItem(promotion, index) {
    return (
      <View style={{
        backgroundColor: 'white',
        borderWidth: 1,
        borderRadius: 5,
        borderColor: "#D3D3D3",
      }}>

        <Pressable onPress={() => openAddPromotionPage(promotion, true, index)}>
          <View marginL-8 marginT-4 marginB-4>
            <Text grey10 text70 style={{ fontWeight: 'bold' }}>
              {promotion.code}
            </Text>
            <Text grey10 text70>
              Value: {promotion.value}
            </Text>
            <Text grey10 text70>
              Promotion Type: {getPromotionType(promotion.promotionType)}
            </Text>
          </View>
        </Pressable>
      </View>
    );
  }

  function renderPromotions() {
    return _.map(promotions, (promotion, i) => {
      return (
        <View key={i} marginT-16 row>
          <View flex>
            {PromotionItem(promotion, i)}
          </View>

          <View style={{ justifyContent: 'center', alignItems: 'center' }} marginL-8>
            <Pressable onPress={() => deletePromotion(i)}>
              <Image source={require('../../assets/icons/delete.png')} tintColor={Colors.black} width={24} height={24} />
            </Pressable>
          </View>
        </View>
      )
    })
  }

  return (
    <View paddingR-16 paddingL-16 style={{ height: "100%" }} backgroundColor='white'>
      {
        isFetchingPromotions ?
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <LoaderScreen message={'Fetching Promotions'} color={Colors.grey40} />
          </View>
          :
          <View style={{ flex: 1, backgroundColor: 'white' }}>
            <View marginB-48 style={{ flex: 1, backgroundColor: "white" }}>
              <ScrollView
                refreshControl={
                  <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }>
                <View>
                  <Text style={{ fontSize: 14 }} marginT-16 marginB-8 $textDefault>
                    Add promotion codes that will give discounted prices on your tickets.
                  </Text>
                </View>
                <View>
                  <Text style={{ fontSize: 20 }} marginT-16 marginB-8 $textDefault>
                    Promotions
                  </Text>
                  {renderPromotions()}
                </View>
              </ScrollView>
            </View>

            <View marginB-16>
              <FloatingButton
                visible={true}
                button={{
                  label: 'Add Promotion',
                  onPress: () => openAddPromotionPage(new Promotion(eventObject.id))
                }}
                buttonLayout={FloatingButtonLayouts.HORIZONTAL}
                bottomMargin={16}
              />
            </View>
          </View>

      }

    </View>
  );
}