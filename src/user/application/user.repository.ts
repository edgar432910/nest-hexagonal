import Result from '../../shared/interfaces/result.interface';
import { UserModel } from '../domain/user.model';

export default interface UserRepository{
  list(where: object, relation: string[], order: object): Promise<Result<UserModel>>;
  getOne(where: object, relation: string[]): Promise<Result<UserModel>>;
  insert(entity: Partial<UserModel>): Promise<Result<UserModel>>;
  update(
    entity: Partial<UserModel>,
    where: object,
    relation: string[],
  ): Promise<Result<UserModel>>;
  delete(where: object): Promise<Result<UserModel>>;

}
