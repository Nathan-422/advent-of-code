from functools import reduce


def factors(n: int):
    return set(
        reduce(
            list.__add__, ([i, n // i] for i in range(1, int(n**0.5) + 1) if n % i == 0)
        )
    )


def get_greatest_factor(factor: list[int]):
    return factor[-2]


file = "data.txt"
file = "example.txt"

total_invalid_ids = 0

with open(file) as data:
    # 11-22,95-115,998-1012
    id_ranges = data.readline().strip("\n").split(",")
    print(id_ranges)

    # 11-22
    for range_unsplit in id_ranges:
        # throw out single digit values
        if range_unsplit.split("-")[0].__len__() == 1:
            range_unsplit = f"10-{range_unsplit.split('-')[1]}"

        # "11", "22" - strings
        sStart, sStop = range_unsplit.split("-")
        iStart, iStop = [int(string) for string in range_unsplit.split("-")]

        # We want to count by 10 * (length - greatest factor) until we're over the end number
        # So for 11-22 we can count by 1s
        # for 100-250 we can count by 10s
        # for 1000-1227 we can count by 100s etc...

        # normalize to increment by 1
        #
        print()
        print(range_unsplit)

        fact = list(factors(sStart.__len__()))
        fact.sort()
        start_len = get_greatest_factor(fact)
        print(fact)

        start_first_segment = int(sStart[: -1 * (sStart.__len__() - start_len)])
        stop_first_segment = int(sStop[: -1 * (sStart.__len__() - start_len)])

        print(f"start num: {sStart}")
        print(f"start len: {start_len}")
        print(f"start segment: {start_first_segment}")
        print(f"stop segment: {stop_first_segment}")

        for i in range(start_first_segment, stop_first_segment + 1):
            repeat = int(f"{i}{i}")

            if repeat in range(iStart, iStop + 1):
                # print(f"Found repeat: {repeat}")
                total_invalid_ids += repeat

    print(total_invalid_ids)
