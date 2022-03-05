import { EntityRepository, Repository } from 'typeorm';
import { User } from '../entity/User';

const bcrypt = require('bcryptjs');

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async comparePassword(inputPassword: string, userPassword: string): Promise<boolean> {
    const correctPassword = bcrypt.compare(inputPassword, userPassword);
    return correctPassword;
  }
}
