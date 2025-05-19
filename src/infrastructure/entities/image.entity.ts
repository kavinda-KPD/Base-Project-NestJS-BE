import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'images' })
export class ImageEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', name: 'url', length: 255, nullable: false })
  url: string;
}
