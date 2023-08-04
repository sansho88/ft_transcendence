
export enum Colors {
    "grey",
    "green",
    "gold"
}

export function getEnumNameByIndex(enumObj: any, index: number): string { //useful for userStatus
    const enumKeys = Object.keys(enumObj).filter((key) => typeof enumObj[key] === 'number');
    const enumValues = enumKeys.map((key) => enumObj[key]);

    if (enumValues.includes(index)) {
        return enumKeys[enumValues.indexOf(index)];
    }

    return "";
}