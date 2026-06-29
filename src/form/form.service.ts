import { BadRequestException, Injectable } from '@nestjs/common';
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

  async updateRequestRecord( id: number, userId: number, data: { assunto: string; descricao: string; data: string;},) {
  const request = await this.readRequestRecord(id, userId);

  if (!request) {
    return null;
  }

  await this.requestRepository.update(id, {
    assunto: data.assunto,
    descricao: data.descricao,
    data: data.data,
  });

  return this.readRequestRecord(id, userId);
}

  async deleteResearcher(id: number, userId: number) {
    return await this.researcherRepository.delete({ id, user_id: userId });
  }

  //userId não lido, porém aplicação rodando normalmente
  async deleteRequestRecord(id: number, userId: number) {
  return await this.requestRepository.delete(id,);
  }

  //AQUIIIIIIIII JSON RESEARCHER  
  async saveResearcherForm(data: { nome: string; email: string; telefone: string; cidade: string; pais: string; area_atuacao: string; data_nascimento: string }, userId: number) {
    if (!this.isAdult(data.data_nascimento)) {
      throw new BadRequestException('O pesquisador deve ter mais de 18 anos.');
    }

    const researcher = this.researcherRepository.create({
      ...data,
      user_id: userId,
    });
    return await this.researcherRepository.save(researcher);
  }

  public isAdult(birthDate: string): boolean {
    const parsed = new Date(birthDate);
    if (Number.isNaN(parsed.getTime())) {
      throw new BadRequestException('Data de nascimento inválida.');
    }

    const today = new Date();
    let age = today.getFullYear() - parsed.getFullYear();
    const monthDiff = today.getMonth() - parsed.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < parsed.getDate())) {
      age -= 1;
    }

    return age >= 18;
  }

//edição abaixo pré-campos
  async saveRequestForm(data: { nome: string; assunto: string; descricao: string; data: string; outros_especificar?: string; }, researcherId: number) {

    const { outros_especificar, ...requestData } = data;
  
  let assuntoFinal = requestData.assunto;

  // 2. Se o usuário selecionou 'Outros', substitui o valor pelo texto digitado
  if (assuntoFinal === 'Outros' && outros_especificar) {
    assuntoFinal = outros_especificar;
  }

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
      .innerJoinAndSelect('request.researcher', 'researcher')
      .where('researcher.user_id = :userId', { userId })
      .getMany();
  }

  async listRequestRecordsByResearcher(researcherId: number, userId: number) {
    return await this.requestRepository
      .createQueryBuilder('request')
      .innerJoin('request.researcher', 'researcher')
      .where('request.researcher_id = :researcherId', { researcherId })
      .andWhere('researcher.user_id = :userId', { userId })
      .getMany();
  }

  async readResearcher(id: number, userId: number) {
    return await this.researcherRepository.findOneBy({ id, user_id: userId });
  }

  async readRequestRecord(id: number, userId: number) {
    return await this.requestRepository
      .createQueryBuilder('request')
      .innerJoinAndSelect('request.researcher', 'researcher')
      .where('request.id = :id', { id })
      .andWhere('researcher.user_id = :userId', { userId })
      .getOne();
  }

  async getResearcherByUserId(userId: number) {
    return await this.researcherRepository.findOneBy({ user_id: userId });
  }
}
