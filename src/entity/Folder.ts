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
  OneToMany,
} from 'typeorm';

import { File } from './File';
import { User } from './User';

@Entity()
export class Folder extends BaseEntity {
    @PrimaryGeneratedColumn()
      id: number;

    @Column({
      type: 'varchar',
      nullable: false,
    })
      name: string;

    @Column({
      type: 'varchar',
      nullable: false,
    })
      eTag: string;

    @ManyToOne(() => User, (user) => user.folders)
    @JoinColumn()
      user: User;

    @OneToMany(() => File, (files) => files.folder)
      files: File[];

    @CreateDateColumn()
      created_at: Date;

    @UpdateDateColumn()
      updated_at: Date;
}
