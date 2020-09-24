import React from 'react';
import loading from './loading.svg';

const Loading = (props) => {
  const { style = {}, restProps } = props;

  return (
    <img
      alt="Loading..."
      src={ loading }
      style={{
        width: '80%',
        ...style
      }}
      { ...restProps }
    />
  )
}

export default Loading;
