import { Body, Controller, Logger, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserSignUpDto } from './dto/update-auth.dto';
import { UserSignInDto } from './dto/create-auth.dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async singUp(@Body() userSignUpDto: UserSignUpDto) {
    this.logger.log(`singUp: ${JSON.stringify(userSignUpDto)}`);
    return await this.authService.singUp(userSignUpDto);
  }

  @Post('login')
  async singIn(@Body() userSignInDto: UserSignInDto) {
    this.logger.log(`singIn: ${JSON.stringify(userSignInDto)}`);
    return await this.authService.singIn(userSignInDto);
  }
}
