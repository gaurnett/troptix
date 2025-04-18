import { List, Typography } from 'antd';
import { format } from 'date-fns';
import { useContext } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { TropTixContext } from '@/components/AuthProvider';
import { Button, ButtonWithIcon } from '@/components/ui/button';
import { InputWithLabel } from '@/components/ui/input';
import { TypographyH3 } from '@/components/ui/typography';
import { CheckoutTicket } from '@/types/checkout';
import { getDateFormatter } from '@/lib/utils';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { UseFormReturn } from 'react-hook-form';
import { UserDetailsFormData } from '@/lib/schemas/checkoutSchema';
import { Input } from '@/components/ui/input';
import { CheckoutConfigResponse } from '@/types/checkout';
import { CheckoutState } from './CheckoutContainer';
const { Paragraph } = Typography;

export default function TicketsCheckoutForm({
  checkoutConfig,
  setCheckout,
  checkout,
  formMethods,
}: {
  checkoutConfig: CheckoutConfigResponse;
  checkout: CheckoutState;
  setCheckout: React.Dispatch<React.SetStateAction<CheckoutState>>;
  formMethods: UseFormReturn<UserDetailsFormData>;
}) {
  const { user } = useContext(TropTixContext);

  function getFormattedCurrency(price) {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });
    return formatter.format(price);
  }

  function updateCost(ticket, reduce = false) {
    const updatedTickets = { ...checkout.tickets };
    const currentQuantity = updatedTickets[ticket.id] || 0;
    const newQuantity = reduce ? currentQuantity - 1 : currentQuantity + 1;

    if (newQuantity <= 0) {
      // remove the ticket from the checkout
      delete updatedTickets[ticket.id];
    } else {
      updatedTickets[ticket.id] = newQuantity;
    }
    setCheckout({
      ...checkout,
      tickets: updatedTickets,
    });
  }

  function getTicketStateMessage(ticket: CheckoutTicket) {
    const now = new Date();
    const startDate = new Date(ticket.saleStartDate);
    const endDate = new Date(ticket.saleEndDate);

    if (now < startDate) {
      return 'Sale starts ' + format(startDate, 'MMM dd, yyyy, hh:mm a');
    }
    if (now > endDate) {
      return 'Sale ended';
    }
    // If sale is active but none can be added
    if (ticket.maxAllowedToAdd <= 0) {
      return 'Sold Out';
    }
    return undefined;
  }

  return (
    <div className="md:px-4">
      <Form {...formMethods}>
        <TypographyH3 text={'Contact Information'} classes="mb-2" />
        <div className="flex justify-between">
          <FormField
            control={formMethods.control}
            name="firstName"
            rules={{ required: true }}
            render={({ field }) => (
              <FormItem className="mb-4 mr-1 md:mr-4 w-full">
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder={'John'} disabled={!!user.id} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={formMethods.control}
            name="lastName"
            rules={{ required: true }}
            render={({ field }) => (
              <FormItem className="mb-4 mr-1 md:mr-4 w-full">
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder={'Doe'} disabled={!!user.id} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="md:flex justify-between">
          <FormField
            control={formMethods.control}
            name="email"
            rules={{ required: true }}
            render={({ field }) => (
              <FormItem className="mb-4 mr-1 md:mr-4 w-full">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={'johndoe@gmail.com'}
                    disabled={!!user.id}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={formMethods.control}
            name="confirmEmail"
            rules={{ required: true }}
            render={({ field }) => (
              <FormItem className="mb-4 mr-1 md:mr-4 w-full">
                <FormLabel>Confirm Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={'johndoe@gmail.com'}
                    disabled={!!user.id}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </Form>

      <TypographyH3 text={'Tickets'} classes="mb-2" />
      <div className="mb-4">
        <div className="w-full">
          <label
            className="block text-gray-800 text-sm font-medium mb-1"
            htmlFor={'promotionCode'}
          >
            Promotion Code
          </label>
        </div>
        <div className="flex w-full">
          <InputWithLabel
            // onChange={handlePromotionChange}
            name={'promotionCode'}
            id={'promotionCode'}
            type={'text'}
            placeholder={'SAVE15'}
            containerClass="w-full"
          />
          <Button onClick={() => {}} className="my-auto ml-2">
            Apply
          </Button>
        </div>
      </div>

      <List
        itemLayout="vertical"
        size="large"
        dataSource={checkoutConfig.tickets}
        split={false}
        renderItem={(ticket: CheckoutTicket, index: number) => {
          let ticketState = getTicketStateMessage(ticket);

          const maxAllowedToAdd = ticket.maxAllowedToAdd;

          const basePrice = ticket.price ?? 0;
          const baseFees = ticket.fees ?? 0;

          const displayPrice = getFormattedCurrency(basePrice);
          const displayFees = getFormattedCurrency(baseFees);

          return (
            <List.Item className="mb-4" style={{ padding: 0 }}>
              <div
                className="px-4 w-full"
                style={{
                  borderWidth: 1,
                  borderRadius: 10,
                  borderColor: '#D3D3D3',
                }}
              >
                <div>
                  <div className="my-auto">
                    <div className="flex h-16">
                      <div className="md:w-4/5 grow my-auto">{ticket.name}</div>
                      <div className="md:w-1/5 flex my-auto justify-center items-center">
                        <div>
                          {ticketState !== undefined ? (
                            <div className="text-center text-md font-bold">
                              {ticketState}
                            </div>
                          ) : (
                            <div className="flex">
                              <ButtonWithIcon
                                onClick={() => updateCost(ticket, true)}
                                className="bg-blue-500 rounded h-8 w-8"
                                size={'sm'}
                                disabled={
                                  checkout.tickets[ticket.id] === 0 ||
                                  checkout.tickets[ticket.id] === undefined
                                }
                                icon={
                                  <MinusOutlined className="text-white items-center justify-center" />
                                }
                              ></ButtonWithIcon>
                              <div className="mx-4" style={{ fontSize: 20 }}>
                                {checkout.tickets[ticket.id] ?? 0}
                              </div>
                              <ButtonWithIcon
                                onClick={() => updateCost(ticket, false)}
                                className="bg-blue-500 rounded h-8 w-8"
                                disabled={
                                  checkout.tickets[ticket.id] ===
                                  maxAllowedToAdd
                                }
                                icon={
                                  <PlusOutlined className="text-white items-center justify-center" />
                                }
                              ></ButtonWithIcon>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  key={index}
                  style={{ width: '100%', borderColor: '#D3D3D3' }}
                >
                  <div
                    style={{ flex: 1, height: 1, backgroundColor: '#D3D3D3' }}
                  />
                  <div className="my-4">
                    <div className="flex">
                      <div className="text-base font-bold">{displayPrice}</div>
                      <div className="my-auto text-gray-500">
                        &nbsp;+ {displayFees} fees
                      </div>
                    </div>
                    <div className="text-sm">
                      Sale ends:{' '}
                      {getDateFormatter(new Date(ticket.saleEndDate))}
                    </div>
                    <div>
                      <Paragraph
                        className="text-justify text-sm"
                        ellipsis={{
                          rows: 2,
                          expandable: true,
                          symbol: 'see more details',
                        }}
                      >
                        {ticket.description}
                      </Paragraph>
                    </div>
                    <div></div>
                  </div>
                </div>
              </div>
            </List.Item>
          );
        }}
      />
    </div>
  );
}
