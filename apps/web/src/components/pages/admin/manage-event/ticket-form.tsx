import {
  CustomDateField,
  CustomInput,
  CustomNumberInput,
  CustomTextArea,
  CustomTimeField,
} from '@/components/ui/input';
import {
  TicketsType as TicketCostType,
  TicketFeeStructure,
  TicketType,
} from '@/hooks/types/Ticket';
import { Button, Checkbox, Form, Select } from 'antd';
import { useEffect, useState, useContext } from 'react';
import { TropTixContext } from '@/components/AuthProvider';
import { Banner } from '@/components/ui/banner';

type DateFieldName = 'saleStartDate' | 'saleEndDate';

export default function TicketForm({
  selectedTicket,
  saveTicket,
  onClose,
}: {
  selectedTicket: TicketType;
  saveTicket: (ticketType: TicketType | undefined) => void;
  onClose: () => void;
}) {
  const [ticketForm, setTicketForm] = useState<TicketType>();
  const { user } = useContext(TropTixContext);

  useEffect(() => {
    setTicketForm(selectedTicket);
  }, [selectedTicket]);

  const handleDateChange = (field: DateFieldName, value) => {
    if (!value) return;

    setTicketForm((prev) => {
      if (!prev) return prev;
      return { ...prev, [field]: value.toDate() };
    });
  };

  const handleFormChange = <K extends Exclude<keyof TicketType, DateFieldName>>(
    field: K,
    value: TicketType[K]
  ) => {
    setTicketForm((prev) => {
      if (!prev) return prev;
      return { ...prev, [field]: value };
    });
  };

  return (
    <div className="md:max-w-md">
      <Form className="" name="basic" onFinish={() => saveTicket(ticketForm)}>
        <h3
          className="text-xl md:text-xl font-extrabold leading-tighter tracking-tighter mb-4"
          data-aos="zoom-y-out"
        >
          Details
        </h3>
        <div className="flex flex-wrap -mx-3 mb-4">
          <div className="w-screen px-3">
            <CustomInput
              value={ticketForm?.name}
              name="name"
              id="name"
              label="Ticket Name"
              type="text"
              placeholder="General Admission"
              handleChange={(e) => handleFormChange('name', e.target.value)}
              required={true}
            />
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-4">
          <div className="w-screen px-3">
            <CustomTextArea
              value={ticketForm?.description}
              name="description"
              id="description"
              label="Ticket Description"
              rows={5}
              placeholder="Describe what patrons get with this ticket"
              handleChange={(e) =>
                handleFormChange('description', e.target.value)
              }
              required={true}
            />
          </div>
        </div>
        <h2
          className="text-xl md:text-xl font-extrabold leading-tighter tracking-tighter mb-4"
          data-aos="zoom-y-out"
        >
          Sale Date & Time
        </h2>
        <div className="md:flex md:justify-between">
          <div className="mb-4 md:mr-4 w-full">
            <CustomDateField
              value={ticketForm?.saleStartDate}
              name="saleStartDate"
              id="saleStartDate"
              label="Sale start date"
              placeholder="Start Date"
              handleChange={(value) => handleDateChange('saleStartDate', value)}
              required={true}
            />
          </div>
          <div className="mb-4 md:ml-4 w-full">
            <CustomTimeField
              value={ticketForm?.saleStartDate}
              name="saleStartDate"
              id="saleStartTime"
              label="Sale start time"
              placeholder="Start Time"
              handleChange={(value) => handleDateChange('saleStartDate', value)}
              required={true}
            />
          </div>
        </div>
        <div className="md:flex md:justify-between">
          <div className="mb-4 md:mr-4 w-full">
            <CustomDateField
              value={ticketForm?.saleEndDate}
              name="saleEndDate"
              id="saleEndDate"
              label="Sale end date"
              placeholder="End Date"
              handleChange={(value) => handleDateChange('saleEndDate', value)}
              required={true}
            />
          </div>
          <div className="mb-4 md:ml-4 w-full">
            <CustomTimeField
              value={ticketForm?.saleEndDate}
              name="saleEndDate"
              id="saleEndTime"
              label="Sale end time"
              placeholder="End Time"
              handleChange={(value) => handleDateChange('saleEndDate', value)}
              required={true}
            />
          </div>
        </div>
        <h2
          className="text-xl md:text-xl font-extrabold leading-tighter tracking-tighter mb-4"
          data-aos="zoom-y-out"
        >
          Pricing & Availability
        </h2>
        <div className="mb-4 w-full">
          <label
            className="block text-gray-800 text-sm font-medium mb-1"
            htmlFor="ticketCostType"
          >
            Ticket Cost Type
          </label>
          <Select
            className="sm:w-screen w-full md:w-52 h-12 text-gray-800"
            id="ticketCostType"
            defaultValue={TicketCostType.FREE}
            onChange={(value) => handleFormChange('ticketType', value)}
            value={ticketForm?.ticketType}
            options={[
              {
                label: 'Free RSVP',
                value: TicketCostType.FREE,
              },
              {
                label: 'Paid Ticket',
                value: TicketCostType.PAID,
              },
            ]}
          />
        </div>
        {ticketForm?.ticketType === TicketCostType.PAID &&
          !user?.isOrganizer && (
            <Banner
              type="warning"
              title="You’re not verified to publish paid events"
              className="mb-4"
              message={
                <>
                  To publish this event, you’ll need to verify your account by
                  meeting with our team.{' '}
                  <a
                    href="https://calendly.com/your-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline font-medium"
                  >
                    Schedule a quick call
                  </a>
                  <br />
                  <br />
                  <span>
                    You can still save this event as a draft or switch to a free
                    ticket to publish it right away.
                  </span>
                </>
              }
            />
          )}
        {ticketForm?.ticketType === TicketCostType.PAID && (
          <div className="md:flex md:justify-between">
            <div className="mb-4 md:mr-4 w-full">
              <CustomNumberInput
                value={ticketForm?.price}
                name="price"
                id="ticket-input-price"
                label="Ticket Price"
                placeholder="$130.00"
                useFormatter={true}
                handleChange={(value) => handleFormChange('price', value)}
                required={ticketForm?.ticketType === TicketCostType.PAID}
              />
            </div>
            <div className="mb-4 md:ml-4 w-full">
              <label
                className="block text-gray-800 text-sm font-medium mb-1"
                htmlFor="ticketingFees"
              >
                Fee Structure
              </label>
              <Select
                className="sm:w-screen w-full md:w-52 h-12 text-gray-800"
                id="ticketingFees"
                defaultValue={TicketFeeStructure.PASS_TICKET_FEES}
                onChange={(value) => handleFormChange('ticketingFees', value)}
                value={ticketForm?.ticketingFees}
                options={[
                  {
                    label: 'Absorb Ticket Fees',
                    value: TicketFeeStructure.ABSORB_TICKET_FEES,
                  },
                  {
                    label: 'Pass Ticket Fees',
                    value: TicketFeeStructure.PASS_TICKET_FEES,
                  },
                ]}
              />
            </div>
          </div>
        )}
        <div className="md:flex md:justify-between">
          <div className="mb-4 md:mr-4 w-full">
            <CustomNumberInput
              value={ticketForm?.quantity}
              name="quantity"
              id="ticket-input-quantity"
              label="Ticket Quantity"
              placeholder="100"
              handleChange={(value) => handleFormChange('quantity', value)}
              required={true}
            />
          </div>
          <div className="mb-4 md:ml-4 w-full">
            <CustomNumberInput
              value={ticketForm?.maxPurchasePerUser}
              name="maxPurchasePerUser"
              id="ticket-input-maxPurchasePerUser"
              label="Max Purchase Per User"
              placeholder="10"
              handleChange={(value) =>
                handleFormChange('maxPurchasePerUser', value)
              }
              required={true}
            />
          </div>
        </div>

        <div>
          <div className="mb-4 md:mr-4 w-full">
            <Checkbox
              checked={ticketForm?.discountCode?.length !== 0}
              onChange={(e) =>
                handleFormChange('requiredDiscountCode', e.target.checked)
              }
            >
              Does this ticket require a discount code
            </Checkbox>
          </div>
          {(ticketForm?.requiredDiscountCode ||
            ticketForm?.discountCode?.length !== 0) && (
            <div className="mb-4 w-full">
              <CustomInput
                value={ticketForm?.discountCode}
                name="discountCode"
                id="discountCode"
                label="Discount Code"
                type="text"
                placeholder="FAMILY_TICKET"
                handleChange={(e) =>
                  handleFormChange('discountCode', e.target.value)
                }
                required={true}
              />
            </div>
          )}
        </div>

        <div className="flex flex-wrap -mx-3 mb-4 mt-4">
          <div className="px-3">
            <Button
              onClick={onClose}
              className="px-6 py-5 shadow-md items-center justify-center font-medium inline-flex"
            >
              Discard
            </Button>
          </div>
          <div className="px-3">
            <Button
              htmlType="submit"
              type="primary"
              className="px-6 py-5 shadow-md items-center bg-blue-600 hover:bg-blue-700 justify-center font-medium inline-flex"
            >
              Save Ticket
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
}
