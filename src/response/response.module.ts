import { Module } from '@nestjs/common';
import { ResponseController } from './response.controller';
import { ResponseService } from './response.service';
import { RoleModule } from 'src/role/role.module';

@Module({
  imports: [RoleModule],
  controllers: [ResponseController],
  providers: [ResponseService],
})
export class ResponsesModule {}
