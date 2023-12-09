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

console.log(nodes)


const navigate = (directions: string, nodes: Map<string, node>, start: node, end: string, steps: number = 0,): number => {
	let i = steps
	let node = start
	let prevNode = start
	console.log("Number of directions" + directions.length)

	while (node.root !== end) {
		console.log(`Steps ${i} | Direction: ${i % directions.length} | Node: ${node.root}`)
		// if (i % 1000000 === 0) {
		// }

		node = nodes.get(node[directions[i % directions.length]])
		i += 1
	}

	console.log(`Steps ${i} | Direction: ${i % directions.length} | Node: ${node.root}`)

	return i
}

// const navigate = (directions: string, nodes: Map<string, node>, current: node, end: string, steps: number = 0,): number => {
//
// 	if (steps % 1000 === 0) {
// 		console.log(`Steps: ${steps}`)
// 		console.log(`Steps ${steps} | Direction: ${steps % (directions.length - 1)} | Node: ${current.root}`)
// 	}
//
// 	if (current.root == end) {
// 		console.log(`--- END --- Steps ${steps}`)
// 		return steps + 1
// 	}
//
//
// 	navigate(
// 		directions,
// 		nodes,
// 		nodes.get(current[directions[steps % (directions.length - 1)]]),
// 		end,
// 		steps + 1
// 	)
// }

console.log("Number of steps: " + navigate(directions, nodes, nodes.get("AAA"), "ZZZ", 0))
