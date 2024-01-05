import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compareSync, hashSync } from 'bcryptjs';
import { CreateUserDto, GetUserDto } from './dto';
import { UsersRepository } from './users.repository';
import { UnprocessableEntityException } from '@nestjs/common';
import { Role, User } from '@app/common';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async verifyUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({ email });
    const isPasswordValid = compareSync(password, user.password);

    if (!isPasswordValid)
      throw new UnauthorizedException('Credentials are not valid!');

    return user;
  }

  async create(createUserDto: CreateUserDto) {
    await this.validateCreateUser(createUserDto);
    const user = new User({
      ...createUserDto,
      roles: createUserDto.roles?.map((roleDto) => new Role(roleDto)),
      password: hashSync(createUserDto.password, 10),
    });

    return this.usersRepository.create(user);
  }

  private async validateCreateUser(createUserDto: CreateUserDto) {
    try {
      await this.usersRepository.findOne({ email: createUserDto.email });
    } catch (err) {
      return;
    }

    throw new UnprocessableEntityException('Email is already taken!');
  }

  getUser(getUserDto: GetUserDto) {
    return this.usersRepository.findOne(getUserDto, { roles: true });
  }
}
