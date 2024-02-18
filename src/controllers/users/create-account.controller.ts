import {
  ConflictException,
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common'
import { hash } from 'bcryptjs'
import { z } from 'zod'
import { PrismaService } from 'src/prisma/prisma.service'
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipes'

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
})
type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>

@Controller('/accounts')
export class CreateAccountController {
  constructor(private prisma: PrismaService) {}
  @Post()
  @HttpCode(201)
  // Validação do body que é enviado, o UsePipes vai fazer essa validação, usa-se uma classe, passando o schema como parâmetro.
  // Essa classe implementado PipeTransform e possui uma função que irá transformar essa informação, se a informação estiver errada,
  // é enviado um erro
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() { name, email, password }: CreateAccountBodySchema) {
    const emailAlreadyExists = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })
    if (emailAlreadyExists) {
      throw new ConflictException('Email Already Exists')
    }
    const hashedPassword = await hash(password, 8)
    const userCreated = await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })
    return {
      userCreated,
    }
  }
}
