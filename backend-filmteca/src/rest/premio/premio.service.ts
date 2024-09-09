import { Injectable } from '@nestjs/common';
import { CreatePremioDto } from './dto/create-premio.dto';
import { UpdatePremioDto } from './dto/update-premio.dto';

@Injectable()
export class PremioService {
  create(createPremioDto: CreatePremioDto) {
    return 'This action adds a new premio';
  }

  findAll() {
    return `This action returns all premio`;
  }

  findOne(id: number) {
    return `This action returns a #${id} premio`;
  }

  update(id: number, updatePremioDto: UpdatePremioDto) {
    return `This action updates a #${id} premio`;
  }

  remove(id: number) {
    return `This action removes a #${id} premio`;
  }
}
