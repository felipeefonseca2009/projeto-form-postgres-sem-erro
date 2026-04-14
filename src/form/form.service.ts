import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PersonRecord } from './entities/person.record.entity';
import { RequestRecord } from './entities/request.record.entity';

@Injectable()
export class FormService {
  constructor(
    @InjectRepository(PersonRecord)
    private readonly personRepository: Repository<PersonRecord>,

    @InjectRepository(RequestRecord)
    private readonly requestRepository: Repository<RequestRecord>,
  ) {}

  async savePersonForm(data: {
    nome: string;
    email: string;
    telefone: string;
    cidade: string;
  }) {
    const person = this.personRepository.create(data);
    return await this.personRepository.save(person);
  }

  async saveRequestForm(data: {
    nome: string;
    assunto: string;
    descricao: string;
    data: string;
  }) {
    const request = this.requestRepository.create(data);
    return await this.requestRepository.save(request);
  }

  async listPersonRecords() {
    return await this.personRepository.find({
      order: { id: 'DESC' },
    });
  }

  async listRequestRecords() {
    return await this.requestRepository.find({
      order: { id: 'DESC' },
    });
  }

  async readPersonRecord(id: number) {
    return await this.personRepository.findOneBy({ id });
  }

  async readRequestRecord(id: number) {
    return await this.requestRepository.findOneBy({ id });
  }
}