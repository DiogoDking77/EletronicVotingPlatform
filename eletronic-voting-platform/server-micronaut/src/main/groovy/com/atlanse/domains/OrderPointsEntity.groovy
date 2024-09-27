
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
import javax.persistence.ManyToOne
import javax.persistence.Table
import javax.validation.constraints.NotBlank
import javax.validation.constraints.NotNull

@Entity
@Table(name = "order_points")
@ToString(includePackage = false, includeNames = true, includeFields = true)
@TupleConstructor
class OrderPointsEntity {
    @Id
    @AutoPopulated
    UUID id

    @Column(name = 'position')
    @NotBlank(message = 'Position can not be blank')
    @NotNull(message = 'Position can not be null')
    int position

    @Column(name = 'points')
    @NotBlank(message = 'Points can not be blank')
    @NotNull(message = 'Points can not be null')
    int points

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "voting_type_id", referencedColumnName = "id")
    @Nullable
    VotingTypeEntity votingType

}




