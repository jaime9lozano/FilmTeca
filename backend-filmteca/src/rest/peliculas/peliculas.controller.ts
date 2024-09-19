import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
  HttpCode,
  Logger,
  UseGuards,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreatePeliculaDto } from './dto/create-pelicula.dto';
import { UpdatePeliculaDto } from './dto/update-pelicula.dto';
import { Pelicula } from './entities/pelicula.entity';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { PeliculasService } from './peliculas.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles, RolesAuthGuard } from '../auth/guards/roles-auth.guard';
import { Express } from 'express';

@Controller('peliculas')
export class PeliculasController {
  private readonly logger: Logger = new Logger(PeliculasController.name);

  constructor(private readonly peliculasService: PeliculasService) {}

  @Get()
  async findAll(
    @Paginate() query: PaginateQuery,
  ): Promise<Paginated<Pelicula>> {
    this.logger.log('Find all peliculas');
    return await this.peliculasService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Pelicula> {
    this.logger.log(`Find one pelicula by id:${id}`);
    return await this.peliculasService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  @Roles('SUPERUSER')
  @HttpCode(201)
  async create(
    @Body() createPeliculaDto: CreatePeliculaDto,
  ): Promise<Pelicula> {
    this.logger.log(`Create pelicula`);
    return await this.peliculasService.create(createPeliculaDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  @Roles('ADMIN')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePeliculaDto: UpdatePeliculaDto,
  ): Promise<Pelicula> {
    this.logger.log(`Update pelicula by id:${id}`);
    return await this.peliculasService.update(id, updatePeliculaDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  @Roles('ADMIN')
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    this.logger.log(`Remove pelicula by id:${id}`);
    await this.peliculasService.remove(id);
  }

  @Patch(':id/imagen')
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  @Roles('ADMIN')
  @UseInterceptors(
    FileInterceptor('file', {
      // No es necesario configurar almacenamiento aquí porque el archivo se enviará como buffer a Cloudinary
      // Solo se requiere el fileFilter para validar el tipo de archivo
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          cb(new BadRequestException('Fichero no soportado.'), false);
        } else {
          cb(null, true);
        }
      },
    }),
  )
  async updateImage(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Pelicula> {
    this.logger.log(`Actualizando imagen de la película con id: ${id}`);

    if (!file) {
      throw new BadRequestException('No se proporcionó ninguna imagen');
    }

    return await this.peliculasService.updateImage(id, file);
  }
}
