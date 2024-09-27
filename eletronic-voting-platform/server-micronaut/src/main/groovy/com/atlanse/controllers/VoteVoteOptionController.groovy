package com.atlanse.controllers

import com.atlanse.domains.VoteVoteOptionEntity
import com.atlanse.dto.VoteVoteOptionDTO
import com.atlanse.services.VoteVoteOptionService
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
@Controller("/api/vote_vote_option")
class VoteVoteOptionController {

    @Inject
    VoteVoteOptionService voteVoteOptionService

    @Get("/{id}")
    HttpResponse<VoteVoteOptionEntity> getVoteVoteOption(UUID id) {
        VoteVoteOptionEntity voteVoteOption = voteVoteOptionService.findByID(id)
        if (voteVoteOption) {
            return HttpResponse.ok(voteVoteOption)
        } else {
            return HttpResponse.notFound()
        }
    }

    @Get("/")
    HttpResponse<Page<VoteVoteOptionEntity>> getVoteVoteOptions(Pageable pageable) {
        return HttpResponse.ok(voteVoteOptionService.findAll(pageable))
    }

    @Post
    HttpResponse<VoteVoteOptionEntity> createVoteVoteOption(@Body VoteVoteOptionDTO voteVoteOptiondto) {
        VoteVoteOptionEntity createdVoteVoteOption = voteVoteOptionService.create(voteVoteOptiondto)
        return HttpResponse.created(createdVoteVoteOption)
    }

    @Patch("/{id}")
    HttpResponse<VoteVoteOptionEntity> updateVoteVoteOption(UUID id, @Body VoteVoteOptionDTO voteVoteOptiondto) {
        VoteVoteOptionEntity updatedVoteVoteOption = voteVoteOptionService.update(id, voteVoteOptiondto)
        if (updatedVoteVoteOption) {
            return HttpResponse.ok(updatedVoteVoteOption)
        } else {
            return HttpResponse.notFound()
        }
    }

    @Delete("/{id}")
    HttpResponse deleteVoteVoteOption(UUID id) {
        if (voteVoteOptionService.findByID(id)) {
            voteVoteOptionService.delete(id)
            return HttpResponse.noContent()
        } else {
            return HttpResponse.notFound()
        }
    }


    @Delete("/byInvited/{voteInviteId}")
    HttpResponse deleteVoteByInvite(UUID voteInviteId) {
        boolean deleted = voteVoteOptionService.deleteVoteByInvite(voteInviteId);

        if (deleted) {
            return HttpResponse.ok();
        } else {
            return HttpResponse.notFound();
        }
    }



    @Get("/find-by-user-and-phase/{userId}/{phaseId}")
    HttpResponse<List<VoteVoteOptionEntity>> findVoteVoteOptionIdsByUserIdAndPhaseId(UUID userId, UUID phaseId) {
        List<VoteVoteOptionEntity> result = voteVoteOptionService.findVoteVoteOptionIdsByUserIdAndPhaseId(userId, phaseId)
        return HttpResponse.ok(result)
    }
}

