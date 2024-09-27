package com.atlanse.services

import com.atlanse.domains.CategoryEntity
import com.atlanse.domains.PhaseEntity
import com.atlanse.domains.UserEntity
import com.atlanse.domains.VoteInviteEntity
import com.atlanse.dto.VoteInviteDTO
import com.atlanse.repositories.VoteInviteRepository

import groovy.util.logging.Slf4j
import io.micronaut.data.model.Page
import io.micronaut.data.model.Pageable
import jakarta.inject.Inject
import jakarta.inject.Singleton

import java.time.LocalDateTime

@Slf4j
@Singleton
class VoteInviteService {

    @Inject
    VoteInviteRepository voteInviteRepository

    @Inject
    PhaseService phaseService

    @Inject
    UserService userService

    VoteInviteEntity create(VoteInviteDTO voteInvitedto) {
        PhaseEntity phase = phaseService.findByID(UUID.fromString(voteInvitedto.phase))
        UserEntity user = userService.findByID(UUID.fromString(voteInvitedto.user))
        VoteInviteEntity voteInvite = new VoteInviteEntity(
                message: voteInvitedto.message,
                response: voteInvitedto.response,
                comment: voteInvitedto.comment,
                inviteDate: LocalDateTime.now(),
                isInvited: voteInvitedto.isInvited,
                phase: phase,
                user: user
        )
        return voteInviteRepository.save(voteInvite)
    }

    VoteInviteEntity findByID(UUID id) {
        return voteInviteRepository.findById(id).orElse(null)
    }

    Page<VoteInviteEntity> findAll(Pageable pageable) {
        return voteInviteRepository.findAll(pageable)
    }

    VoteInviteEntity update(UUID id, VoteInviteDTO voteInvitedto) {

        VoteInviteEntity voteInvite = voteInviteRepository.findById(id).orElse(null)

        if (voteInvite != null) {
            if (voteInvitedto.message) {
                voteInvite.message = voteInvitedto.message
            }
            voteInvite.response = voteInvitedto.response

//            voteInvite.isInvited = voteInvitedto.isInvited

            if (voteInvitedto.comment) {
                voteInvite.comment = voteInvitedto.comment
            }
            if (voteInvitedto.vote_date) {
                voteInvite.voteDate = voteInvitedto.vote_date
            }

            if (voteInvitedto.invite_date) {
                voteInvite.inviteDate = voteInvitedto.invite_date
            }

            if (voteInvitedto.phase) {
                PhaseEntity phase = phaseService.findByID(UUID.fromString(voteInvitedto.phase))
                voteInvite.phase = phase
            }

            if (voteInvitedto.user) {
                UserEntity user = userService.findByID(UUID.fromString(voteInvitedto.user))
                voteInvite.user = user
            }

            voteInviteRepository.update(voteInvite)
            return voteInvite
        }

        return null
    }

    void delete(UUID id) {
        VoteInviteEntity voteInviteToDelete = voteInviteRepository.findById(id).orElse(null)
        if (voteInviteToDelete != null) {
            voteInviteRepository.delete(voteInviteToDelete)
        }
    }


    boolean existsByUserIdAndVotingId(UUID userId, UUID votingId) {
        return voteInviteRepository.existsByUserIdAndVotingId(userId, votingId)
    }


    boolean existsByUserIdAndPhaseIdInvited(UUID userId, UUID phaseId) {
        return voteInviteRepository.existsByUserIdAndPhaseIdInvited(userId, phaseId)
    }

    boolean existsByUserIdAndPhaseId(UUID userId, UUID phaseId) {
        return voteInviteRepository.existsByUserIdAndPhaseId(userId, phaseId)
    }

    void createVoteInvitesForUser(UUID userId, UUID votingId) {
            List<UUID> phaseIds = voteInviteRepository.findPhaseIdsForUser(votingId, userId)

            if (!phaseIds.isEmpty()) {
                for (UUID phaseId : phaseIds) {
                    if (!existsByUserIdAndPhaseIdInvited(userId, phaseId) && !existsByUserIdAndPhaseId(userId, phaseId)){
                        PhaseEntity phase = phaseService.findByID(phaseId)
                        UserEntity user = userService.findByID(userId)

                        VoteInviteEntity voteInvite = new VoteInviteEntity(
                                message: null,
                                response: null,
                                comment: null,
                                voteDate: null,
                                inviteDate: null,
                                phase: phase,
                                user: user
                        )

                        voteInviteRepository.save(voteInvite)
                    }
                }
            }

    }

    /*
    void createVoteInvitesForUser(UUID userId, UUID votingId) {
        if (!existsByUserIdAndVotingId(userId, votingId)) {
            List<UUID> phaseIds = voteInviteRepository.findPhaseIdsForUser(votingId, userId)

            if (!phaseIds.isEmpty()) {
                for (UUID phaseId : phaseIds) {
                    PhaseEntity phase = phaseService.findByID(phaseId)
                    UserEntity user = userService.findByID(userId)

                    VoteInviteEntity voteInvite = new VoteInviteEntity(
                            message: null,
                            response: null,
                            comment: null,
                            voteDate: null,
                            inviteDate: null,
                            phase: phase,
                            user: user
                    )

                    voteInviteRepository.save(voteInvite)
                }
            }
        }
    }
     */

    void createVoteInvitesForOwner(UUID userId, UUID votingId) {
        if (!existsByUserIdAndVotingId(userId, votingId)) {
            List<UUID> Idsphase = voteInviteRepository.findPhaseIdsForOwner(votingId, userId)

            if (!Idsphase.isEmpty()) {
                for (UUID phaseId : Idsphase) {
                    PhaseEntity Phase = phaseService.findByID(phaseId)
                    UserEntity User = userService.findByID(userId)

                    VoteInviteEntity voteInvite = new VoteInviteEntity(
                            message: null,
                            response: null,
                            comment: null,
                            voteDate: null,
                            inviteDate: null,
                            phase: Phase,
                            user: User
                    )

                    voteInviteRepository.save(voteInvite)
                }
            }
        }
    }

    Set<VoteInviteEntity> getVoteInviteByUserPhase(UUID userId, UUID phaseId) {
        return voteInviteRepository.findVoteInviteByUserPhase(userId, phaseId)
    }

    UUID checkVoteInviteByUserPhase(UUID userId, UUID phaseId) {
        return voteInviteRepository.checkVoteInviteByUserPhase(userId, phaseId)
    }

    VoteInviteEntity updateIsInvite(UUID userId, UUID phaseId) {
        def VoteToUpdate = checkVoteInviteByUserPhase(userId, phaseId)
        PhaseEntity phase = phaseService.findByID(phaseId)
        UserEntity user = userService.findByID(userId)
        VoteInviteEntity voteInvite = voteInviteRepository.findById(VoteToUpdate).orElse(null)

                voteInvite.isInvited = true
                voteInvite.inviteDate = LocalDateTime.now()
                voteInvite.phase = phase
                voteInvite.user = user

        voteInviteRepository.update(voteInvite)
        return voteInvite
    }


    boolean existsByUserAndPhase(UUID userId, UUID phaseId) {
        return voteInviteRepository.existsByUserAndPhase(userId, phaseId)
    }
}



