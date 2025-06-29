import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private usersService: UsersService,
    ) {}

    async validateOAuthLogin( email: string, name: string ) {
        const user = await this.usersService.findOrCreate({ email, name });
        const payload = { email: user.email, sub: user.id };

        return{
            acces_token: this.jwtService.sign(payload),
        }
    }
}
