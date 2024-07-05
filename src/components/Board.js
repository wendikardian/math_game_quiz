import React from 'react';
import { Row, Col, Button } from 'antd';

const Board = ({ numbers, onNumberClick, usedNumbers }) => (
  <div className="board">
    {numbers.map((row, rowIndex) => (
      <Row key={rowIndex} className="mb-2">
        {row.map((number, colIndex) => {
          const isUsed = usedNumbers.some((ans) => ans.includes(number));
          return (
            <Col key={colIndex} span={4}>
              <Button
                type="default"
                disabled={isUsed}
                onClick={() => !isUsed && onNumberClick(number)}
              >
                {number}
              </Button>
            </Col>
          );
        })}
      </Row>
    ))}
  </div>
);

export default Board;
