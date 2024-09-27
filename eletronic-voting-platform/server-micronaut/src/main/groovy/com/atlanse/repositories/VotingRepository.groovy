package com.atlanse.repositories

import com.atlanse.domains.VotingEntity
import io.micronaut.data.annotation.Query
import io.micronaut.data.model.Page
import io.micronaut.data.model.Pageable
import io.micronaut.data.annotation.Join
import io.micronaut.data.jdbc.annotation.JdbcRepository
import io.micronaut.data.model.query.builder.sql.Dialect
import io.micronaut.data.repository.PageableRepository


@JdbcRepository(dialect = Dialect.POSTGRES)
interface VotingRepository extends PageableRepository<VotingEntity, UUID> {

    @Join(value = "theme", type = Join.Type.LEFT_FETCH)
    @Join(value = "owner", type = Join.Type.LEFT_FETCH)
    Page<VotingEntity> findAll(Pageable pageable)

    @Join(value = "theme", type = Join.Type.LEFT_FETCH)
    @Join(value = "owner", type = Join.Type.LEFT_FETCH)
    Optional<VotingEntity> findById(UUID id)

    @Query(
            value = """
            SELECT DISTINCT u.id
            FROM vote_invite vi
            JOIN phase p ON vi.phase_id = p.id
            JOIN category c ON p.category_id = c.id
            JOIN users u ON vi.user_id = u.id
            WHERE
            CASE
            WHEN p.privacy = true THEN vi.response = true AND c.voting_id = :votingId
            ELSE c.voting_id = :votingId
            END;
    """
    )
    Set<UUID> findUniqueUserIdsInVoterInvitations(UUID votingId)

    @Query(
            value = """
            SELECT DISTINCT c.id AS id_category
            FROM category c
            LEFT JOIN phase p ON c.id = p.category_id
            WHERE p.category_id IS NULL AND c.voting_id = :votingId
        """
    )
    Set<UUID> findCategorieswithnophases(UUID votingId)
}