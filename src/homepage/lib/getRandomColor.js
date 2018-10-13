// @flow

/**
 * Credits to Paul Irish:
 * https://www.paulirish.com/2009/random-hex-color-code-snippets
 * */

export default function getRandomColor(): string {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`
}
