import { PaginatedResponseDto } from "src/application/dto/paginate/paginated-response.dto";
import { PaginatedResponse } from "src/domain/entities/paginated-response.entity";

export class PaginatedResponseMapper {

static toPaginatedDto<T, R>(
    result: PaginatedResponse<T>,
    mapFn: (item: T) => R
  ): PaginatedResponseDto<R> {
    return {
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
      data: result.data.map(mapFn),
    };
  }

  static async toPaginatedDtoAsync<T, R>(
    result: PaginatedResponse<T>,
    mapFn: (item: T) => Promise<R>,
  ): Promise<PaginatedResponseDto<R>> {
    const data = await Promise.all(result.data.map(mapFn));
    return {
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
      data,
    };
  }
}