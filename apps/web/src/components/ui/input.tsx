import * as React from 'react';

import { cn } from '@/lib/utils';
import { Input as AntdInput, DatePicker, InputNumber, TimePicker } from 'antd';
import { RangePickerProps } from 'antd/es/date-picker';
import { format } from 'date-fns';
import dayjs from 'dayjs';
import { Label } from './label';
// import TextArea from "antd/es/input/TextArea";

const { TextArea } = AntdInput;

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  labelValue?: string;
  containerClass?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

const InputWithLabel = React.forwardRef<HTMLInputElement, InputProps>(
  ({ id, labelValue, containerClass, className, type, ...props }, ref) => {
    return (
      <div className={containerClass}>
        <Label htmlFor={id}>{labelValue}</Label>
        <input
          id={id}
          type={type}
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
InputWithLabel.displayName = 'InputWithLabel';

function CustomInput({
  name,
  value,
  id,
  label,
  type,
  placeholder,
  handleChange,
  disabled = false,
  required = false,
  password = false,
  prefix = '',
}) {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <label
        className="block text-gray-800 text-sm font-medium mb-1"
        htmlFor={id}
      >
        {label}
      </label>
      {password ? (
        <AntdInput.Password
          onChange={handleChange}
          name={name}
          value={value}
          id={id}
          type={type}
          className="form-input w-full text-gray-800"
          prefix={prefix}
          placeholder={placeholder}
          required={required}
        />
      ) : (
        <AntdInput
          onChange={handleChange}
          name={name}
          value={value}
          id={id}
          type={type}
          classNames={{ input: 'form-input w-full text-gray-800' }}
          prefix={prefix}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
        />
      )}
    </div>
  );
}

function CustomNumberInput({
  name,
  value,
  id,
  label,
  placeholder,
  handleChange,
  required,
  useFormatter = false,
}) {
  return (
    <div>
      <label
        className="block text-gray-800 text-sm font-medium mb-1"
        htmlFor={id}
      >
        {label}
      </label>
      <InputNumber
        formatter={(value) =>
          useFormatter
            ? `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            : value
        }
        parser={(value) =>
          useFormatter ? value!.replace(/\$\s?|(,*)/g, '') : value
        }
        onChange={handleChange}
        name={name}
        value={value}
        id={id}
        controls={false}
        classNames={{
          input: 'form-input w-full text-gray-800 custom-number-input',
        }}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
}

function CustomTextArea({
  name,
  value,
  id,
  label,
  rows,
  placeholder,
  handleChange,
  required,
  maxLength = 150,
}) {
  return (
    <div>
      <label
        className="block text-gray-800 text-sm font-medium mb-1"
        htmlFor={id}
      >
        {label}
      </label>
      <TextArea
        maxLength={maxLength}
        onChange={handleChange}
        name={name}
        value={value}
        id={id}
        rows={rows}
        classNames={{ textarea: 'form-input w-full text-gray-800' }}
        placeholder={placeholder}
        required={required}
        showCount
      />
    </div>
  );
}

function CustomDateField({
  name,
  value,
  id,
  label,
  placeholder,
  handleChange,
  required,
  useCustomDisableDate = false,
  startDate = null,
}) {
  const dateFormat = 'MMM dd, yyyy';
  function getDateFormatter(value) {
    return `${format(value.toDate(), 'MMM dd, yyyy')}`;
  }

  // eslint-disable-next-line arrow-body-style
  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    // Can not select days before today and today
    if (useCustomDisableDate) {
      return (
        current && current < dayjs(startDate).subtract(1, 'day').endOf('day')
      );
    } else {
      return current && current < dayjs().subtract(1, 'day').endOf('day');
    }
  };

  return (
    <div>
      <label
        className="block text-gray-800 text-sm font-medium mb-1"
        htmlFor={id}
      >
        {label}
      </label>
      <DatePicker
        placeholder={placeholder}
        disabledDate={disabledDate}
        name={name}
        format={getDateFormatter}
        className="form-input w-full text-gray-800"
        value={
          value === undefined || value === null
            ? dayjs(new Date())
            : dayjs(new Date(value))
        }
        onChange={handleChange}
      />
    </div>
  );
}

function CustomTimeField({
  name,
  value,
  id,
  label,
  placeholder,
  handleChange,
  required,
}) {
  const format = 'hh:mm A';

  return (
    <div>
      <label
        className="block text-gray-800 text-sm font-medium mb-1"
        htmlFor={id}
      >
        {label}
      </label>
      <TimePicker
        changeOnBlur={true}
        placeholder={placeholder}
        name={name}
        format={format}
        className="form-input w-full text-gray-800 time-picker-button"
        value={
          value === undefined || value === null
            ? dayjs(new Date())
            : dayjs(new Date(value))
        }
        onChange={handleChange}
      />
    </div>
  );
}

export {
  CustomDateField,
  CustomInput,
  CustomNumberInput,
  CustomTextArea,
  CustomTimeField,
  Input,
  InputWithLabel,
};
