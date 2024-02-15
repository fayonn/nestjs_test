import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { Expose } from 'class-transformer';

export class PostDto {
  @IsUUID('4')
  @IsOptional()
  @Expose()
  id?: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  title: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  message: string;
}
