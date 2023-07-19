import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const ioAdapter = new IoAdapter(app);

	app.setGlobalPrefix(`api`);
	app.enableCors({
		origin: true, // ou définissez une liste d'origines autorisées ['http://example.com', 'http://localhost:3000']
		methods: ['GET', 'POST', 'PUT', 'DELETE'],
		allowedHeaders: ['Content-Type', 'Authorization'],
		credentials: true,
	});
	app.useWebSocketAdapter(ioAdapter);
	await app.listen(8000);
}
bootstrap();
