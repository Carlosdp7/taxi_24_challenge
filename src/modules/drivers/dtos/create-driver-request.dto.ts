import { IsString, IsLongitude, IsLatitude } from 'class-validator';

export class CreateDriverRequestDto {
  @IsString()
  public name: string;
  @IsString()
  public car_brand: string;
  @IsString()
  public car_color: string;
  @IsString()
  public car_plate: string;
  @IsLatitude()
  public latitude: string;
  @IsLongitude()
  public longitude: string;
}
