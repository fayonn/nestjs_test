import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { PostsService } from '../posts/posts.service';
import { Serialize } from '../../common/decorators/serialize.decorator';
import { UserDto } from './dtos/user.dto';
import { TitlesOutDto } from './dtos/titles-out.dto';
import { PostDto } from '../posts/dtos/post.dto';

// validation is missed
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly postsService: PostsService,
  ) {}

  @Get('/:id')
  @Serialize(UserDto)
  async getOne(@Param('id') id: string) {
    return await this.usersService.findByIdOrThrowError(id, () => {
      throw new NotFoundException(`User not found | id=${id}`);
    });
  }

  @Post()
  @Serialize(UserDto)
  async create(@Body() body: UserDto) {
    return await this.usersService.save(body);
  }

  @Put('/:id')
  @Serialize(UserDto)
  async update(@Param('id') id: string, @Body() body: Partial<UserDto>) {
    return await this.usersService.update(id, body);
  }

  @Delete('/:id')
  @Serialize(UserDto)
  async delete(@Param('id') id: string) {
    return await this.usersService.deleteById(id);
  }

  @Get('/:id/posts')
  @Serialize(PostDto)
  async getUsersPosts(@Param('id') id: string) {
    return await this.postsService.findByUserId(id);
  }

  @Get(`/:id/titles`)
  @Serialize(TitlesOutDto)
  async getTitles(@Param('id') id: string) {
    return await this.usersService.getEmailAndPostTitles(id);
  }
}
