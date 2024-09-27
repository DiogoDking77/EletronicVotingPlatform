package com.atlanse.domains

import groovy.transform.ToString
import groovy.transform.TupleConstructor
import io.micronaut.core.annotation.Nullable
import io.micronaut.data.annotation.AutoPopulated
import io.micronaut.data.annotation.MappedEntity

import javax.persistence.Column
import javax.persistence.Id
import javax.persistence.Table
import javax.validation.constraints.NotBlank
import javax.validation.constraints.NotNull
import java.time.LocalDate
import java.time.LocalDateTime

@MappedEntity
@Table(name = "getPhasesUserCanVote")
@ToString(includePackage = false, includeNames = true, includeFields = true)
@TupleConstructor
class PhasesUserCanVoteViewEntity {

    @Id
    @Column(name = "category_id")
    UUID categoryId

    @Column(name = "phase_ids")
    List<UUID> phaseIds

}
