import { readFileSync } from 'node:fs'
const testFile = './test.txt'
const dataFile = './data.txt'

const data = readFileSync(dataFile, 'utf8').split('\n')[0].split(',').map(line => { return line.split('') })
const test = readFileSync(testFile, 'utf8').split('\n')[0].split(',').map(line => { return line.split('') })

const input = data
console.log(input)
const letterToNumberCache = new Map<string, number>()

function getCharValue(character: string): number {
	const number = character.charCodeAt(0)
	return number
}

function manipulateValue(current: number, newVal: number) {
	const added = current + newVal
	const multiplied = added * 17
	const remainder = multiplied % 256
	return remainder
}

const initValues = input.map(val => {
	return val.reduce((accu, char) => {
		const number = getCharValue(char)
		return manipulateValue(accu, number)
	}, 0)
})

console.log(initValues)

console.log(initValues.reduce((sum, val) => {
	return sum + val
}))
