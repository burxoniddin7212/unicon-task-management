import { Global, Module } from '@nestjs/common';
import { VerifyTokenGuard } from './guards/verify.token.guard';
import { RoleGuard } from './guards/role.guard';

@Global()
@Module({
  providers: [VerifyTokenGuard, RoleGuard],
  exports: [VerifyTokenGuard, RoleGuard],
})
export class SharedModule {}
