import { ForbiddenException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JwtService } from "@nestjs/jwt";
import * as argon from "argon2"

import { AuthDto } from "./dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable({})

export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
        private config: ConfigService
    ) { }
    async signup(dto: AuthDto) {
        try {
            const hash = await argon.hash(dto.password);
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    name: dto.name,
                    hash
                }
            })
            // delete user.hash;
            return { status: 'success', statusCode: HttpStatus.CREATED, msg: "Successfully sign up" }

        } catch (error) {
            // checks if the error comes from prisma
            if (error instanceof PrismaClientKnownRequestError) {
                // check if the error is of unique violation 
                if (error.code === 'P2002') {
                    throw new ForbiddenException("Credentials already taken")
                }
            }

            throw error;
        }
    }

    async signin(dto: AuthDto) {

        const user = await this.prisma.user.findUnique({
            where: { email: dto.email }
        })

        if (!user) {
            throw new ForbiddenException("Invalid Credentials");
        }

        const passMatches = await argon.verify(user.hash, dto.password)
        if (!passMatches) {
            throw new ForbiddenException("Invalid Credentials");
        }

        // delete user.hash; // to remove the hash before sending response to client
        return { status: 'success', statusCode: HttpStatus.OK, msg: "Successfully sign in", access_token: await this.signToken(user.id, user.email) }
    }

    async signToken(id: string, email: string) {
        const payload = {
            sub: id,
            email
        }
        const secret = this.config.get("JWT_SECRET")
        return await this.jwt.signAsync(payload, {
            expiresIn: "15m",
            secret: secret,
        })
    }
}