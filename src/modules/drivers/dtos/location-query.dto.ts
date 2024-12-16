import { IsLongitude, IsLatitude } from 'class-validator';

export class LocationQueryDto {
  @IsLatitude()
  public latitude: string;
  @IsLongitude()
  public longitude: string;
}
