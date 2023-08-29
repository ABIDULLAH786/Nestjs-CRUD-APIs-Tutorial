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

        delete user.hash; // to remove the hash before sending response to client

        return { status: 'success', statusCode: HttpStatus.OK, msg: "Successfully sign in", data: user }
    }
}