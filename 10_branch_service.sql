-- =====================================================================
--  MeubleZone — branch-service  (MAISON MÈRE)
--  Base : branch_db  (PostgreSQL 14+)
--  Responsabilité : maisons filles (filiales) et employés du groupe.
--  C'est le service de référence pour branch_id, consommé en lecture
--  logique par tous les autres services (pas de FK cross-service).
-- =====================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ---------- Maisons filles (filiales) ----------
CREATE TABLE branches (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    public_id     VARCHAR(21)  NOT NULL UNIQUE,
    -- code court lisible (ex : "ABJ", "YAM", "BKE") + numéro de commande préfixe
    code          VARCHAR(10)  UNIQUE,
    name          VARCHAR(160) NOT NULL,
    city          VARCHAR(120),
    address       VARCHAR(240),
    email         VARCHAR(200),
    phone         VARCHAR(40),
    -- manager : référence logique vers un employee de cette filiale
    manager_id    UUID,
    is_active     BOOLEAN      NOT NULL DEFAULT TRUE,
    opened_at     DATE,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);
CREATE INDEX idx_branches_active ON branches(is_active);

-- ---------- Employés du groupe ----------
CREATE TABLE employees (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    public_id   VARCHAR(21)  NOT NULL UNIQUE,
    -- réf. logique vers auth/user-service (compte de connexion), si applicable
    user_id     UUID,
    full_name   VARCHAR(160) NOT NULL,
    email       VARCHAR(200) NOT NULL UNIQUE,
    phone       VARCHAR(40),
    -- direction | manager | vendeur | magasinier | support | comptable
    role        VARCHAR(20)  NOT NULL
                CHECK (role IN ('direction','manager','vendeur','magasinier','support','comptable')),
    -- filiale d'affectation. NULL = rattaché au siège (maison mère)
    branch_id   UUID REFERENCES branches(id) ON DELETE SET NULL,
    is_active   BOOLEAN      NOT NULL DEFAULT TRUE,
    hired_at    DATE,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);
CREATE INDEX idx_employees_branch ON employees(branch_id);
CREATE INDEX idx_employees_role   ON employees(role);

-- manager_id de branches pointe (logiquement) vers employees.id ;
-- pas de FK formelle pour éviter une dépendance circulaire à l'insertion.
