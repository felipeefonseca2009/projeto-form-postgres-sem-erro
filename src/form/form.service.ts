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

  async updateResearcher(id: number, userId: number, data: any) {
    return await this.researcherRepository.update({ id, user_id: userId }, data);
  }

  async deleteResearcher(id: number, userId: number) {
    return await this.researcherRepository.delete({ id, user_id: userId });
  }

  async saveResearcherForm(data: { nome: string; email: string; telefone: string; cidade: string; pais: string; area_atuacao: string }, userId: number) {
    const researcher = this.researcherRepository.create({
      ...data,
      user_id: userId,
    });
    return await this.researcherRepository.save(researcher);
  }

  async saveRequestForm(data: { nome: string; assunto: string; descricao: string; data: string }, researcherId: number) {
    const request = this.requestRepository.create({
      ...data,
      researcher_id: researcherId,
    });
    return await this.requestRepository.save(request);
  }

  async listResearchers(userId: number) {
    return await this.researcherRepository.find({
      where: { user_id: userId },
    });
  }

  async listRequestRecords(userId: number) {
    return await this.requestRepository
      .createQueryBuilder('request')
      .innerJoin('request.researcher', 'researcher')
      .where('researcher.user_id = :userId', { userId })
      .getMany();
  }

  async readResearcher(id: number, userId: number) {
    return await this.researcherRepository.findOneBy({ id, user_id: userId });
  }

  async readRequestRecord(id: number, userId: number) {
    return await this.requestRepository
      .createQueryBuilder('request')
      .innerJoin('request.researcher', 'researcher')
      .where('request.id = :id', { id })
      .andWhere('researcher.user_id = :userId', { userId })
      .getOne();
  }

  async getResearcherByUserId(userId: number) {
    return await this.researcherRepository.findOneBy({ user_id: userId });
  }
}
