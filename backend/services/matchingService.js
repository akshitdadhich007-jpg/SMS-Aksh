/**
 * Traceback Matching Service
 * ──────────────────────────
 * Score weights read from config/env.js instead of hardcoded.
 */

const { supabaseAdmin } = require('../config/supabase');
const config = require('../config/env');

/**
 * Runs matching logic for a newly reported item.
 */
async function runMatching(type, newItem) {
    const oppositeTable = type === 'lost' ? 'found_items' : 'lost_items';

    const { data: candidates, error } = await supabaseAdmin
        .from(oppositeTable)
        .select('*')
        .eq('category', newItem.category)
        .eq('status', 'open');

    if (error || !candidates?.length) return;

    const matches = [];

    for (const candidate of candidates) {
        let score = 0;

        // Category match (already filtered)
        score += config.matchScoreCategory;

        // Color match
        if (candidate.color && newItem.color &&
            candidate.color.toLowerCase() === newItem.color.toLowerCase()) {
            score += config.matchScoreColor;
        }

        // Date proximity (decreasing by penalty per day apart)
        const dateField1 = type === 'lost' ? newItem.date_lost : newItem.date_found;
        const dateField2 = type === 'lost' ? candidate.date_found : candidate.date_lost;
        if (dateField1 && dateField2) {
            const daysDiff = Math.abs(
                (new Date(dateField1) - new Date(dateField2)) / (1000 * 60 * 60 * 24)
            );
            score += Math.max(0, config.matchScoreColor - daysDiff * config.matchScoreDatePenalty);
        }

        if (score >= config.matchScoreCategory) {
            const lostId = type === 'lost' ? newItem.id : candidate.id;
            const foundId = type === 'lost' ? candidate.id : newItem.id;

            matches.push({
                lost_item_id: lostId,
                found_item_id: foundId,
                score: Math.min(score, 100),
            });
        }
    }

    if (matches.length > 0) {
        await supabaseAdmin.from('traceback_matches').insert(matches);
    }

    return matches;
}

module.exports = { runMatching };
