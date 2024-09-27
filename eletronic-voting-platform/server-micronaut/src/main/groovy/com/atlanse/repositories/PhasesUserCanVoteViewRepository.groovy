package com.atlanse.repositories

import com.atlanse.domains.PhasesUserCanVoteViewEntity
import io.micronaut.data.annotation.Query
import com.atlanse.domains.NormalVotingViewEntity
import io.micronaut.data.jdbc.annotation.JdbcRepository
import io.micronaut.data.repository.PageableRepository
import io.micronaut.data.model.query.builder.sql.Dialect

@JdbcRepository(dialect = Dialect.POSTGRES)
interface PhasesUserCanVoteViewRepository extends PageableRepository<PhasesUserCanVoteViewEntity, UUID> {

    @Query(value = """
    SELECT c.id AS category_id, ARRAY_AGG(p.id) AS phase_ids
    FROM "eletronicVoting".category c
    LEFT JOIN "eletronicVoting".phase p ON p.category_id = c.id
    WHERE c.voting_id = :votingId AND (
        (p.privacy = false) OR (
            p.privacy = true AND EXISTS (
                SELECT 1
                FROM "eletronicVoting".vote_invite vi
                WHERE vi.phase_id = p.id AND vi.user_id = :userId AND vi.is_invited = true

            )
        )
    )
    GROUP BY c.id
    ORDER BY c.id ASC;
    """)
    List<PhasesUserCanVoteViewEntity> getPhasesUserCanVote(UUID votingId, UUID userId);

}