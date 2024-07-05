import React, { useState, useEffect } from "react";
import { Layout, Button, InputNumber, Modal, message, Row, Col } from "antd";
import "bootstrap/dist/css/bootstrap.min.css";
import "antd/dist/reset.css";
import "./App.css";
import Board from "./components/Board";
import ControlPanel from "./components/ControlPanel";

const { Header, Content, Footer } = Layout;

const App = () => {
  const [numbers, setNumbers] = useState([]);
  const [target, setTarget] = useState(null);
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [operator, setOperator] = useState("");
  const [operation, setOperation] = useState("");
  const [score, setScore] = useState(0);
  const [usedNumbers, setUsedNumbers] = useState([]);
  const [possibleAnswers, setPossibleAnswers] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(90);
  const [minRange, setMinRange] = useState(1);
  const [maxRange, setMaxRange] = useState(100);
  const [answer, setAnswer] = useState([]);

  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      message.info("Time is up!");
      setGameStarted(false);
      setIsModalVisible(true);
    }
  }, [gameStarted, timeLeft]);

  const generateNumbers = () => {
    const nums = [];
    for (let i = 0; i < 4; i++) {
      const row = [];
      for (let j = 0; j < 5; j++) {
        row.push(
          Math.floor(Math.random() * (maxRange - minRange + 1)) + minRange
        );
      }
      nums.push(row);
    }
    return nums;
  };

  const findPossibleAnswers = (numbers, target) => {
    const operations = ["+", "-", "*", "/"];
    const results = [];
    const foundOperations = new Set();

    const generateOperationString = (a, b, op) => {
      return op === "+" || op === "*" ? `${a} ${op} ${b}` : `${a} ${op} ${b}`;
    };

    for (let i = 0; i < numbers.length; i++) {
      for (let j = 0; j < numbers[i].length; j++) {
        for (let k = 0; k < numbers.length; k++) {
          for (let l = 0; l < numbers[k].length; l++) {
            if (i !== k || j !== l) {
              operations.forEach((op) => {
                let result;
                switch (op) {
                  case "+":
                    result = numbers[i][j] + numbers[k][l];
                    break;
                  case "-":
                    result = numbers[i][j] - numbers[k][l];
                    break;
                  case "*":
                    result = numbers[i][j] * numbers[k][l];
                    break;
                  case "/":
                    if (
                      numbers[k][l] !== 0 &&
                      numbers[i][j] % numbers[k][l] === 0
                    ) {
                      result = numbers[i][j] / numbers[k][l];
                    }
                    break;
                  default:
                    break;
                }
                if (result === target) {
                  const operationString = generateOperationString(
                    numbers[i][j],
                    numbers[k][l],
                    op
                  );
                  if (!foundOperations.has(operationString)) {
                    results.push(`${operationString} = ${target}`);
                    foundOperations.add(operationString);
                  }
                }
              });
            }
          }
        }
      }
    }

    return results;
  };

  const startGame = () => {
    const nums = generateNumbers();
    const newTarget =
      Math.floor(Math.random() * (maxRange - minRange + 1)) + minRange;
    setNumbers(nums);
    setTarget(newTarget);
    setPossibleAnswers(findPossibleAnswers(nums, newTarget));
    setScore(0);
    setUsedNumbers([]);
    setTimeLeft(20);
    setGameStarted(true);
    setAnswer([]);
    setOperation("");
  };

  
  const handleValidate = () => {
    // push the answer to answer array
    setAnswer([...answer, operation]);
    // check if the operation is on the answer if there's any, return and give message already answered
    if (answer.includes(operation)) {
      message.error("Already answered!");
      return;
    }
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
      // setUsedNumbers((prev) => [...prev, `${a} ${operator} ${b} = ${target}`]);
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

  const resetGame = () => {
    setGameStarted(false);
    setNumbers([]);
    setTarget(null);
    setSelectedNumbers([]);
    setOperator("");
    setOperation("");
    setScore(0);
    setUsedNumbers([]);
    setPossibleAnswers([]);
    setTimeLeft(90);
  };

  const handleNumberClick = (number) => {
    if (selectedNumbers.length < 2) {
      setSelectedNumbers([...selectedNumbers, number]);
      if (selectedNumbers.length === 1) {
        setOperation(`${selectedNumbers[0]} ${operator} ${number}`);
      }
    }
  };

  const handleOperatorClick = (op) => {
    setOperator(op);
    if (selectedNumbers.length === 1) {
      setOperation(`${selectedNumbers[0]} ${op}`);
    }
  };

  const handleDelete = () => {
    setSelectedNumbers([]);
    setOperator("");
    setOperation("");
  };

  const handleReset = () => {
    setSelectedNumbers([]);
    setOperator('');
    setOperation('');
  };
  return (
    <Layout className="layout">
      <Header className="header">Math Operations Game</Header>
      <Content style={{ padding: "0 50px" }}>
        <div className="site-layout-content">
          {!gameStarted && (
            <div className="prep-screen">
              <h2>Set Number Range</h2>
              <Row gutter={16}>
                <Col span={12}>
                  <InputNumber
                    min={1}
                    max={1000}
                    value={minRange}
                    onChange={setMinRange}
                    placeholder="Min Range"
                  />
                </Col>
                <Col span={12}>
                  <InputNumber
                    min={1}
                    max={1000}
                    value={maxRange}
                    onChange={setMaxRange}
                    placeholder="Max Range"
                  />
                </Col>
              </Row>
              <Button
                type="primary"
                onClick={startGame}
                style={{ marginTop: "20px" }}
              >
                Start Game
              </Button>
            </div>
          )}
          {gameStarted && (
            <div>
              <h2>Target: {target}</h2>
              <h3>Time Left: {timeLeft}s</h3>
              <h3>
                Operations  : {operation}
              </h3>
              <h3>Score : {score} </h3>
              <Board
                numbers={numbers}
                onNumberClick={handleNumberClick}
                usedNumbers={usedNumbers}
              />
              <ControlPanel
                operator={operator}
                onOperatorClick={handleOperatorClick}
                onValidate={handleValidate}
                operation={operation}
                onDelete={handleDelete}
                onReset={handleReset}
              />

            </div>
          )}
          <Modal
            title="Game Over"
            visible={isModalVisible}
            // onOk={resetGame}
            onOk={() => setIsModalVisible(false)}
            onCancel={() => setIsModalVisible(false)}
          >
            <p>Your final score is: {score}</p>
            <p>Possible Answers:</p>
            <ul>
              {possibleAnswers.map((answer, index) => (
                <li key={index}>{answer}</li>
              ))}
            </ul>
          </Modal>
        </div>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        Produced by Timedoor Academy
      </Footer>
    </Layout>
  );
};

export default App;
