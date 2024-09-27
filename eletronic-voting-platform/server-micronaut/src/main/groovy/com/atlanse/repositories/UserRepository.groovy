package com.atlanse.repositories

import com.atlanse.domains.InvitedVotingsViewEntity
import com.atlanse.domains.UserEntity
import com.atlanse.domains.VotingEntity
import com.atlanse.domains.VotingsViewEntity
import com.atlanse.domains.VotingsVotedViewEntity
import io.micronaut.data.annotation.Query
import io.micronaut.data.jdbc.annotation.JdbcRepository
import io.micronaut.data.model.query.builder.sql.Dialect
import io.micronaut.data.repository.PageableRepository

import java.util.UUID

@JdbcRepository(dialect = Dialect.POSTGRES)
interface UserRepository extends PageableRepository<UserEntity, UUID> {

    Optional<UserEntity> findByEmail(String email)

    @Query("SELECT COUNT(u) > 0 FROM UserEntity u WHERE u.email = :email")
    boolean existsByEmail(String email)

    @Query(
            value = """
            SELECT DISTINCT v.id AS id, v.name AS name, v.information AS information, v.creation_date AS creationDate, v.owner_id AS idOwner, u.email AS owner, v.theme_id AS idTheme, t.theme as theme 
            FROM voting v
            JOIN users u ON v.owner_id = u.id
            JOIN theme t ON t.id = v.theme_id
            ORDER BY creationDate DESC;

    """
    )
    List<VotingsViewEntity> findAllVotings()

    @Query(
            value = """
            SELECT DISTINCT v.id AS id, v.name AS name, v.information AS information, v.creation_date AS creationDate, v.owner_id AS idOwner, u.email AS owner, v.theme_id AS idTheme, t.theme as theme 
            FROM voting v
            JOIN users u ON v.owner_id = u.id
            JOIN theme t ON t.id = v.theme_id
            WHERE v.owner_id = :userId
            ORDER BY creationDate DESC;

    """
    )
    List<VotingsViewEntity> findOwnerVotings(UUID userId)

    @Query(
            value = """
        SELECT DISTINCT v.id AS id, v.name AS name, v.information AS information, v.creation_date AS creationDate, v.owner_id AS idOwner, u.email AS owner, v.theme_id AS idTheme, t.theme as theme 
        FROM vote_invite vi
        JOIN phase p ON vi.phase_id = p.id
        JOIN category c ON p.category_id = c.id
        JOIN voting v ON c.voting_id = v.id
        JOIN users u ON vi.user_id = u.id
        JOIN theme t ON t.id = v.theme_id
        WHERE vi.user_id = :userId AND vi.is_invited = true
    """
    )
    Set<VotingsViewEntity> findInvitedVotings(UUID userId)


    @Query(
            value = """
        SELECT DISTINCT v.id AS id, v.name AS name, v.information AS information, v.creation_date AS creationDate, v.owner_id AS idOwner, u.email AS owner, v.theme_id AS idTheme, t.theme as theme,
                        MAX(vi.vote_date) OVER (PARTITION BY v.id) AS maxVoteDate
        FROM voting v
        JOIN category c ON v.id = c.voting_id
        JOIN phase p ON c.id = p.category_id
        JOIN vote_invite vi ON p.id = vi.phase_id
        JOIN users u ON u.id = v.owner_id
        JOIN vote_vote_option vvo ON vi.id = vvo.vote_invite_id
        JOIN theme t ON t.id = v.theme_id
        WHERE vi.user_id = :userId
        ORDER BY maxVoteDate DESC;
    """
    )
    List<VotingsVotedViewEntity> findVotingsVoted(UUID userId);

    @Query(
            value = """
        SELECT DISTINCT u.id, u.name, u.genre, u.date_of_birth, u.nationality, u.email, u.password, u.creation_date, u.user_role, u.deleted
        FROM vote_invite vi
        JOIN phase p ON vi.phase_id = p.id
        JOIN users u ON vi.user_id = u.id
        WHERE
        CASE
        WHEN p.privacy = true THEN vi.response = true AND vi.phase_id = :phaseId
        ELSE vi.phase_id = :phaseId
        END;
    """
    )
    Set<UserEntity> findUsersByPhaseId(UUID phaseId)



}

