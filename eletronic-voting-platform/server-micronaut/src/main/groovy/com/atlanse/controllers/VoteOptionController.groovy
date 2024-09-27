package com.atlanse.controllers

import com.atlanse.domains.PhaseEntity
import com.atlanse.domains.VoteOptionEntity
import com.atlanse.dto.VoteOptionDTO
import com.atlanse.services.VoteOptionService
import groovy.util.logging.Slf4j
import io.micronaut.data.model.Page
import io.micronaut.data.model.Pageable
import io.micronaut.http.HttpResponse
import io.micronaut.http.annotation.*
import jakarta.inject.Inject

@Slf4j
@Controller("/api/vote_option")
class VoteOptionController {

    @Inject
    VoteOptionService voting_optionService

    @Get("/{id}")
    HttpResponse<VoteOptionEntity> getVotingOption(UUID id) {
        VoteOptionEntity voting_option = voting_optionService.findByID(id)
        if (voting_option) {
            return HttpResponse.ok(voting_option)
        }
        return HttpResponse.notFound()

    }

    @Get
    HttpResponse<Page<VoteOptionEntity>> getVotingOptions(Pageable pageable) {
        return HttpResponse.ok(voting_optionService.findAll(pageable))
    }

    @Post
    HttpResponse<VoteOptionEntity> createVotingOption(@Body VoteOptionDTO votingOptiondto) {
        VoteOptionEntity createdVotingOption = voting_optionService.create(votingOptiondto)
        return HttpResponse.created(createdVotingOption)
    }

    @Patch("/{id}")
    HttpResponse<VoteOptionEntity> update(UUID id, @Body VoteOptionDTO votingOptiondto) {

        VoteOptionEntity updatedVotingOption = voting_optionService.update(id, votingOptiondto)
        if (updatedVotingOption) {
            return HttpResponse.ok(updatedVotingOption)
        } else {
            return HttpResponse.notFound()
        }


    }

    @Delete("/{id}")
    HttpResponse delete(UUID id) {
        if (voting_optionService.findByID(id)) {
            voting_optionService.delete(id)
            return HttpResponse.noContent()
        } else {
            return HttpResponse.notFound()
        }
    }

    @Get("/findByPhaseId/{phaseId}")
    HttpResponse<List<VoteOptionEntity>> getVoteOptionsByPhase(UUID phaseId) {
        List<VoteOptionEntity> options = voting_optionService.getVoteOptionsByPhase(phaseId)
        return HttpResponse.ok(options)
    }

    @Post("/classify-options/{phaseId}")
    HttpResponse classifyOptions(UUID phaseId) {
        voting_optionService.classifyOptions(phaseId)
        return HttpResponse.ok()
    }

    @Post("/classify-options-points/{phaseId}")
    HttpResponse classifyOptionsInPoints(UUID phaseId) {
        voting_optionService.classifyOptionsInPoints(phaseId)
        return HttpResponse.ok()
    }


}



