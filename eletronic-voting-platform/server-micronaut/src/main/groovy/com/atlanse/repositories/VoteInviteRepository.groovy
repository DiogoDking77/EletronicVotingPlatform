package com.atlanse.repositories

import com.atlanse.domains.CategoryEntity
import com.atlanse.domains.VoteInviteEntity
import io.micronaut.data.annotation.Query
import io.micronaut.data.model.Page
import io.micronaut.data.model.Pageable
import io.micronaut.data.annotation.Join
import io.micronaut.data.jdbc.annotation.JdbcRepository
import io.micronaut.data.model.query.builder.sql.Dialect
import io.micronaut.data.repository.PageableRepository


@JdbcRepository(dialect = Dialect.POSTGRES)
interface VoteInviteRepository extends PageableRepository<VoteInviteEntity, UUID> {

    @Join(value = "phase", type = Join.Type.LEFT_FETCH)
    @Join(value = "user", type = Join.Type.LEFT_FETCH)
    Page<VoteInviteEntity> findAll(Pageable pageable)

    @Join(value = "phase", type = Join.Type.LEFT_FETCH)
    @Join(value = "user", type = Join.Type.LEFT_FETCH)
    Optional<VoteInviteEntity> findById(UUID id)

    @Query(value = """
    SELECT p.id
    FROM category c
             LEFT JOIN phase p ON c.id = p.category_id
    WHERE c.voting_id = :votingId AND p.privacy = false
""")
    List<UUID> findPhaseIdsForUser(UUID votingId, UUID userId);

    @Query(value = """
    SELECT p.id
    FROM category c
             LEFT JOIN phase p ON c.id = p.category_id
    WHERE c.voting_id = :votingId
""")
    List<UUID> findPhaseIdsForOwner(UUID votingId, UUID userId);



    @Query(value = """
    SELECT COUNT(vi) > 0
    FROM vote_invite vi
    WHERE vi.user_id = :userId
      AND EXISTS (
          SELECT 1
          FROM category c
          WHERE c.voting_id = :votingId
            AND EXISTS (
                SELECT 1
                FROM phase p
                WHERE p.category_id = c.id
                  AND vi.phase_id = p.id
            )
      )
""")
    boolean existsByUserIdAndVotingId(UUID userId, UUID votingId)


    @Query(value = """
    SELECT COUNT(vi) > 0
    FROM vote_invite vi
    WHERE vi.user_id = :userId 
      AND vi.phase_id = :phaseId
      AND vi.is_invited = true
    """)
    boolean existsByUserIdAndPhaseIdInvited(UUID userId, UUID phaseId)

    @Query(value = """
    SELECT COUNT(vi) > 0
    FROM vote_invite vi
    WHERE vi.user_id = :userId 
      AND vi.phase_id = :phaseId
    """)
    boolean existsByUserIdAndPhaseId(UUID userId, UUID phaseId)



    @Query(
            value = """
            SELECT DISTINCT v.id, v.comment, v.message, v.response, v.invite_date, v.vote_date, v.phase_id, v.user_id, v.is_invited
            FROM vote_invite v
            WHERE v.user_id = :userId AND v.phase_id = :phaseId
        """

    )
    Set<VoteInviteEntity> findVoteInviteByUserPhase(UUID userId, UUID phaseId)

    @Query(
            value = """
                SELECT vi.id
                FROM vote_invite vi
                WHERE vi.user_id = :userId AND vi.phase_id = :phaseId
                AND vi.is_invited = false
        """
    )
    UUID checkVoteInviteByUserPhase(UUID userId, UUID phaseId)

    @Query(
            value = """
        SELECT COUNT(vi) > 0
        FROM vote_invite vi
        WHERE vi.user_id = :userId AND vi.phase_id = :phaseId
    """
    )
    boolean existsByUserAndPhase(UUID userId, UUID phaseId);


}