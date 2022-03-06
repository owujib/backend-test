import {MigrationInterface, QueryRunner} from "typeorm";

export class MediaApp1646573735826 implements MigrationInterface {
    name = 'MediaApp1646573735826'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "fullname" character varying NOT NULL, "email" character varying NOT NULL, "avatar" character varying DEFAULT 'https://res.cloudinary.com/owujib/image/upload/v1640215435/Group_2_by14sn.svg', "password" character varying NOT NULL, "role" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "folder" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "eTag" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_6278a41a706740c94c02e288df8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "file" ("id" SERIAL NOT NULL, "key" character varying NOT NULL, "bucketId" character varying NOT NULL, "safe" boolean NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, "folderId" integer, CONSTRAINT "PK_36b46d232307066b3a2c9ea3a1d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "folder" ADD CONSTRAINT "FK_a0ef64d088bc677d66b9231e90b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "file" ADD CONSTRAINT "FK_b2d8e683f020f61115edea206b3" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "file" ADD CONSTRAINT "FK_3563fb0d3e9557359f541ac77da" FOREIGN KEY ("folderId") REFERENCES "folder"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "file" DROP CONSTRAINT "FK_3563fb0d3e9557359f541ac77da"`);
        await queryRunner.query(`ALTER TABLE "file" DROP CONSTRAINT "FK_b2d8e683f020f61115edea206b3"`);
        await queryRunner.query(`ALTER TABLE "folder" DROP CONSTRAINT "FK_a0ef64d088bc677d66b9231e90b"`);
        await queryRunner.query(`DROP TABLE "file"`);
        await queryRunner.query(`DROP TABLE "folder"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
