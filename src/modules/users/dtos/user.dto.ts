import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { PostDto } from '../../posts/dtos/post.dto';

export class UserDto {
  @IsUUID('4')
  @IsOptional()
  @Expose()
  id?: string;

  @IsNotEmpty()
  @IsEmail()
  @Expose()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsArray()
  @Expose()
  @ValidateNested({ each: true })
  @Type(() => PostDto)
  @IsOptional()
  posts: Partial<PostDto>[];
}
