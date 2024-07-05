import React, { useState, useEffect } from 'react';
import { Layout, Button, Row, Col, message, Modal } from 'antd';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'antd/dist/reset.css';
import './App.css';
import Board from './components/Board';
import ControlPanel from './components/ControlPanel';

const { Header, Content, Footer } = Layout;

const generateNumbers = (min, max, rows, cols) => {
  const numbers = [];
  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < cols; j++) {
      row.push(Math.floor(Math.random() * (max - min + 1)) + min);
    }
    numbers.push(row);
  }
  return numbers;
};

const findPossibleAnswers = (numbers, target) => {
  const operations = ['+', '-', '*', '/'];
  const results = [];

  for (let i = 0; i < numbers.length; i++) {
    for (let j = 0; j < numbers[i].length; j++) {
      for (let k = 0; k < numbers.length; k++) {
        for (let l = 0; l < numbers[k].length; l++) {
          if (i !== k || j !== l) {
            operations.forEach((op) => {
              let result;
              switch (op) {
                case '+':
                  result = numbers[i][j] + numbers[k][l];
                  break;
                case '-':
                  result = numbers[i][j] - numbers[k][l];
                  break;
                case '*':
                  result = numbers[i][j] * numbers[k][l];
                  break;
                case '/':
                  if (numbers[k][l] !== 0) {
                    result = numbers[i][j] / numbers[k][l];
                  }
                  break;
                default:
                  break;
              }
              if (result === target) {
                results.push(`${numbers[i][j]} ${op} ${numbers[k][l]} = ${target}`);
              }
            });
          }
        }
      }
    }
  }

  return results;
};

const App = () => {
  const [target, setTarget] = useState(0);
  const [numbers, setNumbers] = useState([]);
  const [operator, setOperator] = useState('');
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(90);
  const [possibleAnswers, setPossibleAnswers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [usedNumbers, setUsedNumbers] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [operation, setOperation] = useState('');

  const startNewGame = () => {
    const newTarget = Math.floor(Math.random() * 100) + 1;
    const newNumbers = generateNumbers(1, 100, 4, 5);
    const newPossibleAnswers = findPossibleAnswers(newNumbers, newTarget);

    setTarget(newTarget);
    setNumbers(newNumbers);
    setOperator('');
    setSelectedNumbers([]);
    setScore(0);
    setTimeLeft(90);
    setUsedNumbers([]);
    setPossibleAnswers(newPossibleAnswers);
    setGameStarted(true);
    setOperation('');
  };

  useEffect(() => {
    if (!gameStarted) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    if (timeLeft === 0) {
      clearInterval(timer);
      setPossibleAnswers(findPossibleAnswers(numbers, target));
      setIsModalVisible(true);
      setGameStarted(false);
      message.info(`Time's up! Your score is: ${score}`);
    }

    return () => clearInterval(timer);
  }, [timeLeft, score, numbers, target, gameStarted]);

  useEffect(() => {
    if (possibleAnswers.length > 0 && usedNumbers.length === possibleAnswers.length) {
      message.success(`Congratulations! You found all possible answers. Your score is: ${score}`);
      setGameStarted(false);
      setIsModalVisible(true);
    }
  }, [possibleAnswers, usedNumbers, score]);

  const handleNumberClick = (number) => {
    setSelectedNumbers((prev) => [...prev, number]);
    if (selectedNumbers.length === 1) {
      setOperation(`${selectedNumbers[0]} ${operator} ${number}`);
    }
  };

  const handleOperatorClick = (op) => {
    setOperator(op);
    if (selectedNumbers.length === 1) {
      setOperation(`${selectedNumbers[0]} ${op}`);
    }
  };

  const handleValidate = () => {
    if (selectedNumbers.length !== 2 || !operator) return;
    const [a, b] = selectedNumbers;
    let result;

    switch (operator) {
      case '+':
        result = a + b;
        break;
      case '-':
        result = a - b;
        break;
      case '*':
        result = a * b;
        break;
      case '/':
        result = a / b;
        break;
      default:
        return;
    }

    if (result === target) {
      setScore((prevScore) => prevScore + 1);
      message.success('Correct!');
      setUsedNumbers((prev) => [...prev, `${a} ${operator} ${b} = ${target}`]);
      if (usedNumbers.length + 1 === possibleAnswers.length) {
        message.success(`Congratulations! You found all possible answers. Your score is: ${score + 1}`);
        setGameStarted(false);
        setIsModalVisible(true);
      }
    } else {
      message.error('Incorrect!');
    }

    setSelectedNumbers([]);
    setOperator('');
    setOperation('');
  };

  const handleReset = () => {
    setSelectedNumbers([]);
    setOperator('');
    setOperation('');
  };

  return (
    <Layout className="layout">
      <Header className="header">
        <div className="logo">Math Game</div>
      </Header>
      <Content style={{ padding: '50px 50px' }}>
        <div className="site-layout-content">
          {!gameStarted ? (
            <Button type="primary" onClick={startNewGame}>
              Start Game
            </Button>
          ) : (
            <>
              <Row>
                <Col span={24} className="mb-3">
                  <h2>Target: {target}</h2>
                  <h2>Time Left: {timeLeft} seconds</h2>
                  <h2>Score: {score}</h2>
                </Col>
              </Row>
              <Row>
                <Col span={24} className="mb-3">
                  <h3>Operation: {operation}</h3>
                </Col>
              </Row>
              <Board numbers={numbers} onNumberClick={handleNumberClick} usedNumbers={usedNumbers} />
              <ControlPanel onOperatorClick={handleOperatorClick} onValidate={handleValidate} onReset={handleReset} />
            </>
          )}
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Produced by Timedoor Academy</Footer>

      <Modal
        title="Possible Answers"
        visible={isModalVisible}
        onOk={() => setIsModalVisible(false)}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="start" type="primary" onClick={startNewGame}>
            Start New Game
          </Button>
        ]}
      >
        <ul>
          {possibleAnswers.map((answer, index) => (
            <li key={index}>{answer}</li>
          ))}
        </ul>
      </Modal>
    </Layout>
  );
};

export default App;
