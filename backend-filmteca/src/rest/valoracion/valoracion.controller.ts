import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Logger,
  Query,
  UseGuards,
  HttpCode,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { ValoracionService } from './valoracion.service';
import { CreateValoracionDto } from './dto/create-valoracion.dto';
import { UpdateValoracionDto } from './dto/update-valoracion.dto';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { Valoracion } from './entities/valoracion.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles, RolesAuthGuard } from '../auth/guards/roles-auth.guard';

@Controller('valoraciones')
export class ValoracionController {
  private readonly logger: Logger = new Logger(ValoracionController.name);

  constructor(private readonly valoracionService: ValoracionService) {}

  @Get()
  async findAll(
    @Paginate() query: PaginateQuery,
  ): Promise<Paginated<Valoracion>> {
    this.logger.log('Sacando todas las valoraciones');
    return await this.valoracionService.findAll(query);
  }

  @Get(':id/pelicula')
  async findAllByPelicula(
    @Paginate() query: PaginateQuery,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Paginated<Valoracion>> {
    this.logger.log('Sacando todas las valoraciones de una pelicula.');
    return await this.valoracionService.findAllByPelicula(query, id);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Valoracion> {
    this.logger.log(`Find one valoracion by id:${id}`);
    return await this.valoracionService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  @Roles('USER')
  @HttpCode(201)
  async create(
    @Body() createValoracionDto: CreateValoracionDto,
    @Body('userId', ParseIntPipe) userId: number,
  ): Promise<Valoracion> {
    this.logger.log(`Create valoracion`);
    return await this.valoracionService.create(createValoracionDto, userId);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  @Roles('USER')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateValoracionDto: UpdateValoracionDto,
  ): Promise<Valoracion> {
    this.logger.log(`Update Valoracion by id:${id}`);
    return await this.valoracionService.update(id, updateValoracionDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  @Roles('USER')
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    this.logger.log(`Remove valoracion by id:${id}`);
    await this.valoracionService.remove(id);
  }
}
