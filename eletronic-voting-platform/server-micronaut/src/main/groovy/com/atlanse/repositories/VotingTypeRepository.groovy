package com.atlanse.repositories

import com.atlanse.domains.VotingTypeEntity
import io.micronaut.data.jdbc.annotation.JdbcRepository
import io.micronaut.data.model.query.builder.sql.Dialect
import io.micronaut.data.repository.PageableRepository


@JdbcRepository(dialect = Dialect.POSTGRES)
interface VotingTypeRepository extends PageableRepository<VotingTypeEntity, UUID> {

}