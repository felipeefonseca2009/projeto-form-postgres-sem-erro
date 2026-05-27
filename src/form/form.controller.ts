import { Body, Controller, Get, Param, Post, Render, Redirect, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from '../auth/auth.service';
import { FormService } from './form.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

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

  @UseGuards(JwtAuthGuard)
  @Get('edit/person/:id')
  @Render('edit-person')
  async editPerson(@Param('id') id: number) {
    const person = await this.formService.readPersonRecord(id);
    return { person };
  }

  @UseGuards(JwtAuthGuard)
  @Post('edit/person/:id')
  @Redirect('/records/person')
  async updatePerson(
    @Param('id') id: number,
    @Body() body: any,
  ) {
    await this.formService.updatePerson(id, body);
  }

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
  @Get('forms/person')
  @Render('person-form')
  personForm() {
    return {};
  }

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
  @Get('forms/request')
  @Render('request-form')
  requestForm() {
    return {};
  }

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
  @Get('records/person')
  @Render('person-records')
  async personRecords() {
    const records = await this.formService.listPersonRecords();
    return { records };
  }

  @UseGuards(JwtAuthGuard)
  @Get('records/request')
  @Render('request-records')
  async requestRecords() {
    const records = await this.formService.listRequestRecords();
    return { records };
  }

  @UseGuards(JwtAuthGuard)
  @Get('records/person/:id')
  @Render('person-record-detail')
  async personRecordDetail(@Param('id') id: string) {
    const record = await this.formService.readPersonRecord(Number(id));
    return { record };
  }

  @UseGuards(JwtAuthGuard)
  @Get('records/request/:id')
  @Render('request-record-detail')
  async requestRecordDetail(@Param('id') id: string) {
    const record = await this.formService.readRequestRecord(Number(id));
    return { record };
  }
}