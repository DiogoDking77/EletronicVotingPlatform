package com.atlanse.repositories

import com.atlanse.domains.CategoryEntity
import io.micronaut.data.annotation.Join
import io.micronaut.data.annotation.Query
import io.micronaut.data.jdbc.annotation.JdbcRepository
import io.micronaut.data.model.Page
import io.micronaut.data.model.Pageable
import io.micronaut.data.model.query.builder.sql.Dialect
import io.micronaut.data.repository.PageableRepository


@JdbcRepository(dialect = Dialect.POSTGRES)
interface CategoryRepository extends PageableRepository<CategoryEntity, UUID> {

    @Join(value = "voting", type = Join.Type.LEFT_FETCH)
    Page<CategoryEntity> findAll(Pageable pageable)

    @Join(value = "voting", type = Join.Type.LEFT_FETCH)
    Optional<CategoryEntity> findById(UUID id)


    @Query(
            value = """
            SELECT DISTINCT c.id, c.name, c.information, c.voting_id
            FROM category c
            WHERE c.voting_id = :votingId
        """

    )
    List<CategoryEntity> findCategoriesByVoting(UUID votingId)

    @Query(
            value = """
        SELECT COUNT(c) > 0
        FROM category c
        WHERE c.name = :name AND c.voting_id = :votingId
    """
    )
    boolean existsCategoryInVoting(String name, UUID votingId);

}
