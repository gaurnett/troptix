import { CustomInput, CustomTextArea } from "@/components/ui/input";
import Link from "next/link";
import { useEffect, useState } from "react";
import { TicketType } from 'troptix-models';
import { Button, Drawer, List, Popconfirm, Spin, message } from "antd";
import { Event, Promotion, PromotionType } from "troptix-models";
import { GetPromotionsType, GetPromotionsRequest, getPromotions, addPromotion } from 'troptix-api';
import { useRouter } from "next/router";
import PromotionCodeForm from "./promotion-code-form";

export default function PromotionCodesPage() {
  const router = useRouter();
  const eventId = router.query.eventId;

  const [messageApi, contextHolder] = message.useMessage();
  const [promotions, setPromotions] = useState<any[]>([]);
  const [isFetchingPromotions, setIsFetchingPromotions] = useState(true);
  const [show, setShow] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<any>();
  const [selectedIndex, setSelectedIndex] = useState(-1);

  useEffect(() => {
    async function fetchPromotions() {
      const getPromotionsRequest: any = {
        getPromotionsType: GetPromotionsType.GET_PROMOTIONS_ALL,
        eventId: eventId,
      }

      try {
        const response = await getPromotions(getPromotionsRequest);

        if ((response.error === undefined || response.error === undefined) && response.length !== 0) {
          setPromotions(response);
        }
      } catch (error) {
      }
      setIsFetchingPromotions(false);
    };

    fetchPromotions();
  }, [eventId]);

  async function savePromotion() {
    const response = await addPromotion(selectedPromotion, selectedIndex !== -1);

    if (response === null || response === undefined || response.error !== null) {
      messageApi.open({
        type: 'error',
        content: 'Failed to save promotion code, please try again.',
      });
      return;
    }

    messageApi.open({
      type: 'success',
      content: 'Successfully saved promotion code.',
    });

    if (selectedIndex === -1) {
      setPromotions([...promotions, selectedPromotion])
    } else {
      const updatedPromotions = promotions.map((promotion, i) => {
        if (promotion.id === selectedPromotion.id) {
          return selectedPromotion;
        } else {
          return promotion;
        }
      });
      setPromotions(updatedPromotions);
    }

    setOpen(false);
  }

  function deletePromotion() {
    setPromotions(promotions.filter(promotion => promotion.id !== selectedPromotion.id));
  }

  function showDrawer(ticket: any, index: number) {
    setSelectedPromotion(ticket);
    setSelectedIndex(index);
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <div className="">
      {contextHolder}
      <div className="w-full md:max-w-md mr-8">
        {
          isFetchingPromotions ?
            <Spin className="mt-16" tip="Fetching Promotions" size="large">
              <div className="content" />
            </Spin> :
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold leading-tighter tracking-tighter mb-4" data-aos="zoom-y-out">Promotion Codes</h2>

              <Button onClick={() => showDrawer(new Promotion(eventId), -1)} type="primary" className="px-6 py-5 shadow-md items-center bg-blue-600 hover:bg-blue-700 justify-center font-medium inline-flex">Add Promotion</Button>

              <List
                className="demo-loadmore-list"
                itemLayout="horizontal"
                dataSource={promotions}
                renderItem={(item, index) => (
                  <List.Item
                    actions={[
                      <Button onClick={() => showDrawer(item, index)} key="edit">Edit</Button>,
                      <Popconfirm
                        key="delete"
                        title="Delete this promotion"
                        description="Are you sure to delete this promotion?"
                        className="time-picker-button"
                        onConfirm={deletePromotion}
                        okText="Yes"
                        cancelText="No"
                      >
                        <Button danger>Delete</Button>
                      </Popconfirm>]}
                  >
                    <div>{item.code}</div>
                  </List.Item>
                )}
              />
            </div>

        }
      </div>

      <Drawer width={500} title="Add Promotion" placement="right" onClose={onClose} open={open}>
        <PromotionCodeForm selectedPromotion={selectedPromotion} setSelectedPromotion={setSelectedPromotion} savePromotion={savePromotion} />
      </Drawer>

    </div>
  );
}