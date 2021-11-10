import React from 'react';
import * as BsIcons from 'react-icons/bs';
export const SidebarData = [
  {
    title: '핵심 피해 기록',
    path: '/mainbullying',
    icon: <BsIcons.BsFillInfoCircleFill />,
    cName: 'nav-text'
  },
  {
    title: '사건 개요',
    path: '/overview',
    icon: <BsIcons.BsFillInfoCircleFill />,
    cName: 'nav-text'
  },
  {
    title: '전체 자료 목록',
    path: '/allevidence',
    icon: <BsIcons.BsPersonBoundingBox />,
    cName: 'nav-text'
  },
  {
    title: '녹음 증거 자료 목록',
    path: '/recordevidence',
    icon: <BsIcons.BsFillHouseDoorFill />,
    cName: 'nav-text'
  },
  {
    title: '사진 증거 자료 목록',
    path: '/pictureevidence',
    icon: <BsIcons.BsFillInfoCircleFill />,
    cName: 'nav-text'
  },
  
];