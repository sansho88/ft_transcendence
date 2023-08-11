import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';



async function bootstrap() {
	const app = await NestFactory.create(AppModule);

/////////////////////////////

	app.setGlobalPrefix(`api`);
	app.enableCors({
		origin: true, // ou définissez une liste d'origines autorisées ['http://example.com', 'http://localhost:3000']
		methods: ['GET', 'POST', 'PUT', 'DELETE'],
		allowedHeaders: ['Content-Type', 'Authorization'],
		credentials: true,
	});
	await app.listen(8000);
}
bootstrap();