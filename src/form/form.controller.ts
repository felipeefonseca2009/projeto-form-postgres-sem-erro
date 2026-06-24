import { Body, Controller, Get, NotFoundException, Param, Post, Render, Redirect, Req, UseGuards } from '@nestjs/common';
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
  async editResearcher(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    const researcher = await this.formService.readResearcher(Number(id), user.id);

    if (!researcher) {
      throw new NotFoundException('Pesquisador não encontrado.');
    }

    return { person: researcher };
  }

  @UseGuards(JwtAuthGuard)
  @Post('researchers/:id/edit')
  @Redirect('/researchers')
  async updateResearcher(
    @Param('id') id: string,
    @Body() body: any,
    @CurrentUser() user: any,
  ) {
    await this.formService.updateResearcher(Number(id), user.id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('records/request/:id/edit')
  @Render('edit-request')
  async editRequest(
  @Param('id') id: string,
  @CurrentUser() user: any,
  ) {
  const request = await this.formService.readRequestRecord(Number(id), user.id);

  if (!request) {
    throw new NotFoundException('Solicitacao nao encontrada.');
  }

  return { request };
  }

  @UseGuards(JwtAuthGuard)
  @Post('records/request/:id/edit')
  @Redirect('/records/request')
  async updateRequest(
  @Param('id') id: string,
  @Body() body: {
    assunto: string;
    descricao: string;
    data: string;
  },
  @CurrentUser() user: any,
  ) {
  await this.formService.updateRequestRecord(Number(id), user.id, {
    assunto: body.assunto,
    descricao: body.descricao,
    data: body.data,
  });
}

  @UseGuards(JwtAuthGuard)
  @Post('researchers/:id/delete')
  @Redirect('/researchers')
  async deleteResearcher(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    await this.formService.deleteResearcher(Number(id), user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('records/request/:id/delete')
  @Redirect('/records/request')
  async deleteRequestRecord(
  @Param('id') id: string,
  @CurrentUser() user: any,
  ) {
  await this.formService.deleteRequestRecord(Number(id), user.id);
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
    return { action: '/forms/request' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('researchers/:id/requests/new')
  @Render('request-form')
  async requestFormForResearcher(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    const researcher = await this.formService.readResearcher(Number(id), user.id);

    if (!researcher) {
      throw new NotFoundException('Pesquisador não encontrado.');
    }

    return {
      action: `/researchers/${researcher.id}/requests`,
      researcher,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('forms/request')
  @Render('success')
  async submitRequestForm(
    @Body() body: {
      assunto: string;
      descricao: string;
      data: string;
    },
    @CurrentUser() user: any,
  ) {
    const researcher = await this.formService.getResearcherByUserId(user.id);
    
    if (!researcher) {
      return {
        erro: 'Você não tem um perfil de pesquisador. Crie um primeiro.',
      };
    }

    const request = await this.formService.saveRequestForm(
      { ...body, nome: researcher.nome },
      researcher.id,
    );

    return {
      mensagem: 'Solicitação salva com sucesso.',
      tipo: 'request',
      id: request.id,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('researchers/:id/requests')
  @Render('success')
  async submitRequestFormForResearcher(
    @Param('id') id: string,
    @Body() body: {
      assunto: string;
      descricao: string;
      data: string;
    },
    @CurrentUser() user: any,
  ) {
    const researcher = await this.formService.readResearcher(Number(id), user.id);

    if (!researcher) {
      throw new NotFoundException('Pesquisador não encontrado.');
    }

    const request = await this.formService.saveRequestForm(
      { ...body, nome: researcher.nome },
      researcher.id,
    );

    return {
      mensagem: 'Solicitação salva com sucesso.',
      tipo: 'request',
      id: request.id,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('researchers')
  @Render('researcher-records')
  async personRecords(@CurrentUser() user: any) {
    const records = await this.formService.listResearchers(user.id);
    return { records };
  }

  @UseGuards(JwtAuthGuard)
  @Get('records/request')
  @Render('request-records')
  async requestRecords(@CurrentUser() user: any) {
    const records = await this.formService.listRequestRecords(user.id);
    return { records };
  }

  @UseGuards(JwtAuthGuard)
  @Get('researchers/:id')
  @Render('researcher-record-detail')
  async personRecordDetail(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    const researcherId = Number(id);
    const record = await this.formService.readResearcher(researcherId, user.id);
    const requests = record
      ? await this.formService.listRequestRecordsByResearcher(researcherId, user.id)
      : [];

    return { record, requests };
  }

  @UseGuards(JwtAuthGuard)
  @Get('records/request/:id')
  @Render('request-record-detail')
  async requestRecordDetail(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    const record = await this.formService.readRequestRecord(Number(id), user.id);
    return { record };
  }
}
