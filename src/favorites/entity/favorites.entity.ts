import { Entity, Column } from 'typeorm';

@Entity()
export class Favorites {
  @Column('text', { array: true })
  artists: string[];

  @Column('text', { array: true })
  albums: string[];
  
  @Column('text', { array: true })
  tracks: string[];
}