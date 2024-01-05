import { DatabaseModule, Role } from '@app/common';
import { User } from '@app/common/models';
import { Module } from '@nestjs/common';
import { JwtStrategy } from '../strategies';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
  imports: [DatabaseModule, DatabaseModule.forFeature([User, Role])],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, JwtStrategy],
  exports: [UsersService],
})
export class UsersModule {}
