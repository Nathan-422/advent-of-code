file = "data.txt"
# file = "example.txt"

total_invalid_ids = 0

with open(file) as data:
    # 11-22,95-115,998-1012
    id_ranges = data.readline().strip("\n").split(",")
    print(id_ranges)

    # 11-22
    for range_unsplit in id_ranges:
        # We want to count by length n/2 (rounded up) increments to skip iterating over all numbers
        # So for 11-22 we can count by 1s
        # for 100-250 we can count by 10s
        # for 1000-1227 we can count by 100s etc...

        # throw out single digit values
        if range_unsplit.split("-")[0].__len__() == 1:
            range_unsplit = f"10-{range_unsplit.split('-')[1]}"

        # "11", "22" - strings
        sStart, sStop = range_unsplit.split("-")
        iStart, iStop = [int(string) for string in range_unsplit.split("-")]

        # normalize to increment by 1
        #
        # this approach may be more computationally
        # intensive but should work for odds
        #
        # count chars in first word
        # take half, rounded down i.e. 5 -> 2
        # remove same number from end
        # increment through with range()
        print()
        print(range_unsplit)

        start_len = sStart.__len__()
        stop_len = sStop.__len__()

        start_first_half = int(sStart[: -1 * (start_len // 2)])
        stop_first_half = int(sStop[: -1 * (start_len // 2)])

        print(f"start num: {sStart}")
        print(f"start len: {start_len}")

        if start_len % 2 == 1:
            # print("Starting number is odd length")
            digits_to_remove = -1 * ((start_len // 2) + 1)
            start_first_half = int(sStart[:digits_to_remove])
            stop_first_half = int(sStop[:digits_to_remove])

        for i in range(start_first_half, stop_first_half + 1):
            repeat = int(f"{i}{i}")

            if repeat in range(iStart, iStop + 1):
                # print(f"Found repeat: {repeat}")
                total_invalid_ids += repeat

    print(total_invalid_ids)
