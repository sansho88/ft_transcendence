import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
	(data: string | undefined, ctx: ExecutionContext) => {
		const user = ctx.switchToHttp().getRequest().user;
		if (!user) return undefined;
		return data ? user[data] : user;
	},
);
