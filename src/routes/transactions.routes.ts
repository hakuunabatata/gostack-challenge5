import { Router } from 'express';
import { getCustomRepository, getRepository } from 'typeorm';
import multer from 'multer';
import uploadConfig from '../config/upload';

import Category from '../models/Category';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

const upload = multer(uploadConfig);

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository);
  const categoriesRepository = getRepository(Category);

  const findTransactions = await transactionsRepository.find();
  const findCategories = await categoriesRepository.find();

  const transactions = findTransactions.map(
    ({ id, title, value, type, category_id, created_at, updated_at }) => ({
      id,
      title,
      value,
      type,
      category: findCategories.find(category => category.id === category_id),
      created_at,
      updated_at,
    }),
  );

  const balance = await transactionsRepository.getBalance();

  return response.json({ transactions, balance });
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;

  const createTransaction = new CreateTransactionService();

  const transaction = await createTransaction.execute({
    title,
    value,
    type,
    category,
  });

  return response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  const transactionsRepository = getCustomRepository(TransactionsRepository);

  await transactionsRepository.delete({ id });

  const deleteTransaction = new DeleteTransactionService();

  deleteTransaction.execute(id);

  return response.send();
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    const importTransaction = new ImportTransactionsService();

    const importTransactions = await importTransaction.execute(
      request.file.path,
    );

    // console.log(importTransactions);

    return response.json(importTransactions);
  },
);

export default transactionsRouter;
