import { Body, Controller, Get, Param, Post, Render, Redirect, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from '../auth/auth.service';
import { FormService } from './form.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

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
  @Get('researchers/:id/edit')
  @Render('edit-researcher')
  async editResearcher(@Param('id') id: number) {
    const researcher = await this.formService.readResearcher(id);
    return { person: researcher };
  }

  @UseGuards(JwtAuthGuard)
  @Post('researchers/:id/edit')
  @Redirect('/researchers')
  async updateResearcher(
    @Param('id') id: number,
    @Body() body: any,
  ) {
    await this.formService.updateResearcher(id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('researchers/:id/delete')
  @Redirect('/researchers')
  async deleteResearcher(@Param('id') id: string) {
    await this.formService.deleteResearcher(Number(id));
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
  @Get('researchers/new')
  @Render('researcher-form')
  personForm() {
    return {};
  }

  @UseGuards(JwtAuthGuard)
  @Post('researchers')
  @Render('success')
  async submitPersonForm(
    @Body() body: {
      nome: string;
      email: string;
      telefone: string;
      cidade: string;
      pais: string;
      area_atuacao: string;
    },
    @CurrentUser() user: any,
  ) {
    const person = await this.formService.saveResearcherForm(body, user.id);

    return {
      mensagem: 'Cadastro de pesquisador salvo com sucesso.',
      tipo: 'researchers',
      id: person.id,
      isResearcher: true,
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
      researcher_id?: number;
    },
    @CurrentUser() user: any,
  ) {
    const { researcher_id, ...requestData } = body;
    const request = await this.formService.saveRequestForm(requestData, researcher_id);

    return {
      mensagem: 'Solicitação salva com sucesso.',
      tipo: 'request',
      id: request.id,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('researchers')
  @Render('researcher-records')
  async personRecords() {
    const records = await this.formService.listResearchers();
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
  @Get('researchers/:id')
  @Render('researcher-record-detail')
  async personRecordDetail(@Param('id') id: string) {
    const record = await this.formService.readResearcher(Number(id));
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