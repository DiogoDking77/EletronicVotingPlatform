package com.atlanse.controllers

import com.atlanse.domains.VotingEntity
import com.atlanse.dto.VotingDTO
import com.atlanse.services.VotingService
import groovy.util.logging.Slf4j
import io.micronaut.data.model.Page
import io.micronaut.data.model.Pageable
import io.micronaut.http.HttpResponse
import io.micronaut.http.HttpStatus
import io.micronaut.http.annotation.Body
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Delete
import io.micronaut.http.annotation.Get
import io.micronaut.http.annotation.Patch
import io.micronaut.http.annotation.Post
import jakarta.inject.Inject

import java.util.UUID

@Slf4j
@Controller("/api/voting")
class VotingController {

    @Inject
    VotingService votingService

    @Get("/{id}")
    HttpResponse<VotingEntity> getVoting(UUID id) {
        VotingEntity voting = votingService.findByID(id)
        if (voting) {
            return HttpResponse.ok(voting)
        } else {
            return HttpResponse.notFound()
        }
    }

    @Get("/")
    HttpResponse<Page<VotingEntity>> getVotings(Pageable pageable) {
        return HttpResponse.ok(votingService.findAll(pageable))
    }

    @Post
    HttpResponse<VotingEntity> createVoting(@Body VotingDTO votingdto) {
        VotingEntity createdVoting = votingService.create(votingdto)
        return HttpResponse.created(createdVoting)
    }

    @Patch("/{id}")
    HttpResponse<VotingEntity> updateVoting(UUID id, @Body VotingDTO votingdto) {
        VotingEntity updatedVoting = votingService.update(id, votingdto)
        if (updatedVoting) {
            return HttpResponse.ok(updatedVoting)
        } else {
            return HttpResponse.notFound()
        }
    }

    @Delete("/{id}")
    HttpResponse deleteVoting(UUID id) {
        if (votingService.findByID(id)) {
            votingService.delete(id)
            return HttpResponse.noContent()
        } else {
            return HttpResponse.notFound()
        }
    }

    @Get("/{id}/voters")
    HttpResponse<Set<UUID>> getUniqueUserIdsInVoterInvitations(UUID id) {
        Set<UUID> uniqueUserIds = votingService.findUniqueUserIdsInVoterInvitations(id)
        return HttpResponse.ok(uniqueUserIds)
    }

    @Get("/{id}/categories_no_phase")
    HttpResponse<Set<UUID>> getCategorieswithnophases(UUID id) {
        Set<UUID> uniqueCategoryIds = votingService.findCategorieswithnophases(id)
        return HttpResponse.ok(uniqueCategoryIds)
    }
}
