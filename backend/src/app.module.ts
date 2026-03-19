// import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
// import { AuthModule } from './auth/auth.module';
// import { ConfigModule, ConfigService } from '@nestjs/config';
 
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { ChatModule } from './chat/chat.module';


// @Module({
//    imports: [
//     ConfigModule.forRoot({ isGlobal: true }),

//     TypeOrmModule.forRootAsync({
//       inject: [ConfigService],
//       useFactory: (config: ConfigService) => ({
//         type: 'mysql',
//         url: config.get('DATABASE_URL'),
//         autoLoadEntities: true,
//         driver: require('mysql2'),
//       }),
//     }),
//      AuthModule,
//     ChatModule
//   ],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule {}
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',                    // نوع قاعدة البيانات
        url: config.get('DATABASE_URL'),   // رابط الاتصال
        autoLoadEntities: true,
        synchronize: true,                 // أنشئ الجداول تلقائياً (للتطوير فقط)
        entities: [__dirname + '/**/*.entity{.ts,.js}'], // شمل كل الـ entities
      }),
    }),
    AuthModule,
    ChatModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}