import { AppModule } from '@/app.module'
import { PrismaService } from '@/prisma/prisma.service'
import { createSlug } from '@/utils/slug'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'

describe('Create question (E2E)', () => {
  // Deixa a aplicação pronta para testes e2e, sem a necessidade de rodar npm run dev
  let app: INestApplication
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let prisma: PrismaService
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)
    await app.init()
  })
  test('[POST] /questions', async () => {
    const user = await prisma.user.create({
      data: {
        email: 'example@example.com',
        name: 'test',
        password: await hash('123456', 8),
      },
    })
    const accessToken = jwt.sign({ sub: user.id })

    const response = await request(app.getHttpServer())
      .post('/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'New question',
        content: 'Question content',
      })
    expect(response.statusCode).toBe(201)
    const questionOnDatabase = await prisma.question.findUnique({
      where: {
        slug: createSlug('New question'),
      },
    })
    expect(questionOnDatabase).toBeTruthy()
  })
})
