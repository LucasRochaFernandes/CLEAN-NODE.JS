import { Module } from '@nestjs/common'

import { PrismaService } from './prisma/prisma.service'
import { CreateAccountController } from './controllers/users/create-account.controller'
import { ConfigModule } from '@nestjs/config'
import { envSchema } from './env'
import { AuthModule } from './auth/auth.module'
import { AuthenticateController } from './controllers/users/authenticate.controller'
import { CreateQuestionController } from './controllers/questions/create.controller'
import { FetchRecentQuestionsController } from './controllers/questions/fetch-recent-questions.controller'

@Module({
  imports: [
    // Module de configuração para variáveis ambiente
    // forRoot é usado para configurar módulos
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
  ],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
    FetchRecentQuestionsController,
  ],
  providers: [PrismaService],
})
export class AppModule {}
