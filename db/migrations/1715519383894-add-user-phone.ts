import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserPhone1715519383894 implements MigrationInterface {
    name = 'AddUserPhone1715519383894'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "phone" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phone"`);
    }

}
