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
	lookups: Lookup[]
}

type Lookup = {
	start: number
	output: number
	range: number
}

const parseData = (data: string[]) => {
	const seeds = data[0].split(': ')[1].split(' ').map((seed) => {
		return Number.parseInt(seed)
	})

	const rawConversions = data.slice(1).join('\n').split(/\n(?=\w+-\w+-\w+)/g)
	const conversions = rawConversions.map((line) => {
		const parts = (line.split(/\smap:\s/))
		// const numberLookups = 
		const lookyLoos = parts[1].split('\n').map((lookup) => {
			const parts = lookup.split(' ').map((part) => {
				return Number.parseInt(part)
			})
			return {
				start: parts[1],
				output: parts[0],
				range: parts[2]
			}
		})
		const converts: Conversion = {
			name: parts[0],
			lookups: lookyLoos
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
console.log(almanac)

const seeds = []

for (let seed of almanac.seeds) {
	let seedConverted = seed
	console.log('='.repeat(35))
	console.log(`Seed ${seedConverted}`)
	for (let i = 0; i < almanac.tables.length; i++) {
		const lookups = almanac.tables[i].lookups
		for (let lookup of lookups) {
			if (seedConverted >= lookup.start && seedConverted <= lookup.start + lookup.range - 1) {
				console.log(`${almanac.tables[i].name}\nBase: ${lookup.start}\nSeed: ${seedConverted}\nEnd : ${lookup.start + lookup.range - 1}`)
				let difference = seedConverted - lookup.start
				console.log(`Diff: ${difference}`)
				seedConverted = lookup.output + difference
				console.log(`Outp: ${seedConverted}`)
				break
			}
		}
	}
	seeds.push(seedConverted)
}

console.log(seeds)

console.log(seeds.reduce((accu, current) => {
	if (current < accu) {
		return current
	} else {
		return accu
	}
}))
