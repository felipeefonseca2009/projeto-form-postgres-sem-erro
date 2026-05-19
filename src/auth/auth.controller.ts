import { Body, Controller, Get, Post, Render, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
  async loginForm(@Body() loginDto: LoginDto) {
    try {
      const loginResult = await this.authService.login(loginDto);
      return {
        success: true,
        message: 'Login realizado com sucesso!',
        accessToken: loginResult.accessToken,
      };
    } catch (error) {
      return {
        error: (error as Error).message || 'Erro ao efetuar login.',
      };
    }
  }
}
