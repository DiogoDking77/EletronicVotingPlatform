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
@Table(name = "getStatisticsPhase")
@ToString(includePackage = false, includeNames = true, includeFields = true)
@TupleConstructor
class StatisticsPhaseInPointsViewEntity {

    @Id
    @Column(name = "idOption")
    UUID id

    @Column(name = "option")
    String option

    @Column(name = "info")
    String info

    @Column(name = "Rank")
    int Rank

    @Column(name = "TotalPoints")
    int Points

    @Column(name = "Winner")
    boolean Winner

    @Column(name = "percentage")
    BigDecimal percentage



}
