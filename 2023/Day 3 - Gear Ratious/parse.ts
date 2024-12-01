import { readFileSync } from 'node:fs'
const testFile = './test.txt'
const dataFile = './data.txt'

type Part = {
	id: number
	line: number
	index: number
	symbols: Array<Symbol>
}

type Symbol = {
	content: string
	index: number
	line: number
	position: Position
}

enum Position {
	topleft = "topleft",
	top = "top",
	topright = "topright",
	left = "left",
	right = 'right',
	bottomleft = "bottomleft",
	bottom = "bottom",
	bottomright = "bottomright",
}

const findSymbols = (parts: string[], index: number, line: number): Array<Symbol> => {
	const symbols: Array<Symbol> = []
	for (let y = 0; y < parts.length; y++) {
		const lineSymbols = parts[y].matchAll(/[!--]|\/|[:-@]/g)
		for (let symbol of lineSymbols) {
			const v = ["top", "", "bottom"]

			let pos = v[y]
			let i: number

			if (symbol.index === 0) {
				pos += 'left'
				i = index
			} else if (symbol.index === parts[y].length - 1) {
				pos += 'right'
				i = index + parts[y].length - 1
			} else {
				i = symbol.index + index
			}

			const sym: Symbol = {
				content: symbol[0],
				index: i,
				line: line + y - 1,
				position: Position[pos]
			}

			symbols.push(sym)
		}
	}

	return symbols
}

const getSurroundingLines = (line: number, data: string[]) => {
	const lines: string[] = []

	if (line === 0) {
		lines.push('.'.repeat(data[line].length))
	} else {
		lines.push(data[line - 1])
	}

	lines.push(data[line])

	if (line === data.length - 2) {
		lines.push('.'.repeat(data[line].length))
	} else {
		lines.push(data[line + 1])
	}

	return lines
}

const getSubLines = (index: number, length: number, lines: string[]) => {
	let newLines = lines
	if (index === 0) {
		newLines = lines.map((line) => {
			return '.' + line
		})
		index++
	}

	if (index + length === lines[0].length) {
		newLines = lines.map((line) => {
			return line + '.'
		})
	}

	return newLines.map((line) => {
		return line.substring(index - 1, index + length + 1)
	})
}

const data = readFileSync(dataFile, 'utf8').split("\n")
const parts = new Array<Part>
const gears = {}

for (let y = 0; y < data.length; y++) {
	const line = data[y]
	const tokens = line.matchAll(/[0-9]+/g)
	for (let token of tokens) {
		const lines = getSurroundingLines(y, data)
		const subLines = getSubLines(token.index, token[0].length, lines)
		const symbols = findSymbols(subLines, token.index, y)

		// if (symbols.length > 0) {
		// 	console.log('='.repeat(35))
		// 	console.log(`Token: ${token} | Line: (${y + 1} of ${data.length - 1})`)
		// 	// console.log(line)
		// 	console.log(subLines.join('\n'))
		// 	console.log(`Symbols: ${JSON.stringify(symbols)}`)
		// 	console.log('='.repeat(35))
		// }

		const part: Part = {
			id: Number.parseInt(token[0]),
			line: y,
			index: token.index,
			symbols: symbols,
		}
		parts.push(part)
		for (let symbol of symbols) {

			if (symbol.content !== "*") continue
			const pos = "x" + symbol.index + "y" + symbol.line

			if (gears[pos] === undefined) {
				gears[pos] = []
			}

			gears[pos].push(part)
		}
	}
}

console.log(parts
	.filter((part) => { if (part.symbols.length > 0) return part })
	.reduce((pre, cur) => pre + cur.id, 0))

console.log(gears)

console.log(Object.keys(gears)
	.filter((key) => {
		if (gears[key].length >= 2) {
			return gears[key]
		}
	})
	.reduce((accumulator, key) => {
		console.log(`Ratio: ${gears[key][0].id * gears[key][1].id} (${gears[key][0].id} and ${gears[key][0].id})`)
		return accumulator + (gears[key][0].id * gears[key][1].id)
	}, 0))



