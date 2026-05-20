import { Body, Controller, Get, Param, Post, Render, Redirect, Req } from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from '../auth/auth.service';
import { FormService } from './form.service';

@Controller()
export class FormController {
  constructor(
    private readonly formService: FormService,
    private readonly authService: AuthService,
  ) {}

  private parseCookies(cookieHeader?: string): Record<string, string> {
    if (!cookieHeader) {
      return {};
    }
    return cookieHeader.split(';').reduce((cookies, cookiePair) => {
      const [name, ...rest] = cookiePair.trim().split('=');
      cookies[name] = rest.join('=');
      return cookies;
    }, {} as Record<string, string>);
  }

  @Get('edit/person/:id')
  @Render('edit-person')
  async editPerson(@Param('id') id: number) {
    const person = await this.formService.readPersonRecord(id);
    return { person };
  }

  @Post('edit/person/:id')
  @Redirect('/records/person')
  async updatePerson(
    @Param('id') id: number,
    @Body() body: any,
  ) {
    await this.formService.updatePerson(id, body);
  }

  @Post('delete/person/:id')
  @Redirect('/records/person')
  async deletePerson(@Param('id') id: string) {
    await this.formService.deletePerson(Number(id));
  }

  @Get()
  @Render('home')
  async home(@Req() req: Request) {
    const cookies = this.parseCookies(req.headers.cookie);
    const token = cookies['auth_token'];
    const payload = token ? await this.authService.validateToken(token) : null;

    return {
      loggedIn: Boolean(payload),
    };
  }

  @Get('forms/person')
  @Render('person-form')
  personForm() {
    return {};
  }

  @Post('forms/person')
  @Render('success')
  async submitPersonForm(
    @Body() body: {
      nome: string;
      email: string;
      telefone: string;
      cidade: string;
      pais: string;
      tataravo: string;
    },
  ) {
    const person = await this.formService.savePersonForm(body);

    return {
      mensagem: 'Cadastro de pessoa salvo com sucesso.',
      tipo: 'person',
      id: person.id,
    };
  }

  @Get('forms/request')
  @Render('request-form')
  requestForm() {
    return {};
  }

  @Post('forms/request')
  @Render('success')
  async submitRequestForm(
    @Body() body: {
      nome: string;
      assunto: string;
      descricao: string;
      data: string;
    },
  ) {
    const request = await this.formService.saveRequestForm(body);

    return {
      mensagem: 'Solicitação salva com sucesso.',
      tipo: 'request',
      id: request.id,
    };
  }

  @Get('records/person')
  @Render('person-records')
  async personRecords() {
    const records = await this.formService.listPersonRecords();
    return { records };
  }

  @Get('records/request')
  @Render('request-records')
  async requestRecords() {
    const records = await this.formService.listRequestRecords();
    return { records };
  }

  @Get('records/person/:id')
  @Render('person-record-detail')
  async personRecordDetail(@Param('id') id: string) {
    const record = await this.formService.readPersonRecord(Number(id));
    return { record };
  }

  @Get('records/request/:id')
  @Render('request-record-detail')
  async requestRecordDetail(@Param('id') id: string) {
    const record = await this.formService.readRequestRecord(Number(id));
    return { record };
  }
}