import { Controller, Get, HttpStatus, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';

import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';

@Controller('users')
export class UsersController {
    // Get: users/me
    @UseGuards(JwtGuard)  // protecting route
    @Get('/me')
    getMe(@GetUser() user: User, @GetUser('email') email: string) {
        // this was just for testing purposes that how we can get a single value by passing it as a parameter to decorator
        // console.log(email) 
        return { status: 'success', statusCode: HttpStatus.ACCEPTED, data: user }

    }
}
