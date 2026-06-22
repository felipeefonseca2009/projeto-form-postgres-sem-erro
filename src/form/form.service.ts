import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Researcher } from './entities/person.record.entity';
import { RequestRecord } from './entities/request.record.entity';

@Injectable()
export class FormService {
  constructor(
    @InjectRepository(Researcher)
    private researcherRepository: Repository<Researcher>,

    @InjectRepository(RequestRecord)
    private requestRepository: Repository<RequestRecord>,
  ) {}

  async updateResearcher(id: number, data: any) {
    return await this.researcherRepository.update(id, data);
  }

  async deleteResearcher(id: number) {
    return await this.researcherRepository.delete(id);
  }

  async saveResearcherForm(data: { nome: string; email: string; telefone: string; cidade: string; pais: string; area_atuacao: string }, userId: number) {
    const researcher = this.researcherRepository.create({
      ...data,
      user_id: userId,
    });
    return await this.researcherRepository.save(researcher);
  }

  async saveRequestForm(data: { nome: string; assunto: string; descricao: string; data: string }, researcherId?: number) {
    const request = this.requestRepository.create({
      ...data,
      ...(researcherId && { researcher_id: researcherId }),
    });
    return await this.requestRepository.save(request);
  }

  async listResearchers() {
    return await this.researcherRepository.find();
  }

  async listRequestRecords() {
    return await this.requestRepository.find();
  }

  async readResearcher(id: number) {
    return await this.researcherRepository.findOneBy({ id });
  }

  async readRequestRecord(id: number) {
    return await this.requestRepository.findOneBy({ id });
  }
}