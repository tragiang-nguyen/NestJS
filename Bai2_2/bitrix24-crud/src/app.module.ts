import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ContactsModule } from './contacts/contacts.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [() => process.env],
    }),
    ContactsModule,
  ],
})
export class AppModule {}