import { IsLongitude, IsLatitude, IsNumber } from 'class-validator';

export class CreateTripRequestDto {
  @IsNumber()
  public passengerId: number;
  @IsNumber()
  public driverId: number;
  @IsLatitude()
  public latTo: string;
  @IsLatitude()
  public latFrom: string;
  @IsLongitude()
  public lngTo: string;
  @IsLongitude()
  public lngFrom: string;
}
