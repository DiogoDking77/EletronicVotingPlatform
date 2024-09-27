package com.atlanse.repositories

import com.atlanse.domains.OptionsToClassifyInPointsViewEntity
import com.atlanse.domains.OptionsToClassifyViewEntity
import com.atlanse.domains.PhaseEntity
import com.atlanse.domains.VoteOptionEntity
import io.micronaut.data.annotation.Join
import io.micronaut.data.annotation.Query
import io.micronaut.data.jdbc.annotation.JdbcRepository
import io.micronaut.data.model.Page
import io.micronaut.data.model.Pageable
import io.micronaut.data.model.query.builder.sql.Dialect
import io.micronaut.data.repository.PageableRepository


@JdbcRepository(dialect = Dialect.POSTGRES)
interface VoteOptionRepository extends PageableRepository<VoteOptionEntity, UUID> {

    @Join(value = "phase", type = Join.Type.LEFT_FETCH)
    Page<VoteOptionEntity> findAll(Pageable pageable)

    @Join(value = "phase", type = Join.Type.LEFT_FETCH)
    Optional<VoteOptionEntity> findById(UUID id)

    @Query(
            value = """
            SELECT DISTINCT vo.id, vo.information, vo.name, vo.phase_id
            FROM vote_option vo
            WHERE vo.phase_id= :phaseId
            ORDER BY vo.name ASC
        """

    )
    List<VoteOptionEntity> findVoteOptionsByPhase(UUID phaseId)

    @Query(
            value = """
                        SELECT
                            vo.id as idOption,
                            vo.name as option,
                            vo.information as info,
                            COUNT(vvo.vote_option_id) as NumberOfVotes,
                            c.id as categoryId,
                            p.id as currentPhaseId,
                            p.n_phase as currentNPhase,
                            p.closing_date as closingDate,
                            p.n_phase + 1 as nextNPhase, 
                            (
                                SELECT id
                                FROM phase
                                WHERE category_id = c.id AND n_phase = p.n_phase + 1
                            ) as nextPhaseId 
                        FROM
                            vote_option vo
                                LEFT JOIN vote_vote_option vvo ON vo.id = vvo.vote_option_id
                                LEFT JOIN vote_invite vi ON vvo.vote_invite_id = vi.id
                                LEFT JOIN phase p ON vo.phase_id = p.id
                                LEFT JOIN category c ON p.category_id = c.id
                                LEFT JOIN voting vg ON c.voting_id = vg.id
                                LEFT JOIN users u ON vi.user_id = u.id
                        WHERE
                                p.id = :phaseId OR
                            (p.id IS NULL AND vo.phase_id = :phaseId)
                        GROUP BY
                            idOption, option, info, categoryId, currentPhaseId, currentNPhase
                        ORDER BY
                            NumberOfVotes DESC
                        LIMIT (
                            SELECT n_winners
                            FROM phase
                            WHERE id = :phaseId
                        );
                
        """
    )
    Set<OptionsToClassifyViewEntity> listOptionsToClassify(UUID phaseId)


    @Query(
            value = """
        SELECT COUNT(vo) > 0
        FROM vote_option vo
        WHERE vo.name = :name AND vo.phase_id = :phaseId
    """
    )
    boolean existsByNameAndPhaseId(String name, UUID phaseId);

    @Query(
            value = """
                SELECT COUNT(vo.id) > 0
                FROM vote_option vo
                         LEFT JOIN phase p ON vo.phase_id = p.id
                WHERE vo.name = :name AND p.category_id = (
                    SELECT p2.category_id
                    FROM phase p2
                    WHERE p2.id = :phaseId
                )
    """
    )
    boolean existsOptionInCategory(String name, UUID phaseId);


    @Query(
            value = """
            SELECT DISTINCT vo.id as idOption,
                vo.name as option,
                vo.information as info,
                vvo.position,
                COUNT(*) as Votes,
                SUM(o.points) as TotalPointsPosition,
                SUM(COUNT(*) * o.points) OVER (PARTITION BY vo.name) as TotalPoints,
                c.id as categoryId,
                p.id as currentPhaseId,
                p.n_phase as currentNPhase,
                p.closing_date as closingDate,
                p.n_phase + 1 as nextNPhase,
                p.n_winners as nWinners,
                (
                    SELECT id
                    FROM phase
                    WHERE category_id = c.id AND n_phase = p.n_phase + 1
                ) as nextPhaseId
FROM vote_invite vi
         JOIN phase p ON vi.phase_id = p.id
         JOIN category c ON p.category_id = c.id
         JOIN voting vg ON c.voting_id = vg.id
         JOIN users u ON vi.user_id = u.id
         JOIN vote_vote_option vvo ON vi.id = vvo.vote_invite_id
         JOIN vote_option vo ON vo.id = vvo.vote_option_id
         JOIN voting_type vt ON p.voting_type_id = vt.id
         JOIN order_points o ON o.voting_type_id = vt.id AND o.position = vvo.position
WHERE
        p.id = :phaseId
GROUP BY idOption, option, info, vvo.position, o.points, categoryId, currentPhaseId, currentNPhase 
ORDER BY TotalPoints DESC, vvo.position ASC, Votes DESC;

    """
    )
    List<OptionsToClassifyInPointsViewEntity> listOptionsToClassifyInPoints(UUID phaseId)

    @Query(
            value = """
                SELECT COUNT(vo) > 0
                FROM vote_option vo
                WHERE vo.name = :name AND vo.phase_id = :nextPhaseId
        """
    )
    boolean optionAlreadyClassify(String name, UUID nextPhaseId);

}
