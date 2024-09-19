import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  Logger,
  UseGuards,
  HttpCode,
  Put,
  ParseIntPipe,
} from '@nestjs/common';
import { ActorService } from './actor.service';
import { CreateActorDto } from './dto/create-actor.dto';
import { UpdateActorDto } from './dto/update-actor.dto';
import { CacheInterceptor, CacheKey } from '@nestjs/cache-manager';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { Actor } from './entities/actor.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles, RolesAuthGuard } from '../auth/guards/roles-auth.guard';
import { Generos } from '../generos/entities/genero.entity';

@Controller('actores')
@UseInterceptors(CacheInterceptor)
export class ActorController {
  private readonly logger: Logger = new Logger(ActorController.name);

  constructor(private readonly actorService: ActorService) {}

  @Get()
  async findAll(): Promise<Actor> {
    this.logger.log('Find all actores');
    return await this.actorService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Actor> {
    this.logger.log(`Find one actor by id:${id}`);
    return await this.actorService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  @Roles('SUPERUSER')
  @HttpCode(201)
  async create(@Body() createActorDto: CreateActorDto): Promise<Actor> {
    this.logger.log(`Create actor`);
    return await this.actorService.create(createActorDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  @Roles('ADMIN')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateActorDto: UpdateActorDto,
  ): Promise<Actor> {
    this.logger.log(`Update actor by id:${id}`);
    return await this.actorService.update(id, updateActorDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  @Roles('ADMIN')
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    this.logger.log(`Remove actor by id:${id}`);
    await this.actorService.remove(id);
  }
}
