import { readFileSync } from 'node:fs'
const testFile = './test.txt'
const dataFile = './data.txt'

const data = readFileSync(dataFile, 'utf8').split("\n").filter((line) => {
	if (line !== "") return line
})
const test = readFileSync(testFile, 'utf8').split("\n").filter((line) => {
	if (line !== "") return line
})

type Almanac = {
	seeds: number[]
	tables: Conversion[]
}

type Conversion = {
	name: string
	lookups: Map<number, number>
}

const parseData = (data: string[]) => {
	const seeds = data[0].split(': ')[1].split(' ').map((seed) => {
		return Number.parseInt(seed)
	})

	const rawConversions = data.slice(1).join('\n').split(/\n(?=\w+-\w+-\w+)/g)
	const conversions = rawConversions.map((line) => {
		const parts = (line.split(/\smap:\s/))
		const map = new Map<number, number>
		parts[1].split('\n').forEach((lookup) => {
			const parts = lookup.split(' ').map((part) => {
				return Number.parseInt(part)
			})
			for (let i = 0; i < parts[2]; i++) {
				map.set(parts[1] + i, parts[0] + i)
			}
		})
		const converts: Conversion = {
			name: parts[0],
			lookups: map
		}
		return converts
	})
	const almanac: Almanac = {
		seeds: seeds,
		tables: conversions
	}
	return almanac
}

const almanac = parseData(data)
console.log(almanac.tables[0].lookups.has(0))

const seeds = []

for (let seed of almanac.seeds) {
	let seedConverted = seed
	for (let i = 0; i < almanac.tables.length; i++) {
		const lookup = almanac.tables[i].lookups
		if (lookup.has(seedConverted)) {
			seedConverted = lookup.get(seedConverted)
		}
	}
	seeds.push(seedConverted)
}

console.log(seeds.reduce((accu, current) => {
	if (current < accu) {
		return current
	} else {
		return accu
	}
}))
