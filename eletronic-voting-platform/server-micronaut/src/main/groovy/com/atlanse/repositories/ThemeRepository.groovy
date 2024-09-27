package com.atlanse.repositories

import com.atlanse.domains.ThemeEntity
import io.micronaut.data.annotation.Query
import io.micronaut.data.jdbc.annotation.JdbcRepository
import io.micronaut.data.model.query.builder.sql.Dialect
import io.micronaut.data.repository.PageableRepository


@JdbcRepository(dialect = Dialect.POSTGRES)
interface ThemeRepository extends PageableRepository<ThemeEntity, UUID> {
    @Query(
            value = """
                    SELECT id, theme
                    FROM theme
                    ORDER BY 
                    CASE 
                    WHEN theme = 'Others' THEN 2  
                    ELSE 1                       
                    END,
                    theme;                         

    """
    )
    List<ThemeEntity> getThemesordered()
}
