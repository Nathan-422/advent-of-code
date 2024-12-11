import copy


def isValidDirection(line):
    direction = 'neutral'

    for n in range(len(line)):
        if (n + 1 == len(line)):
            return True

        n1 = line[n]
        n2 = line[n + 1]
        difference = n2-n1
        match direction:
            case 'neutral':
                if (difference > 0):
                    direction = 'increasing'
                elif (difference < 0):
                    direction = 'decreasing'
                else:
                    return False
            case 'increasing':
                if (difference < 0):
                    return False
            case 'decreasing':
                if (difference > 0):
                    return False


def isRecordInRange(line):
    for n in range(len(line)):
        if (n + 1 == len(line)):
            return True
        n1 = line[n]
        n2 = line[n + 1]
        diff = abs(n2 - n1)

        if (diff == 0 or diff > 3):
            return False
    return True


def isReportSafe(line):
    return isValidDirection(line) and isRecordInRange(line)


def isValidWithReportRemoved(line):
    for n in range(len(line)):
        modified = copy.deepcopy(line)
        modified.pop(n)
        if (isReportSafe(modified)):
            return True
    return False


with open('data.txt', 'r') as file:
    safe_reports = 0
    for raw_line in file:
        line = [int(x) for x in raw_line.rstrip('\n').split(' ')]

        if (isReportSafe(line) or isValidWithReportRemoved(line)):
            safe_reports += 1

        # print("% s is % s" % (line, 'Safe' if isValid(diffs) else 'UNsafe'))
    print(safe_reports)
