import { AbstractEntity } from 'src/database/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Listing extends AbstractEntity<Listing> {
  @Column()
  description: string;

  @Column({ default: 0 })
  rating: number;
}
