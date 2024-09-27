package com.atlanse.domains

import com.fasterxml.jackson.annotation.JsonFormat
import com.fasterxml.jackson.annotation.JsonIgnore
import groovy.transform.ToString
import groovy.transform.TupleConstructor
import io.micronaut.core.annotation.Nullable
import io.micronaut.data.annotation.AutoPopulated
import io.micronaut.data.annotation.DateCreated

import javax.persistence.AttributeOverride
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.FetchType
import javax.persistence.Id
import javax.persistence.JoinColumn
import javax.persistence.JoinTable
import javax.persistence.ManyToMany
import javax.persistence.ManyToOne
import javax.persistence.Table
import javax.validation.constraints.NotBlank
import javax.validation.constraints.NotNull
import java.time.LocalDateTime

@Entity
@Table(name = "phase")
@ToString(includePackage = false, includeNames = true, includeFields = true)
@TupleConstructor
class PhaseEntity {
    @Id
    @AutoPopulated
    UUID id

    @Column(name = 'n_phase')
    @NotBlank(message = 'Phase number can not be blank')
    @NotNull(message = 'Phase number can not be null')
    int n_phase

    @Column(name = 'name')
    @NotBlank(message = 'Name can not be blank')
    @NotNull(message = 'Name can not be null')
    String name

    @Column(name = 'n_winners')
    @NotBlank(message = 'Winners number can not be blank')
    @NotNull(message = 'Winners number can not be null')
    int n_winners

    @Column(name = 'opening_date')
    @NotBlank(message = 'Opening date can not be blank')
    @NotNull(message = 'Opening date can not be null')
    LocalDateTime openingDate

    @Column(name = 'closing_date')
    @NotBlank(message = 'Closing date can not be blank')
    @NotNull(message = 'Closing date can not be null')
    LocalDateTime closingDate

    @Column(name = 'privacy')
    @NotBlank(message = 'Privacy can not be blank')
    @NotNull(message = 'Privacy can not be null')
    boolean privacy

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "voting_type_id", referencedColumnName = "id")
    @Nullable
    VotingTypeEntity votingType

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", referencedColumnName = "id")
    @Nullable
    CategoryEntity category



}

