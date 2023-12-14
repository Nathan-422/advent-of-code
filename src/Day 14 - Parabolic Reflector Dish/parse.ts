import { readFileSync } from 'node:fs'
function shiftBoldersLeft(platform: string[]): string[] {
	return platform.map(line => {
		return line.split('#').map(seg => {
			if (seg.length === 0) return ''
			const leftShiftedBolders = [...seg].reduce((accu, current) => {
				const value = current === 'O' ? current + accu : accu + current
				return value
			})
			return leftShiftedBolders
		}).join('#')
	})
}



const testFile = './test.txt'
const dataFile = './data.txt'

const data = readFileSync(dataFile, 'utf8').split("\n").filter((line) => line !== "")
const test = readFileSync(testFile, 'utf8').split("\n").filter((line) => line !== "")

const input = test
console.log(input.join('\n'))
console.log()
console.log(shiftBoldersLeft(input).join('\n'))

