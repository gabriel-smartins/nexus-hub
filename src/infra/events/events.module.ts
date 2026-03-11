import { OnAnswerCreated } from '@/domain/forum/application/subscribers/on-answer-created'
import { OnQuestionBestAnswer } from '@/domain/forum/application/subscribers/on-question-best-answer'
import { SendNotificationUseCase } from '@/domain/notification/application/use-cases/send-notification'
import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'

@Module({
  imports: [DatabaseModule],
  providers: [OnAnswerCreated, OnQuestionBestAnswer, SendNotificationUseCase],
})
export class EventsModule {}
