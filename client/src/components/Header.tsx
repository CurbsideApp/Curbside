import React, { useState } from 'react';
import '../styling/Header.scss';
import curbside from './../assets/CurbsideSmall.png';
import { useNavigate } from 'react-router-dom';
import tree from "../assets/woodland.png";

import ButtonSmall from './ButtonSmall';
import { useAuth } from '../contexts/AuthContext';

export default function Header({ prevRoute, buttonFree }: HeaderProps) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const baseDate = new Date(2022, 4, 5, 16, 30, 0); // May 17, 2022
  const now = new Date();
  let diffInHours = Math.round(Math.abs(baseDate.getTime() - now.getTime()) / (60 * 60 * 1000));
  const treesPlanted = Math.round(diffInHours * 5 * 0.5 * 6 / 7); // person hours of work invested in the project

  function PrevRoute() {
    return (
      <button
        className='PrevRoute'
        onClick={() => navigate(-1)}
      >
        <i className="bi bi-arrow-left"></i>
      </button>
    )
  }

  return (
    <div className='Header'>
      {prevRoute && <PrevRoute />}
      <button className="curbside-home" onClick={() => navigate('/')}>
        <img src={curbside} alt='Curbside' />
      </button>
      {currentUser ?
        (<p className='treesPlanted'><img src={tree} alt="trees" />{treesPlanted}</p>)
        :
        (!buttonFree
          &&
          (<div className='header-login' onClick={() => navigate('/login')} >
            <ButtonSmall content={'Log in'} fill={true} />
          </div>)
        )
      }
    </div>
  )
}

interface HeaderProps {
  prevRoute?: boolean;
  buttonFree?: boolean
}