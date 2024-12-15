rules = []
before = {}
print_jobs = []
process_as_rule = True
with open('./test.txt', 'r') as file:
    for line in file:
        if (line.rfind('|') == -1):
            process_as_rule = False
        if (process_as_rule):
            rules.append(line.rstrip('\n'))
            rule = line.rstrip('\n').split('|')
            before.setdefault(rule[0], [])
            before[rule[0]].append(rule[1])
        else:
            print_jobs.append(line.rstrip('\n'))
print(before)
