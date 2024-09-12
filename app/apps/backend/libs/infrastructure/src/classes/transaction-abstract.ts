import { Connection } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export abstract class BaseTransaction<TransactionInput, TransactionOutput> {
  protected constructor(private readonly connection: Connection) {}

  protected abstract execute(data: TransactionInput): Promise<TransactionOutput>;

  @Transactional()
  async run(data: TransactionInput): Promise<TransactionOutput> {
    return this.execute(data);
  }

  async runWithinTransaction(data: TransactionInput): Promise<TransactionOutput> {
    return this.execute(data);
  }
}
