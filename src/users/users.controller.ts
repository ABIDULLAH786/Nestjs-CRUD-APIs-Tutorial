import { Controller, Get, HttpStatus, UseGuards } from '@nestjs/common';

import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';

@Controller('users')
export class UsersController {
    // Get: users/me
    @UseGuards(JwtGuard)  // protecting route
    @Get('/me')
    getMe(@GetUser() user) {
        return { status: 'success', statusCode: HttpStatus.ACCEPTED, data: user }

    }
}
