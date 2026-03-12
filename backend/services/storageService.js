/**
 * Storage Upload Service
 * ──────────────────────
 * Connected to: SmartSurveillance.jsx, ReportFoundItem.jsx, ReportLostItem.jsx,
 *               ProveOwnership.jsx, StaffAttendance.jsx, CreateListing.jsx, DocumentRepo.jsx
 *
 * Buckets:
 *   surveillance-images, lost-found-images, proof-uploads,
 *   marketplace-images, attendance-images, documents
 */

const { supabaseAdmin } = require('../config/supabase');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

/**
 * Uploads a file buffer to a Supabase Storage bucket.
 * @param {string} bucket - Storage bucket name
 * @param {Buffer} fileBuffer - Raw file data
 * @param {string} originalName - Original filename (for extension)
 * @param {string} folder - Optional sub-folder within the bucket
 * @returns {Promise<{url: string, path: string}>}
 */
async function uploadFile(bucket, fileBuffer, originalName, folder = '') {
    const ext = path.extname(originalName);
    const fileName = `${folder ? folder + '/' : ''}${uuidv4()}${ext}`;

    const { data, error } = await supabaseAdmin.storage
        .from(bucket)
        .upload(fileName, fileBuffer, {
            contentType: getContentType(ext),
            upsert: false,
        });

    if (error) throw new Error(`Storage upload failed: ${error.message}`);

    const { data: urlData } = supabaseAdmin.storage
        .from(bucket)
        .getPublicUrl(fileName);

    return { url: urlData.publicUrl, path: fileName };
}

/**
 * Deletes a file from a Supabase Storage bucket.
 * @param {string} bucket
 * @param {string} filePath - The path returned during upload
 */
async function deleteFile(bucket, filePath) {
    const { error } = await supabaseAdmin.storage
        .from(bucket)
        .remove([filePath]);

    if (error) throw new Error(`Storage delete failed: ${error.message}`);
}

function getContentType(ext) {
    const types = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.webp': 'image/webp',
        '.pdf': 'application/pdf',
        '.doc': 'application/msword',
        '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        '.csv': 'text/csv',
    };
    return types[ext.toLowerCase()] || 'application/octet-stream';
}

module.exports = { uploadFile, deleteFile };
