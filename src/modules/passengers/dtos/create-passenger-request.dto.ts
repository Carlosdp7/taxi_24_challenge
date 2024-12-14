import { IsString } from 'class-validator';

export class CreatePassengerRequestDto {
  @IsString()
  public name: string;
}
