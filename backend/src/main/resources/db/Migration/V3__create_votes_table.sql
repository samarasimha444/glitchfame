CREATE TABLE votes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    participation_id BIGINT NOT NULL,
    voter_id BIGINT NOT NULL,

    deleted BIT(1) NOT NULL DEFAULT b'0',
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    CONSTRAINT fk_vote_participation
        FOREIGN KEY (participation_id)
        REFERENCES participations(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_vote_voter
        FOREIGN KEY (voter_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    -- Prevent duplicate vote for same participant
    CONSTRAINT uk_vote_unique
        UNIQUE (voter_id, participation_id, deleted),

    INDEX idx_vote_voter_deleted (voter_id, deleted),
    INDEX idx_vote_participation_deleted (participation_id, deleted)
);