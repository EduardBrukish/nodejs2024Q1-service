import { Repository, FindOptionsWhere } from 'typeorm';
import { CommonNotFoundException } from '../exception/not-found.exception';

export const getEntityById = async <T extends { id: string }>(
  collection: Repository<T>,
  id: string,
): Promise<T | undefined> => {
  const entity = await collection.findOne({
    where: { id } as FindOptionsWhere<T>,
  });

  if (!entity) {
    throw new CommonNotFoundException(`Entity with ID ${id} not found`);
  }

  return entity;
};
