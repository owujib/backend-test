/* eslint-disable import/no-cycle */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column, BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
  BeforeInsert,
  OneToOne,
} from 'typeorm';
import { File } from './File';
import { Folder } from './Folder';

const bcrypt = require('bcryptjs');

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
      id: number;

    @Column({
      nullable: false,
    })
      fullname: string;

    @Column({
      nullable: false,
    })
      email: string;

    @Column({
      nullable: true,
      default: 'https://res.cloudinary.com/owujib/image/upload/v1640215435/Group_2_by14sn.svg',
    })
      avatar: string;

    @Column({
      nullable: false,
    })
      password: string;

    @Column({
      nullable: false,
    })
      role: number;

    @OneToMany(() => File, (files) => files.user)
      files: File[];

    @OneToMany(() => Folder, (folders) => folders.user)
      folders: Folder[];

    @CreateDateColumn()
      created_at: Date;

    @UpdateDateColumn()
      updated_at: Date;

    @BeforeInsert()
    async updatePassword() {
      this.password = await bcrypt.hash(this.password, 10);
    }

    public static mockTestUser(): User {
      const user = new User();
      user.role = 1;
      user.email = 'test@email.com';
      user.password = 'TestPassword';
      user.avatar = 'https://res.cloudinary.com/owujib/image/upload/v1640215435/Group_2_by14sn.svg';
      user.id = 1;
      return user;
    }
}
