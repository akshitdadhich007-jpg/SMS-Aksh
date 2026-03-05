const fs = require('fs');

function processCssFile(filepath) {
    if (!fs.existsSync(filepath)) return;
    let css = fs.readFileSync(filepath, 'utf8');

    // 3. Spacing normalizer
    const allowedSpacings = [4, 8, 12, 16, 24, 32, 48, 64];
    function snap(val) {
        if (val === 0) return 0;
        let closest = allowedSpacings[0];
        let minDiff = Math.abs(val - closest);
        for (const s of allowedSpacings) {
            if (Math.abs(val - s) < minDiff) {
                closest = s;
                minDiff = Math.abs(val - s);
            }
        }
        return closest;
    }

    // Regex to find padding and margins
    css = css.replace(/(padding|margin|gap):\s*([^;]+);/g, (match, prop, values) => {
        const parts = values.split(' ').map(p => {
            let m = p.match(/^(\d+)px$/);
            if (m) {
                return snap(parseInt(m[1])) + 'px';
            }
            return p;
        });
        return `${prop}: ${parts.join(' ')};`;
    });
    css = css.replace(/(padding|margin)-(top|bottom|left|right):\s*(\d+)px;/g, (match, prop, dir, val) => {
        return `${prop}-${dir}: ${snap(parseInt(val))}px;`;
    });

    // Radius substitutions
    css = css.replace(/border-radius:\s*(?:var\(--radius.*?\)|\d+px);/g, (match) => {
        return `border-radius: var(--radius-md);`;
    });

    // Colors mapping
    css = css.replace(/var\(--bg\)|#F8FAFC/gi, 'var(--background)');
    css = css.replace(/var\(--card\)|#FFFFFF/gi, 'var(--surface)');
    css = css.replace(/#4f46e5|#3b82f6|#6366f1|#7c3aed|var\(--brand-blue\)/gi, 'var(--primary)');
    css = css.replace(/var\(--brand-hover\)|#4338ca/gi, 'var(--primary-hover)');
    css = css.replace(/var\(--hover-bg\)|#f1f5f9/g, 'var(--background)');
    css = css.replace(/#0f172a|#1e293b|#334155/gi, 'var(--text-primary)');
    css = css.replace(/#475569|#64748b|#94a3b8|var\(--text-muted\)/gi, 'var(--text-secondary)');
    css = css.replace(/#e2e8f0|#e5e7eb|#cbd5e1/gi, 'var(--border)');

    fs.writeFileSync(filepath, css);
}

const glob = require('fs');
// Very basic manual glob
const files = [
    'frontend/src/styles/components.css',
    'frontend/src/styles/admin-style.css',
    'frontend/src/styles/Traceback.css',
    'frontend/src/styles/LandingPage.css',
    'frontend/src/styles/Login.css',
    'frontend/src/pages/admin/AdminSettings.css',
    'frontend/src/pages/admin/AssetBooking.css',
    'frontend/src/pages/resident/Emergency.css',
    'frontend/src/pages/resident/MyBills.css',
    'frontend/src/pages/resident/ResidentSettings.css',
];
files.forEach(f => processCssFile(f));
console.log('Processed component CSS');
