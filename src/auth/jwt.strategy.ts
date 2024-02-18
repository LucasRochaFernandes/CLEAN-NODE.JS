import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'
import { Env } from 'src/env'
import { Injectable } from '@nestjs/common'
import { z } from 'zod'

const tokenSchema = z.object({
  sub: z.string().uuid(),
})

export type TokenSchema = z.infer<typeof tokenSchema>

// Validação do token nas rotas, serve como middleware
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService<Env, true>) {
    const publickey = config.get('JWT_PUBLIC_KEY', { infer: true })
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      algorithms: ['RS256'],
      // Chave pública porque ele só é usada para validar o token
      secretOrKey: Buffer.from(publickey, 'base64'),
    })
  }

  // validade usando zod se existe no payload o id do user
  async validate(payload: TokenSchema) {
    return tokenSchema.parse(payload)
  }
}
