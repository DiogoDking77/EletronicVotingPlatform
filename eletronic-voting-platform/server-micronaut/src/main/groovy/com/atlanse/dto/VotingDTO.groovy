package com.atlanse.dto

import groovy.transform.ToString
import groovy.transform.TupleConstructor
import io.micronaut.core.annotation.Nullable

import java.time.LocalDateTime

@ToString(includePackage = false, includeNames = true, includeFields = true)
@TupleConstructor
class VotingDTO {
        @Nullable
        UUID id
        @Nullable
        String name
        String information
        @Nullable
        LocalDateTime creation_date
        @Nullable
        String theme
        @Nullable
        String owner

    }
