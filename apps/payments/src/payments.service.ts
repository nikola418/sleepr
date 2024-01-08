import {
  NOTIFICATIONS_SERVICE_NAME,
  NotificationsServiceClient,
} from '@app/common/types/notifications';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientGrpc } from '@nestjs/microservices';
import Stripe from 'stripe';
import { PaymentsCreateChargeDto } from './dto';

@Injectable()
export class PaymentsService implements OnModuleInit {
  constructor(
    private readonly configService: ConfigService,
    @Inject(NOTIFICATIONS_SERVICE_NAME)
    private readonly client: ClientGrpc,
  ) {}

  private readonly stripe = new Stripe(
    this.configService.get('STRIPE_SECRET_KEY'),
    { apiVersion: '2023-10-16' },
  );

  private notificationsServiceClient: NotificationsServiceClient;

  onModuleInit() {
    this.notificationsServiceClient =
      this.client.getService<NotificationsServiceClient>(
        NOTIFICATIONS_SERVICE_NAME,
      );
  }

  async createCharge({ amount, card, email }: PaymentsCreateChargeDto) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const paymentMethod = await this.stripe.paymentMethods.create({
      type: 'card',
      card: {
        cvc: card.cvc,
        number: card.number,
        exp_month: card.expMonth,
        exp_year: card.expYear,
      },
    });

    const paymentIntent = await this.stripe.paymentIntents.create({
      payment_method: 'pm_card_visa',
      amount: amount * 100,
      confirm: true,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never',
      },
      payment_method_types: ['card'],
    });

    this.notificationsServiceClient
      .notifyEmail({
        email,
        text: `Your payment of $${amount} has completed successfully.`,
      })
      .subscribe();

    return paymentIntent;
  }
}
