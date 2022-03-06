import { MigrationInterface, QueryRunner } from 'typeorm';

export class MediaApp1646607410465 implements MigrationInterface {
  name = 'MediaApp1646607410465';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE TABLE `user` (`id` int NOT NULL AUTO_INCREMENT, `fullname` varchar(255) NOT NULL, `email` varchar(255) NOT NULL, `avatar` varchar(255) NULL DEFAULT \'https://res.cloudinary.com/owujib/image/upload/v1640215435/Group_2_by14sn.svg\', `password` varchar(255) NOT NULL, `role` int NOT NULL, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB');
    await queryRunner.query('CREATE TABLE `folder` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `eTag` varchar(255) NOT NULL, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `userId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB');
    await queryRunner.query('CREATE TABLE `file` (`id` int NOT NULL AUTO_INCREMENT, `key` varchar(255) NOT NULL, `bucketId` varchar(255) NOT NULL, `safe` tinyint NOT NULL, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `userId` int NULL, `folderId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB');
    await queryRunner.query('ALTER TABLE `folder` ADD CONSTRAINT `FK_a0ef64d088bc677d66b9231e90b` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION');
    await queryRunner.query('ALTER TABLE `file` ADD CONSTRAINT `FK_b2d8e683f020f61115edea206b3` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION');
    await queryRunner.query('ALTER TABLE `file` ADD CONSTRAINT `FK_3563fb0d3e9557359f541ac77da` FOREIGN KEY (`folderId`) REFERENCES `folder`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `file` DROP FOREIGN KEY `FK_3563fb0d3e9557359f541ac77da`');
    await queryRunner.query('ALTER TABLE `file` DROP FOREIGN KEY `FK_b2d8e683f020f61115edea206b3`');
    await queryRunner.query('ALTER TABLE `folder` DROP FOREIGN KEY `FK_a0ef64d088bc677d66b9231e90b`');
    await queryRunner.query('DROP TABLE `file`');
    await queryRunner.query('DROP TABLE `folder`');
    await queryRunner.query('DROP TABLE `user`');
  }
}
