import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import GammaAPI from 'polymarket-provider';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const gammaApi = GammaAPI();

  const config = new DocumentBuilder() 
    .setTitle('CTB Copy Trading API')
    .setDescription(
      'API used by the frontend: dashboard stats, followers (add/update/remove), alerts, weekly reports, comparative analysis, and Polymarket activity.',
    )
    .setVersion('1.0')
    .addTag('Dashboard', 'Real-time stats, recent trades, weekly reports, comparative analysis')
    .addTag('Followers (Followed Wallets)', 'List, add, update (active/inactive), remove followers')
    .addTag('Alerts', 'Performance alerts and mark-as-read')
    .addTag('Polymarket', 'Trade activity by wallet address')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  app.enableCors({ origin: true }); // allow frontend (Next.js) to call API
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
