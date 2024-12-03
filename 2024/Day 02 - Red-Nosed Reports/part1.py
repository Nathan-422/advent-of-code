import copy


def isIncreasing(line):
    ordered = sorted(copy.deepcopy(line))

    return line[0] == ordered[0]


def getDifferences(line):
    difference = []
    for i in range(len(line)):
        if i == len(line) - 1:
            return difference
        difference.append(abs(int(line[i]) - int(line[i + 1])))


with open('test.txt', 'r') as file:
    for raw_line in file:
        line = [int(x) for x in raw_line.rstrip('\n').split(' ')]
        print(isIncreasing(line))
        print(line)
        print(getDifferences(line))
        # for i in range(len(line)):
        #     i + 1
