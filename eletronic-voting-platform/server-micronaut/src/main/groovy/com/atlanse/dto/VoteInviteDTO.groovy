package com.atlanse.dto

import groovy.transform.ToString
import groovy.transform.TupleConstructor
import io.micronaut.core.annotation.Nullable

import java.time.LocalDateTime

@ToString(includePackage = false, includeNames = true, includeFields = true)
@TupleConstructor
class VoteInviteDTO {
    @Nullable
    UUID id

    boolean isInvited

    String comment

    @Nullable
    LocalDateTime vote_date

    @Nullable
    LocalDateTime invite_date

    String message

    boolean response

    @Nullable
    String phase

    @Nullable
    String user


}

