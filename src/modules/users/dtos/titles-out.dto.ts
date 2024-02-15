import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { Expose, Type } from 'class-transformer';

export class TitlesOutDto {
  @IsString()
  @IsNotEmpty()
  @Expose()
  email: string;

  @IsArray()
  @Type(() => String)
  @IsNotEmpty()
  @Expose()
  titles: string;
}
