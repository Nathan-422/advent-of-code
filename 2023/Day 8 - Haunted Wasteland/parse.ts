import { readFileSync } from 'node:fs'
const testFile = './test.txt'
const dataFile = './data.txt'

const data = readFileSync(dataFile, 'utf8').split("\n").filter((line) => line !== "")
const test = readFileSync(testFile, 'utf8').split("\n").filter((line) => line !== "")

const input = data

type node = {
	root: string
	L: string
	R: string
}

const directions = input.shift()
const nodes = input.map((line) => {
	const [root, L, R] = line.matchAll(new RegExp("[A-Z]{3}", 'g'))
	return {
		root: root[0],
		L: L[0],
		R: R[0],
	}
}).reduce((map, current) => {
	return map.set(current.root, current)
}, new Map<string, node>)

// console.log(nodes)

function getNextNode(nodes: Map<string, node>, node: node, directions: string, steps: number) {
	return nodes.get(node[directions[steps % directions.length]])
}

function isDestination(currentLocations: node[], steps: number) {
	let i = 0
	for (let location of currentLocations) {
		if (location.root[2] === "Z") {
			i += 1
		}
	}
	if (i === currentLocations.length - 1) {
		return true
	} else if (i >= 3) {
		console.log("Steps: " + steps + currentLocations.reduce((pre, cur) => {
			return `${pre} - ${cur.root}`
		}, ` (${i})`))
	}
	return false
}


const navigate = (steps: number = 0,): number => {
	let i = steps
	let currentLocations = [...nodes.keys()]
		.filter((node) => node.at(2) === "A").map((loc) => nodes.get(loc))
	// console.log("Number of directions" + directions.length)

	while (!isDestination(currentLocations, i)) {
		// if (i % 10000000 === 0) {
		// 	console.log(`Steps ${i} | Node: ${[...currentLocations.values()].reduce((string, current) => {
		// 		return string + " - " + current.root
		// 	}, "")}`)
		// }
		currentLocations = currentLocations.map((location) => {
			return getNextNode(nodes, location, directions, i)
		})
		i += 1
	}

	console.log(`Steps ${i} | Node: ${[...currentLocations.values()].reduce((string, current) => {
		return string + " - " + current.root
	}, "")}`)

	return i
}

console.log("Number of steps: " + navigate(0))
// console.log([...nodes.keys()].filter((node) => node.at(2) === "A"))
