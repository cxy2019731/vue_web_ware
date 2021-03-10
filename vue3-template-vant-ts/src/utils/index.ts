
/**
 * 随机16进制颜色 hexColor
 * 方法一
 */

export function hexColor(): string {
    let str = "#";
    let arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "A", "B", "C", "D", "E", "F"];
    for (let i = 0; i < 6; i++) {
        let index = Number.parseInt((Math.random() * 16).toString());
        str += arr[index];
    }
    return str;
}
/**
 * 随机16进制颜色 randomHexColorCode
 * 方法二
 */
export const randomHexColorCode = (): string => {
    let n = (Math.random() * 0xfffff * 1000000).toString(16);
    return "#" + n.slice(0, 6);
};