import * as readline from 'node:readline/promises';
import * as config from '../assets/config';
import {Letter} from "./interfaces/Letter";
import {generateFrame} from "../assets/frames";
import {GameStatus} from "./enums/GameStatus";

export class GameManager {
    private _readline: readline.Interface
    private static _instance: GameManager;
    private word: Letter[];
    private alreadyGuessed: Set<string>;
    private stepsLeft: number;

    private constructor() {
        console.clear();
        this._readline = readline.createInterface({input: process.stdin, output: process.stdout});
        this.stepsLeft = config.steps;
        this.word = [];
        this.alreadyGuessed = new Set<string>();
        this.startGame().then(); // IDE complains about not awaiting, but we can't await here (constructor)
    }

    public static get instance(): GameManager {
        if (!GameManager._instance) {
            GameManager._instance = new GameManager();
        }
        return GameManager._instance;
    }

    private async ask(question: string): Promise<string> {
        return await this._readline.question(question);
    }

    private async chooseWord(): Promise<string> {
        let dictionaryOrNot = await this.ask('Do you want to use the default dictionary? (Y/n) ');
        if (dictionaryOrNot === '') {
            return config.dictionary[Math.floor(Math.random() * config.dictionary.length)];
        }
        while (dictionaryOrNot !== 'y' && dictionaryOrNot !== 'n') {
            console.log('Please enter y or n');
            dictionaryOrNot = await this.ask('Do you want to use the default dictionary? (Y/n) ');
        }
        switch (dictionaryOrNot) {
            case 'y':
                return config.dictionary[Math.floor(Math.random() * config.dictionary.length)];
            case 'n':
                let word = await this.ask('Enter a word: ');
                while (word.length < config.wordConstraints.min || word.length > config.wordConstraints.max) {
                    console.log(`Word must be between ${config.wordConstraints.min} and ${config.wordConstraints.max} characters long`);
                    word = await this.ask('Enter a word: ');
                }
                return word;
        }
    }

    private async initWord(word: string): Promise<void> {
        for (let i = 0; i < word.length; i++) {
            this.word.push({
                letter: word[i],
                status: false
            });
        }
    }

    private async printWord(): Promise<string> {
        let word = '';
        for (let i = 0; i < this.word.length; i++) {
            if (this.word[i].status) {
                word += this.word[i].letter;
            } else {
                word += '_';
            }
        }
        return word;
    }

    private async checkLetter(letter: string): Promise<boolean> {
        let toReturn = false;
        for (let i = 0; i < this.word.length; i++) {
            if (this.word[i].letter.toLowerCase() === letter.toLowerCase()) {
                this.word[i].status = true;
                toReturn = true;
                this.alreadyGuessed.add(letter.toLowerCase());
            }
        }
        return toReturn;
    }

    private async checkWin(): Promise<boolean> {
        return this.word.every((letter) => letter.status);
    }

    private async checkLose(): Promise<boolean> {
        return this.stepsLeft === 0;
    }

    private async printStatus(): Promise<void> {
        console.clear();
        console.log(`${generateFrame(this.stepsLeft, await this.printWord())}\n`);
    }

    // I need to say the user if they already guessed the letter
    private async play(status: GameStatus = GameStatus.OK): Promise<void> {
        await this.printStatus();
        switch (status) {
            case GameStatus.MORE_THAN_ONE_LETTER:
                console.log('Please enter only one letter');
                break;
            case GameStatus.ALREADY_GUESSED:
                console.log('You already guessed this letter');
                break;
        }
        let letter = await this.ask('Enter a letter: ');
        if(letter.length > 1) {
            await this.play(GameStatus.MORE_THAN_ONE_LETTER);
        }
        if(this.alreadyGuessed.has(letter.toLowerCase())) {
            await this.play(GameStatus.ALREADY_GUESSED);
        }
        if (!await this.checkLetter(letter)) {
            this.stepsLeft--;
        }
        if (await this.checkWin()) {
            await this.printStatus();
            console.log('You win!');
            process.exit();
            return; // Should be unreachable
        }
        if (await this.checkLose()) {
            await this.printStatus();
            console.log('You lose!');
            process.exit();
            return; // Should be unreachable
        }
        await this.play(GameStatus.OK);
    }

    private async startGame(): Promise<void> {
        let word = await this.chooseWord();
        await this.initWord(word);
        await this.play();
    }
}