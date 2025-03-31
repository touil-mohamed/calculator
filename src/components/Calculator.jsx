import { Button, Grid, Paper, Container, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useState } from 'react';


import { Calculator } from '../logic/calculatorLogic';

const CalcButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(2),
  fontSize: '1.5rem',
  borderRadius: '8px',
  width: '100%',
  minHeight: '64px',
}));

const Display = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'right',
  fontSize: '2rem',
  marginBottom: theme.spacing(2),
  minHeight: '64px',
  background: '#f5f5f5',
  wordBreak: 'break-all'
}));

const CalculatorComponent = () => {
  const [display, setDisplay] = useState('0');
  const [firstNumber, setFirstNumber] = useState(null);
  const [operator, setOperator] = useState(null);
  const [calculator] = useState(new Calculator());
  const [waitingForSecondNumber, setWaitingForSecondNumber] = useState(false);
  const [setHistory] = useState([]); 


  const buttons = [
    ['7', '8', '9', '+'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '*'],
    ['C', '0', '=', '/']
  ];

  const handleNumber = (num) => {
    if (waitingForSecondNumber) {
      setDisplay(num);
      setWaitingForSecondNumber(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleOperator = (op) => {
    setFirstNumber(parseFloat(display));
    setOperator(op);
    setWaitingForSecondNumber(true);
  };

  const handleEquals = () => {
    if (firstNumber === null || operator === null) return;

    try {
      const result = calculator.calculate(
        firstNumber,
        operator,
        parseFloat(display)
      );
      setDisplay(result.toString());
      setFirstNumber(null);
      setOperator(null);
    } catch (error) {
      setDisplay('Error');
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setFirstNumber(null);
    setOperator(null);
    setWaitingForSecondNumber(false);
  };

  const handleClearHistory = () => {
    calculator.clearHistory();
    setHistory([]); // Mettre à jour l'état local
  };

  const handleButtonClick = (value) => {
    switch (value) {
      case '=':
        handleEquals();
        break;
      case 'C':
        handleClear();
        break;
      case '+':
      case '-':
      case '*':
      case '/':
        handleOperator(value);
        break;
      default:
        handleNumber(value);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Display elevation={3}
          data-testid="display">
          {display}
        </Display>
        <Grid container spacing={1}>
          {buttons.map((row, rowIndex) => (
            <Grid container item spacing={1} key={rowIndex}>
              {row.map((button) => (
                <Grid item xs={3} key={button}>
                  <CalcButton
                    variant="contained"
                    color={
                      button === '=' ? 'primary' :
                      button === 'C' ? 'error' :
                      ['+', '-', '*', '/'].includes(button) ? 'secondary' :
                      'info'
                    }
                    onClick={() => handleButtonClick(button)}
                    data-testid={`button-${button}`}
                  >
                    {button}
                  </CalcButton>
                </Grid>
              ))}
            </Grid>
          ))}
        </Grid>
        
        {/* Historique */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Historique</Typography>
          {calculator.getHistory().map((item, index) => (
            <Paper 
              key={index} 
              sx={{ 
                p: 2, 
                my: 1, 
                display: 'flex', 
                justifyContent: 'space-between' 
              }}
            >
              <span>{item.expression} = {item.result}</span>
              <span>{item.timestamp.toLocaleTimeString()}</span>
            </Paper>
          ))}
          {calculator.getHistory().length > 0 && (
            <Button 
              variant="outlined" 
              color="error" 
              onClick={handleClearHistory}
              sx={{ mt: 2 }}
              data-testid="clear-history"
            >
              Effacer l&apos;historique
            </Button>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default CalculatorComponent;
