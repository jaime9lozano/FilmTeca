import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  Logger,
  UseGuards,
  HttpCode,
  Put,
} from '@nestjs/common';
import { GenerosService } from './generos.service';
import { CreateGeneroDto } from './dto/create-genero.dto';
import { UpdateGeneroDto } from './dto/update-genero.dto';
import { CacheInterceptor, CacheKey } from '@nestjs/cache-manager';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { Generos } from './entities/genero.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles, RolesAuthGuard } from '../auth/guards/roles-auth.guard';

@Controller('generos')
@UseInterceptors(CacheInterceptor)
export class GenerosController {
  private readonly logger: Logger = new Logger(GenerosController.name);

  constructor(private readonly generosService: GenerosService) {}

  @Get()
  @CacheKey('all_generos')
  async findAll(@Paginate() query: PaginateQuery): Promise<Paginated<Generos>> {
    this.logger.log('Find all generos');
    return await this.generosService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Generos> {
    this.logger.log(`Find one genero by id:${id}`);
    return await this.generosService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  @Roles('ADMIN')
  @HttpCode(201)
  async create(@Body() createGeneroDto: CreateGeneroDto): Promise<Generos> {
    this.logger.log(`Create genero`);
    return await this.generosService.create(createGeneroDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  @Roles('ADMIN')
  async update(
    @Param('id') id: number,
    @Body() updateGeneroDto: UpdateGeneroDto,
  ): Promise<Generos> {
    this.logger.log(`Update genero by id:${id}`);
    return await this.generosService.update(id, updateGeneroDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  @Roles('ADMIN')
  @HttpCode(204)
  async remove(@Param('id') id: number): Promise<void> {
    this.logger.log(`Remove genero by id:${id}`);
    await this.generosService.remove(id);
  }
}
