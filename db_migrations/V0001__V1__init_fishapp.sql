CREATE TABLE IF NOT EXISTS t_p26368353_quantum_research_ini.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE,
  phone TEXT UNIQUE,
  username TEXT NOT NULL DEFAULT 'Рыбак',
  avatar_url TEXT,
  fishcoins INTEGER NOT NULL DEFAULT 500,
  rank TEXT NOT NULL DEFAULT 'Новичок',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS t_p26368353_quantum_research_ini.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES t_p26368353_quantum_research_ini.users(id),
  token TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '30 days'
);

CREATE TABLE IF NOT EXISTS t_p26368353_quantum_research_ini.catches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES t_p26368353_quantum_research_ini.users(id),
  fish_type TEXT NOT NULL,
  weight_kg NUMERIC(6,2),
  gear TEXT,
  description TEXT,
  location_name TEXT,
  lat NUMERIC(10,6),
  lng NUMERIC(10,6),
  likes_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS t_p26368353_quantum_research_ini.catch_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  catch_id UUID NOT NULL REFERENCES t_p26368353_quantum_research_ini.catches(id),
  url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS t_p26368353_quantum_research_ini.catch_likes (
  user_id UUID NOT NULL REFERENCES t_p26368353_quantum_research_ini.users(id),
  catch_id UUID NOT NULL REFERENCES t_p26368353_quantum_research_ini.catches(id),
  PRIMARY KEY (user_id, catch_id)
);

CREATE TABLE IF NOT EXISTS t_p26368353_quantum_research_ini.map_markers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES t_p26368353_quantum_research_ini.users(id),
  type TEXT NOT NULL DEFAULT 'catch',
  lat NUMERIC(10,6) NOT NULL,
  lng NUMERIC(10,6) NOT NULL,
  message TEXT,
  fish_type TEXT,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '24 hours',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_catches_user ON t_p26368353_quantum_research_ini.catches(user_id);
CREATE INDEX IF NOT EXISTS idx_catches_created ON t_p26368353_quantum_research_ini.catches(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_markers_expires ON t_p26368353_quantum_research_ini.map_markers(expires_at);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON t_p26368353_quantum_research_ini.sessions(token);
