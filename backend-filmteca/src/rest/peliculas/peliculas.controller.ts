import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Param,
  Body,
  Req,
  UploadedFile,
  UseInterceptors,
  HttpCode,
  Logger,
} from '@nestjs/common';
import { CacheInterceptor, CacheKey } from '@nestjs/cache-manager';
import { FileInterceptor } from '@nestjs/platform-express';
import { parse, extname } from 'path';
import { Request } from 'express';
import { diskStorage } from 'multer';
import { CreatePeliculaDto } from './dto/create-pelicula.dto';
import { UpdatePeliculaDto } from './dto/update-pelicula.dto';
import { Pelicula } from './entities/pelicula.entity';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { PeliculasService } from './peliculas.service';

@Controller('peliculas')
@UseInterceptors(CacheInterceptor)
export class PeliculasController {
  private readonly logger: Logger = new Logger(PeliculasController.name);

  constructor(private readonly peliculasService: PeliculasService) {}

  @Get()
  @CacheKey('all_peliculas')
  async findAll(
    @Paginate() query: PaginateQuery,
  ): Promise<Paginated<Pelicula>> {
    this.logger.log('Find all peliculas');
    return await this.peliculasService.findAll(query);
  }

  @Get(':id')
  //@ApiNotFoundResponse({ description: 'PeliculaEntity no encontrada' })
  async findOne(@Param('id') id: number): Promise<Pelicula> {
    this.logger.log(`Find one pelicula by id:${id}`);
    return await this.peliculasService.findOne(id);
  }

  @Post()
  //@UseGuards(JwtAuthGuard, RolesAuthGuard)
  //@Roles('ADMIN')
  //@ApiBearerAuth()
  @HttpCode(201)
  async create(
    @Body() createPeliculaDto: CreatePeliculaDto,
  ): Promise<Pelicula> {
    this.logger.log(`Create pelicula`);
    return await this.peliculasService.create(createPeliculaDto);
  }

  @Put(':id')
  //@ApiBearerAuth()
  //@UseGuards(JwtAuthGuard, RolesAuthGuard)
  //@Roles('ADMIN')
  async update(
    @Param('id') id: number,
    @Body() updatePeliculaDto: UpdatePeliculaDto,
  ): Promise<Pelicula> {
    this.logger.log(`Update pelicula by id:${id}`);
    return await this.peliculasService.update(id, updatePeliculaDto);
  }

  @Delete(':id')
  //@UseGuards(JwtAuthGuard, RolesAuthGuard)
  //@ApiBearerAuth()
  //@Roles('ADMIN')
  @HttpCode(204)
  async remove(@Param('id') id: number): Promise<void> {
    this.logger.log(`Remove pelicula by id:${id}`);
    await this.peliculasService.remove(id);
  }

  @Patch(':id/imagen')
  //@UseGuards(JwtAuthGuard, RolesAuthGuard)
  //@ApiBearerAuth()
  //@Roles('ADMIN')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: process.env.UPLOADS_DIR || './storage-dir',
        filename: (_req, file, cb) => {
          const { name } = parse(file.originalname);
          const fileName = `${Date.now()}_${name.replace(/\s/g, '')}`;
          const fileExt = extname(file.originalname);
          cb(null, `${fileName}${fileExt}`);
        },
      }),
    }),
  )
  async updateImage(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ): Promise<Pelicula> {
    this.logger.log(`Actualizando imagen de la pelicula con id: ${id}`);
    return await this.peliculasService.updateImage(id, file, req);
  }
}
