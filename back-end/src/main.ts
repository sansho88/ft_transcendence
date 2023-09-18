import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'; //generator api doc

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
			/////////		Auto api doc on localhost:8000
	const config = new DocumentBuilder()
		.setTitle('Documentation API PONGPOD')
		.setDescription('Simplement nos routes API')
		.setVersion('1.0')
		.addTag('USERS')
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, document);
			/////////
	app.enableCors({
		origin: true, // ou définissez une liste d'origines autorisées ['http://example.com', 'http://localhost:3000']
		methods: ['GET', 'POST', 'PUT'],
		allowedHeaders: ['Content-Type', 'Authorization'],
		credentials: true,
	});
			/////////
	app.setGlobalPrefix(`api`);
	await app.listen(8000, '0.0.0.0');
}
bootstrap();
