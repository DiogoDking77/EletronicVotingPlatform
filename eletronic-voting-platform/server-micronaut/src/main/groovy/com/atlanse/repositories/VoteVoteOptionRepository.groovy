package com.atlanse.repositories

import com.atlanse.domains.VoteVoteOptionEntity
import io.micronaut.data.annotation.Query
import io.micronaut.data.model.Page
import io.micronaut.data.model.Pageable
import io.micronaut.data.annotation.Join
import io.micronaut.data.jdbc.annotation.JdbcRepository
import io.micronaut.data.model.query.builder.sql.Dialect
import io.micronaut.data.repository.PageableRepository


@JdbcRepository(dialect = Dialect.POSTGRES)
interface VoteVoteOptionRepository extends PageableRepository<VoteVoteOptionEntity, UUID> {

    @Join(value = "voteInvite", type = Join.Type.LEFT_FETCH)
    @Join(value = "voteOption", type = Join.Type.LEFT_FETCH)
    Page<VoteVoteOptionEntity> findAll(Pageable pageable)

    @Join(value = "voteInvite", type = Join.Type.LEFT_FETCH)
    @Join(value = "voteOption", type = Join.Type.LEFT_FETCH)
    Optional<VoteVoteOptionEntity> findById(UUID id)

    @Query("""
        SELECT vvo.id, vvo.position, vvo.vote_invite_id, vvo.vote_option_id FROM vote_vote_option vvo
        WHERE vvo.vote_invite_id IN (
            SELECT vi.id FROM vote_invite vi
            WHERE vi.user_id = :userId AND vi.phase_id = :phaseId
            ORDER BY vvo.position ASC 
        )
    """)
    List<VoteVoteOptionEntity> findVoteVoteOptionIdsByUserIdAndPhaseId(UUID userId, UUID phaseId);

    @Query("""
        SELECT vvo.id FROM vote_vote_option vvo
        WHERE vvo.vote_invite_id = :voteInviteId AND vvo.vote_option_id = :voteOptionId
    """)
    List<UUID> findIdVoteByInviteOption(UUID voteInviteId, UUID voteOptionId);

    @Query("""
        SELECT vvo.id FROM vote_vote_option vvo
        WHERE vvo.vote_invite_id = :voteInviteId
    """)
    List<UUID> findVotesByInvite(UUID voteInviteId);

}