import React, { ElementType, FormEvent } from 'react';
import { MutableRefObject } from 'react';
import Form from 'react-bootstrap/Form';
import '../styling/InputField.scss';

export default function InputField({
  name,
  label,
  type,
  placeholder,
  defaultValue,
  error,
  fieldref,
  as,
  required,
  min,
  max,
  value,
  step,
  multiple = false,
  onChange = (): void => {},
  onKeyPress = (): void => {},
}: inputInterface) {
  return (
    <Form.Group controlId={name} className="InputField">
      {label && <Form.Label>{label}</Form.Label>}
      <Form.Control
        multiple={multiple}
        type={type || 'text'}
        placeholder={placeholder}
        defaultValue={defaultValue}
        ref={fieldref}
        as={as}
        required={required}
        step={step}
        min={min}
        max={max}
        value={value}
        onChange={onChange}
        onKeyPress={onKeyPress}
      />
      <Form.Text className={'text-danger'}>{error}</Form.Text>
    </Form.Group>
  );
}

interface inputInterface {
  name: string;
  label?: string;
  type?: string;
  placeholder?: string;
  defaultValue?: string;
  error?: string;
  fieldref?: MutableRefObject<HTMLInputElement | null>;
  as?: ElementType<any> | undefined;
  required?: boolean;
  min?: number;
  max?: number;
  step?: string;
  value?: number | string;
  multiple?: boolean;
  onChange?: (event: FormEvent) => void;
  onKeyPress?: (event: FormEvent) => void;
}
