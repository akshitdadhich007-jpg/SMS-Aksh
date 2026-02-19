export function calculateMatchScore(lost, found) {
    let score = 0;

    if (lost.category === found.category) {
        score += 30;
    }

    const lostWords = lost.description.toLowerCase().split(" ");
    const foundWords = found.description.toLowerCase().split(" ");

    const common = lostWords.filter(word =>
        foundWords.includes(word)
    );

    score += (common.length / lostWords.length) * 40;

    if (lost.location === found.location) {
        score += 20;
    }

    const daysDiff = Math.abs(
        new Date(lost.date) - new Date(found.date)
    ) / (1000 * 60 * 60 * 24);

    if (daysDiff <= 7) {
        score += 10;
    }

    return Math.round(score);
}
