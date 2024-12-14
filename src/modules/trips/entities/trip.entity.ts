import { PassengerEntity } from '../../passengers/entities';
import { DriverEntity } from '../../drivers/entities';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity({ name: 'trip' })
export class TripEntity {
  @PrimaryGeneratedColumn('identity', { generatedIdentity: 'ALWAYS' })
  id: number;

  @ManyToOne(() => DriverEntity)
  @JoinColumn({ name: 'driver_id' })
  driverId: DriverEntity;

  @ManyToOne(() => PassengerEntity)
  @JoinColumn({ name: 'passenger_id' })
  passengerId: PassengerEntity;

  @Column({ name: 'is_completed', default: false })
  isCompleted: boolean;

  @Column({ name: 'lat_to' })
  latTo: string;

  @Column({ name: 'lat_from' })
  latFrom: string;

  @Column({ name: 'lng_to' })
  lngTo: string;

  @Column({ name: 'lng_from' })
  lngFrom: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updatedAt: Date;
}
