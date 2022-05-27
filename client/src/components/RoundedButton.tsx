import React from 'react';
import '../styling/RoundedButton.css';

export default function RoundedButton({ content, onClick }: { content: any, onClick: any }) {
  return (
    <button className="map-button" onClick={onClick}>
      <p>
        {content}
      </p>
    </button>
  )
}
