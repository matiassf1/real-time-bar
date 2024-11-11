import { IsInt, Min, Max, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class PaginationDto {
    @IsOptional()
    @IsInt()
    @Min(1)
    @Transform(({ value }) => (value ? parseInt(value, 10) : 1), { toClassOnly: true }) // Ensure default to 1
    page?: number;

    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(100)
    @Transform(({ value }) => (value ? parseInt(value, 10) : 10), { toClassOnly: true }) // Ensure default to 10
    limit?: number;
}
