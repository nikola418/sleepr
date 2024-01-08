import {
  IsDefined,
  IsNotEmptyObject,
  IsNumber,
  IsPositive,
  ValidateNested,
} from 'class-validator';
import { CardDto } from './card.dto';
import { Type } from 'class-transformer';
import { CreateChargeMessage } from '../types';

export class CreateChargeDto implements Omit<CreateChargeMessage, 'email'> {
  @IsDefined()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CardDto)
  card: CardDto;

  @IsNumber()
  @IsPositive()
  amount: number;
}
