import { HttpStatus, Injectable } from "@nestjs/common";


@Injectable({})

export class AuthService {
    signup() {
        return { status: 'success', statusCode: HttpStatus.CREATED, msg: "This is sign up api" }
    }

    signin() {
        return { status: 'success', statusCode: HttpStatus.OK, msg: "This is sign in api" }
    }
}