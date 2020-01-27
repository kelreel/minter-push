import React from 'react';

import loader from '../../assets/loading.svg';

type props = {
  size?: string
}

const Loading: React.FC<props> = ({size}) => {
  return <img src={loader} alt="Loading..." style={{width: size, height: size}} />
}

export default Loading