package com.atlanse.dto

import com.atlanse.domains.ThemeEntity
import groovy.transform.ToString
import groovy.transform.TupleConstructor
import io.micronaut.core.annotation.Nullable

import java.time.LocalDateTime

@ToString(includePackage = false, includeNames = true, includeFields = true)
@TupleConstructor
class VoteOptionDTO {
    @Nullable
    UUID id
    @Nullable
    String name
    String information
    @Nullable
    String phase

}
