import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import axios from 'axios';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/google/callback', // Update this as needed
      passReqToCallback: true,
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) {
    try {
      const user = {
        id: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
        picture: profile.photos[0].value
      };
      done(null, user);
    } catch (err) {
      done(err, false);
    }
  }

  async validateToken(token: string) {
    const url = `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${token}`;
    const response = await axios.get(url);
    return response.data;
  }
}
