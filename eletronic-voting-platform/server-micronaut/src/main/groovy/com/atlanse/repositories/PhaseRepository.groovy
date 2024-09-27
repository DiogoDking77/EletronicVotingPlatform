package com.atlanse.repositories


import com.atlanse.domains.PhaseEntity
import com.atlanse.domains.PhasesByCategoryViewEntity
import com.atlanse.domains.StatisticsPhaseInPointsViewEntity
import com.atlanse.domains.StatisticsPhaseViewEntity
import io.micronaut.data.annotation.Query
import io.micronaut.data.model.Page
import io.micronaut.data.model.Pageable
import io.micronaut.data.annotation.Join
import io.micronaut.data.jdbc.annotation.JdbcRepository
import io.micronaut.data.model.query.builder.sql.Dialect
import io.micronaut.data.repository.PageableRepository

@JdbcRepository(dialect = Dialect.POSTGRES)
interface PhaseRepository extends PageableRepository<PhaseEntity, UUID> {

    @Join(value = "category", type = Join.Type.LEFT_FETCH)
    @Join(value = "votingType", type = Join.Type.LEFT_FETCH)
    Page<PhaseEntity> findAll(Pageable pageable)

    @Join(value = "category", type = Join.Type.LEFT_FETCH)
    @Join(value = "votingType", type = Join.Type.LEFT_FETCH)
    Optional<PhaseEntity> findById(UUID id)

    /*
    @Query(
            value = """
            SELECT DISTINCT p.id AS id, p.closing_date AS closingDate, p.n_phase AS n_phase, p.n_winners AS n_winners, p.name AS name_phase, p.opening_date AS openingDate, p.privacy AS privacy, p.category_id AS categoryId, p.voting_type_id AS votingTypeId, vt.n_choices AS n_choices, vt.type AS type 
            FROM phase p
            JOIN voting_type vt ON vt.id = p.voting_type_id
            WHERE p.category_id = :categoryId
            ORDER BY p.n_phase ASC;
        """
    )
    List<PhasesByCategoryViewEntity> findPhasesByCategory(UUID categoryId)

     */


    @Query(
            value = """           
                SELECT
                    p.id AS id,
                    p.closing_date AS closingDate,
                    p.n_phase AS n_phase,
                    p.n_winners AS n_winners,
                    p.name AS name_phase,
                    p.opening_date AS openingDate,
                    p.privacy AS privacy,
                    p.category_id AS categoryId,
                    p.voting_type_id AS votingTypeId,
                    MAX(vt.n_choices) AS n_choices,
                    MAX(vt.type) AS type,
                    JSON_AGG(
                            JSON_BUILD_OBJECT(
                                    'position', op.position,
                                    'points', op.points
                                )
                        ) AS orderPoints
                FROM phase p
                         LEFT JOIN order_points op ON op.voting_type_id = p.voting_type_id
                         LEFT JOIN voting_type vt ON vt.id = p.voting_type_id
                WHERE p.category_id = :categoryId
                GROUP BY p.id, p.closing_date, p.n_phase, p.n_winners, p.name, p.opening_date, p.privacy, p.category_id, p.voting_type_id
                ORDER BY p.n_phase ASC;
        """
    )
    List<PhasesByCategoryViewEntity> findPhasesByCategory(UUID categoryId)


    @Query(
            value = """
        SELECT DISTINCT p.id
        FROM phase p
                 JOIN category c ON p.category_id = c.id
        WHERE c.voting_id = :votingId AND p.privacy = false
    """
    )
    List<UUID> findAllByVotingIdAndPrivacy(UUID votingId);

    @Query(
            value = """
                WITH VoteOptionStats AS (
                    SELECT
                                DENSE_RANK() OVER (ORDER BY COUNT(vvo.vote_option_id) DESC, vo.name) AS voteRank,
                                vo.id as id,
                                vo.name AS option,
                                vo.information AS info,
                                COUNT(vvo.vote_option_id) AS numberOfVotes,
                                COALESCE(ROUND(100.0 * COUNT(vvo.vote_option_id) / NULLIF(SUM(COUNT(vvo.vote_option_id)) OVER (), 0), 2), 0) AS percentage,
                                p.n_winners
                    FROM
                        vote_option vo
                            LEFT JOIN vote_vote_option vvo ON vo.id = vvo.vote_option_id
                            LEFT JOIN vote_invite vi ON vvo.vote_invite_id = vi.id
                            LEFT JOIN phase p ON vi.phase_id = p.id
                            LEFT JOIN category c ON p.category_id = c.id
                            LEFT JOIN voting vg ON c.voting_id = vg.id
                            LEFT JOIN users u ON vi.user_id = u.id
                    WHERE
                            p.id = :phaseId OR (p.id IS NULL AND vo.phase_id = :phaseId)
                    GROUP BY vo.id, vo.name, vo.information, p.n_winners
                )
                SELECT
                    voteRank,
                    id,
                    option,
                    info,
                    numberOfVotes,
                    percentage,
                    CASE
                        WHEN voteRank = 1 AND n_winners = 1 THEN true
                        WHEN voteRank <= n_winners AND numberOfVotes > 0 THEN true
                        ELSE false
                        END AS winner
                FROM
                    VoteOptionStats
                ORDER BY
                    voteRank;
        """
    )
    List<StatisticsPhaseViewEntity> showStatistics(UUID phaseId)

    @Query(
            value = """
        SELECT COUNT(p) > 0
        FROM phase p
        WHERE p.name = :name AND p.category_id = :categoryId
    """
    )
    boolean existsPhaseInCategory(String name, UUID categoryId);



    @Query(
            value = """
SELECT
            DENSE_RANK() OVER (ORDER BY TotalPoints DESC) as Rank,
            idOption,
            option,
            info,
            TotalPoints,
            Percentage,
            CASE WHEN RANK() OVER (ORDER BY TotalPoints DESC) <= nWinners THEN true ELSE false END as Winner,
            position,
            Votes,
            TotalPointsPosition,
            nWinners
FROM (
         SELECT
             vo.id as idOption,
             vo.name as option,
             vo.information as info,
             vvo.position,
             COUNT(vvo.id) as Votes,
             COALESCE(SUM(o.points), 0) as TotalPointsPosition,
             COALESCE(SUM(COUNT(*) * o.points) OVER (PARTITION BY vo.name), 0) as TotalPoints,
             COALESCE(ROUND((COALESCE(SUM(COUNT(*) * o.points) OVER (PARTITION BY vo.name), 0) / NULLIF(SUM(COUNT(*) * o.points) OVER (), 0)) * 100, 2) , 0) as Percentage,
             p.n_winners as nWinners
         FROM
             vote_option vo
                 LEFT JOIN
             vote_vote_option vvo ON vo.id = vvo.vote_option_id
                 LEFT JOIN
             vote_invite vi ON vvo.vote_invite_id = vi.id
                 LEFT JOIN
             phase p ON vi.phase_id = p.id
                 LEFT JOIN
             category c ON p.category_id = c.id
                 LEFT JOIN
             voting vg ON c.voting_id = vg.id
                 LEFT JOIN
             order_points o ON o.voting_type_id = p.voting_type_id AND o.position = vvo.position
         WHERE
                 vo.phase_id = :phaseId OR vo.phase_id IS NULL
         GROUP BY
             idOption, option, info, vvo.position, o.points, nWinners
     ) AS Subquery
ORDER BY
    TotalPoints DESC, position ASC, Votes DESC;


        """
    )
    List<StatisticsPhaseInPointsViewEntity> showStatisticsInPoints(UUID phaseId)


}
