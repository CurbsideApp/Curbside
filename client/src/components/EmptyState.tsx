import React from 'react'
import "../styling/EmptyState.scss"
import leaf from "../assets/empty-leaf.png"


const EmptyState = ({text = 'Nothing to show'}) => {
  return (
    <div className='EmptyState'>
      <img src={leaf} alt="Flower collection vector created by coolvector - www.freepik.com" />
      <p>{text}</p>
      <img className="second" src={leaf} alt="Flower collection vector created by coolvector - www.freepik.com" />
    </div>
  )
}

export default EmptyState