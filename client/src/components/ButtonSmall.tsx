import React from 'react';
import '../styling/CustomButton.scss';

export default function ButtonSmall({ content, fill }: {content: string, fill: boolean}) {
  return (
    <button className={`CustomButton ${fill ? "fill" : "nofill"}`}>
      {content}
    </button>
  )
}
