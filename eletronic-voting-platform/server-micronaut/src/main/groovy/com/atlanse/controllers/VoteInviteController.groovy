package com.atlanse.controllers

import com.atlanse.domains.CategoryEntity
import com.atlanse.domains.UserEntity
import com.atlanse.domains.VoteInviteEntity
import com.atlanse.dto.VoteInviteDTO
import com.atlanse.services.VoteInviteService

import groovy.util.logging.Slf4j
import io.micronaut.data.model.Page
import io.micronaut.data.model.Pageable
import io.micronaut.http.HttpResponse
import io.micronaut.http.annotation.Body
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Delete
import io.micronaut.http.annotation.Get
import io.micronaut.http.annotation.Patch
import io.micronaut.http.annotation.Post
import jakarta.inject.Inject

@Slf4j
@Controller("/api/vote_invite")
class VoteInviteController {

    @Inject
    VoteInviteService voteInviteService

    @Get("/{id}")
    HttpResponse<VoteInviteEntity> getVoterInvitation(UUID id) {
        VoteInviteEntity voteInvite = voteInviteService.findByID(id)
        if (voteInvite) {
            return HttpResponse.ok(voteInvite)
        } else {
            return HttpResponse.notFound()
        }
    }

    @Get("/")
    HttpResponse<Page<VoteInviteEntity>> getVoterInvitations(Pageable pageable) {
        return HttpResponse.ok(voteInviteService.findAll(pageable))
    }

    @Post
    HttpResponse<VoteInviteEntity> createVoterInvitation(@Body VoteInviteDTO voteInvitedto) {
        VoteInviteEntity createdVoterInvitation = voteInviteService.create(voteInvitedto)
        return HttpResponse.created(createdVoterInvitation)
    }

    @Patch("/{id}")
    HttpResponse<VoteInviteEntity> updateVoterInvitation(UUID id, @Body VoteInviteDTO voteInvitedto) {
        VoteInviteEntity updatedVoterInvitation = voteInviteService.update(id, voteInvitedto)
        if (updatedVoterInvitation) {
            return HttpResponse.ok(updatedVoterInvitation)
        } else {
            return HttpResponse.notFound()
        }
    }

    @Delete("/{id}")
    HttpResponse deleteVoterInvitation(UUID id) {
        if (voteInviteService.findByID(id)) {
            voteInviteService.delete(id)
            return HttpResponse.noContent()
        } else {
            return HttpResponse.notFound()
        }
    }


    @Get("/check-invite/{userId}/{votingId}")
    HttpResponse<Boolean> checkVoteInvite(UUID userId, UUID votingId) {
        boolean existsVoteInvite = voteInviteService.existsByUserIdAndVotingId(userId, votingId)
        return HttpResponse.ok(existsVoteInvite)
    }

    @Post("/create-invites/{userId}/{votingId}")
    HttpResponse createVoteInvites(UUID userId, UUID votingId) {
        voteInviteService.createVoteInvitesForUser(userId, votingId)
        return HttpResponse.ok()
    }

    @Get("/findByUserId/{userId}/{phaseId}")
    HttpResponse<Set<VoteInviteEntity>> getVoteInviteByUserPhase(UUID userId, UUID phaseId) {
        Set<VoteInviteEntity> voteinvite = voteInviteService.getVoteInviteByUserPhase(userId, phaseId)
        return HttpResponse.ok(voteinvite)
    }

    @Patch("/isInvited/{userId}/{phaseId}")
    HttpResponse<VoteInviteEntity> updateIsInvite(UUID userId, UUID phaseId) {
        VoteInviteEntity updatedVoterInvitation = voteInviteService.updateIsInvite(userId, phaseId)
        if (updatedVoterInvitation) {
            return HttpResponse.ok(updatedVoterInvitation)
        } else {
            return HttpResponse.notFound()
        }
    }

    @Get("/existsByUserAndPhase/{userId}/{phaseId}")
    HttpResponse<Boolean> existsByUserAndPhase(UUID userId, UUID phaseId) {
        boolean exists = voteInviteService.existsByUserAndPhase(userId, phaseId);
        return HttpResponse.ok(exists);
    }

    @Post("/create-invites-owner/{userId}/{votingId}")
    HttpResponse createVoteInvitesOwner(UUID userId, UUID votingId) {
        voteInviteService.createVoteInvitesForOwner(userId, votingId)
        return HttpResponse.ok()
    }


}
