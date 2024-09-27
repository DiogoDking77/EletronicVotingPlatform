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
@Table(name = "getMultipleVotings")
@ToString(includePackage = false, includeNames = true, includeFields = true)
@TupleConstructor
class MultipleVotingViewEntity {

    @Id
    @Column(name = "id_phase")
    UUID id_phase

    @Column(name = "id_vote_invite")
    UUID id_vote_invite

    @Column(name = "id_user")
    UUID id_user

    @Column(name = "name_user")
    String nameUser

    @Column(name = "genre")
    String genre

    @Column(name = "date_of_birth")
    LocalDate dateOfBirth

    @Column(name = "nationality")
    String nationality

    @Column(name = "email")
    String email

    @Column(name = "name_phase")
    String namePhase

    @Column(name = "id_vote_option")
    UUID id_vote_option

    @Column(name = "name_vote_option")
    String nameVoteOption

    @Column(name = "information_vote_option")
    String informationVoteOption

    @Column(name = "comment")
    String comment

    @Column(name = "vote_date")
    LocalDateTime voteDate

}
