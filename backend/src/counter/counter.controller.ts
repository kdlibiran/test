import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CounterService } from './counter.service';

@ApiTags('counter')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
@Controller('counter')
export class CounterController {
  constructor(private readonly counterService: CounterService) {}

  @ApiOperation({ summary: 'Get current counter value (auth required)' })
  @Get()
  getCurrent(@Req() req: any) {
    const userId = req.user.userId;
    return this.counterService.getCurrent(userId);
  }

  @ApiOperation({
    summary: 'Increment counter and broadcast over WebSockets (auth required)',
  })
  @Post('increment')
  increment(@Req() req: any) {
    const userId = req.user.userId;
    return this.counterService.increment(userId);
  }

  @ApiOperation({
    summary: 'Decrement counter and broadcast over WebSockets (auth required)',
  })
  @Post('decrement')
  decrement(@Req() req: any) {
    const userId = req.user.userId;
    return this.counterService.decrement(userId);
  }
}
