/**
 * Improved matching algorithm with fuzzy text, color, location, and date scoring.
 */

const STOP_WORDS = new Set(['the', 'a', 'an', 'and', 'or', 'is', 'it', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'has', 'was', 'i', 'my', 'me']);

function tokenize(text) {
    if (!text) return [];
    return text.toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .split(/\s+/)
        .filter(w => w.length > 1 && !STOP_WORDS.has(w));
}

function wordOverlap(text1, text2) {
    const words1 = tokenize(text1);
    const words2 = tokenize(text2);
    if (words1.length === 0 || words2.length === 0) return 0;

    let matchCount = 0;
    words1.forEach(w1 => {
        if (words2.some(w2 => w2 === w1 || (w1.length > 3 && w2.length > 3 && levenshtein(w1, w2) <= 2))) {
            matchCount++;
        }
    });
    return matchCount / Math.max(words1.length, 1);
}

function levenshtein(a, b) {
    const m = a.length, n = b.length;
    const dp = Array.from({ length: m + 1 }, (_, i) => {
        const row = new Array(n + 1);
        row[0] = i;
        return row;
    });
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            dp[i][j] = a[i - 1] === b[j - 1]
                ? dp[i - 1][j - 1]
                : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
        }
    }
    return dp[m][n];
}

function locationScore(loc1, loc2) {
    if (!loc1 || !loc2) return 0;
    const l1 = loc1.toLowerCase().trim();
    const l2 = loc2.toLowerCase().trim();
    if (l1 === l2) return 1;
    // Partial match — check if common keywords
    const overlap = wordOverlap(l1, l2);
    return overlap;
}

function colorMatch(color1, color2) {
    if (!color1 || !color2) return 0;
    return color1.toLowerCase().trim() === color2.toLowerCase().trim() ? 1 : 0;
}

export function calculateMatchScore(lost, found) {
    let score = 0;

    // Category match (25 pts)
    if (lost.category && found.category && lost.category === found.category) {
        score += 25;
    }

    // Description similarity (35 pts) — fuzzy text matching
    const descOverlap = wordOverlap(lost.description, found.description);
    score += Math.round(descOverlap * 35);

    // Location proximity (20 pts)
    const locScore = locationScore(lost.location, found.location);
    score += Math.round(locScore * 20);

    // Color match (10 pts)
    score += colorMatch(lost.color, found.color) * 10;

    // Date proximity (10 pts) — using event_date field
    const lostDate = new Date(lost.event_date);
    const foundDate = new Date(found.event_date);
    if (!isNaN(lostDate) && !isNaN(foundDate)) {
        const daysDiff = Math.abs(lostDate - foundDate) / (1000 * 60 * 60 * 24);
        if (daysDiff <= 1) score += 10;
        else if (daysDiff <= 3) score += 8;
        else if (daysDiff <= 7) score += 5;
        else if (daysDiff <= 14) score += 2;
    }

    return Math.min(Math.round(score), 100);
}

export function getAIQuestions(category) {
    const cat = (category || '').toLowerCase();
    const questions = {
        electronics: [
            'What is the device brand and model?',
            'Describe the phone case or any accessories',
            'What is the wallpaper / lock screen image?'
        ],
        documents: [
            'What type of document is it?',
            'What name appears on the document?',
            'Any additional documents in the same holder?'
        ],
        accessories: [
            'Describe the material and color in detail',
            'Any engravings, brand name, or initials?',
            'What was inside (if wallet/bag)?'
        ],
        keys: [
            'How many keys on the keyring?',
            'Any keychain or tag attached? Describe it',
            'What brand/type of vehicle key (if any)?'
        ],
        clothing: [
            'What is the exact brand and size?',
            'Any stains, tears, or identifying marks?',
            'What was in the pockets (if anything)?'
        ],
    };
    return questions[cat] || [
        'Describe a unique identifying feature',
        'What color and brand is it?',
        'When and where exactly did you lose it?'
    ];
}
