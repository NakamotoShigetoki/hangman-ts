import {Letter} from "../classes/interfaces/Letter";

const FRAMES: Array<String> = [
    `#                           #
#                           #
#                           #
#                           #
#                           #
#                           #
#                           #
#                           #`,
    `#                           #
#            +---+          #
#            |   |          #
#                |          #
#                |          #
#                |          #
#                |          #
#                           #`,
    `#                           #
#            +---+          #
#            |   |          #
#            O   |          #
#                |          #
#                |          #
#                |          #
#                           #`,
    `#                           #
#            +---+          #
#            |   |          #
#            O   |          #
#            |   |          #
#                |          #
#                |          #
#                           #`,
    `#                           #
#            +---+          #
#            |   |          #
#            O   |          #
#           /|   |          #
#                |          #
#                |          #
#                           #`,
    `#                           #
#            +---+          #
#            |   |          #
#            O   |          #
#           /|\\  |          #
#                |          #
#                |          #
#                           #`,
    `#                           #
#            +---+          #
#            |   |          #
#            O   |          #
#           /|\\  |          #
#           /    |          #
#                |          #
#                           #`,
    `#                           #
#            +---+          #
#            |   |          #
#            O   |          #
#           /|\\  |          #
#           / \\  |          #
#                |          #
#                           #`
]
const HEADER: string = "########## Hangman ##########"
const EMPTYFRAME: string = "#                           #"
const FOOTER: Function = (steps: number) => `########## ${steps} steps ##########`;

const WORDFRAME = (word: string): string => {
    let spaceCalculation = 25 - word.length;
    const isEven = spaceCalculation % 2 === 0;
    // If not even, we add one space to the right side
    let lSpaces = Math.floor(spaceCalculation / 2);
    let rSpaces = isEven ? lSpaces : lSpaces + 1;
    return `# ${' '.repeat(lSpaces)}${word}${' '.repeat(rSpaces)} #`;
}

export const generateFrame = (steps: number, word: string): string => {
    return `${HEADER}\n${FRAMES[7-steps]}\n${EMPTYFRAME}\n${WORDFRAME(word)}\n${FOOTER(steps)}`
}