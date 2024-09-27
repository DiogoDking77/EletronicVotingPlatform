
package com.atlanse.domains

import groovy.transform.ToString
import groovy.transform.TupleConstructor
import io.micronaut.core.annotation.Nullable
import io.micronaut.data.annotation.AutoPopulated

import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.FetchType
import javax.persistence.Id
import javax.persistence.JoinColumn
import javax.persistence.ManyToMany
import javax.persistence.ManyToOne
import javax.persistence.Table
import javax.validation.constraints.NotBlank
import javax.validation.constraints.NotNull

@Entity
@Table(name = "vote_option")
@ToString(includePackage = false, includeNames = true, includeFields = true)
@TupleConstructor
class VoteOptionEntity {
    @Id
    @AutoPopulated
    UUID id

    @Column(name = 'name')
    @NotBlank(message = 'Name can not be blank')
    @NotNull(message = 'Name can not be null')
    String name

    @Column(name = 'information', length = 1000)
    String information

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "phase_id", referencedColumnName = "id")
    @Nullable
    PhaseEntity phase

}