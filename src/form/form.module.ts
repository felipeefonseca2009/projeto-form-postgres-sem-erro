import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { FormController } from './form.controller';
import { FormService } from './form.service';
import { Researcher } from './entities/person.record.entity';
import { RequestRecord } from './entities/request.record.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Researcher, RequestRecord]), AuthModule],
  controllers: [FormController],
  providers: [FormService],
})
export class FormModule {}