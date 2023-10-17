import {BadRequestException} from "@nestjs/common";

export function checkLimitID(nb: number) {
	if (nb > 2147483647 || nb < -2147483648)
		throw new BadRequestException('There is no such high ID')
}