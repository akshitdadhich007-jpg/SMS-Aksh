
-- Traceback Tables
CREATE TABLE IF NOT EXISTS traceback_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type VARCHAR(10) CHECK (type IN ('lost', 'found')),
    category VARCHAR(50),
    description TEXT,
    location VARCHAR(255),
    event_date DATE,
    reporter_id UUID,
    status VARCHAR(20) DEFAULT 'open', -- open, matched, resolved
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS traceback_matches (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    lost_item_id UUID REFERENCES traceback_items(id),
    found_item_id UUID REFERENCES traceback_items(id),
    match_score INT,
    ai_reason TEXT,
    status VARCHAR(20) DEFAULT 'potential', -- potential, rejected, confirmed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS traceback_claims (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    item_id UUID REFERENCES traceback_items(id),
    claimant_id UUID,
    status VARCHAR(20) DEFAULT 'pending_verification', -- pending_verification, verified, rejected
    verification_token TEXT,
    token_expiry TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS traceback_handover_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    claim_id UUID REFERENCES traceback_claims(id),
    verifier_id UUID,
    verif_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
