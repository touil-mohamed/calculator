import { Calculator } from '../../logic/calculatorLogic.js';
import { describe, beforeEach, test, expect } from 'vitest';

describe('Calculator Logic', () => {
  let calculator;

  beforeEach(() => {
    calculator = new Calculator();
  });

  describe('Opérations de base', () => {
    test('addition de nombres positifs', () => {
      expect(calculator.calculate(2, '+', 3)).toBe(5);
    });

    test('addition avec nombres négatifs', () => {
      expect(calculator.calculate(-2, '+', -3)).toBe(-5);
    });

    test('soustraction avec résultat négatif', () => {
      expect(calculator.calculate(3, '-', 5)).toBe(-2);
    });

    test('multiplication de nombres décimaux', () => {
      expect(calculator.calculate(2.5, '*', 2)).toBe(5);
    });
  });

  describe('Gestion des nombres décimaux', () => {
    test('addition de nombres décimaux', () => {
      expect(calculator.calculate(0.1, '+', 0.2)).toBeCloseTo(0.3);
    });

    test('multiplication de nombres décimaux', () => {
      expect(calculator.calculate(0.3, '*', 0.3)).toBeCloseTo(0.09);
    });
  });

  describe('Gestion des erreurs', () => {
    test('division par zéro', () => {
      expect(() => calculator.calculate(5, '/', 0)).toThrow('Division par zéro impossible');
    });

    test('opérateur invalide', () => {
      expect(() => calculator.calculate(5, '%', 2)).toThrow('Opérateur non valide');
    });

    test('nombres non valides', () => {
      expect(() => calculator.calculate('abc', '+', 2)).toThrow('Nombre non valide');
    });
  });

  describe('Fonctionnalités avancées', () => {
    test('calcul avec parenthèses', () => {
      expect(calculator.evaluateExpression('(2 + 3) * 4')).toBe(20);
    });

    test('expressions complexes', () => {
      expect(calculator.evaluateExpression('2 + 3 * 4')).toBe(14);
    });

    test('calcul avec pourcentage', () => {
      expect(calculator.calculatePercentage(100, 50)).toBe(50);
    });
  });
});

