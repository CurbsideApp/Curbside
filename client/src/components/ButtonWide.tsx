import React from 'react';
import '../styling/CustomButton.scss';
import { ButtonProps } from 'react-bootstrap';

export default function ButtonWide({ type='button', clickFunction,  content, fill }: { type?: ButtonProps['type'], clickFunction?: any, content: string, fill: boolean}) {
  return (
    <button
      type={type}
      onClick={clickFunction}
      className={`CustomButton ${fill ? "fill" : "nofill"}`}
      style={{width:'100%'}}
    >
      {content}
    </button>
  )
}
