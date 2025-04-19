import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashsService {
  constructor(private readonly configService: ConfigService) {}

  hash(str: string): Promise<string> {
    return bcrypt.hash(str, Number(this.configService.get('HASH_ROUNDS')));
  }

  compare(str: string, hash: string): Promise<boolean> {
    return bcrypt.compare(str, hash);
  }
}
