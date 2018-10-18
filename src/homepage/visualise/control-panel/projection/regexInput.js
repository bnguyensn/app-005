// @flow

export default function regexInput(s1: string): ?string | ?number {
    // ***** Restrict input ***** //

    if (!s1) {
        // Return '' if user deleting all strings

        return 'EMPTY'
    } else {
        // Check for anything that's not a digit

        const regex1 = /[^\d]/g;
        const match1 = s1.match(regex1);

        if (!match1) {
            // Convert to number and check if within range

            try {
                const n1 = Number(s1);

                if (n1 >= 0 && n1 <= 100) {
                    return n1
                }

                return 'KEEP'
            } catch (e) {
                return 'KEEP'
            }
        }

        return 'KEEP'
    }


}
