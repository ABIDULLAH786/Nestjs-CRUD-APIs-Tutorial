import { Controller, Get, HttpStatus, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtGuard } from 'src/auth/guard';

@Controller('users')
export class UsersController {
    // Get: users/me
    @UseGuards(JwtGuard)  // protecting route
    @Get('/me')
    getMe(@Req() req: Request) {
        return { status: 'success', statusCode: HttpStatus.ACCEPTED, data: req.user }

    }
}
