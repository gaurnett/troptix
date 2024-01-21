import {
  CustomDateField,
  CustomInput,
  CustomTextArea,
  CustomTimeField,
} from '@/components/ui/input';
import Autocomplete from 'react-google-autocomplete';
import { Button, message, Form } from 'antd';
import { useRouter } from 'next/router';
import { RequestType } from '@/hooks/useFetchEvents';
import { useCreateEvent } from '@/hooks/usePostEvent';
import { useQueryClient } from '@tanstack/react-query';

export default function AddEventFormPage({ event, setEvent }) {
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEvent((previousEvent) => ({
      ...previousEvent,
      [e.target.name]: e.target.value,
    }));
  }

  async function updateDate(name, value) {
    if (value === null) {
      return;
    }

    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);

    if (name === 'startDate') {
      if (value.toDate().getTime() > endDate.getTime()) {
        const newEndDate = value.toDate();
        newEndDate.setHours(newEndDate.getHours() + 4);

        setEvent((previousEvent) => ({
          ...previousEvent,
          ['endDate']: newEndDate,
        }));
      }
    }

    if (name === 'endDate' && value.toDate().getTime() < startDate.getTime()) {
      messageApi.open({
        type: 'error',
        content: 'End time cannot be before start time',
      });
      return;
    }

    setEvent((previousEvent) => ({
      ...previousEvent,
      [name]: value.toDate(),
    }));
  }

  function getValueOrDefault(value: any, defaultValue: any) {
    if (value === undefined || value === null) {
      return defaultValue;
    }

    return value;
  }

  function onPlaceChanged(place: google.maps.places.PlaceResult) {
    if (place === null || place === undefined) {
      return;
    }

    let country = '';
    let countryCode = '';
    let lat = 0;
    let lng = 0;
    if (place.address_components !== undefined) {
      place.address_components.forEach((component) => {
        if (component.types.includes('country')) {
          country = component.long_name;
          countryCode = component.short_name;
        }
      });
    }

    if (place.geometry?.location !== undefined) {
      lat = place.geometry.location.lat();
      lng = place.geometry.location.lng();
    }

    setEvent((previousEvent: any) => ({
      ...previousEvent,
      ['address']: getValueOrDefault(place.formatted_address, ''),
      ['country']: getValueOrDefault(country, ''),
      ['country_code']: getValueOrDefault(countryCode, ''),
      ['latitude']: getValueOrDefault(lat, 0),
      ['longitude']: getValueOrDefault(lng, 0),
    }));
  }

  const queryClient = useQueryClient();
  const mutation = useCreateEvent();

  function createEvent() {
    const e = event;
    mutation.mutate(e, {
      onSuccess: () => {
        messageApi.open({
          type: 'success',
          content: 'Successfully created event.',
        });
        queryClient.invalidateQueries({
          queryKey: [RequestType.GET_EVENTS_ALL],
        });

        router.push({
          pathname: `/admin/manage-event`,
          query: {
            eventId: event.id,
          },
        });
      },
      onError: () => {
        messageApi.open({
          type: 'error',
          content: 'Failed to create event, please try again.',
        });
      },
    });
  }

  async function onFinish(values: any) {
    if (event.address === '' || event.address === undefined) {
      messageApi.open({
        type: 'error',
        content: 'Please enter a valid address',
      });
      return;
    }

    createEvent();
  }

  return (
    <div className="w-full md:max-w-xl mx-auto">
      {contextHolder}
      <Form name="basic" onFinish={onFinish} className="mx-4">
        <h2
          className="text-2xl md:text-3xl font-extrabold leading-tighter tracking-tighter mb-4"
          data-aos="zoom-y-out"
        >
          Event Details
        </h2>

        <div className="flex flex-wrap -mx-3 mb-4">
          <div className="w-full px-3">
            <CustomInput
              value={event.name}
              name={'name'}
              id={'name'}
              label={'Event Title *'}
              type={'text'}
              placeholder={'TropTix Beach Party'}
              handleChange={handleChange}
              required={true}
            />
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-4">
          <div className="w-full px-3">
            <CustomInput
              value={event.organizer}
              name={'organizer'}
              id={'organizer'}
              label={'Event Organizer *'}
              type={'text'}
              placeholder={'TropTix'}
              handleChange={handleChange}
              required={true}
            />
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-4">
          <div className="w-full px-3">
            <CustomInput
              value={event.venue}
              name={'venue'}
              id={'venue'}
              label={'Event Venue *'}
              type={'text'}
              placeholder={'Brooklyn Museum'}
              handleChange={handleChange}
              required={true}
            />
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-4">
          <div className="w-full px-3">
            <label
              className="block text-gray-800 text-sm font-medium mb-1"
              htmlFor={'location'}
            >
              Event Address *
            </label>
            <Autocomplete
              className="form-input w-full text-gray-800"
              placeholder="200 Eastern Pkwy, Brooklyn, NY 11238"
              defaultValue={event.address}
              apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
              onPlaceSelected={(place) => {
                onPlaceChanged(place);
              }}
              options={{
                types: [],
              }}
            />
          </div>
        </div>

        <h2
          className="text-2xl md:text-3xl font-extrabold leading-tighter tracking-tighter mb-4"
          data-aos="zoom-y-out"
        >
          Description
        </h2>
        <div className="flex flex-wrap -mx-3 mb-4">
          <div className="w-full px-3">
            <CustomTextArea
              value={event.description}
              name={'description'}
              id={'description'}
              label={'Event Description *'}
              rows={6}
              placeholder={
                'Add a full description of your event. This will be presented on your event details page.'
              }
              handleChange={handleChange}
              required={true}
            />
          </div>
        </div>

        <h2
          className="text-2xl md:text-3xl font-extrabold leading-tighter tracking-tighter mb-4"
          data-aos="zoom-y-out"
        >
          Date & Time
        </h2>
        <div className="md:flex md:justify-between">
          <div className="mb-4 md:mr-4 w-full">
            <CustomDateField
              value={event.startDate}
              name={'startDate'}
              id={'startDate'}
              label={'Start Date *'}
              placeholder={'Start Date'}
              handleChange={(value: any) => updateDate('startDate', value)}
              required={true}
            />
          </div>
          <div className="mb-4 md:ml-4 w-full">
            <CustomTimeField
              value={event.startDate}
              name={'startDate'}
              id={'startTime'}
              label={'Start Time *'}
              placeholder={'Start Time'}
              handleChange={(value: any) => updateDate('startDate', value)}
              required={true}
            />
          </div>
        </div>
        <div className="md:flex md:justify-between">
          <div className="mb-4 md:mr-4 w-full">
            <CustomDateField
              value={event.endDate}
              name={'endDate'}
              id={'endDate'}
              label={'End Date *'}
              placeholder={'End Date'}
              handleChange={(value: any) => updateDate('endDate', value)}
              required={true}
              useCustomDisableDate={true}
              startDate={event.startDate}
            />
          </div>
          <div className="mb-4 md:ml-4 w-full">
            <CustomTimeField
              value={event.endDate}
              name={'endDate'}
              id={'endTime'}
              label={'End Time *'}
              placeholder={'End Time'}
              handleChange={(value: any) => updateDate('endDate', value)}
              required={true}
            />
          </div>
        </div>

        <div className="flex flex-wrap -mx-3 mb-4 mt-8">
          <div className="px-3">
            <Button
              htmlType="submit"
              type="primary"
              className="px-6 py-6 shadow-md items-center bg-blue-600 hover:bg-blue-700 justify-center font-medium inline-flex"
            >
              Save and Continue
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
}
