import fs from 'fs';
// import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
// import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from './CreateTransactionService';

interface Row {
  title: string;
  type: 'income' | 'outcome';
  value: string;
  category: string;
}
class ImportTransactionsService {
  async execute(path: string): Promise<Transaction[]> {
    const createTransaction = new CreateTransactionService();

    const checkFile = fs.promises.stat(path);
    if (!checkFile) {
      throw new AppError(`Arquivo ${path} não encontrado`);
    }

    const file = fs.readFileSync(path, 'utf-8');

    const fileLines = file.trim().split('\n');

    // await fileLines.shift();

    // console.log(fileLines);

    const readedTransactions = fileLines.map((row, index) => {
      if (index > 0) {
        const [title, type, value, category] = row.split(',');

        console.log(index);
        console.log(category);

        const transaction = {
          title,
          type: type as 'income' | 'outcome',
          value: Number(value),
          category,
        };
        return transaction;
      }
    });

    const transactions: Transaction[] = [];

    for (const transaction of readedTransactions) {
      const createdTransaction = await createTransaction.execute(transaction);
      transactions.push(createdTransaction);
    }

    return transactions;
  }
}

export default ImportTransactionsService;
