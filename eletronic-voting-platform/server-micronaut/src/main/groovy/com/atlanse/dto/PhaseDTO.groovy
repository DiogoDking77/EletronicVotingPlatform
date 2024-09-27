package com.atlanse.dto

import com.atlanse.domains.ThemeEntity
import groovy.transform.ToString
import groovy.transform.TupleConstructor
import io.micronaut.core.annotation.Nullable

import java.time.LocalDateTime

@ToString(includePackage = false, includeNames = true, includeFields = true)
@TupleConstructor
class PhaseDTO {
    @Nullable
    UUID id
    @Nullable
    int n_phase
    @Nullable
    String name
    @Nullable
    int n_winners
    @Nullable
    LocalDateTime opening_date
    @Nullable
    LocalDateTime closing_date
    @Nullable
    boolean privacy
    @Nullable
    String votingType
    @Nullable
    String category

}