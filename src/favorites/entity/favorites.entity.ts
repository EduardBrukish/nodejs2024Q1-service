import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Favorites {
  @PrimaryColumn()
  id: string;

  @Column('text', { array: true })
  artists: string[];

  @Column('text', { array: true })
  albums: string[];

  @Column('text', { array: true })
  tracks: string[];
}
