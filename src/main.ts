import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import { Env } from './env'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: false,
  })
  // Eu uso o config service para pegar minhas variáveis ambiente
  const configService = app.get<ConfigService<Env, true>>(ConfigService)
  const port = configService.get('PORT', { infer: true })
  await app.listen(port, () => {
    console.log('Server Running!')
  })
}
bootstrap()
