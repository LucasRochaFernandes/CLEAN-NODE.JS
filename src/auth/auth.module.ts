import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { Env } from 'src/env'
import { JwtStrategy } from './jwt.strategy'

@Module({
  imports: [
    PassportModule,
    // Usando o module JWT, podemos configurar usando registerAsync, injetando o ConfigService com o qual é possível obter o JWT_SECRET
    JwtModule.registerAsync({
      inject: [ConfigService],
      global: true,
      useFactory(config: ConfigService<Env, true>) {
        // A chave secreta privada serve para ser usada na criação do JWT dentro do serviço de origem e somente
        const privateKey = config.get('JWT_PRIVATE_KEY', { infer: true })
        // A chave secreta publica serve para ser usada entre serviços, para validar um JWT
        const publicKey = config.get('JWT_PUBLIC_KEY', { infer: true })
        return {
          signOptions: { algorithm: 'RS256' },
          privateKey: Buffer.from(privateKey, 'base64'),
          publicKey: Buffer.from(publicKey, 'base64'),
        }
      },
    }),
  ],
  providers: [JwtStrategy],
})
export class AuthModule {}
