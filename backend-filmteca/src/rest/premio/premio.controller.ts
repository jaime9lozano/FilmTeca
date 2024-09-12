import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
  UseGuards,
  HttpCode,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { PremioService } from './premio.service';
import { CreatePremioDto } from './dto/create-premio.dto';
import { UpdatePremioDto } from './dto/update-premio.dto';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { Premio } from './entities/premio.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles, RolesAuthGuard } from '../auth/guards/roles-auth.guard';
import { CacheInterceptor, CacheKey } from '@nestjs/cache-manager';
import { Generos } from '../generos/entities/genero.entity';

@Controller('premios')
@UseInterceptors(CacheInterceptor)
export class PremioController {
  private readonly logger: Logger = new Logger(PremioController.name);

  constructor(private readonly premioService: PremioService) {}

  @Get()
  @CacheKey('all_premios')
  async findAll(): Promise<Premio> {
    this.logger.log('Find all premios');
    return await this.premioService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Premio> {
    this.logger.log(`Find one premio by id:${id}`);
    return await this.premioService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  @Roles('ADMIN')
  @HttpCode(201)
  async create(@Body() createPremioDto: CreatePremioDto): Promise<Premio> {
    this.logger.log(`Create premio`);
    return await this.premioService.create(createPremioDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  @Roles('ADMIN')
  async update(
    @Param('id') id: number,
    @Body() updatePremioDto: UpdatePremioDto,
  ): Promise<Premio> {
    this.logger.log(`Update premio by id:${id}`);
    return await this.premioService.update(id, updatePremioDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  @Roles('ADMIN')
  @HttpCode(204)
  async remove(@Param('id') id: number): Promise<void> {
    this.logger.log(`Remove premio by id:${id}`);
    await this.premioService.remove(id);
  }
}
