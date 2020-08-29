import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const findIncome = await this.find({ where: { type: 'income' } });
    const findOutcome = await this.find({ where: { type: 'outcome' } });

    let income = 0;
    let outcome = 0;
    let total = 0;

    findIncome.map(({ value }) => {
      income += value;
      total += value;
      return income;
    });

    findOutcome.map(({ value }) => {
      outcome += value;
      total -= value;
      return outcome;
    });

    return {
      income,
      outcome,
      total,
    };
  }
}

export default TransactionsRepository;
