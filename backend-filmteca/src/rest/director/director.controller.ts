import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
  UseInterceptors,
  UseGuards,
  HttpCode,
  Put,
} from '@nestjs/common';
import { DirectorService } from './director.service';
import { CreateDirectorDto } from './dto/create-director.dto';
import { UpdateDirectorDto } from './dto/update-director.dto';
import { CacheInterceptor, CacheKey } from '@nestjs/cache-manager';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { Director } from './entities/director.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles, RolesAuthGuard } from '../auth/guards/roles-auth.guard';
import { Generos } from '../generos/entities/genero.entity';

@Controller('directores')
@UseInterceptors(CacheInterceptor)
export class DirectorController {
  private readonly logger: Logger = new Logger(DirectorController.name);

  constructor(private readonly directorService: DirectorService) {}

  @Get()
  @CacheKey('all_directores')
  async findAll(): Promise<Director> {
    this.logger.log('Find all directores');
    return await this.directorService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Director> {
    this.logger.log(`Find one director by id:${id}`);
    return await this.directorService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  @Roles('ADMIN')
  @HttpCode(201)
  async create(
    @Body() createDirectorDto: CreateDirectorDto,
  ): Promise<Director> {
    this.logger.log(`Create director`);
    return await this.directorService.create(createDirectorDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  @Roles('ADMIN')
  async update(
    @Param('id') id: number,
    @Body() updateDirectorDto: UpdateDirectorDto,
  ): Promise<Director> {
    this.logger.log(`Update director by id:${id}`);
    return await this.directorService.update(id, updateDirectorDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  @Roles('ADMIN')
  @HttpCode(204)
  async remove(@Param('id') id: number): Promise<void> {
    this.logger.log(`Remove director by id:${id}`);
    await this.directorService.remove(id);
  }
}
