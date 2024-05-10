import { IsArray, IsDateString, IsMilitaryTime, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateSongDTO {
  @IsString()
  @IsOptional()
  readonly title: string;

  @IsOptional()
  @IsNumber({}, { each: true })
  readonly artists: number[];

  @IsOptional()
  @IsDateString()
  readonly releasedDate: Date;

  @IsMilitaryTime()
  @IsOptional()
  readonly duration: Date;

  @IsString()
  @IsOptional()
  readonly lyrics: string;
}