import { TropTixContext } from '@/components/WebNavigator';
import { Spinner } from '@/components/ui/spinner';
import { Promotion, createPromotion } from '@/hooks/types/Promotion';
import { DeletePromotionRequest, PostPromotionRequest, useDeletePromotion, useFetchPromotionsForEvent, usePostPromotion } from '@/hooks/usePromotions';
import { useQueryClient } from '@tanstack/react-query';
import { Button, Drawer, List, Popconfirm, message } from 'antd';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import PromotionCodeForm from './promotion-code-form';

export default function PromotionCodesPage() {
  const router = useRouter();
  const { user } = useContext(TropTixContext);
  const eventId = router.query.eventId as string;

  const [messageApi, contextHolder] = message.useMessage();
  const [open, setOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion>();
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const { isPending, data: promotions } = useFetchPromotionsForEvent(eventId);
  const postPromotion = usePostPromotion();
  const deleteEventPromotion = useDeletePromotion();
  const queryClient = useQueryClient();

  async function savePromotion() {
    messageApi.open({
      key: 'update-promotions-loading',
      type: 'loading',
      content: 'Updating Promotions..',
      duration: 0,
    });

    const request: PostPromotionRequest = {
      editingPromotion: selectedIndex !== -1,
      promotion: selectedPromotion,
      jwtToken: user.jwtToken
    }

    postPromotion.mutate(request, {
      onSuccess: (data) => {
        console.log(data);
        const updatedList: Promotion[] = promotions;
        if (selectedIndex >= 0) {
          updatedList[selectedIndex] = data;
        } else {
          updatedList.push(data);
        }
        queryClient.setQueryData([eventId], updatedList);

        messageApi.destroy('update-promotions-loading');
        messageApi.open({
          type: 'success',
          content: 'Successfully saved promotion.',
        });
        setOpen(false);
      },
      onError: (error) => {
        messageApi.destroy('update-promotions-loading');
        messageApi.open({
          type: 'error',
          content: "Error saving promotion",
        });
        return;
      }
    });
  }

  function deletePromotion(deletedPromotion: Promotion) {
    messageApi.open({
      key: 'delete-promotion-loading',
      type: 'loading',
      content: 'Deleting Promotion...',
      duration: 0,
    });
    const request: DeletePromotionRequest = {
      id: deletedPromotion?.id,
      jwtToken: user.jwtToken,
    };

    deleteEventPromotion.mutate(request, {
      onSuccess: (data: Promotion) => {
        const updatedList: Promotion[] = promotions.filter(
          (promotion) => promotion.id !== data?.id
        );
        queryClient.setQueryData([eventId], updatedList);

        messageApi.destroy('delete-promotion-loading');
        messageApi.open({
          type: 'success',
          content: 'Successfully deleted promotion.',
        });
        setOpen(false);
      },
      onError: (error) => {
        messageApi.destroy('delete-promotion-loading');
        messageApi.open({
          type: 'error',
          content: 'There was an error deleting the promotion, please try again',
        });
      },
    });
  }

  function showDrawer(promotion: Promotion, index: number) {
    setSelectedPromotion(promotion);
    setSelectedIndex(index);
    setOpen(true);
  }

  const onClose = () => {
    setOpen(false);
  };

  return (
    <div className="">
      {contextHolder}
      <div className="w-full md:max-w-md mr-8">
        {isPending ? (
          <div className="mt-4">
            <Spinner text={'Fetching Promotions'} />
          </div>
        ) : (
          <div>
            <h2
              className="text-2xl md:text-3xl font-extrabold leading-tighter tracking-tighter mb-4"
              data-aos="zoom-y-out"
            >
              Promotion Codes
            </h2>

            <Button
              onClick={() => showDrawer(createPromotion(eventId), -1)}
              type="primary"
              className="px-6 py-5 shadow-md items-center bg-blue-600 hover:bg-blue-700 justify-center font-medium inline-flex"
            >
              Add Promotion
            </Button>

            <List
              className="demo-loadmore-list"
              itemLayout="horizontal"
              dataSource={promotions}
              renderItem={(item: Promotion, index) => (
                <List.Item
                  actions={[
                    <Button onClick={() => showDrawer(item, index)} key="edit">
                      Edit
                    </Button>,
                    <Popconfirm
                      key="delete"
                      title="Delete this promotion"
                      description="Are you sure to delete this promotion?"
                      className="time-picker-button"
                      onConfirm={() => deletePromotion(item)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button danger>Delete</Button>
                    </Popconfirm>,
                  ]}
                >
                  <div>{item.code}</div>
                </List.Item>
              )}
            />
          </div>
        )}
      </div>

      <Drawer
        width={500}
        title="Add Promotion"
        placement="right"
        onClose={onClose}
        open={open}
      >
        <PromotionCodeForm
          onClose={onClose}
          selectedPromotion={selectedPromotion}
          setSelectedPromotion={setSelectedPromotion}
          savePromotion={savePromotion}
        />
      </Drawer>
    </div>
  );
}
