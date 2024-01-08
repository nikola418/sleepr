import {
  PAYMENTS_SERVICE_NAME,
  PaymentsServiceClient,
  UserDto,
} from '@app/common';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { map } from 'rxjs';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationsRepository } from './reservations.repository';

@Injectable()
export class ReservationsService implements OnModuleInit {
  constructor(
    private readonly reservationsRepository: ReservationsRepository,
    @Inject(PAYMENTS_SERVICE_NAME)
    private readonly paymentsClient: ClientGrpc,
  ) {}

  private paymentsServiceClient: PaymentsServiceClient;

  onModuleInit() {
    this.paymentsServiceClient =
      this.paymentsClient.getService<PaymentsServiceClient>(
        PAYMENTS_SERVICE_NAME,
      );
  }

  async create(
    createReservationDto: CreateReservationDto,
    { email, _id: userId }: UserDto,
  ) {
    return this.paymentsServiceClient
      .createCharge({ ...createReservationDto.charge, email })
      .pipe(
        map((response) => {
          return this.reservationsRepository.create({
            ...createReservationDto,
            invoiceId: response.id,
            timestamp: new Date(),
            userId,
          });
        }),
      );
  }

  findAll() {
    return this.reservationsRepository.find({});
  }

  findOne(_id: string) {
    return this.reservationsRepository.findOne({ _id });
  }

  update(_id: string, updateReservationDto: UpdateReservationDto) {
    return this.reservationsRepository.findOneAndUpdate(
      { _id },
      { $set: updateReservationDto },
    );
  }

  remove(_id: string) {
    return this.reservationsRepository.findOneAndDelete({ _id });
  }
}
