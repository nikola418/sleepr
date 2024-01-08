import { IsCreditCard, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { CardMessage } from '../types';

export class CardDto implements CardMessage {
  @IsString()
  @IsNotEmpty()
  cvc: string;

  @IsNumber()
  expMonth;

  @IsNumber()
  expYear: number;

  @IsCreditCard()
  number: string;
}
