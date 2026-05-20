import { Body, Controller, Get, Post, Render, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Get('login')
  @Render('login')
  loginPage(@Query('error') error?: string) {
    return { error };
  }

  @Get('register')
  @Render('register')
  registerPage(@Query('error') error?: string) {
    return { error };
  }

  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('register-form')
  @Render('register')
  async registerForm(@Body() createUserDto: CreateUserDto) {
    try {
      await this.authService.register(createUserDto);
      return {
        success: true,
        message: 'Cadastro realizado com sucesso! Faça login agora.',
      };
    } catch (error) {
      return {
        error: (error as Error).message || 'Erro ao cadastrar usuário.',
      };
    }
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('login-form')
  @Render('login')
  async loginForm(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const loginResult = await this.authService.login(loginDto);
      res.cookie('auth_token', loginResult.accessToken, {
        httpOnly: true,
        maxAge: Number(
          process.env.JWT_EXPIRES_IN_SECONDS || '3600',
        ) * 1000,
      });
      return {
        success: true,
        message: 'Login realizado com sucesso!',
      };
    } catch (error) {
      return {
        error: (error as Error).message || 'Erro ao efetuar login.',
      };
    }
  }

  @Get('logout')
  @Render('login')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('auth_token');
    return {
      success: true,
      message: 'Você saiu com sucesso. Faça login novamente para acessar o sistema.',
    };
  }
}
