import { ForbiddenException, HttpStatus, Injectable } from "@nestjs/common";
import { AuthDto } from "./dto";
import * as argon from "argon2"
import { PrismaService } from "src/prisma/prisma.service";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

@Injectable({})

export class AuthService {
    constructor(private prisma: PrismaService) { }
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
            delete user.hash;
            return { status: 'success', statusCode: HttpStatus.CREATED, msg: "Successfully sign up", data: user }

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

    signin() {
        return { status: 'success', statusCode: HttpStatus.OK, msg: "This is sign in api" }
    }
}