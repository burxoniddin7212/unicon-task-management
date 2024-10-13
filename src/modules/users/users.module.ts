import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { OrganizationUsersRepository } from './organization-users.repository';
import { OrganizationsModule } from '../organizations/organizations.module';

@Module({
  imports: [OrganizationsModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, OrganizationUsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
