
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
import java.time.LocalDateTime

@Entity
@Table(name = "vote_invite")
@ToString(includePackage = false, includeNames = true, includeFields = true)
@TupleConstructor
class VoteInviteEntity {
    @Id
    @AutoPopulated
    UUID id

    @Column(name = 'is_invited')
    boolean isInvited

    @Column(name = 'comment', length = 1000)
    String comment

    @Column(name = 'vote_date')
    LocalDateTime voteDate

    @Column(name = 'invite_date')
    LocalDateTime inviteDate

    @Column(name = 'message', length = 1000)
    String message

    @Column(name = 'response')
    boolean response

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "phase_id", referencedColumnName = "id")
    @Nullable
    PhaseEntity phase

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    @Nullable
    UserEntity user

}




