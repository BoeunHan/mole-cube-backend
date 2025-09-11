import { Module } from '@nestjs/common';
import { GameGateway } from './gateway/game.gateway';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
  ],
  providers: [GameGateway],
})
export class AppModule {}
