import { Controller, Post, UseGuards, Body } from '@nestjs/common'

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { PrismaService } from 'src/prisma/prisma.service'
import { z } from 'zod'
import { CurrentUser } from 'src/auth/current-user-decorator'
import { TokenSchema } from 'src/auth/jwt.strategy'
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipes'
import { createSlug } from 'src/utils/slug'

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
})

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>

@Controller('/questions')
// Estratégia de proteção das rotas usando Guard e AuthGuard('jwt') isso é confirado no service jwt.strategy.ts
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(private prisma: PrismaService) {}

  @Post()
  // decorator customizado para receber o payload do token
  async handle(
    @CurrentUser() user: TokenSchema,
    @Body(new ZodValidationPipe(createQuestionBodySchema))
    body: CreateQuestionBodySchema,
  ) {
    const { content, title } = body
    const { sub: userId } = user
    const slug = createSlug(title)

    const question = await this.prisma.question.create({
      data: {
        content,
        title,
        slug,
        authorId: userId,
      },
    })
    return {
      question,
    }
  }
}
