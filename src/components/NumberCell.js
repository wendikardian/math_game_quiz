import React from 'react';
import { Card } from 'antd';

const NumberCell = ({ number, onClick, disabled }) => (
  <Card
    onClick={!disabled ? onClick : null}
    className={`number-cell ${disabled ? 'disabled' : ''}`}
  >
    {number}
  </Card>
);

export default NumberCell;
