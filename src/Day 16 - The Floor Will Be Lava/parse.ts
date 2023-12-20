import { readFileSync } from 'node:fs'
import { Dir, Pos, Loc, LinkedList, getCoordFromDir, getOppositeDir } from '../grid-traversal.js'

enum Floor {
	'.',
	'/',
	'\\',
	'-',
	'|',
}

type FloorMap = string[][]
type Wall = null

type BeamSeg = Loc & {
	pos: Pos
	contents: Floor | Wall
	from: Dir
	to: Array<Dir> | null
}

function getContentsFromPos(map: FloorMap, pos: Pos): Floor | Wall {
	const { x, y } = { ...pos }
	const width = map[0].length
	const height = map.length

	if (
		x + 1 > width ||
		y + 1 > height
	) {
		return null
	}

	return map[y][x] as unknown as Floor
}

const testFile = './test.txt'
const dataFile = './data.txt'

const data: FloorMap = readFileSync(dataFile, 'utf8').split("\n").filter((line) => line !== "").map(line => line.split(''))
const test: FloorMap = readFileSync(testFile, 'utf8').split("\n").filter((line) => line !== "").map(line => line.split(''))

const input = test
// console.log(input.map(line => line.join('')).join('\n'))

const start: Pos = { x: 0, y: 0 }
const pathStart: BeamSeg = {
	pos: start,
	contents: getContentsFromPos(input, start),
	from: Dir.WEST,
	to: Array<Dir>(Dir.EAST),
}

const beamPath: LinkedList = {
	head: pathStart,
	size: 1,
	// getFirst: function(this: LinkedList): BeamSeg { return this.head },
	// getLast: function(this: LinkedList): BeamSeg {
	// 	let lastNode = this.head
	// 	if (lastNode) {
	// 		while (lastNode.next) {
	// 			lastNode = lastNode.next
	// 		}
	// 	}
	// 	return lastNode
	// },
	// add: function(this: LinkedList, seg: BeamSeg) {
	// 	this.getLast().next = seg
	// 	this.size += 1
	// }
}


