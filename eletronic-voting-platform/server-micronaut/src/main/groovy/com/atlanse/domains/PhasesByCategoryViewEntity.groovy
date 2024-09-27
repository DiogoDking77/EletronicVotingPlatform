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
@Table(name = "getPhasesByCategory")
@ToString(includePackage = false, includeNames = true, includeFields = true)
@TupleConstructor
class PhasesByCategoryViewEntity {

    @Id
    @Column(name = "id")
    UUID id

    @Column(name = "name_phase")
    String name_phase

    @Column(name = "n_phase")
    int n_phase

    @Column(name = "openingDate")
    LocalDateTime openingDate

    @Column(name = "closingDate")
    LocalDateTime closingDate

    @Column(name = "n_winners")
    int n_winners

    @Column(name = "privacy")
    boolean privacy

    @Column(name = "categoryId")
    UUID categoryId

    @Column(name = "votingTypeId")
    UUID votingTypeId

    @Column(name = "n_choices")
    int n_choices

    @Column(name = "type")
    String type

    @Column(name = "orderPoints")
    //List<OrderPointsEntity> orderPoints
    List<Object[]> orderPoints
    //List<OrderPointsEntity> orderPoints



}
