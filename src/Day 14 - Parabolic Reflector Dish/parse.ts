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
			rotatedMatrix[i] = rotatedMatrix[i].concat(matrix[j][matrix[0].length - 1 - i])
		}
	}

	return rotate(rotatedMatrix, rotation - 1)
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

const testArray = [
	'ABCD',
	'EFGH',
	'IJKL'
]

const input = test
console.log(input.join('\n'))
console.log()

console.log(testArray.join('\n'))
console.log()
console.log(rotate(testArray, Rotation.ninty).join('\n'))
