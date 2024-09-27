package com.atlanse.repositories

import com.atlanse.domains.InvitedVotingsViewEntity
import com.atlanse.domains.UserEntity
import com.atlanse.domains.VotingEntity
import io.micronaut.data.annotation.Query
import io.micronaut.data.jdbc.annotation.JdbcRepository
import io.micronaut.data.model.query.builder.sql.Dialect
import io.micronaut.data.repository.PageableRepository

import java.util.UUID

@JdbcRepository(dialect = Dialect.POSTGRES)
interface InvitedVotingsViewRepository extends PageableRepository<InvitedVotingsViewEntity, UUID> {

    @Query(
            value = """
        SELECT 
            v.id as id, 
            v.name as name, 
            v.information as information, 
            v.creation_date as creationDate, 
            v.owner_id as idOwner, 
            v.theme_id as idTheme,
            t.theme as theme,
            u.email as owner,
            MAX(vi.invite_date) OVER (PARTITION BY v.id) AS maxInviteDate,
            ARRAY_AGG(DISTINCT jsonb_build_object('phase', p.name, 'category', c.name)) as phases
        FROM 
            vote_invite vi
            JOIN phase p ON vi.phase_id = p.id
            JOIN category c ON p.category_id = c.id
            JOIN voting v ON c.voting_id = v.id
            JOIN users u ON v.owner_id = u.id
            JOIN theme t ON t.id = v.theme_id
        WHERE 
            vi.user_id = :userId AND vi.is_invited = true
        GROUP BY 
            v.id, v.name, v.information, v.creation_date, v.owner_id, v.theme_id, t.theme, u.email, vi.invite_date
        ORDER BY maxInviteDate DESC;
    """
    )
    List<InvitedVotingsViewEntity> findInvitedVotingsAndPhases(UUID userId);


}

