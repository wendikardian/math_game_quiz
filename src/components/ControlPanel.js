import React from 'react';
import { Row, Col, Button } from 'antd';

const ControlPanel = ({ onOperatorClick, onValidate, onReset }) => (
  <div className="control-panel">
    <Row>
      <Col span={24} className="mb-3">
        <Button type="primary" onClick={() => onOperatorClick('+')}>
          +
        </Button>
        <Button type="primary" onClick={() => onOperatorClick('-')} className="mx-2">
          -
        </Button>
        <Button type="primary" onClick={() => onOperatorClick('*')}>
          *
        </Button>
        <Button type="primary" onClick={() => onOperatorClick('/')} className="mx-2">
          /
        </Button>
        <Button type="primary" onClick={onValidate} className="mx-2">
          Validate
        </Button>
        <Button type="default" onClick={onReset} className="mx-2">
          Reset
        </Button>
      </Col>
    </Row>
  </div>
);

export default ControlPanel;
