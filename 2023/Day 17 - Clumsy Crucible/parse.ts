import { readFileSync } from 'node:fs'
import { Dir, Pos } from '../grid-traversal.js'
const testFile = './test.txt'
const dataFile = './data.txt'

const data = readFileSync(dataFile, 'utf8').split("\n").filter((line) => line !== "")
const test = readFileSync(testFile, 'utf8').split("\n").filter((line) => line !== "")

const input = test
console.log(input)

class Node {

	pos: Pos
	dir: Dir

	Node() {

	}

}
