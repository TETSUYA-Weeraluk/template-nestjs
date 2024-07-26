import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { BackendModuleModule } from './backend/backend.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ConfigModule.forRoot(), BackendModuleModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
