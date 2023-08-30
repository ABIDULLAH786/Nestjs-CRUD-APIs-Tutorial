import { ExecutionContext, createParamDecorator } from "@nestjs/common";

export const GetUser = createParamDecorator(
    (data: string | undefined, ctx: ExecutionContext) => {
        const request: Express.Request = ctx
            .switchToHttp()
            .getRequest()
        
        if (data) {
            return request.user[data] // to return a specific value from user object that is asked for
        }
        return request.user;    // return whole object 
    } 
)