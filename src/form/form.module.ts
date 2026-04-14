import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormController } from './form.controller';
import { FormService } from './form.service';
import { PersonRecord } from './entities/person.record.entity';
import { RequestRecord } from './entities/request.record.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PersonRecord, RequestRecord])],
  controllers: [FormController],
  providers: [FormService],
})
export class FormModule {}