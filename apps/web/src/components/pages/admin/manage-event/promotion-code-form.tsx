import { CustomInput, CustomNumberInput } from "@/components/ui/input";
import { Button, Form, Select } from "antd";
import { PromotionType } from 'troptix-models';

export default function PromotionCodeForm({ selectedPromotion, setSelectedPromotion, savePromotion }) {

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSelectedPromotion(previousPromotion => ({
      ...previousPromotion,
      [event.target.name]: event.target.value,
    }))
  }

  function handleNumberChange(name, value) {
    setSelectedPromotion(previousPromotion => ({
      ...previousPromotion,
      [name]: value,
    }))
  }

  function handleSelectChange(value: string) {
    setSelectedPromotion(previousPromotion => ({
      ...previousPromotion,
      ["ticketingFees"]: value,
    }))
  };

  return (
    <div className="md:max-w-md">
      <Form
        name="promo-form"
        onFinish={savePromotion}>
        <h3 className="text-xl md:text-xl font-extrabold leading-tighter tracking-tighter mb-4" data-aos="zoom-y-out">Promotion Details</h3>
        <div className="flex flex-wrap -mx-3 mb-4">
          <div className="w-screen px-3">
            <CustomInput value={selectedPromotion.code} name={"code"} id={"code"} label={"Promotion Code"} type={"text"} placeholder={"SAVE15"} handleChange={handleChange} required={true} />
          </div>
        </div>
        <div className="md:flex md:justify-between">
          <div className="mb-4 md:mr-4 w-full">
            <CustomNumberInput value={selectedPromotion.value} name={"value"} id={"ticket-input-quantity"} label={"Promotion Value"} placeholder={"15"} handleChange={(value) => handleNumberChange("quantity", value)} required={true} />
          </div>
          <div className="mb-4 md:ml-4 w-full">
            <label className="block text-gray-800 text-sm font-medium mb-1" htmlFor={"promotionType"}>Promotion Type</label>
            <Select
              className="sm:w-screen w-full md:w-52 h-12 text-gray-800"
              id="promotionType"
              defaultValue={PromotionType.PERCENTAGE}
              onChange={handleSelectChange}
              value={selectedPromotion.promotionType}
              options={[
                { label: 'Percentage', value: PromotionType.PERCENTAGE },
                { label: 'Dollar Amount', value: PromotionType.DOLLAR_AMOUNT },
              ]}
            />
          </div>
        </div>

        <div className="flex flex-wrap -mx-3 mb-4 mt-4">
          <div className="px-3">
            <Button className="px-8 py-6 shadow-md items-center justify-center font-medium inline-flex">Discard</Button>
          </div>
          <div className="px-3">
            <Button htmlType="submit" type="primary" className="px-8 py-6 shadow-md items-center bg-blue-600 hover:bg-blue-700 justify-center font-medium inline-flex">Save Promotion</Button>
          </div>
        </div>
      </Form>
    </div>
  );
}