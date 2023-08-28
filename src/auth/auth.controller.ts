import { Controller, Get, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";

// Route /auth/*
@Controller('auth')

export class AuthController{
    constructor(private authService: AuthService) { }
    
    // Route: /auth/signup
    @Post('signup')
    signup() {
        return this.authService.signup();
    }

    // Route: /auth/signin
    @Post('signin')
    signin() {
        return this.authService.signin();
    }
    
}