CREATE TABLE participations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    user_id BIGINT NOT NULL,
    season_id BIGINT NOT NULL,

    date_of_birth DATE NOT NULL,
    location VARCHAR(150),

    photo_url VARCHAR(500) NOT NULL,

    status ENUM('PENDING','APPROVED','REJECTED','WITHDRAWN')
        NOT NULL DEFAULT 'PENDING',

    deleted BIT(1) NOT NULL DEFAULT b'0',

    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
        ON UPDATE CURRENT_TIMESTAMP(6),

    CONSTRAINT fk_participation_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_participation_season
        FOREIGN KEY (season_id) REFERENCES seasons(id)
        ON DELETE CASCADE
);


CREATE INDEX idx_participation_user_season_deleted_id
ON participations(user_id, season_id, deleted, id);

CREATE INDEX idx_participation_season_status_deleted
ON participations(season_id, status, deleted);