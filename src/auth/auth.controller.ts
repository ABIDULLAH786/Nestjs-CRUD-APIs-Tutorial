import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";

// Route /auth/*
@Controller('auth')

export class AuthController {
    constructor(private authService: AuthService) { }

    // Route: /auth/signup
    @Post('signup')
    signup(@Body() dto: AuthDto) {
        return this.authService.signup(dto);
    }

    // Route: /auth/signin
    @Post('signin')
    signin(@Body() dto: AuthDto) {
        return this.authService.signin(dto);
    }

}