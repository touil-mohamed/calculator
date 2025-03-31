export class Calculator {
    constructor() {
      this.history = [];
      this.maxHistoryLength = 10;
      this.precision = 10;
    }
  
    validateNumbers(...numbers) {
      numbers.forEach(num => {
        if (typeof num !== 'number' || isNaN(num)) {
          throw new Error('Nombre non valide');
        }
      });
    }
  
    roundResult(number) {
      return Number(Math.round(number + 'e' + this.precision) + 'e-' + this.precision);
    }
  
    calculate(num1, operator, num2) {
      this.validateNumbers(num1, num2);
      let result;
  
      switch (operator) {
        case '+':
          result = num1 + num2;
          break;
        case '-':
          result = num1 - num2;
          break;
        case '*':
          result = num1 * num2;
          break;
        case '/':
          if (num2 === 0) throw new Error('Division par zéro impossible');
          result = num1 / num2;
          break;
        default:
          throw new Error('Opérateur non valide');
      }
  
      result = this.roundResult(result);
      this.addToHistory(`${num1} ${operator} ${num2}`, result);
      return result;
    }
  
    evaluateExpression(expression) {
      expression = expression.replace(/\s+/g, '');
      
      while (expression.includes('(')) {
        const openIndex = expression.lastIndexOf('(');
        const closeIndex = expression.indexOf(')', openIndex);
        if (closeIndex === -1) throw new Error('Parenthèses mal formées');
        
        const subExpression = expression.substring(openIndex + 1, closeIndex);
        const result = this.evaluateExpression(subExpression);
        
        expression = expression.substring(0, openIndex) + 
                    result + 
                    expression.substring(closeIndex + 1);
      }
  
      const tokens = this.tokenize(expression);
      return this.evaluateTokens(tokens);
    }
  
    tokenize(expression) {
      const tokens = [];
      let currentNumber = '';
      
      for (let char of expression) {
        if (/[\d.]/.test(char)) {
          currentNumber += char;
        } else {
          if (currentNumber) {
            tokens.push(parseFloat(currentNumber));
            currentNumber = '';
          }
          if (/[+\-*/]/.test(char)) {
            tokens.push(char);
          }
        }
      }
      
      if (currentNumber) {
        tokens.push(parseFloat(currentNumber));
      }
      
      return tokens;
    }
  
    evaluateTokens(tokens) {
      for (let i = 1; i < tokens.length - 1; i += 2) {
        if (tokens[i] === '*' || tokens[i] === '/') {
          const result = this.calculate(tokens[i-1], tokens[i], tokens[i+1]);
          tokens.splice(i-1, 3, result);
          i -= 2;
        }
      }
      
      let result = tokens[0];
      for (let i = 1; i < tokens.length - 1; i += 2) {
        result = this.calculate(result, tokens[i], tokens[i+1]);
      }
      
      return result;
    }
  
    calculatePercentage(total, percentage) {
      this.validateNumbers(total, percentage);
      const result = (total * percentage) / 100;
      this.addToHistory(`${percentage}% de ${total}`, result);
      return result;
    }
  
    addToHistory(expression, result) {
      this.history.unshift({
        expression,
        result,
        timestamp: new Date()
      });
  
      if (this.history.length > this.maxHistoryLength) {
        this.history.pop();
      }
    }
  
    getHistory() {
      return this.history;
    }
  
    searchHistory(query) {
      return this.history.filter(item => 
        item.expression.includes(query) || 
        item.result.toString().includes(query)
      );
    }
  
    clearHistory() {
      this.history = [];
    }
  }
  