import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormModule } from './form/form.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { Researcher } from './form/entities/person.record.entity';
import { RequestRecord } from './form/entities/request.record.entity';
import { User } from './users/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: Number(configService.get<string>('DB_PORT')),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [Researcher, RequestRecord, User],
        synchronize: true,
      }),
    }),

    FormModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
