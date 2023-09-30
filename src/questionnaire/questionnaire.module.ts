import { Module } from '@nestjs/common';
import { QuestionnaireController } from './questionnaire.controller';
import { QuestionnaireService } from './questionnaire.service';
import { RoleModule } from 'src/role/role.module';

@Module({
  imports: [RoleModule],
  controllers: [QuestionnaireController],
  providers: [QuestionnaireService],
})
export class QuestionnaireModule {}
