import { AuthCredentialsDto } from './auth-credentials.dto';
import { PickType } from '@nestjs/swagger';

export class AuthLoginDto extends PickType(AuthCredentialsDto, ['email', 'password']) {}