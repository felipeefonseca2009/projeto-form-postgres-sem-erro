import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PersonRecord } from './entities/person.record.entity';
import { RequestRecord } from './entities/request.record.entity';

@Injectable()
export class FormService {

  constructor(
    @InjectRepository(PersonRecord)
    private personRepository: Repository<PersonRecord>,

    @InjectRepository(RequestRecord)
    private requestRepository: Repository<RequestRecord>,
  ) {}

  async updatePerson(id: number, data: any) {
  return await this.personRepository.update(id, data);
}

async deletePerson(id: number) {
  return await this.personRepository.delete(id);
}

  async savePersonForm(data: { nome: string; email: string; telefone: string; cidade: string; pais: string; tataravo: string }) {
    const person = this.personRepository.create(data);
    return await this.personRepository.save(person);
  }

  async saveRequestForm(data: { nome: string; assunto: string; descricao: string; data: string }) {
    const request = this.requestRepository.create(data);
    return await this.requestRepository.save(request);
  }

  async listPersonRecords() {
    return await this.personRepository.find();
  }
s
  async listRequestRecords() {
    return await this.requestRepository.find();
  }

  async readPersonRecord(id: number) {
    return await this.personRepository.findOneBy({ id });
  }

  async readRequestRecord(id: number) {
    return await this.requestRepository.findOneBy({ id });
  }
}