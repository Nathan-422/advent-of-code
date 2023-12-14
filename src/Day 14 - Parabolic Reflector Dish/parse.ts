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

function rotate(matrix: string[], rotation: Rotation): string[] {
	if (rotation === Rotation.full) {
		return matrix
	}

	const rotatedMatrix = new Array<string>(matrix[0].length).fill('')
	for (let i = 0; i < rotatedMatrix.length; i++) {
		for (let j = 0; j < matrix.length; j++) {
			rotatedMatrix[i] = rotatedMatrix[i].concat(matrix[matrix.length - 1 - j][i])
		}
	}

	return rotate(rotatedMatrix, rotation - 1)
}

function score(platform: string[]): number {
	return platform.map((line) => {
		return line.replace(/\./g, '').replace(/#/g, '')
	}).reduce((total, value, i, arr) => {
		console.log(`Line: ${arr.length - i}. Count: ${value}`)
		return total + (value.length * (arr.length - i))
	}, 0)
}

enum Rotation {
	full,
	ninty,
	oneEighty,
	twoSeventy
}

const testFile = './test.txt'
const dataFile = './data.txt'

const data = readFileSync(dataFile, 'utf8').split("\n").filter((line) => line !== "")
const test = readFileSync(testFile, 'utf8').split("\n").filter((line) => line !== "")

const input = data
console.log(input.join('\n'))
console.log()

const boldersMovedNorth = rotate(shiftBoldersLeft(rotate(input, Rotation.twoSeventy)), Rotation.ninty)
console.log(boldersMovedNorth.join('\n'))
console.log(score(boldersMovedNorth))
