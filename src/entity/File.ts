/* eslint-disable import/no-cycle */
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';

import { Folder } from './Folder';
import { User } from './User';

@Entity()
export class File extends BaseEntity {
     @PrimaryGeneratedColumn()
       id: number;

    @Column({
      nullable: false,
    })
      key: string;

    @Column({
      nullable: false,
    })
      bucketId: string;

    @Column({
      nullable: false,
    })
      safe: boolean;

    @ManyToOne(() => User, (user) => user.files)
    @JoinColumn()
      user: User;

    @ManyToOne(() => Folder, (folder) => folder.files)
    @JoinColumn()
      folder: Folder;

    @CreateDateColumn()
      created_at: Date;

    @UpdateDateColumn()
      updated_at: Date;
}
