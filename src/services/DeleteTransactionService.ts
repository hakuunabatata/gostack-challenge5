import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const transactionExists = transactionsRepository.findOne({ where: { id } });

    if (!transactionExists) {
      throw new AppError(`Transaction don't exists`);
    }

    await transactionsRepository.delete({ id });
  }
}

export default DeleteTransactionService;
