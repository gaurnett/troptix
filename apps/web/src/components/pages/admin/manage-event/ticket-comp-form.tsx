import { CustomInput } from "@/components/ui/input";
import { ComplementaryOrder, ComplementaryTicket, generateComplementaryOrder } from "@/hooks/types/Order";
import { useCreateComplementaryOrder } from "@/hooks/useOrders";
import { generateId } from "@/lib/utils";
import { Button, Form, Select, message } from "antd";
import { useEffect, useState } from "react";
import { PostOrdersType } from 'troptix-api';

export default function TicketCompForm({ event, ticketTypes }) {

  const [messageApi, contextHolder] = message.useMessage();
  const [complementaryOrder, setComplementaryOrder] = useState<ComplementaryOrder>(generateComplementaryOrder(event));
  const [ticketTypeOptions, setTicketTypeOptions] = useState<Map<string, any>>(new Map());
  const [selectedTicket, setSelectedTicket] = useState<any>();
  const [canShowMessage, setCanShowMessage] = useState(true);
  const generalTicket = "General (Grants general entry)";
  const compTicketIdSuffix = "-comp-ticket";
  const createOrder = useCreateComplementaryOrder();

  useEffect(() => {
    const tempTickets: Map<string, any> = new Map();
    tempTickets.set(event.id + compTicketIdSuffix, {
      label: generalTicket,
      value: event.id + compTicketIdSuffix
    })

    if (
      ticketTypes === undefined
      || ticketTypes === null
      || ticketTypes.length === 0) {
      setTicketTypeOptions(tempTickets);
      return;
    }

    ticketTypes.forEach(ticketType => {
      tempTickets.set(ticketType.id, {
        label: ticketType.name,
        value: ticketType.id
      })
    })

    setTicketTypeOptions(tempTickets);

  }, [event, ticketTypes])

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setComplementaryOrder(previousTicket => ({
      ...previousTicket,
      [event.target.name]: event.target.value,
    }));
  }

  function handleSelectChange(value: string, option: any) {
    setSelectedTicket(value);
    const tickets = new Array();
    const complementaryTicket: ComplementaryTicket = {
      id: generateId(),
      name: option.label,
      firstName: complementaryOrder.firstName,
      lastName: complementaryOrder.lastName,
      email: complementaryOrder.email
    };

    if (!String(option.value).includes(compTicketIdSuffix)) {
      complementaryTicket.ticketTypeId = option.value
    }

    tickets.push(complementaryTicket);
    setComplementaryOrder(previousTicket => ({
      ...previousTicket,
      ["tickets"]: tickets,
    }))
  };

  async function sendComplementaryTicket() {
    if (!selectedTicket) {
      if (canShowMessage) {
        setCanShowMessage(false);
        message.error("Please select ticket type")
          .then(() => setCanShowMessage(true))
      }
      return;
    }

    const postOrdersRequest = {
      type: PostOrdersType.POST_ORDERS_CREATE_COMPLEMENTARY_ORDER,
      complementaryOrder: complementaryOrder
    }

    createOrder.mutate(postOrdersRequest, {
      onSuccess: (data) => {
        messageApi.open({
          type: 'success',
          content: 'Successfully sent complementary ticket.',
        });

        setComplementaryOrder(generateComplementaryOrder(event));
        setSelectedTicket(undefined);
      },
      onError: (error) => {
        messageApi.open({
          type: 'error',
          content: 'Failed to create complementary ticket, please try again.',
        });
        return;
      }
    })
  }

  return (
    <div className="md:max-w-md">
      {contextHolder}
      <Form
        className=""
        name="comp-form"
        onFinish={sendComplementaryTicket}>
        <h3 className="text-xl md:text-xl font-extrabold leading-tighter tracking-tighter mb-4" data-aos="zoom-y-out">Ticket Details</h3>
        <div className="md:flex md:justify-between">
          <div className="mb-4 md:mr-4 w-full">
            <CustomInput value={complementaryOrder.firstName} name={"firstName"} id={"firstName"} label={"First Name"} type={"text"} placeholder={"John"} handleChange={handleChange} required={true} />
          </div>
          <div className="mb-4 md:ml-4 w-full">
            <CustomInput value={complementaryOrder.lastName} name={"lastName"} id={"lastName"} label={"Last Name"} type={"text"} placeholder={"Doe"} handleChange={handleChange} required={true} />
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-4">
          <div className="w-screen px-3">
            <CustomInput value={complementaryOrder.email} name={"email"} id={"email"} label={"Email"} placeholder={"johndoe@gmail.com"} handleChange={handleChange} required={true} type={"text"} />
          </div>
        </div>
        <div className="flex flex-wrap mb-4">
          <label className="block text-gray-800 text-sm font-medium mb-1" htmlFor={"ticketingFees"}>Ticket Type</label>
          <Select
            className="sm:w-screen w-full h-12 text-gray-800"
            id="ticketingFees"
            placeholder={"Select ticket type"}
            defaultValue={ticketTypeOptions[0]}
            onChange={handleSelectChange}
            value={selectedTicket}
            options={Array.from(ticketTypeOptions.values())}
          />
        </div>
        <div className="flex flex-wrap -mx-3 mb-4 mt-4">
          <div className="px-3">
            <Button className="px-6 py-5 shadow-md items-center justify-center font-medium inline-flex">Discard</Button>
          </div>
          <div className="px-3">
            <Button htmlType="submit" type="primary" className="px-6 py-5 shadow-md items-center bg-blue-600 hover:bg-blue-700 justify-center font-medium inline-flex">Send Ticket</Button>
          </div>
        </div>
      </Form>
    </div>
  );
}