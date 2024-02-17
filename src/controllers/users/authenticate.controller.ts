import { Body, Controller, HttpCode, Post, UsePipes } from '@nestjs/common'
import { hash } from 'bcryptjs'
import { z } from 'zod'
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipes'
import { PrismaService } from 'src/prisma/prisma.service'
import { JwtService } from '@nestjs/jwt'

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
})
type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@Controller('/sessions')
export class AuthenticateController {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  @Post()
  @HttpCode(201)
  // @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() { email }: AuthenticateBodySchema) {
    const userByEmail = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })
    if (!userByEmail) {
      throw new Error('Não encontrado')
    }

    try {
      const token = this.jwt.sign({ sub: 'user-id' })
      return token
    } catch (error) {
      console.log(error)
    }
  }
}
