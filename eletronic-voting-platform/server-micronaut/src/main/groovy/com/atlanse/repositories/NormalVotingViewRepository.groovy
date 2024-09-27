package com.atlanse.repositories


import io.micronaut.data.annotation.Query
import com.atlanse.domains.NormalVotingViewEntity
import io.micronaut.data.jdbc.annotation.JdbcRepository
import io.micronaut.data.repository.PageableRepository
import io.micronaut.data.model.query.builder.sql.Dialect

@JdbcRepository(dialect = Dialect.POSTGRES)
interface NormalVotingViewRepository extends PageableRepository<NormalVotingViewEntity, UUID> {

    @Query(value = """
        SELECT id_phase, id_vote_invite, id_user, name_user, genre, date_of_birth, nationality, email, name_phase, id_vote_option, name_vote_option, information_vote_option, comment, vote_date
        FROM normal_voting_view
        WHERE id_phase = :phaseId
    """)
    List<NormalVotingViewEntity> getNormalVoting(UUID phaseId);

}