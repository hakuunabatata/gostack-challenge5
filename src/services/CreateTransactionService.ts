// import AppError from '../errors/AppError';

import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Category from '../models/Category';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}
class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const categoriesRepository = getRepository(Category);

    const { total } = await transactionsRepository.getBalance();

    if (type === 'outcome' && value > total) {
      throw new AppError(`The Value ${value} is bigger than ${total}`);
    }

    const findCategory = await categoriesRepository.findOne({
      where: { title: category },
    });

    let category_id = findCategory?.id;

    if (!findCategory) {
      const createCategory = categoriesRepository.create({
        title: category,
      });

      await categoriesRepository.save(createCategory);

      category_id = createCategory.id;
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id,
    });

    await transactionsRepository.save(transaction);

    // console.log(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
