import copy


def getDifferences(line):
    difference = []
    for i in range(len(line)):
        if i == len(line) - 1:
            return difference
        difference.append(int(line[i]) - int(line[i + 1]))
    return difference


def isValidDirection(line):
    direction = 'neutral'

    for n in range(len(line)):
        if n == len(line):
            return True

        n1 = line[n]
        n2 = line[n + 1]
        difference = n2-n1
        match direction:
            case 'neutral':
                if (n == 0 and difference == 0):
                    continue
                elif (difference > 0):
                    direction = 'increasing'
                elif (difference < 0):
                    direction = 'decreasing'
            case 'increasing':
                if (difference < 0):
                    return False
            case 'decreasing':
                if (difference > 0):
                    return False


def isPermutationValid(line):
    for n in range(len(line)):
        modified = copy.deepcopy(line).pop(n)
        if (isValidDirection(getDifferences(modified))):
            return True
    return False


with open('test.txt', 'r') as file:
    safe_reports = 0
    for raw_line in file:
        line = [int(x) for x in raw_line.rstrip('\n').split(' ')]
        diffs = getDifferences(line)

        if (isValidDirection(diffs) or isPermutationValid(line)):
            safe_reports += 1

        # print("% s is % s" % (line, 'Safe' if isValid(diffs) else 'UNsafe'))
    print(safe_reports)
