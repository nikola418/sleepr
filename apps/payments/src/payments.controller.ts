import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { PaymentsCreateChargeDto } from './dto';
import Stripe from 'stripe';

@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @MessagePattern('create_charge')
  @UsePipes(new ValidationPipe())
  async createCharge(
    @Payload() data: PaymentsCreateChargeDto,
    @Ctx() context: RmqContext,
  ): Promise<Stripe.PaymentIntent> {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    return this.paymentsService
      .createCharge(data)
      .then(() => channel.ack(originalMsg));
  }
}
