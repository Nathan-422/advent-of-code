const fs = require('node:fs')
const file = './data.txt'

// Methods

function parseTokens(string) {
	const colors = {
		red: [],
		green: [],
		blue: [],
	}

	Object.keys(colors).map((color) => {
		const results = string.matchAll(new RegExp('[0-9]+(?= ' + color + ')', 'g'))
		for (let result of results) {
			const destring = Number.parseInt(result[0]);
			colors[color] = [destring].concat(...colors[color]);
		}
	})

	// console.log(colors)
	return colors
}

function extractId(string, pattern = '(?<=Game )[0-9]+(?=:)', flags = '') {
	let result = new RegExp(pattern, flags).exec(string)
	// console.log('ID: ' + result)

	if (result === null) return null

	return Number.parseInt(result)
}

function isGamePossible(limits, tokens) {
	let isPossible = true
	Object.keys(limits).map((color) => {
		for (let numCubes of tokens[color]) {
			if (!isPossible) break
			console.log(`Cubes: ${numCubes + ' ' + color} - Max: ${limits[color]}`)
			if (numCubes > limits[color]) {
				console.log('VIOLATION OF PHYSICS')
				isPossible = false
				break
			}
		}
	})
	return isPossible
}

function minimumViableCubes(tokens) {

	const minViable = {}
	Object.keys(tokens).map((color) => {
		let mostCubesShown = 0
		for (num of tokens[color]) {
			if (num > mostCubesShown) {
				mostCubesShown = num
			}
		}
		minViable[color] = mostCubesShown
	})
	return minViable
}

function powerOfSet(game) {
	const set = []
	Object.keys(game).map((key) => {
		set.push(game[key])
	})
	const initialValue = set.pop()
	let power = set.reduce((accumulator, currentValue) => accumulator * currentValue, initialValue,)

	return power
}


// Model

const maxCubes = {
	red: 12,
	green: 13,
	blue: 14
}

// Execution

let data = fs.readFileSync(file, 'utf8', (err, contents) => {
	if (err) {
		console.error(err)
		return
	}
	return contents
})

let parsedData = data.split('\n')

let sum = 0

for (let line of parsedData) {
	if (!line) break
	// let tokens = (line)
	//
	// for (let i = 0; i < tokens.length; i++) {
	// 	if (tokens[i].length === 1) continue
	// 	tokens[i] = convertWord(tokens[i])
	// }
	//
	const id = extractId(line)
	const tokens = parseTokens(line)
	console.log(tokens)
	const minCubes = minimumViableCubes(tokens)
	const power = powerOfSet(minCubes)
	// const possible = isGamePossible(maxCubes, tokens)

	console.log(`Game: ${id}
Red: ${tokens.red}
Green: ${tokens.green}
Blue: ${tokens.blue}
Power: ${power}`)

	// if (possible) {
	// 	sum += id
	// }

	sum += power

	console.log()

}

console.log(sum)
