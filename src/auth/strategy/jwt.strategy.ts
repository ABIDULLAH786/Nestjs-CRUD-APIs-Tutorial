import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

import { PrismaService } from "src/prisma/prisma.service";

@Injectable({})
export class JwtStrategy extends PassportStrategy(
    Strategy,
    'jwt'  // this will link the user protected route by using UseGuard there
) {
    constructor(config: ConfigService, private prisma: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            // ignoreExpiration: false,
            secretOrKey: config.get("JWT_SECRET")
        });
    }

    async validate(payload: { sub: string, email: string }) {
        const user = await this.prisma.user.findUnique({
            where: { id: payload.sub }
        })
        delete user.hash;
        
        return user;
    }
}