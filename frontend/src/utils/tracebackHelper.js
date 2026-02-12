/**
 * Utility functions for Traceback feature
 */

/**
 * Get the base path for Traceback based on current location
 * @param {string} pathname - from useLocation().pathname
 * @returns {string} Base path like '/admin', '/resident', or '/security'
 */
export const getTracebackBasePath = (pathname) => {
    if (pathname.startsWith('/admin')) return '/admin';
    if (pathname.startsWith('/resident')) return '/resident';
    if (pathname.startsWith('/security')) return '/security';
    return '/admin'; // default fallback
};

/**
 * Get full Traceback path based on current location
 * @param {string} pathname - from useLocation().pathname
 * @param {string} subPath - like 'report-lost', 'matches', etc.
 * @returns {string} Full path like '/admin/traceback/report-lost'
 */
export const getTracebackPath = (pathname, subPath = '') => {
    const basePath = getTracebackBasePath(pathname);
    if (!subPath) return `${basePath}/traceback`;
    return `${basePath}/traceback/${subPath}`;
};
