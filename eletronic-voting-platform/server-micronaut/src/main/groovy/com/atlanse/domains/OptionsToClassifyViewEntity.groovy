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
@Table(name = "getOptionsToClassify")
@ToString(includePackage = false, includeNames = true, includeFields = true)
@TupleConstructor
class OptionsToClassifyViewEntity {

    @Id
    @Column(name = "idOption")
    UUID idOption

    @Column(name = "option")
    String option

    @Column(name = "info")
    String info

    @Column(name = "NumberOfVotes")
    int NumberOfVotes

    @Column(name = "categoryId")
    UUID categoryId

    @Column(name = "currentPhaseId")
    UUID currentPhaseId

    @Column(name = "currentNPhase")
    int currentNPhase

    @Column(name = "closingDate")
    LocalDateTime closingDate

    @Column(name = "nextPhaseId")
    //String nextPhaseId
    UUID nextPhaseId

    @Column(name = "nextNPhase")
    int nextNPhase


}
