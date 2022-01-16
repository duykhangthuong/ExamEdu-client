/**
 *  Convert a number into a string with Viet Nam's currency format
 * @param {int, float} number
 * @returns
 */
export function currencyFormatter(number) {
    return number.toLocaleString("en-US").replace(/,/g, ".") + " VNĐ";
}

/**
 * Name subjects to change
 * Check if a string is in the format of a positive integer
 * @param {string} numberString
 */
export function isPositiveInteger(numberString) {
    if (/^(0+)$/.test(numberString)) {
        return false;
    }
    return /^(\d+)$/.test(numberString);
}

//Courtesy of SO
/**
 *  Format a dateString to the format of MM DD YYYY
 * @param {string} dateString
 * @return A date string with the format of MM DD YYYY
 */
export function formatDateLong(dateString) {
    let date = new Date(dateString);
    let year = date.getFullYear().toString().padStart(4, "0");
    let month = (date.getMonth() + 1).toString().padStart(2, "0");
    let day = date.getDate().toString().padStart(2, "0");

    let formatedDate = new Date(year + "/" + month + "/" + day);
    let options = { year: "numeric", month: "long", day: "numeric" };

    return formatedDate.toLocaleDateString("en-US", options);
}
//yyyy-MM-DD
export function formatDateShort(dateString) {
    let date = new Date(dateString);
    let year = date.getFullYear().toString().padStart(4, "0");
    let month = (date.getMonth() + 1).toString().padStart(2, "0");
    let day = date.getDate().toString().padStart(2, "0");

    return year + "-" + month + "-" + day;
}

export function getMethodNameFromUrl(url) {
    const arrSplitByApi = url.split("/api/");
    const strAfterApi = arrSplitByApi[arrSplitByApi.length - 1];
    const arrSplitByDash = strAfterApi.split("/");

    return arrSplitByDash[0];
}
