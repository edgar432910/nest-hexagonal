import { Module } from "@nestjs/common";
import { UserController } from "./adapter/user.controller";
import { UserUseCase } from "./application/user.usecase";
import { UserOperation } from "./infraestructure/user.operation";
import { FileUseCase } from "src/file/file.usecase";



@Module({
    imports: [],
    controllers: [UserController],
    providers: [UserUseCase, UserOperation, FileUseCase],
  })
  export class UserModule {}