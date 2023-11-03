import { Controller, Get, Post, Put, Delete, Param, Body, BadRequestException, NotFoundException } from '@nestjs/common';
import { UserUseCase } from '../application/user.usecase';
import { UserModel } from '../domain/user.model';
import Result from 'src/shared/interfaces/result.interface';

@Controller("users")
export class UserController {
  constructor(private useCase: UserUseCase) { }

  @Get()
  async list(): Promise<Result<UserModel>> {

    return await this.useCase.list({}, [], {
      lastname: 'ASC',
      name: 'ASC',
    });
  }

  @Get(':id')
  async getOne(@Param() params: { id: string }) {
    const where = { dni: +params.id };
    return await this.useCase.getOne(where);
  }

  @Post()
  async insert(@Body() user: Partial<UserModel>) {
    try {
      const result = await this.useCase.insert(user);
      return result;
    } catch (err) {
      const errorMessage = err.message || 'An error occurred';
      throw new BadRequestException(errorMessage);
    }
  }


  @Put(':id')
  async update(@Param() params: { id: string }, @Body() user: UserModel) {
    try {
      const body = user;
      const where = { dni: params.id };
      const result = await this.useCase.update(body, where);
      return result;
    } catch (err) {
      throw new NotFoundException();
    }
  }

  @Delete(':id')
  async delete(@Param() params: { id: string }) {
    try {
      const where = { dni: params.id };
      const result = await this.useCase.delete(where);
      return result
    } catch (err) {
      throw new NotFoundException();
    }
  }
}
