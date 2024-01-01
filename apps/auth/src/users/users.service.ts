import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compareSync, hashSync } from 'bcryptjs';
import { CreateUserDto, GetUserDto } from './dto';
import { UsersRepository } from './users.repository';
import { UnprocessableEntityException } from '@nestjs/common';

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
    await this.validateCreateUserDto(createUserDto);

    return this.usersRepository.create({
      ...createUserDto,
      password: hashSync(createUserDto.password, 10),
    });
  }

  private async validateCreateUserDto(createUserDto: CreateUserDto) {
    try {
      await this.usersRepository.findOne({ email: createUserDto.email });
    } catch (err) {
      return;
    }

    throw new UnprocessableEntityException('Email is already taken!');
  }

  getUser(getUserDto: GetUserDto) {
    return this.usersRepository.findOne(getUserDto);
  }
}
