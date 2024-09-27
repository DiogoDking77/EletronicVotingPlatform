package com.atlanse.repositories

import com.atlanse.domains.CategoryEntity
import com.atlanse.domains.OrderPointsEntity
import io.micronaut.data.annotation.Join
import io.micronaut.data.jdbc.annotation.JdbcRepository
import io.micronaut.data.model.Page
import io.micronaut.data.model.Pageable
import io.micronaut.data.model.query.builder.sql.Dialect
import io.micronaut.data.repository.PageableRepository


@JdbcRepository(dialect = Dialect.POSTGRES)
interface OrderPointsRepository extends PageableRepository<OrderPointsEntity, UUID> {

    @Join(value = "votingType", type = Join.Type.LEFT_FETCH)
    Page<OrderPointsEntity> findAll(Pageable pageable)

    @Join(value = "votingType", type = Join.Type.LEFT_FETCH)
    Optional<OrderPointsEntity> findById(UUID id)
}
