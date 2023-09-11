import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'; //generator api doc


async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const ioAdapter = new IoAdapter(app);

	///////////////// generer doc API auto
	const config = new DocumentBuilder()
		.setTitle('Documentation API PONGPOD')
		.setDescription('Simplement nos routes API')
		.setVersion('0.1')
		.addTag('USERS')
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, document);

/////////////////////////////

	app.setGlobalPrefix(`api`);
	app.enableCors({
		origin: 'http://localhost:3000', // ou définissez une liste d'origines autorisées ['http://example.com', 'http://localhost:3000']
		methods: ['GET', 'POST', 'PUT', 'DELETE'],
		allowedHeaders: ['Content-Type', 'Authorization'],
		credentials: true,
	});
	app.useWebSocketAdapter(ioAdapter);
	await app.listen(8000, '0.0.0.0');
}
bootstrap();
